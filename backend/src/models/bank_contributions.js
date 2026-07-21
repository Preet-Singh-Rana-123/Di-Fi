const pool = require("../utils/db");

class Bank_Contributions {
    static async create(bank_id, user_id, amount_contributed) {
        const result = pool.query(
            `INSERT INTO bank_contributions (bank_id,user_id,amount_contributed) VALUES ($1,$2,$3);`,
            [bank_id, user_id, amount_contributed],
        );
        return result.rows[0];
    }

    static async update_amount_contriibuted(bank_id, user_id, amount_added) {
        const result = pool.query(
            `UPDATE bank_contributions SET amount_contributed = amount_contributed + $1 WHERE bank_id = $2 AND user_id = $3;`,
            [amount_added, bank_id, user_id],
        );
        return result.rows[0];
    }

    static async get_amount_contibuted(clientOrPool, bank_id, user_id) {
        const result = clientOrPool.query(
            `SELECT user_id ,amount_contributed FROM bank_contributions WHERE bank_id = $1 AND user_id = $2;`,
            [bank_id, user_id],
        );
        return result;
    }
}

module.exports = Bank_Contributions;
