const Users = require("../models/users");
const WalletTransactions = require("../models/wallet_transactions");
const pool = require("../utils/db");

exports.transfer_funds = async (sender_id, reciver_id, amount, type) => {
    const client = await pool.connect();
    try {
        await client.query(`BEGIN`);
        const senderRes = await Users.deduct_wallet_balance(
            client,
            sender_id,
            amount,
        );
        if (senderRes.rows.length === 0) {
            throw new Error("Insufficient funds or invalid sender.");
        }
        const receiverRes = await Users.credit_wallet_balance(
            client,
            reciver_id,
            amount,
        );
        if (receiverRes.rows.length === 0) {
            throw new Error("Invalid receiver.");
        }

        await WalletTransactions.create(
            client,
            sender_id,
            reciver_id,
            amount,
            type,
        );
        await client.query("COMMIT");
        return { success: true, message: "Transfer successful" };
    } catch (err) {
        await client.query(`ROLLBACK`);
        console.log(err);
        return { success: false, error: err.message };
    } finally {
        client.release();
    }
};

exports.update_wallet_balance = async (user_id, amount) => {
    const client = await pool.connect();
    try {
        await client.query(`BEGIN`);
        const result = await Users.credit_wallet_balance(
            client,
            user_id,
            amount,
        );
        if (result.rows.length === 0) {
            throw new Error("Invalid receiver.");
        }
        await client.query("COMMIT");
        return {
            success: true,
            message: "wallet balance updated successfuly",
            data: result.rows[0],
        };
    } catch (err) {
        await client.query(`ROLLBACK`);
        console.log(err);
        return { success: false, error: err.message, result: result.rows[0] };
    } finally {
        client.release();
    }
};
