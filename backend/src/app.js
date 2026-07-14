const express = require("express");
const dotenv = require("dotenv");

const authRouter = require("./routes/authRoutes");
const transactionRouter = require("./routes/transactionRoutes");

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);
app.use("/api/transaction", transactionRouter);

app.listen(3000, () => {
    console.log(`Server is running http://localhost:3000`);
});
