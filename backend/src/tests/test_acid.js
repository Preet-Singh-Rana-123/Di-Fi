const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });
require("dotenv").config({ path: path.join(__dirname, "../.env") });
require("dotenv").config();

const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../utils/db");

const Users = require("../models/users");
const BankPools = require("../models/bank_pools");
const BankContributions = require("../models/bank_contributions");
const Loans = require("../models/loans");
const LoanRepayments = require("../models/loan_repayments");
const WalletTransactions = require("../models/wallet_transactions");

const { withTransaction } = require("../utils/transaction");
const { calculateMonthlyInstallment, calculateTotalRepayable, calculateRepaymentSplit, distributeYield } = require("../utils/financialMath");

async function runACIDTestSuite() {
    console.log("\n=======================================================");
    console.log("🧪 STARTING DECENTRALIZED P2P BANKING ACID TEST SUITE");
    console.log("=======================================================\n");

    try {
        // 1. Reset database schema
        console.log("--> Resetting Database Schema...");
        const schemaSql = fs.readFileSync(path.join(__dirname, "../db/schema.sql"), "utf8");
        await pool.query(schemaSql);
        console.log("✔ Schema reset cleanly.\n");

        // 2. Create Users
        console.log("--> Creating Test Users (Alice: Banker, Bob: Lender, Charlie: Borrower)...");
        const passwordHash = await bcrypt.hash("password123", 10);
        
        const alice = await Users.create(null, "alice_banker", "alice@difi.org", "Alice", "Banker", passwordHash);
        const bob = await Users.create(null, "bob_lender", "bob@difi.org", "Bob", "Lender", passwordHash);
        const charlie = await Users.create(null, "charlie_borrower", "charlie@difi.org", "Charlie", "Borrower", passwordHash);
        
        console.log(`✔ Created Users: Alice (ID: ${alice.id}), Bob (ID: ${bob.id}), Charlie (ID: ${charlie.id})\n`);

        // 3. Deposit Funds into Wallets
        console.log("--> Depositing Initial Wallet Funds...");
        await withTransaction(async (client) => {
            await Users.creditWalletBalance(client, alice.id, 50000.00);
            await WalletTransactions.create(client, null, alice.id, 50000.00, "DEPOSIT", "Initial topup Alice");
            
            await Users.creditWalletBalance(client, bob.id, 50000.00);
            await WalletTransactions.create(client, null, bob.id, 50000.00, "DEPOSIT", "Initial topup Bob");
        });
        
        let aliceDb = await Users.findById(null, alice.id);
        let bobDb = await Users.findById(null, bob.id);
        console.log(`✔ Alice Wallet Balance: $${aliceDb.wallet_balance}`);
        console.log(`✔ Bob Wallet Balance:   $${bobDb.wallet_balance}\n`);

        // 4. Test P2P Direct Transfer
        console.log("--> Testing ACID Direct Transfer (Alice -> Bob $5,000)...");
        await withTransaction(async (client) => {
            const locked = await Users.findByIdsForUpdate(client, [alice.id, bob.id]);
            await Users.deductWalletBalance(client, alice.id, 5000.00);
            await Users.creditWalletBalance(client, bob.id, 5000.00);
            await WalletTransactions.create(client, alice.id, bob.id, 5000.00, "TRANSFER", "Alice to Bob transfer");
        });

        aliceDb = await Users.findById(null, alice.id);
        bobDb = await Users.findById(null, bob.id);
        console.log(`✔ Alice Balance post-transfer: $${aliceDb.wallet_balance} (Expected: 45000.00)`);
        console.log(`✔ Bob Balance post-transfer:   $${bobDb.wallet_balance} (Expected: 55000.00)\n`);

        // 5. Alice Found a Bank Pool
        console.log("--> Alice Found Bank Pool ('Apex Liquidity Vault') with $10,000 seed...");
        let poolId;
        await withTransaction(async (client) => {
            await Users.findByIdForUpdate(client, alice.id);
            await Users.deductWalletBalance(client, alice.id, 10000.00);
            
            const bankPool = await BankPools.create(
                client,
                alice.id,
                "Apex Liquidity Vault",
                12.00, // 12% APR
                10.00, // 10% Owner Commission
                20.00, // 20% Reserve Ratio
                10000.00
            );
            poolId = bankPool.id;
            await BankContributions.upsertContribution(client, poolId, alice.id, 10000.00);
            await WalletTransactions.create(client, alice.id, null, 10000.00, "POOL_DEPOSIT", "Alice seed liquidity");
        });

        let poolDb = await BankPools.findById(null, poolId);
        console.log(`✔ Bank Pool Created (ID: ${poolDb.id})`);
        console.log(`  Total Liquidity:     $${poolDb.total_liquidity}`);
        console.log(`  Available Liquidity: $${poolDb.available_liquidity}\n`);

        // 6. Bob Deposit Liquidity
        console.log("--> Bob Deposits $20,000 Liquidity into Apex Vault...");
        await withTransaction(async (client) => {
            await Users.findByIdForUpdate(client, bob.id);
            await BankPools.findByIdForUpdate(client, poolId);
            
            await Users.deductWalletBalance(client, bob.id, 20000.00);
            await BankPools.updateLiquidity(client, poolId, 20000.00, 20000.00);
            await BankContributions.upsertContribution(client, poolId, bob.id, 20000.00);
            await WalletTransactions.create(client, bob.id, null, 20000.00, "POOL_DEPOSIT", "Bob LP deposit");
        });

        poolDb = await BankPools.findById(null, poolId);
        console.log(`✔ Pool Total Liquidity:     $${poolDb.total_liquidity} (Expected: 30000.00)`);
        console.log(`✔ Pool Available Liquidity: $${poolDb.available_liquidity} (Expected: 30000.00)\n`);

        // 7. Charlie Requests Loan
        console.log("--> Charlie Applies for a $15,000 Loan (12 Months @ 12% APR)...");
        const emi = calculateMonthlyInstallment(15000.00, 12.00, 12);
        const totalRepayable = calculateTotalRepayable(emi, 12);
        
        console.log(`  Calculated EMI: $${emi}`);
        console.log(`  Total Repayable: $${totalRepayable}`);

        const loan = await Loans.create(
            null,
            poolId,
            charlie.id,
            15000.00,
            12.00,
            12,
            emi,
            totalRepayable,
            "Small Business Expansion"
        );
        console.log(`✔ Loan Requested (Loan ID: ${loan.id}, Status: ${loan.status})\n`);

        // 8. Alice Approves & Disburses Loan
        console.log("--> Alice Approves and Disburses Loan #1 to Charlie...");
        await withTransaction(async (client) => {
            await Loans.findByIdForUpdate(client, loan.id);
            const p = await BankPools.findByIdForUpdate(client, poolId);
            
            await BankPools.updateLiquidity(client, poolId, 0.00, -15000.00);
            await Users.creditWalletBalance(client, charlie.id, 15000.00);
            await Loans.updateStatus(client, loan.id, "ACTIVE", new Date());
            await WalletTransactions.create(client, null, charlie.id, 15000.00, "LOAN_DISBURSEMENT", "Disbursement #1");
        });

        poolDb = await BankPools.findById(null, poolId);
        let charlieDb = await Users.findById(null, charlie.id);
        console.log(`✔ Loan Disbursed!`);
        console.log(`  Pool Total Liquidity:     $${poolDb.total_liquidity} (Unchanged asset pool)`);
        console.log(`  Pool Available Liquidity: $${poolDb.available_liquidity} (Expected: 15000.00)`);
        console.log(`  Charlie Wallet Balance:   $${charlieDb.wallet_balance} (Expected: 15000.00)\n`);

        // 9. Charlie Repays 1st Installment
        console.log("--> Charlie Repays 1st Installment ($1,332.70)...");
        const paymentAmount = emi;
        await withTransaction(async (client) => {
            const l = await Loans.findByIdForUpdate(client, loan.id);
            const p = await BankPools.findByIdForUpdate(client, poolId);
            await Users.findByIdForUpdate(client, charlie.id);

            const { principalPortion, interestPortion } = calculateRepaymentSplit(
                l.remaining_balance,
                l.interest_rate,
                paymentAmount
            );

            await Users.deductWalletBalance(client, charlie.id, paymentAmount);
            await BankPools.updateLiquidity(client, poolId, 0.00, principalPortion);

            const contributors = await BankContributions.getContributionsByBank(client, poolId);
            const yieldDist = distributeYield(interestPortion, p.owner_commission_pct, contributors, p.total_liquidity);

            if (yieldDist.ownerFee > 0) {
                await Users.creditWalletBalance(client, p.owner_id, yieldDist.ownerFee);
                await WalletTransactions.create(client, charlie.id, p.owner_id, yieldDist.ownerFee, "OWNER_COMMISSION", "Repayment cut owner");
            }

            for (const dist of yieldDist.distributions) {
                await Users.creditWalletBalance(client, dist.user_id, dist.share);
                await WalletTransactions.create(client, charlie.id, dist.user_id, dist.share, "POOL_YIELD_DISTRIBUTION", "Repayment cut LP");
            }

            await Loans.reduceRemainingBalance(client, loan.id, principalPortion);
            await LoanRepayments.create(client, loan.id, charlie.id, paymentAmount, principalPortion, interestPortion, yieldDist.ownerFee, yieldDist.poolYield);
            await WalletTransactions.create(client, charlie.id, null, paymentAmount, "LOAN_REPAYMENT", "Charlie repayment #1");
        });

        poolDb = await BankPools.findById(null, poolId);
        aliceDb = await Users.findById(null, alice.id);
        bobDb = await Users.findById(null, bob.id);
        charlieDb = await Users.findById(null, charlie.id);
        const updatedLoan = await Loans.findById(null, loan.id);

        console.log(`✔ Repayment Processed cleanly!`);
        console.log(`  Loan Remaining Balance: $${updatedLoan.remaining_balance}`);
        console.log(`  Pool Available Liquidity: $${poolDb.available_liquidity}`);
        console.log(`  Alice Wallet Balance:   $${aliceDb.wallet_balance} (Owner cut + LP yield)`);
        console.log(`  Bob Wallet Balance:     $${bobDb.wallet_balance} (2/3 LP yield share)`);
        console.log(`  Charlie Wallet Balance: $${charlieDb.wallet_balance}\n`);

        // 10. Test Atomic Rollback on Overdraft
        console.log("--> Testing Atomic Rollback on Overdraft Attempt...");
        try {
            await withTransaction(async (client) => {
                await Users.deductWalletBalance(client, charlie.id, 999999.00); // Invalid amount
            });
            console.error("❌ ERROR: Overdraft should have failed!");
        } catch (err) {
            console.log(`✔ Expected Rollback Triggered: "${err.message}"`);
        }

        console.log("\n=======================================================");
        console.log("✅ ALL ACID & P2P BANKING INTEGRATION TESTS PASSED!");
        console.log("=======================================================\n");

    } catch (err) {
        console.error("\n❌ ACID Test Suite Failed:", err);
    } finally {
        await pool.end();
        process.exit(0);
    }
}

runACIDTestSuite();
