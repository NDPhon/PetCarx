#!/usr/bin/env node
const { Pool } = require('pg')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: false })

async function run() {
  try {
    const res = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name='medical_record' ORDER BY ordinal_position;")
    console.log('Columns for medical_record:')
    console.table(res.rows)
  } catch (err) {
    console.error('Error inspecting columns:', err.message || err)
  } finally {
    try { await pool.end() } catch (e) {}
  }
}

run()
