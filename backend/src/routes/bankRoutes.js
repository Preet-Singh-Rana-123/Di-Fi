const express = require("express");
const router = express.Router();
const bankController = require("../controllers/bankControllers");
const { authenticateToken } = require("../middleware/authMiddleware");

router.post("/create", authenticateToken, bankController.createBankPool);
router.post("/deposit-liquidity", authenticateToken, bankController.depositLiquidity);
router.post("/withdraw-liquidity", authenticateToken, bankController.withdrawLiquidity);
router.get("/pools", bankController.getAllBankPools);
router.get("/pool/:id", bankController.getBankPoolById);

module.exports = router;
