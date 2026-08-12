const express = require("express");
const router = express.Router();
const loanController = require("../controllers/loanControllers");
const { authenticateToken } = require("../middleware/authMiddleware");

router.post("/request", authenticateToken, loanController.requestLoan);
router.post("/disburse/:id", authenticateToken, loanController.approveAndDisburseLoan);
router.post("/repay", authenticateToken, loanController.repayLoanInstallment);
router.get("/user", authenticateToken, loanController.getUserLoans);
router.get("/bank/:bankId", authenticateToken, loanController.getBankLoans);
router.get("/:id", authenticateToken, loanController.getLoanById);

module.exports = router;
