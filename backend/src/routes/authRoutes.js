const express = require("express");
const router = express.Router();
const authController = require("../controllers/authControllers");
const { authenticateToken } = require("../middleware/authMiddleware");

router.post("/register", authController.postRegister);
router.post("/login", authController.postLogin);
router.get("/me", authenticateToken, authController.getMe);

module.exports = router;
