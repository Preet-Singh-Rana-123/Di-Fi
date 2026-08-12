const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users = require("../models/users");
const BankPools = require("../models/bank_pools");
const BankContributions = require("../models/bank_contributions");
const Loans = require("../models/loans");

exports.postRegister = async (req, res) => {
    try {
        const { username, email, password, first_name, last_name } = req.body;

        if (!username || !email || !password || !first_name || !last_name) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await Users.findByEmail(null, email);
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await Users.create(null, username, email, first_name, last_name, hashedPassword);

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                wallet_balance: user.wallet_balance
            }
        });
    } catch (err) {
        console.error("Error in postRegister:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.postLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await Users.findByEmail(null, email);
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET_KEY,
            { expiresIn: process.env.JWT_EXPIRE_TIME || "24h" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                wallet_balance: user.wallet_balance
            }
        });
    } catch (err) {
        console.error("Error in postLogin:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getMe = async (req, res) => {
    try {
        const userId = parseInt(req.user.id, 10);
        const user = await Users.findById(null, userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const contributions = await BankContributions.getUserAllContributions(null, userId);
        const loans = await Loans.findByBorrower(null, userId);

        res.status(200).json({
            user,
            contributions,
            loans
        });
    } catch (err) {
        console.error("Error in getMe:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};
