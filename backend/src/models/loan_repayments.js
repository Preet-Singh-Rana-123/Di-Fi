const pool = require("../utils/db");

class LoanRepayments {
    static async create(
        clientOrPool,
        loanId,
        payerId,
        amountPaid,
        principalPortion,
        interestPortion,
        ownerFee,
        poolYield
    ) {
        const db = clientOrPool || pool;
        const result = await db.query(
            `INSERT INTO loan_repayments (
                loan_id, payer_id, amount_paid, principal_portion, interest_portion, owner_fee, pool_yield
             ) VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *;`,
            [loanId, payerId, amountPaid, principalPortion, interestPortion, ownerFee, poolYield]
        );
        return result.rows[0];
    }

    static async findByLoan(clientOrPool, loanId) {
        const db = clientOrPool || pool;
        const result = await db.query(
            `SELECT lr.*, u.username as payer_username
             FROM loan_repayments lr
             JOIN users u ON lr.payer_id = u.id
             WHERE lr.loan_id = $1
             ORDER BY lr.created_at DESC;`,
            [loanId]
        );
        return result.rows;
    }
}

module.exports = LoanRepayments;
