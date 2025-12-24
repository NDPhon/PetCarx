import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Provide a simple, clear DB pool implementation.
// If FORCE_DEMO=true, export a lightweight mock pool so server can run without a real DB.
if (process.env.FORCE_DEMO === 'true') {
  console.log('⚠️ FORCE_DEMO=true — using mock DB pool (demo mode)');

  class MockPool {
    on() {}
    async connect() {
      return { release() {} };
    }
    async query(_q?: string, _params?: any[]) {
      // return empty results by default
      return { rows: [] } as any;
    }
  }

  const mock: any = new MockPool();
  export default mock as Pool;

  (async function checkTable() {
    console.log('Demo mode: skipping table inspection');
  })();

} else {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' || process.env.DATABASE_URL?.includes('sslmode')
      ? { rejectUnauthorized: false }
      : false,
  });

  pool.on('error', (err) => {
    console.error('PG pool error:', err);
  });

  // Test connection
  pool
    .connect()
    .then((c) => {
      c.release();
      console.log('✅ DB connected successfully');
    })
    .catch((err) => {
      console.error('❌ DB connection failed:', err);
    });

  export default pool;

  async function checkTable() {
    try {
      const res = await pool.query(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public';
      `);
      console.log(res.rows);
    } catch (err) {
      console.error('Error checking tables:', err);
    }
  }

  checkTable();

  process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
  });
  process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
  });
}
