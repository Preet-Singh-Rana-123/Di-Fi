const pool = require("../utils/db");

class WalletTransactions {
    static async create(
        clientOrPool,
        senderId,
        receiverId,
        amount,
        transactionType,
        description = ""
    ) {
        const db = clientOrPool || pool;
        const result = await db.query(
            `INSERT INTO wallet_transactions (sender_id, receiver_id, amount, transaction_type, description)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *;`,
            [senderId, receiverId, amount, transactionType, description]
        );
        return result.rows[0];
    }

    static async findByUser(clientOrPool, userId) {
        const db = clientOrPool || pool;
        const result = await db.query(
            `SELECT wt.*,
                    s.username as sender_username,
                    r.username as receiver_username
             FROM wallet_transactions wt
             LEFT JOIN users s ON wt.sender_id = s.id
             LEFT JOIN users r ON wt.receiver_id = r.id
             WHERE wt.sender_id = $1 OR wt.receiver_id = $1
             ORDER BY wt.created_at DESC;`,
            [userId]
        );
        return result.rows;
    }
}

module.exports = WalletTransactions;
