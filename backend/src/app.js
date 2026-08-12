const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRouter = require("./routes/authRoutes");
const walletRouter = require("./routes/walletRoutes");
const bankRouter = require("./routes/bankRoutes");
const loanRouter = require("./routes/loanRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Route mounts
app.use("/api/auth", authRouter);
app.use("/api/wallet", walletRouter);
app.use("/api/bank", bankRouter);
app.use("/api/loan", loanRouter);

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "OK", timestamp: new Date() });
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`DeFi Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;
