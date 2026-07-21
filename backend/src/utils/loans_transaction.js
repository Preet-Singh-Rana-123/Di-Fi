const Bank_Pools = require("../models/bank_pools");
const WalletTransactions = require("../models/wallet_transactions");
const Users = require("../models/users");
const Bank_Contributed = require("../models/bank_contributions");
const { find_owner_cut, find_contributers_cut } = require("./math_operations");
const pool = require("../utils/db");

exports.distributeRepaymentYield = async (bankId, totalInstallmentReceived) => {
    const client = await pool.connect();
    try {
        await client.query(`BEGIN`);

        const bankRes = await Bank_Pools.get_bank_pool_detail(client, bankId);
        if (bankRes.rows.length === 0) {
            throw new Error("Bank not found");
        }

        const {
            owner_id: ownerId,
            owner_commission_pct: commissionPct,
            total_liquidity: totalLiquidity,
        } = bankRes.rows[0];

        const ownerCut = find_owner_cut(
            totalInstallmentReceived,
            commissionPct,
        );
        const yieldToDistribute = totalInstallmentReceived - ownerCut;

        if (ownerCut > 0) {
            await Users.credit_wallet_balance(client, ownerId, ownerCut);
        }

        const contributorsRes = await Bank_Contributed.get_bank_pool_detail(
            client,
            bankId,
        );

        for (let contributor of contributorsRes.rows) {
            const {
                user_id: contributorId,
                amount_contributed: rawContribution,
            } = contributor;

            const individualShare = find_contributers_cut(
                totalLiquidity,
                rawContribution,
                yieldToDistribute,
            );

            if (individualShare > 0) {
                await Users.credit_wallet_balance(
                    client,
                    contributorId,
                    individualShare,
                );

                await WalletTransactions.create(
                    client,
                    ownerId,
                    contributorId,
                    individualShare,
                    "POOL_YIELD_DISTRIBUTION",
                );
            }
        }

        await client.query("COMMIT");
        return { success: true };
    } catch (err) {
        await client.query(`ROLLBACK`);
        console.log(err);
        return { success: false, error: err.message };
    } finally {
        client.release();
    }
};
