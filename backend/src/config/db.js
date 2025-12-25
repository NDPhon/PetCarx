"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' || (process.env.DATABASE_URL || '').includes('sslmode')
        ? { rejectUnauthorized: false }
        : false,
    keepAlive: true,
    idleTimeoutMillis: 30000,
    max: 10,
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
// Startup table listing removed to prevent connection issues
//# sourceMappingURL=db.js.map