const { withTransaction } = require("../utils/transaction");
const {
    calculateMonthlyInstallment,
    calculateTotalRepayable,
    calculateRepaymentSplit,
    distributeYield
} = require("../utils/financialMath");
const Users = require("../models/users");
const BankPools = require("../models/bank_pools");
const BankContributions = require("../models/bank_contributions");
const Loans = require("../models/loans");
const LoanRepayments = require("../models/loan_repayments");
const WalletTransactions = require("../models/wallet_transactions");

exports.requestLoan = async (req, res) => {
    try {
        const borrowerId = parseInt(req.user.id, 10);
        const { bank_id, principal_amount, term_months, purpose } = req.body;
        const bankId = parseInt(bank_id, 10);
        const principal = parseFloat(principal_amount);
        const term = parseInt(term_months, 10);

        if (!bankId || isNaN(principal) || principal <= 0 || isNaN(term) || term <= 0) {
            return res.status(400).json({ message: "Valid bank_id, positive principal, and positive term_months are required" });
        }

        const pool = await BankPools.findById(null, bankId);
        if (!pool) {
            return res.status(404).json({ message: "Bank pool not found" });
        }

        if (pool.status !== "ACTIVE") {
            return res.status(400).json({ message: "Bank pool is not accepting loan applications" });
        }

        const monthlyInstallment = calculateMonthlyInstallment(principal, pool.interest_rate, term);
        const totalRepayable = calculateTotalRepayable(monthlyInstallment, term);

        const loan = await Loans.create(
            null,
            bankId,
            borrowerId,
            principal,
            pool.interest_rate,
            term,
            monthlyInstallment,
            totalRepayable,
            purpose || ""
        );

        res.status(201).json({
            message: "Loan request submitted successfully",
            loan
        });
    } catch (err) {
        console.error("Error in requestLoan:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.approveAndDisburseLoan = async (req, res) => {
    try {
        const userId = parseInt(req.user.id, 10);
        const loanId = parseInt(req.params.id, 10);

        if (!loanId) {
            return res.status(400).json({ message: "Valid loan ID is required" });
        }

        const result = await withTransaction(async (client) => {
            const loan = await Loans.findByIdForUpdate(client, loanId);
            if (!loan) throw new Error("Loan not found");

            if (loan.status !== "REQUESTED") {
                throw new Error(`Loan cannot be disbursed because it is currently in '${loan.status}' status`);
            }

            const pool = await BankPools.findByIdForUpdate(client, loan.bank_id);
            if (!pool) throw new Error("Bank pool not found");

            // Verify caller is bank owner
            if (parseInt(pool.owner_id, 10) !== userId) {
                throw new Error("Only the Bank Pool owner can approve and disburse loans");
            }

            const principal = parseFloat(loan.principal_amount);
            const currentAvail = parseFloat(pool.available_liquidity);
            const totalLiq = parseFloat(pool.total_liquidity);
            const resRatioPct = parseFloat(pool.reserve_ratio_pct);

            if (currentAvail < principal) {
                throw new Error(`Insufficient available liquidity in bank pool (Available: $${currentAvail.toFixed(2)}, Requested: $${principal.toFixed(2)})`);
            }

            // Verify Fractional Reserve Ratio constraint
            const availAfter = currentAvail - principal;
            const requiredReserve = (totalLiq * resRatioPct) / 100;
            if (availAfter < requiredReserve) {
                throw new Error(`Disbursement violates bank reserve ratio requirement (Required reserve: $${requiredReserve.toFixed(2)}, Remaining after disbursement: $${availAfter.toFixed(2)})`);
            }

            // Deduct available liquidity from bank pool
            await BankPools.updateLiquidity(client, loan.bank_id, 0.00, -principal);

            // Credit principal to borrower wallet
            await Users.creditWalletBalance(client, loan.borrower_id, principal);

            // Update loan status
            const updatedLoan = await Loans.updateStatus(client, loanId, "ACTIVE", new Date());

            // Log ledger transaction
            await WalletTransactions.create(
                client,
                null,
                loan.borrower_id,
                principal,
                "LOAN_DISBURSEMENT",
                `Loan disbursement for loan #${loanId} from pool ${pool.bank_name}`
            );

            return updatedLoan;
        });

        res.status(200).json({
            message: "Loan approved and disbursed successfully",
            loan: result
        });
    } catch (err) {
        console.error("Error in approveAndDisburseLoan:", err);
        res.status(400).json({ message: err.message || "Failed to disburse loan" });
    }
};

exports.repayLoanInstallment = async (req, res) => {
    try {
        const borrowerId = parseInt(req.user.id, 10);
        const { loan_id, amount } = req.body;
        const loanId = parseInt(loan_id, 10);
        const paymentAmount = parseFloat(amount);

        if (!loanId || isNaN(paymentAmount) || paymentAmount <= 0) {
            return res.status(400).json({ message: "Valid loan_id and positive payment amount are required" });
        }

        const result = await withTransaction(async (client) => {
            const loan = await Loans.findByIdForUpdate(client, loanId);
            if (!loan) throw new Error("Loan not found");

            if (parseInt(loan.borrower_id, 10) !== borrowerId) {
                throw new Error("You are not the borrower of this loan");
            }

            if (loan.status !== "ACTIVE") {
                throw new Error(`Loan is not active for repayment (Current status: ${loan.status})`);
            }

            const borrower = await Users.findByIdForUpdate(client, borrowerId);
            if (parseFloat(borrower.wallet_balance) < paymentAmount) {
                throw new Error("Insufficient wallet balance for loan repayment");
            }

            const remBalance = parseFloat(loan.remaining_balance);
            const actualPayment = Math.min(paymentAmount, remBalance);

            // Calculate repayment split
            const { principalPortion, interestPortion } = calculateRepaymentSplit(
                remBalance,
                loan.interest_rate,
                actualPayment
            );

            // Deduct payment from borrower wallet
            await Users.deductWalletBalance(client, borrowerId, actualPayment);

            // Replenish bank pool available liquidity with principal portion
            const pool = await BankPools.findByIdForUpdate(client, loan.bank_id);
            if (principalPortion > 0) {
                await BankPools.updateLiquidity(client, loan.bank_id, 0.00, principalPortion);
            }

            // Distribute interest yield to bank owner and LP contributors
            let ownerFee = 0.00;
            let poolYield = 0.00;

            if (interestPortion > 0) {
                const contributors = await BankContributions.getContributionsByBank(client, loan.bank_id);
                const yieldDistribution = distributeYield(
                    interestPortion,
                    pool.owner_commission_pct,
                    contributors,
                    pool.total_liquidity
                );

                ownerFee = yieldDistribution.ownerFee;
                poolYield = yieldDistribution.poolYield;

                // Credit Bank Owner commission
                if (ownerFee > 0) {
                    await Users.creditWalletBalance(client, pool.owner_id, ownerFee);
                    await WalletTransactions.create(
                        client,
                        borrowerId,
                        pool.owner_id,
                        ownerFee,
                        "OWNER_COMMISSION",
                        `Bank owner commission from loan #${loanId} repayment`
                    );
                }

                // Credit LP contributors
                for (const dist of yieldDistribution.distributions) {
                    await Users.creditWalletBalance(client, dist.user_id, dist.share);
                    await WalletTransactions.create(
                        client,
                        borrowerId,
                        dist.user_id,
                        dist.share,
                        "POOL_YIELD_DISTRIBUTION",
                        `LP yield share from loan #${loanId} repayment`
                    );
                }
            }

            // Update remaining loan balance & status
            const updatedLoan = await Loans.reduceRemainingBalance(client, loanId, principalPortion);

            // Record repayment detail
            const repaymentRecord = await LoanRepayments.create(
                client,
                loanId,
                borrowerId,
                actualPayment,
                principalPortion,
                interestPortion,
                ownerFee,
                poolYield
            );

            // Record general wallet transaction log
            await WalletTransactions.create(
                client,
                borrowerId,
                null,
                actualPayment,
                "LOAN_REPAYMENT",
                `Repayment for loan #${loanId} (${principalPortion.toFixed(2)} principal, ${interestPortion.toFixed(2)} interest)`
            );

            return {
                loan: updatedLoan,
                repayment: repaymentRecord
            };
        });

        res.status(200).json({
            message: "Loan repayment processed successfully",
            result
        });
    } catch (err) {
        console.error("Error in repayLoanInstallment:", err);
        res.status(400).json({ message: err.message || "Failed to process loan repayment" });
    }
};

exports.getUserLoans = async (req, res) => {
    try {
        const userId = parseInt(req.user.id, 10);
        const loans = await Loans.findByBorrower(null, userId);
        res.status(200).json({ loans });
    } catch (err) {
        console.error("Error in getUserLoans:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getBankLoans = async (req, res) => {
    try {
        const bankId = parseInt(req.params.bankId, 10);
        const loans = await Loans.findByBank(null, bankId);
        res.status(200).json({ loans });
    } catch (err) {
        console.error("Error in getBankLoans:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getLoanById = async (req, res) => {
    try {
        const loanId = parseInt(req.params.id, 10);
        const loan = await Loans.findById(null, loanId);
        if (!loan) {
            return res.status(404).json({ message: "Loan not found" });
        }

        const repayments = await LoanRepayments.findByLoan(null, loanId);

        res.status(200).json({
            loan,
            repayments
        });
    } catch (err) {
        console.error("Error in getLoanById:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};
