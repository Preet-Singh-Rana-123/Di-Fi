const express = require("express");
const router = express.Router();
const walletController = require("../controllers/walletControllers");
const { authenticateToken } = require("../middleware/authMiddleware");

router.post("/deposit", authenticateToken, walletController.depositFunds);
router.post("/withdraw", authenticateToken, walletController.withdrawFunds);
router.post("/transfer", authenticateToken, walletController.transferFunds);
router.get("/history", authenticateToken, walletController.getWalletHistory);

module.exports = router;
