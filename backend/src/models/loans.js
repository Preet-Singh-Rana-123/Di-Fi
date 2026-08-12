const pool = require("../utils/db");

class Loans {
    static async create(
        clientOrPool,
        bankId,
        borrowerId,
        principalAmount,
        interestRate,
        termMonths,
        monthlyInstallment,
        totalRepayable,
        purpose = ""
    ) {
        const db = clientOrPool || pool;
        const result = await db.query(
            `INSERT INTO loans (
                bank_id, borrower_id, principal_amount, interest_rate, term_months,
                monthly_installment, total_repayable, remaining_balance, status, purpose
             ) VALUES ($1, $2, $3, $4, $5, $6, $7, $7, 'REQUESTED', $8)
             RETURNING *;`,
            [
                bankId,
                borrowerId,
                principalAmount,
                interestRate,
                termMonths,
                monthlyInstallment,
                totalRepayable,
                purpose
            ]
        );
        return result.rows[0];
    }

    static async findById(clientOrPool, loanId) {
        const db = clientOrPool || pool;
        const result = await db.query(
            `SELECT l.*, bp.bank_name, u.username as borrower_username, u.email as borrower_email
             FROM loans l
             JOIN bank_pools bp ON l.bank_id = bp.id
             JOIN users u ON l.borrower_id = u.id
             WHERE l.id = $1;`,
            [loanId]
        );
        return result.rows[0];
    }

    static async findByIdForUpdate(client, loanId) {
        const result = await client.query(
            `SELECT * FROM loans WHERE id = $1 FOR UPDATE;`,
            [loanId]
        );
        return result.rows[0];
    }

    static async updateStatus(client, loanId, status, disbursedAt = null) {
        const result = await client.query(
            `UPDATE loans
             SET status = $1,
                 disbursed_at = COALESCE($2, disbursed_at)
             WHERE id = $3
             RETURNING *;`,
            [status, disbursedAt, loanId]
        );
        if (result.rows.length === 0) {
            throw new Error(`Loan with ID ${loanId} not found.`);
        }
        return result.rows[0];
    }

    static async reduceRemainingBalance(client, loanId, principalPaid) {
        const result = await client.query(
            `UPDATE loans
             SET remaining_balance = GREATEST(0.00, remaining_balance - $1),
                 status = CASE WHEN remaining_balance - $1 <= 0.01 THEN 'REPAID' ELSE status END
             WHERE id = $2
             RETURNING *;`,
            [principalPaid, loanId]
        );
        if (result.rows.length === 0) {
            throw new Error(`Loan with ID ${loanId} not found.`);
        }
        return result.rows[0];
    }

    static async findByBorrower(clientOrPool, borrowerId) {
        const db = clientOrPool || pool;
        const result = await db.query(
            `SELECT l.*, bp.bank_name, bp.interest_rate as bank_interest_rate
             FROM loans l
             JOIN bank_pools bp ON l.bank_id = bp.id
             WHERE l.borrower_id = $1
             ORDER BY l.created_at DESC;`,
            [borrowerId]
        );
        return result.rows;
    }

    static async findByBank(clientOrPool, bankId) {
        const db = clientOrPool || pool;
        const result = await db.query(
            `SELECT l.*, u.username as borrower_username, u.email as borrower_email
             FROM loans l
             JOIN users u ON l.borrower_id = u.id
             WHERE l.bank_id = $1
             ORDER BY l.created_at DESC;`,
            [bankId]
        );
        return result.rows;
    }
}

module.exports = Loans;
