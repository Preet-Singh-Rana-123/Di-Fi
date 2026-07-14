const pool = require("../utils/db");

class Users {
    static async create(username, email, first_name, last_name, password_hash) {
        const result = await pool.query(
            `INSERT INTO users (username,email, first_name, last_name, password_hash) VALUES ($1,$2,$3,$4,$5);`,
            [username, email, first_name, last_name, password_hash],
        );
        return result.rows[0];
    }

    static async findById(user_id) {
        const result = await pool.query(`SELECT * FROM users WHERE id=$1`, [
            user_id,
        ]);
        return result.rows[0];
    }

    static async findByEmail(email) {
        const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
            email,
        ]);
        return result.rows[0];
    }

    static async credit_wallet_balance(clientOrPool, user_id, amount) {
        const result = await clientOrPool.query(
            `UPDATE users SET wallet_balance=wallet_balance+$1 WHERE id = $2 RETURNING wallet_balance;`,
            [amount, user_id],
        );
        return result;
    }

    static async deduct_wallet_balance(clientOrPool, user_id, amount) {
        const result = await clientOrPool.query(
            `UPDATE users SET wallet_balance=wallet_balance-$1 WHERE id = $2 AND wallet_balance >= $1 RETURNING wallet_balance;`,
            [amount, user_id],
        );
        return result;
    }
}

module.exports = Users;
