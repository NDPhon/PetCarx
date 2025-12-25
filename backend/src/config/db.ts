import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' || process.env.DATABASE_URL?.includes('sslmode')
    ? { rejectUnauthorized: false }
    : false,
  keepAlive: true,
  idleTimeoutMillis: 30000,
  max: 10,
});

pool.on('error', (err) => {
  console.error('PG pool error:', err);
});

pool
  .connect()
  .then((c) => {
    c.release();
    console.log('✅ DB connected successfully');
  })
  .catch((err) => {
    console.error('❌ DB connection failed:', err);
  });

// Removed startup check to avoid premature connection termination and noisy logs

export default pool;
