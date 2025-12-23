import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
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
    // Do NOT exit process here so backend can run with mock routes during local dev
  });

export default pool;

// Hàm check bảng
async function checkTable() {
  try {
    const res = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public';
    `);
    console.log(res.rows);
  } catch (err) {
    console.error("Error checking tables:", err);
  }
}

checkTable();
