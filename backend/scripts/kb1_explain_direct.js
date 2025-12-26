#!/usr/bin/env node
const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL not set in environment. Abort.');
  process.exit(1);
}

// create pool with ssl disabled to avoid 'server does not support SSL' issues for local PG
const pool = new Pool({ connectionString, ssl: false });

const outPath = path.join(__dirname, 'kb1_explain_output.txt');
const write = (s) => fs.appendFileSync(outPath, s + '\n');

const selectQuery = `SELECT
    a.appointment_id,
    a.appointment_time,
    a.status,
    c.full_name AS customer_name,
    p.pet_name,
    b.name AS branch_name,
    e.full_name AS doctor_name
FROM appointment a
JOIN customer c ON a.customer_id = c.customer_id
JOIN pet p ON a.pet_id = p.pet_id
JOIN branch b ON a.branch_id = b.branch_id
JOIN employee e ON a.employee_id = e.employee_id
WHERE a.branch_id = 1
  AND a.appointment_time::date = '2025-01-10'
  AND a.status = 'Confirmed';`;

async function run() {
  try {
    if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
    write('KB1 EXPLAIN ANALYZE - started at ' + new Date().toISOString());

    write('\n-- DROP INDEX IF EXISTS ix_appointment_branch_time_status;');
    await pool.query('DROP INDEX IF EXISTS ix_appointment_branch_time_status;');
    write('Dropped index (if existed)');

    write('\n-- EXPLAIN ANALYZE (no index)');
    const res1 = await pool.query('EXPLAIN ANALYZE ' + selectQuery);
    write('EXPLAIN (no index) output:');
    res1.rows.forEach(r => write(r['QUERY PLAN'] || JSON.stringify(r)));

    write('\n-- CREATE INDEX ix_appointment_branch_time_status;');
    await pool.query('CREATE INDEX IF NOT EXISTS ix_appointment_branch_time_status ON appointment (branch_id, appointment_time, status);');
    write('Created index');

    write('\n-- EXPLAIN ANALYZE (with index)');
    const res2 = await pool.query('EXPLAIN ANALYZE ' + selectQuery);
    write('EXPLAIN (with index) output:');
    res2.rows.forEach(r => write(r['QUERY PLAN'] || JSON.stringify(r)));

    write('\nKB1 EXPLAIN ANALYZE - finished at ' + new Date().toISOString());
    console.log('KB1 explain finished, output written to', outPath);
  } catch (err) {
    console.error('Error running KB1 explain:', err);
    write('ERROR: ' + err.message);
  } finally {
    try { await pool.end(); } catch (e) {}
  }
}

run();
