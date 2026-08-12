const { withTransaction } = require("../utils/transaction");
const Users = require("../models/users");
const WalletTransactions = require("../models/wallet_transactions");

exports.depositFunds = async (req, res) => {
    try {
        const userId = parseInt(req.user.id, 10);
        const { amount } = req.body;
        const parsedAmount = parseFloat(amount);

        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            return res.status(400).json({ message: "Amount must be a positive number" });
        }

        const result = await withTransaction(async (client) => {
            const user = await Users.findByIdForUpdate(client, userId);
            if (!user) {
                throw new Error("User not found");
            }

            const updatedUser = await Users.creditWalletBalance(client, userId, parsedAmount);
            await WalletTransactions.create(
                client,
                null,
                userId,
                parsedAmount,
                "DEPOSIT",
                `Direct wallet deposit of $${parsedAmount.toFixed(2)}`
            );

            return updatedUser;
        });

        res.status(200).json({
            message: "Deposit successful",
            wallet_balance: result.wallet_balance
        });
    } catch (err) {
        console.error("Error in depositFunds:", err);
        res.status(400).json({ message: err.message || "Failed to deposit funds" });
    }
};

exports.withdrawFunds = async (req, res) => {
    try {
        const userId = parseInt(req.user.id, 10);
        const { amount } = req.body;
        const parsedAmount = parseFloat(amount);

        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            return res.status(400).json({ message: "Amount must be a positive number" });
        }

        const result = await withTransaction(async (client) => {
            const user = await Users.findByIdForUpdate(client, userId);
            if (!user) {
                throw new Error("User not found");
            }

            if (parseFloat(user.wallet_balance) < parsedAmount) {
                throw new Error("Insufficient wallet balance for withdrawal");
            }

            const updatedUser = await Users.deductWalletBalance(client, userId, parsedAmount);
            await WalletTransactions.create(
                client,
                userId,
                null,
                parsedAmount,
                "WITHDRAWAL",
                `Wallet withdrawal of $${parsedAmount.toFixed(2)}`
            );

            return updatedUser;
        });

        res.status(200).json({
            message: "Withdrawal successful",
            wallet_balance: result.wallet_balance
        });
    } catch (err) {
        console.error("Error in withdrawFunds:", err);
        res.status(400).json({ message: err.message || "Failed to withdraw funds" });
    }
};

exports.transferFunds = async (req, res) => {
    try {
        const senderId = parseInt(req.user.id, 10);
        const { receiver_email, receiver_id, amount } = req.body;
        const parsedAmount = parseFloat(amount);

        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            return res.status(400).json({ message: "Amount must be a positive number" });
        }

        let targetReceiverId = receiver_id ? parseInt(receiver_id, 10) : null;
        if (!targetReceiverId && receiver_email) {
            const receiverUser = await Users.findByEmail(null, receiver_email);
            if (!receiverUser) {
                return res.status(404).json({ message: "Receiver email not found" });
            }
            targetReceiverId = receiverUser.id;
        }

        if (!targetReceiverId) {
            return res.status(400).json({ message: "Receiver ID or email is required" });
        }

        if (senderId === targetReceiverId) {
            return res.status(400).json({ message: "Cannot transfer funds to yourself" });
        }

        const result = await withTransaction(async (client) => {
            // Lock both users in deterministic ID order to avoid deadlocks
            const lockedUsers = await Users.findByIdsForUpdate(client, [senderId, targetReceiverId]);
            const sender = lockedUsers.find(u => u.id === senderId);
            const receiver = lockedUsers.find(u => u.id === targetReceiverId);

            if (!sender) throw new Error("Sender not found");
            if (!receiver) throw new Error("Receiver not found");

            if (parseFloat(sender.wallet_balance) < parsedAmount) {
                throw new Error("Insufficient wallet balance for transfer");
            }

            const updatedSender = await Users.deductWalletBalance(client, senderId, parsedAmount);
            await Users.creditWalletBalance(client, targetReceiverId, parsedAmount);

            await WalletTransactions.create(
                client,
                senderId,
                targetReceiverId,
                parsedAmount,
                "TRANSFER",
                `Direct transfer to ${receiver.username}`
            );

            return updatedSender;
        });

        res.status(200).json({
            message: "Transfer successful",
            wallet_balance: result.wallet_balance
        });
    } catch (err) {
        console.error("Error in transferFunds:", err);
        res.status(400).json({ message: err.message || "Failed to transfer funds" });
    }
};

exports.getWalletHistory = async (req, res) => {
    try {
        const userId = parseInt(req.user.id, 10);
        const transactions = await WalletTransactions.findByUser(null, userId);
        res.status(200).json({ transactions });
    } catch (err) {
        console.error("Error in getWalletHistory:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};
