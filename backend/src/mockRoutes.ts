import { Router } from 'express'
import pool from './config/db'

const router = Router()

// Simple mock data for frontend during local testing
router.get('/sales', (req, res) => {
  res.json([
    { id: 1, productName: 'Thức ăn cho chó', quantity: 2, total: 300000 },
    { id: 2, productName: 'Dầu gội', quantity: 1, total: 80000 }
  ])
})

router.post('/sales', (req, res) => {
  // try to insert into a sales/invoice table if exists, otherwise return mock
  (async () => {
    try {
      const { customerName, phone, productName, quantity, unitPrice, total } = req.body
      // try common production table names first
      const tryTables = ['sale', 'sales']
      let inserted = false
      for (const t of tryTables) {
        try {
          await pool.query(
            `INSERT INTO ${t} (customer_name, phone, product_name, quantity, unit_price, total) VALUES ($1,$2,$3,$4,$5,$6)`,
            [customerName, phone, productName, quantity || 1, unitPrice || 0, total || 0]
          )
          inserted = true
          break
        } catch (e) {
          // try next
        }
      }
      if (!inserted) {
        // insert into demo_sales for demo purposes
        await pool.query(
          'INSERT INTO demo_sales (customer_name, phone, product_name, quantity, unit_price, total) VALUES ($1,$2,$3,$4,$5,$6)',
          [customerName, phone, productName, quantity || 1, unitPrice || 0, total || 0]
        )
      }
      return res.status(201).json({ message: 'Sale recorded', body: req.body, insertedInto: inserted ? 'production' : 'demo' })
    } catch (err:any) {
      console.error('Insert sale failed, returning mock:', (err && err.message) || err)
      return res.status(201).json({ message: 'Sale recorded (mock)', body: req.body })
    }
  })()
})

router.get('/stats/revenue', (req, res) => {
  ;(async () => {
    try {
      // Try to compute totals from invoice table
      const totalRes = await pool.query(`SELECT COALESCE(SUM(total),0) as total FROM invoice`)
      const monthlyRes = await pool.query(`SELECT DATE_TRUNC('month', date) as month, COALESCE(SUM(total),0) as revenue FROM invoice GROUP BY 1 ORDER BY 1 DESC LIMIT 6`)
      const dailyRes = await pool.query(`SELECT DATE_TRUNC('day', date) as day, COALESCE(SUM(total),0) as revenue FROM invoice GROUP BY 1 ORDER BY 1 DESC LIMIT 1`)

      const totalRevenue = totalRes.rows[0]?.total ?? 0
      const monthlyData = monthlyRes.rows.map((r: any) => ({ month: new Date(r.month).toLocaleString('default',{month:'short'}), revenue: Number(r.revenue) }))
      const monthlyRevenue = monthlyData.length ? monthlyData[0].revenue : 0
      const dailyRevenue = dailyRes.rows.length ? Number(dailyRes.rows[0].revenue) : 0

      return res.json({
        totalRevenue: Number(totalRevenue),
        monthlyRevenue,
        dailyRevenue,
        topServices: [],
        monthlyData
      })
    } catch (err: any) {
      console.error('Stats query failed, falling back to mock:', (err && err.message) || err)
      return res.json({
        totalRevenue: 5000000,
        monthlyRevenue: 400000,
        dailyRevenue: 20000,
        topServices: [
          { name: 'Khám tổng quát', count: 120, revenue: 1200000 },
          { name: 'Tiêm phòng', count: 90, revenue: 450000 }
        ],
        monthlyData: [
          { month: 'Jan', revenue: 300000 },
          { month: 'Feb', revenue: 250000 },
          { month: 'Mar', revenue: 400000 }
        ]
      })
    }
  })()
})

router.get('/medical-records', (req, res) => {
  res.json([
    { id: 1, petName: 'Mimi', ownerName: 'Nguyễn Văn A', diagnosis: 'Viêm da' }
  ])
})

router.post('/medical-records', (req, res) => {
  (async () => {
    try {
      const { petName, ownerName, symptoms, diagnosis, treatment, medications, notes, followUpDate } = req.body
      // try production tables first
      const tryTables = ['medical_record', 'medical_records', 'medicalrecord']
      let inserted = false
      for (const t of tryTables) {
        try {
          await pool.query(
            `INSERT INTO ${t} (pet_name, owner_name, symptoms, diagnosis, treatment, medications, notes, follow_up_date) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
            [petName, ownerName, symptoms, diagnosis, treatment, medications, notes, followUpDate || null]
          )
          inserted = true
          break
        } catch (e) {
          // continue
        }
      }
      if (!inserted) {
        await pool.query(
          'INSERT INTO demo_medical_records (pet_name, owner_name, symptoms, diagnosis, treatment, medications, notes, follow_up_date) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
          [petName, ownerName, symptoms, diagnosis, treatment, medications, notes, followUpDate || null]
        )
      }
      return res.status(201).json({ message: 'Medical record saved', body: req.body, insertedInto: inserted ? 'production' : 'demo' })
    } catch (err:any) {
      console.error('Insert medical record failed, returning mock:', (err && err.message) || err)
      return res.status(201).json({ message: 'Medical record saved (mock)', body: req.body })
    }
  })()
})

router.post('/invoices', (req, res) => {
  (async () => {
    try {
      const { invoiceNumber, customerName, phone, date, subtotal, tax, total, notes } = req.body || {}
      const tryTables = ['invoice', 'invoices']
      let inserted = false
      for (const t of tryTables) {
        try {
          await pool.query(
            `INSERT INTO ${t} (invoice_number, customer_name, phone, date, subtotal, tax, total, notes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
            [invoiceNumber || `INV-${Date.now()}`, customerName, phone, date || null, subtotal || 0, tax || 0, total || 0, notes || null]
          )
          inserted = true
          break
        } catch (e) {
          // continue
        }
      }
      if (!inserted) {
        await pool.query(
          'INSERT INTO demo_invoices (invoice_number, customer_name, phone, date, subtotal, tax, total, notes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
          [invoiceNumber || `INV-${Date.now()}`, customerName, phone, date || null, subtotal || 0, tax || 0, total || 0, notes || null]
        )
      }
      return res.status(201).json({ message: 'Invoice created', body: req.body, insertedInto: inserted ? 'production' : 'demo' })
    } catch (err:any) {
      console.error('Create invoice failed, returning mock:', (err && err.message) || err)
      return res.status(201).json({ message: 'Invoice created (mock)', body: req.body })
    }
  })()
})

router.get('/search', (req, res) => {
  ;(async () => {
    const { type, query } = req.query
    const q = String(query || '')
    try {
      if (type === 'pets') {
        const r = await pool.query(`SELECT id, name, type, age, owner, phone FROM pet WHERE name ILIKE $1 OR owner ILIKE $1 LIMIT 100`, [`%${q}%`])
        return res.json(r.rows)
      }
      if (type === 'vaccines') {
        // try vaccine table
        try {
          const r = await pool.query(`SELECT id, name, type, price, stock FROM vaccine WHERE name ILIKE $1 LIMIT 100`, [`%${q}%`])
          return res.json(r.rows)
        } catch (e) {
          // fallback to vaccination_package
          const r = await pool.query(`SELECT id, name, price FROM vaccination_package WHERE name ILIKE $1 LIMIT 100`, [`%${q}%`])
          return res.json(r.rows)
        }
      }
      if (type === 'customers') {
        const r = await pool.query(`SELECT id, name, phone, email FROM customer WHERE name ILIKE $1 OR phone ILIKE $1 LIMIT 100`, [`%${q}%`])
        return res.json(r.rows)
      }
    } catch (err: any) {
      console.error('Search failed, fallback to empty:', (err && err.message) || err)
    }
    return res.json([])
  })()
})

router.get('/appointments', (req, res) => {
  ;(async () => {
    try {
      const r = await pool.query('SELECT id, pet_name as "petName", owner_name as "ownerName", phone, service, date, time, notes, created_at FROM demo_appointments ORDER BY created_at DESC LIMIT 200')
      return res.json(r.rows)
    } catch (err:any) {
      console.error('Failed to fetch demo appointments, fallback to sample:', (err && err.message) || err)
      return res.json([{ id: 1, petName: 'Mimi', ownerName: 'Nguyễn Văn A', date: '2025-12-25' }])
    }
  })()
})

router.get('/demo/medical-records', (req, res) => {
  ;(async () => {
    try {
      const r = await pool.query('SELECT id, pet_name as petName, owner_name as ownerName, symptoms, diagnosis, treatment, medications, notes, follow_up_date as followUpDate, created_at FROM demo_medical_records ORDER BY created_at DESC LIMIT 200')
      return res.json(r.rows)
    } catch (err:any) {
      console.error('Failed to fetch demo medical records:', (err && err.message) || err)
      return res.json([])
    }
  })()
})

router.get('/demo/sales', (req, res) => {
  ;(async () => {
    try {
      const r = await pool.query('SELECT id, customer_name as customerName, phone, product_name as productName, quantity, unit_price as unitPrice, total, created_at FROM demo_sales ORDER BY created_at DESC LIMIT 200')
      return res.json(r.rows)
    } catch (err:any) {
      console.error('Failed to fetch demo sales:', (err && err.message) || err)
      return res.json([])
    }
  })()
})

router.get('/demo/invoices', (req, res) => {
  ;(async () => {
    try {
      const r = await pool.query('SELECT id, invoice_number as invoiceNumber, customer_name as customerName, phone, date, subtotal, tax, total, notes, created_at FROM demo_invoices ORDER BY created_at DESC LIMIT 200')
      return res.json(r.rows)
    } catch (err:any) {
      console.error('Failed to fetch demo invoices:', (err && err.message) || err)
      return res.json([])
    }
  })()
})

router.get('/demo/appointments', (req, res) => {
  ;(async () => {
    try {
      const r = await pool.query('SELECT id, pet_name as petName, owner_name as ownerName, phone, service, date, time, notes, created_at FROM demo_appointments ORDER BY created_at DESC LIMIT 200')
      return res.json(r.rows)
    } catch (err:any) {
      console.error('Failed to fetch demo appointments:', (err && err.message) || err)
      return res.json([])
    }
  })()
})

router.post('/appointments', (req, res) => {
  (async () => {
    try {
      const { petName, ownerName, phone, service, date, time, notes } = req.body
      const tryTables = ['appointment', 'appointments']
      let inserted = false
      for (const t of tryTables) {
        try {
          await pool.query(
            `INSERT INTO ${t} (pet_name, owner_name, phone, service, date, time, notes) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
            [petName, ownerName, phone, service, date || null, time || null, notes || null]
          )
          inserted = true
          break
        } catch (e) {
          // continue
        }
      }
      if (!inserted) {
        await pool.query(
          'INSERT INTO demo_appointments (pet_name, owner_name, phone, service, date, time, notes) VALUES ($1,$2,$3,$4,$5,$6,$7)',
          [petName, ownerName, phone, service, date || null, time || null, notes || null]
        )
      }
      return res.status(201).json({ message: 'Appointment created', body: req.body, insertedInto: inserted ? 'production' : 'demo' })
    } catch (err:any) {
      console.error('Create appointment failed, returning mock:', (err && err.message) || err)
      return res.status(201).json({ message: 'Appointment created (mock)', body: req.body })
    }
  })()
})

router.get('/pets', (req, res) => {
  ;(async () => {
    try {
      const r = await pool.query('SELECT id, name, type, age FROM pet LIMIT 200')
      return res.json(r.rows)
    } catch (err: any) {
      console.error('Failed to fetch pets from DB (fallback):', (err && err.message) || err)
      return res.json([{ id: 1, name: 'Mimi', type: 'Mèo', age: 2 }])
    }
  })()
})

router.get('/customers', (req, res) => {
  ;(async () => {
    try {
      const r = await pool.query('SELECT id, name, phone, email FROM customer LIMIT 200')
      return res.json(r.rows)
    } catch (err: any) {
      console.error('Failed to fetch customers from DB (fallback):', (err && err.message) || err)
      return res.json([{ id: 1, name: 'Nguyễn Văn A', phone: '0123-456-789' }])
    }
  })()
})

router.get('/vaccines', (req, res) => {
  ;(async () => {
    try {
      // try vaccine table
      const r = await pool.query('SELECT id, name, price FROM vaccine LIMIT 200')
      if (r.rows && r.rows.length) return res.json(r.rows)
      // fallback to vaccination_package
      const r2 = await pool.query('SELECT id, name, price FROM vaccination_package LIMIT 200')
      return res.json(r2.rows)
    } catch (err: any) {
      console.error('Failed to fetch vaccines from DB (fallback):', (err && err.message) || err)
      return res.json([{ id: 1, name: 'Vaccine dại', price: 100000 }])
    }
  })()
})

// Products endpoint backed by DB (fallback to sample if table missing)
router.get('/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, price, inventory as stock FROM product LIMIT 100')
    if (result && result.rows && result.rows.length > 0) {
      return res.json(result.rows)
    }
  } catch (err: any) {
    // ignore and fallback
    console.error('Error fetching products from DB (fallback to sample):', (err && err.message) || err)
  }

  // fallback sample
  res.json([
    { id: 'food', name: 'Thức ăn cho chó', price: 150000, stock: 50 },
    { id: 'food_cat', name: 'Thức ăn cho mèo', price: 140000, stock: 45 },
    { id: 'toy', name: 'Đồ chơi', price: 50000, stock: 30 }
  ])
})

export default router
