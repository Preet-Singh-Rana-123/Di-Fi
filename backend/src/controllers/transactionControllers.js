const Users = require("../models/users");
const {
    transfer_funds,
    update_wallet_balance,
} = require("../utils/funds_transactions");
const { distributeRepaymentYield } = require("../utils/loans_transaction");

exports.yeild_repayment_distribution = async (req, res, next) => {
    try {
        const { bank_id, total_installment } = req.body;
        const result = await distributeRepaymentYield(
            bank_id,
            total_installment,
        );
        res.status(200).json({ result });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal error occurred" });
    }
};

exports.fund_transfer_transaction = async (req, res, next) => {
    try {
        const { reciver_mail, amount, type } = req.body;
        const sender_id = req.user.id;
        const reciver = await Users.findByEmail(reciver_mail);
        const reciver_id = reciver.id;
        const result = await transfer_funds(
            sender_id,
            reciver_id,
            amount,
            type,
        );
        res.status(200).json({ result });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal error occurred" });
    }
};

exports.update_wallet_transaction = async (req, res, next) => {
    try {
        const { amount } = req.body;
        const user_id = req.user.id;
        const response = await update_wallet_balance(user_id, amount);
        if (!response.success) {
            return res.status(400).json({
                message: response.error,
            });
        }
        res.status(200).json({
            message: "wallet balance updated successfull",
            result: response.data,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal error occurred" });
    }
};
