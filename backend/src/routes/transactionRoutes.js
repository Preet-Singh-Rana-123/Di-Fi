const express = require("express");
const transactionController = require("../controllers/transactionControllers");
const { authenticateToken } = require("../middleware/authMiddleware");

const transactionRouter = express.Router();

transactionRouter.patch(
    "/fund-transfer",
    authenticateToken,
    transactionController.fund_transfer_transaction,
);
transactionRouter.patch(
    "/wallet-fund-update",
    authenticateToken,
    transactionController.update_wallet_transaction,
);
transactionRouter.patch(
    "/distribute-yeild",
    authenticateToken,
    transactionController.yeild_repayment_distribution,
);

module.exports = transactionRouter;
