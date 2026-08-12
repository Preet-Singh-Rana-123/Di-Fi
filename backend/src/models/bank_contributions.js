const pool = require("../utils/db");

class BankContributions {
    static async upsertContribution(client, bankId, userId, amountDelta) {
        const result = await client.query(
            `INSERT INTO bank_contributions (bank_id, user_id, amount_contributed)
             VALUES ($1, $2, $3)
             ON CONFLICT (bank_id, user_id)
             DO UPDATE SET 
                amount_contributed = bank_contributions.amount_contributed + EXCLUDED.amount_contributed,
                updated_at = CURRENT_TIMESTAMP
             RETURNING id, bank_id, user_id, amount_contributed;`,
            [bankId, userId, amountDelta]
        );
        return result.rows[0];
    }

    static async deductContribution(client, bankId, userId, amount) {
        const result = await client.query(
            `UPDATE bank_contributions
             SET amount_contributed = amount_contributed - $1,
                 updated_at = CURRENT_TIMESTAMP
             WHERE bank_id = $2 AND user_id = $3 AND amount_contributed >= $1
             RETURNING id, bank_id, user_id, amount_contributed;`,
            [amount, bankId, userId]
        );
        if (result.rows.length === 0) {
            throw new Error(`Insufficient contribution balance or contribution record not found for user ${userId} in bank ${bankId}.`);
        }
        return result.rows[0];
    }

    static async getContributionsByBank(clientOrPool, bankId) {
        const db = clientOrPool || pool;
        const result = await db.query(
            `SELECT bc.*, u.username, u.email, u.first_name, u.last_name
             FROM bank_contributions bc
             JOIN users u ON bc.user_id = u.id
             WHERE bc.bank_id = $1 AND bc.amount_contributed > 0
             ORDER BY bc.amount_contributed DESC;`,
            [bankId]
        );
        return result.rows;
    }

    static async getUserContribution(clientOrPool, bankId, userId) {
        const db = clientOrPool || pool;
        const result = await db.query(
            `SELECT * FROM bank_contributions WHERE bank_id = $1 AND user_id = $2;`,
            [bankId, userId]
        );
        return result.rows[0];
    }

    static async getUserAllContributions(clientOrPool, userId) {
        const db = clientOrPool || pool;
        const result = await db.query(
            `SELECT bc.*, bp.bank_name, bp.interest_rate, bp.owner_commission_pct, bp.total_liquidity
             FROM bank_contributions bc
             JOIN bank_pools bp ON bc.bank_id = bp.id
             WHERE bc.user_id = $1 AND bc.amount_contributed > 0
             ORDER BY bc.updated_at DESC;`,
            [userId]
        );
        return result.rows;
    }
}

module.exports = BankContributions;
