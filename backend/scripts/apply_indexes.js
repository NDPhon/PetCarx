#!/usr/bin/env node
const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })

const sqlPath = path.join(__dirname, '..', 'migrations', 'create_indexes.sql')
const sql = fs.readFileSync(sqlPath, 'utf8')
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: false })

async function run() {
  try {
    console.log('Applying indexes from', sqlPath)
    await pool.query(sql)
    console.log('Indexes applied successfully')
  } catch (err) {
    console.error('Failed to apply indexes:', err.message || err)
  } finally {
    try { await pool.end() } catch (e) {}
  }
}

run()
