const { withTransaction } = require("../utils/transaction");
const Users = require("../models/users");
const BankPools = require("../models/bank_pools");
const BankContributions = require("../models/bank_contributions");
const Loans = require("../models/loans");
const WalletTransactions = require("../models/wallet_transactions");

exports.createBankPool = async (req, res) => {
    try {
        const ownerId = parseInt(req.user.id, 10);
        const {
            bank_name,
            interest_rate,
            owner_commission_pct,
            reserve_ratio_pct,
            initial_liquidity,
        } = req.body;

        if (!bank_name || interest_rate === undefined) {
            return res
                .status(400)
                .json({ message: "Bank name and interest rate are required" });
        }

        const rate = parseFloat(interest_rate);
        const commPct =
            owner_commission_pct !== undefined
                ? parseFloat(owner_commission_pct)
                : 10.0;
        const resPct =
            reserve_ratio_pct !== undefined
                ? parseFloat(reserve_ratio_pct)
                : 20.0;
        const initLiq =
            initial_liquidity !== undefined
                ? parseFloat(initial_liquidity)
                : 0.0;

        if (
            rate < 0 ||
            commPct < 0 ||
            commPct > 100 ||
            resPct < 0 ||
            resPct > 100 ||
            initLiq < 0
        ) {
            return res.status(400).json({ message: "Invalid pool parameters" });
        }

        const result = await withTransaction(async (client) => {
            const owner = await Users.findByIdForUpdate(client, ownerId);
            if (!owner) {
                throw new Error("Owner user not found");
            }

            if (initLiq > 0) {
                if (parseFloat(owner.wallet_balance) < initLiq) {
                    throw new Error(
                        "Insufficient wallet balance for initial pool liquidity seed",
                    );
                }
                await Users.deductWalletBalance(client, ownerId, initLiq);
            }

            const pool = await BankPools.create(
                client,
                ownerId,
                bank_name,
                rate,
                commPct,
                resPct,
                initLiq,
            );

            if (initLiq > 0) {
                await BankContributions.upsertContribution(
                    client,
                    pool.id,
                    ownerId,
                    initLiq,
                );
                await WalletTransactions.create(
                    client,
                    ownerId,
                    null,
                    initLiq,
                    "POOL_DEPOSIT",
                    `Initial liquidity seed for bank pool ${bank_name}`,
                );
            }

            return pool;
        });

        res.status(201).json({
            message: "Bank Pool created successfully",
            pool: result,
        });
    } catch (err) {
        console.error("Error in createBankPool:", err);
        res.status(400).json({
            message: err.message || "Failed to create bank pool",
        });
    }
};

exports.depositLiquidity = async (req, res) => {
    try {
        const userId = parseInt(req.user.id, 10);
        const { bank_id, amount } = req.body;
        const bankId = parseInt(bank_id, 10);
        const parsedAmount = parseFloat(amount);

        if (!bankId || isNaN(parsedAmount) || parsedAmount <= 0) {
            return res
                .status(400)
                .json({
                    message: "Valid bank_id and positive amount are required",
                });
        }

        const result = await withTransaction(async (client) => {
            const user = await Users.findByIdForUpdate(client, userId);
            if (!user) throw new Error("User not found");

            if (parseFloat(user.wallet_balance) < parsedAmount) {
                throw new Error(
                    "Insufficient wallet balance to deposit liquidity",
                );
            }

            const pool = await BankPools.findByIdForUpdate(client, bankId);
            if (!pool) throw new Error("Bank pool not found");

            if (pool.status !== "ACTIVE") {
                throw new Error(
                    "Bank pool is not currently accepting deposits",
                );
            }

            await Users.deductWalletBalance(client, userId, parsedAmount);
            await BankPools.updateLiquidity(
                client,
                bankId,
                parsedAmount,
                parsedAmount,
            );
            const contribution = await BankContributions.upsertContribution(
                client,
                bankId,
                userId,
                parsedAmount,
            );

            await WalletTransactions.create(
                client,
                userId,
                null,
                parsedAmount,
                "POOL_DEPOSIT",
                `Liquidity deposit into bank pool ${pool.bank_name}`,
            );

            return { pool, contribution };
        });

        res.status(200).json({
            message: "Liquidity deposited successfully",
            bank_id: bankId,
            contributed_amount: parsedAmount,
        });
    } catch (err) {
        console.error("Error in depositLiquidity:", err);
        res.status(400).json({
            message: err.message || "Failed to deposit liquidity",
        });
    }
};

exports.withdrawLiquidity = async (req, res) => {
    try {
        const userId = parseInt(req.user.id, 10);
        const { bank_id, amount } = req.body;
        const bankId = parseInt(bank_id, 10);
        const parsedAmount = parseFloat(amount);

        if (!bankId || isNaN(parsedAmount) || parsedAmount <= 0) {
            return res
                .status(400)
                .json({
                    message: "Valid bank_id and positive amount are required",
                });
        }

        const result = await withTransaction(async (client) => {
            const pool = await BankPools.findByIdForUpdate(client, bankId);
            if (!pool) throw new Error("Bank pool not found");

            if (parseFloat(pool.available_liquidity) < parsedAmount) {
                throw new Error(
                    "Insufficient unallocated liquidity in bank pool for withdrawal",
                );
            }

            const contribution = await BankContributions.getUserContribution(
                client,
                bankId,
                userId,
            );
            if (
                !contribution ||
                parseFloat(contribution.amount_contributed) < parsedAmount
            ) {
                throw new Error(
                    "Withdrawal amount exceeds your active contribution share",
                );
            }

            await BankContributions.deductContribution(
                client,
                bankId,
                userId,
                parsedAmount,
            );
            await BankPools.updateLiquidity(
                client,
                bankId,
                -parsedAmount,
                -parsedAmount,
            );
            await Users.creditWalletBalance(client, userId, parsedAmount);

            await WalletTransactions.create(
                client,
                null,
                userId,
                parsedAmount,
                "POOL_WITHDRAWAL",
                `Liquidity withdrawal from bank pool ${pool.bank_name}`,
            );

            return { bankId, withdrawnAmount: parsedAmount };
        });

        res.status(200).json({
            message: "Liquidity withdrawn successfully",
            result,
        });
    } catch (err) {
        console.error("Error in withdrawLiquidity:", err);
        res.status(400).json({
            message: err.message || "Failed to withdraw liquidity",
        });
    }
};

exports.getAllBankPools = async (req, res) => {
    try {
        const pools = await BankPools.findAll(null);
        res.status(200).json({ pools });
    } catch (err) {
        console.error("Error in getAllBankPools:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getBankPoolById = async (req, res) => {
    try {
        const bankId = parseInt(req.params.id, 10);
        const pool = await BankPools.findById(null, bankId);
        if (!pool) {
            return res.status(404).json({ message: "Bank pool not found" });
        }

        const contributors = await BankContributions.getContributionsByBank(
            null,
            bankId,
        );
        const loans = await Loans.findByBank(null, bankId);

        res.status(200).json({
            pool,
            contributors,
            loans,
        });
    } catch (err) {
        console.error("Error in getBankPoolById:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};
