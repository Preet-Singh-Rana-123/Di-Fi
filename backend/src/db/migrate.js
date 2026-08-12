const fs = require("fs");
const path = require("path");
const pool = require("../utils/db");

async function runMigration() {
    try {
        console.log("Starting database schema migration...");
        const schemaPath = path.join(__dirname, "schema.sql");
        const sql = fs.readFileSync(schemaPath, "utf8");
        
        await pool.query(sql);
        console.log("Database schema migration completed successfully!");
    } catch (err) {
        console.error("Migration failed:", err);
    } finally {
        await pool.end();
        process.exit(0);
    }
}

runMigration();
