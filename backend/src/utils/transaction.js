const pool = require("./db");

/**
 * Executes a database operation within an ACID transaction block.
 * Handles client checkout, BEGIN, COMMIT, ROLLBACK, and client release automatically.
 * 
 * @param {Function} callback Async function receiving (client) to perform queries on
 * @returns {Promise<any>} Result of callback
 */
async function withTransaction(callback) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const result = await callback(client);
        await client.query("COMMIT");
        return result;
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Transaction rolled back due to error:", error.message);
        throw error;
    } finally {
        client.release();
    }
}

module.exports = { withTransaction };
