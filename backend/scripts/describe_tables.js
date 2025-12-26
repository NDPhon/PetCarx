const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function describe(table) {
  const res = await pool.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = $1`, [table]);
  console.log('\n== ' + table + ' ==');
  if (res.rows.length === 0) console.log('No columns found or table does not exist');
  res.rows.forEach(r => console.log(r.column_name, r.data_type));
}

async function run() {
  try {
    await describe('demo_appointments');
    await describe('demo_medical_records');
    await describe('demo_invoices');
    await describe('product');
    await describe('inventory');
  } catch (e) { console.error('Error:', e); }
  finally { await pool.end(); }
}

run();
