const pool = require("../utils/db");

class Bank_Pools {
    static async create(
        user_id,
        bank_name,
        interest_rate,
        owner_commission_pct,
        total_liquidity,
    ) {
        const result = await pool.query(
            `INSERT INTO bank_pools (owner_id,bank_name,interest_rate,owner_commission_pct,total_liquidity) VALUES ($1,$2,$3,$4,$5);`,
            [
                user_id,
                bank_name,
                interest_rate,
                owner_commission_pct,
                total_liquidity,
            ],
        );
        return result.rows[0];
    }

    static async update_total_liquidity(bank_id, liquidity_amount) {
        const result = await pool.query(
            `UPDATE bank_pools SET total_liquidity = total_liquidity + $1 WHERE id = $2;`,
            [liquidity_amount, bank_id],
        );
        return result.rows[0];
    }

    static async get_bank_pool_detail(bank_id) {
        const result = await pool.query(
            `SELECT owner_id, bank_name, interest_rate, owner_commission_pct, total_liquidity FROM bank_pools WHERE id = $1;`,
            [bank_id],
        );
        return result.rows[0];
    }
}

module.exports = Bank_Pools;
