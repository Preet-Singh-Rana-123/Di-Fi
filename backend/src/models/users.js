const pool = require("../utils/db");

class Users {
    static async create(clientOrPool, username, email, firstName, lastName, passwordHash) {
        const db = clientOrPool || pool;
        const result = await db.query(
            `INSERT INTO users (username, email, first_name, last_name, password_hash)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, username, email, first_name, last_name, wallet_balance, created_at;`,
            [username, email, firstName, lastName, passwordHash]
        );
        return result.rows[0];
    }

    static async findById(clientOrPool, id) {
        const db = clientOrPool || pool;
        const result = await db.query(
            `SELECT id, username, email, first_name, last_name, wallet_balance, created_at
             FROM users WHERE id = $1;`,
            [id]
        );
        return result.rows[0];
    }

    /**
     * Obtains an exclusive FOR UPDATE row lock on user record inside an active transaction.
     */
    static async findByIdForUpdate(client, id) {
        const result = await client.query(
            `SELECT id, username, email, first_name, last_name, wallet_balance, created_at
             FROM users WHERE id = $1 FOR UPDATE;`,
            [id]
        );
        return result.rows[0];
    }

    /**
     * Locks multiple users in deterministic ID order to prevent database deadlocks.
     */
    static async findByIdsForUpdate(client, ids) {
        const sortedIds = [...new Set(ids)].sort((a, b) => a - b);
        const result = await client.query(
            `SELECT id, username, email, first_name, last_name, wallet_balance
             FROM users WHERE id = ANY($1::int[]) ORDER BY id ASC FOR UPDATE;`,
            [sortedIds]
        );
        return result.rows;
    }

    static async findByEmail(clientOrPool, email) {
        const db = clientOrPool || pool;
        const result = await db.query(
            `SELECT * FROM users WHERE email = $1;`,
            [email]
        );
        return result.rows[0];
    }

    static async creditWalletBalance(client, userId, amount) {
        const result = await client.query(
            `UPDATE users
             SET wallet_balance = wallet_balance + $1
             WHERE id = $2
             RETURNING id, wallet_balance;`,
            [amount, userId]
        );
        if (result.rows.length === 0) {
            throw new Error(`User with ID ${userId} not found for balance credit.`);
        }
        return result.rows[0];
    }

    static async deductWalletBalance(client, userId, amount) {
        const result = await client.query(
            `UPDATE users
             SET wallet_balance = wallet_balance - $1
             WHERE id = $2 AND wallet_balance >= $1
             RETURNING id, wallet_balance;`,
            [amount, userId]
        );
        if (result.rows.length === 0) {
            throw new Error(`Insufficient wallet balance or user ${userId} not found.`);
        }
        return result.rows[0];
    }
}

module.exports = Users;
