const pool = require("../utils/db");

class BankPools {
    static async create(
        clientOrPool,
        ownerId,
        bankName,
        interestRate,
        ownerCommissionPct = 10.0,
        reserveRatioPct = 20.0,
        initialLiquidity = 0.0
    ) {
        const db = clientOrPool || pool;
        const result = await db.query(
            `INSERT INTO bank_pools (
                owner_id, bank_name, interest_rate, owner_commission_pct, reserve_ratio_pct, total_liquidity, available_liquidity
             ) VALUES ($1, $2, $3, $4, $5, $6, $6)
             RETURNING id, owner_id, bank_name, interest_rate, owner_commission_pct, reserve_ratio_pct, total_liquidity, available_liquidity, status, created_at;`,
            [ownerId, bankName, interestRate, ownerCommissionPct, reserveRatioPct, initialLiquidity]
        );
        return result.rows[0];
    }

    static async findById(clientOrPool, bankId) {
        const db = clientOrPool || pool;
        const result = await db.query(
            `SELECT bp.*, u.username as owner_username, u.email as owner_email
             FROM bank_pools bp
             JOIN users u ON bp.owner_id = u.id
             WHERE bp.id = $1;`,
            [bankId]
        );
        return result.rows[0];
    }

    static async findByIdForUpdate(client, bankId) {
        const result = await client.query(
            `SELECT * FROM bank_pools WHERE id = $1 FOR UPDATE;`,
            [bankId]
        );
        return result.rows[0];
    }

    static async findAll(clientOrPool) {
        const db = clientOrPool || pool;
        const result = await db.query(
            `SELECT bp.*, u.username as owner_username,
                    (SELECT COUNT(*)::int FROM bank_contributions bc WHERE bc.bank_id = bp.id) as contributor_count,
                    (SELECT COUNT(*)::int FROM loans l WHERE l.bank_id = bp.id AND l.status = 'ACTIVE') as active_loans_count
             FROM bank_pools bp
             JOIN users u ON bp.owner_id = u.id
             ORDER BY bp.created_at DESC;`
        );
        return result.rows;
    }

    static async updateLiquidity(client, bankId, totalDelta, availableDelta) {
        const result = await client.query(
            `UPDATE bank_pools
             SET total_liquidity = total_liquidity + $1,
                 available_liquidity = available_liquidity + $2
             WHERE id = $3 AND total_liquidity + $1 >= 0 AND available_liquidity + $2 >= 0
             RETURNING id, total_liquidity, available_liquidity;`,
            [totalDelta, availableDelta, bankId]
        );
        if (result.rows.length === 0) {
            throw new Error(`Insufficient pool liquidity or bank pool ${bankId} not found.`);
        }
        return result.rows[0];
    }
}

module.exports = BankPools;
