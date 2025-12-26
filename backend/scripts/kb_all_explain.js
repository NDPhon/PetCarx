#!/usr/bin/env node
const { Pool } = require('pg')
const path = require('path')
const fs = require('fs')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.error('DATABASE_URL not set in environment. Abort.')
  process.exit(1)
}

const pool = new Pool({ connectionString, ssl: false })

const tasks = [
  {
    id: 'KB2_medical_history',
    name: 'KB2 - Medical history (medical_record)',
    index: 'ix_medical_record_pet_exam_date',
    indexDDL: 'CREATE INDEX IF NOT EXISTS ix_medical_record_pet_exam_date ON medical_record (pet_id, exam_date);',
    select: `SELECT mr.exam_date as exam_date, mr.diagnosis, mr.notes
FROM medical_record mr
WHERE mr.pet_id = 123
ORDER BY mr.exam_date DESC;`
  },
  {
    id: 'KB3_customer_phone',
    name: 'KB3 - Customer lookup by phone',
    index: 'ix_customer_phone',
    indexDDL: 'CREATE INDEX IF NOT EXISTS ix_customer_phone ON customer (phone);',
    select: `SELECT * FROM customer WHERE phone = '0901234567';`
  },
  {
    id: 'KB4_revenue',
    name: 'KB4 - Revenue by branch (invoice/payment)',
    index: 'ix_invoice_branch_created_at',
    indexDDL: 'CREATE INDEX IF NOT EXISTS ix_invoice_branch_created_at ON invoice (branch_id, created_at);',
    select: `SELECT b.branch_id, b.name AS branch_name, SUM(p.paid_amount) AS total_revenue, COUNT(p.payment_id) AS total_transactions
FROM payment p
JOIN invoice i ON p.invoice_id = i.invoice_id
JOIN branch b ON i.branch_id = b.branch_id
WHERE p.status = 'Completed' AND p.paid_at BETWEEN '2025-01-01' AND '2025-12-31'
GROUP BY b.branch_id, b.name;`
  },
  {
    id: 'KB5_inventory',
    name: 'KB5 - Inventory by branch (inventory/warehouse)',
    index: 'ix_inventory_warehouse_product',
    indexDDL: 'CREATE INDEX IF NOT EXISTS ix_inventory_warehouse_product ON inventory (warehouse_id, product_id);',
    select: `SELECT p.product_id, p.product_name, p.expiry_date, SUM(i.quantity) AS total_quantity
FROM product p
JOIN inventory i ON p.product_id = i.product_id
JOIN warehouse w ON i.warehouse_id = w.warehouse_id
WHERE w.branch_id = 1 AND p.product_type = 'Vaccine'
GROUP BY p.product_id, p.product_name, p.expiry_date;`
  }
]

const outDir = path.join(__dirname)

async function runTask(t) {
  const outFile = path.join(outDir, `${t.id}_explain.txt`)
  if (fs.existsSync(outFile)) fs.unlinkSync(outFile)
  const w = (s) => fs.appendFileSync(outFile, s + '\n')
  w(`Task: ${t.name} - started at ${new Date().toISOString()}`)
  try {
    w('\n-- DROP INDEX IF EXISTS ' + t.index)
    await pool.query(`DROP INDEX IF EXISTS ${t.index};`)
    w('Dropped index (if existed)')

    w('\n-- EXPLAIN ANALYZE (no index)')
    const r1 = await pool.query('EXPLAIN ANALYZE ' + t.select)
    w('EXPLAIN (no index) output:')
    r1.rows.forEach(r => w(r['QUERY PLAN'] || JSON.stringify(r)))

    w(`\n-- CREATE INDEX ${t.index}`)
    await pool.query(t.indexDDL)
    w('Created index (if not exists)')

    w('\n-- EXPLAIN ANALYZE (with index)')
    const r2 = await pool.query('EXPLAIN ANALYZE ' + t.select)
    w('EXPLAIN (with index) output:')
    r2.rows.forEach(r => w(r['QUERY PLAN'] || JSON.stringify(r)))

    w(`Task: ${t.name} - finished at ${new Date().toISOString()}`)
    console.log(`Finished ${t.id}, output -> ${outFile}`)
  } catch (err) {
    console.error(`Error in task ${t.id}:`, err.message || err)
    w('ERROR: ' + (err.message || JSON.stringify(err)))
  }
}

async function runAll() {
  for (const t of tasks) {
    await runTask(t)
  }
  try { await pool.end() } catch (e) {}
  console.log('All KB explains finished.')
}

runAll()
