const fs = require('fs')
const path = require('path')
require('dotenv').config()
const { Pool } = require('pg')

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })

async function run() {
  try {
    const sql = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8')
    await pool.query(sql)
    console.log('Seed executed')
    process.exit(0)
  } catch (err) {
    console.error('Seed failed:', err)
    process.exit(1)
  }
}

run()
run()