const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users = require("../models/users");

exports.postRegister = async (req, res, next) => {
    try {
        const { username, email, password, first_name, last_name } = req.body;

        const existingUser = await Users.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        Users.create(username, email, first_name, last_name, hashedPassword);

        res.status(201).json({ message: "User registered" });
    } catch (err) {
        console.log("Error while checking auth status", err);
        res.status(500).json({ message: "Internal error occurred" });
    }
};

exports.postLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await Users.findByEmail(email);

        if (!user) {
            return res
                .status(401)
                .json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res
                .status(401)
                .json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user.id.toString(), email },
            process.env.JWT_SECRET_KEY,
            { expiresIn: process.env.JWT_EXPIRE_TIME },
        );

        res.status(200).json({ message: "Login successful", token });
    } catch (err) {
        console.log("Error while checking auth status", err);
        res.status(500).json({ message: "Internal error occurred" });
    }
};
