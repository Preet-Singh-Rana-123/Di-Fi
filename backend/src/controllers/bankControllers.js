const Bank_Pools = require("../models/bank_pools");
const Bank_Contributions = require("../models/bank_contributions");

exports.create_bank_pools = async (req, res, next) => {
    try {
        const {
            bank_name,
            intrest_rate,
            owner_commission_pct,
            total_liquidity,
        } = req.body;

        const user_id = req.user.id;

        await Bank_Pools.create(
            user_id,
            bank_name,
            intrest_rate,
            owner_commission_pct,
            total_liquidity,
        );

        res.status(201).json({ message: "Bank Pool created sucessfully!" });
    } catch (err) {
        console.log("Error while creating bank pool", err);
        res.status(500).json({ message: "Internal error occurred" });
    }
};

exports.create_bank_contributions = async (req, res, next) => {
    try {
        const { bank_id, amount_contributed } = req.body;
        const user_id = req.user.id;

        await Bank_Contributions.create(bank_id, user_id, amount_contributed);

        res.status(201).json({
            message: "Bank Contributions created sucessfully!",
        });
    } catch (err) {
        console.log("Error while creating bank Contributions", err);
        res.status(500).json({ message: "Internal error occurred" });
    }
};
