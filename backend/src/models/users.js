const pool = require("../utils/db");

class Users {
    static async create(username, email, first_name, last_name, password_hash) {
        const result = await pool.query(
            `INSERT INTO users (username,email, first_name, last_name, password_hash) VALUES ($1,$2,$3,$4,$5);`,
            [username, email, first_name, last_name, password_hash],
        );
        return result.rows[0];
    }

    static async findById(user_id) {
        const result = await pool.query(`SELECT * FROM users WHERE id=$1`, [
            user_id,
        ]);
        return result.rows[0];
    }

    static async findByEmail(email) {
        const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
            email,
        ]);
        return result.rows[0];
    }
}

module.exports = Users;
