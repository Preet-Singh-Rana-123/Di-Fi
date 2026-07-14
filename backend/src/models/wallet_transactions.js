const pool = require("../utils/db");

class WalletTransactions {
    static async create(
        clientOrPool,
        sender_id,
        reciver_id,
        amount,
        transaction_type,
    ) {
        const result = await clientOrPool.query(
            `INSERT INTO Wallet_Transactions (sender_id, receiver_id, amount, transaction_type)
            VALUES ($1, $2, $3, $4);`,
            [sender_id, reciver_id, amount, transaction_type],
        );
        return result.rows[0];
    }
}

module.exports = WalletTransactions;
