"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// db.ts
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});
// Test kết nối
pool
    .connect()
    .then(() => console.log("✅ DB connected successfully"))
    .catch((err) => {
    console.error("❌ DB connection failed:", err);
    process.exit(1);
});
exports.default = pool;
// Hàm check bảng
async function checkTable() {
    try {
        const res = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public';
    `);
        console.log(res.rows);
    }
    catch (err) {
        console.error("Error checking tables:", err);
    }
}
checkTable();
//# sourceMappingURL=db.js.map