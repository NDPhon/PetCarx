const fs = require('fs')
const path = require('path')

const API = 'http://localhost:8000/api'

async function run() {
  const out = {}
  try {
    const fetch = global.fetch || (await import('node-fetch')).default

    const r1 = await fetch(`${API}/appointments/get-appointments`)
    out.getAppointments = { status: r1.status, body: await safeJson(r1) }

    const createApPayload = { customer_id: null, pet_id: null, branch_id: 1, employee_id: null, appointment_time: '2025-12-24T10:00:00', status: 'Confirmed', channel: 'Online', service_ids: [] }
    const r2 = await fetch(`${API}/appointments/add-appointment`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(createApPayload) })
    out.createAppointment = { status: r2.status, body: await safeJson(r2) }

    const r3 = await fetch(`${API}/appointments/get-appointments`)
    out.getAppointmentsAfter = { status: r3.status, body: await safeJson(r3) }

    const r4 = await fetch(`${API}/medical-records/pet/1`)
    out.medicalHistory = { status: r4.status, body: await safeJson(r4) }

    const r5 = await fetch(`${API}/vaccines`)
    out.vaccines = { status: r5.status, body: await safeJson(r5) }

    const r6 = await fetch(`${API}/products`)
    out.products = { status: r6.status, body: await safeJson(r6) }

    const r7 = await fetch(`${API}/customers`)
    out.customers = { status: r7.status, body: await safeJson(r7) }

    const createCust = await fetch(`${API}/customers`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ name: 'E2E User', phone: '0900000000' }) })
    out.createCustomer = { status: createCust.status, body: await safeJson(createCust) }

    const inv = await fetch(`${API}/demo/appointments`)
    out.demoAppointments = { status: inv.status, body: await safeJson(inv) }

    // Invoice flow
    const invCreate = await fetch(`${API}/invoices/add-invoice`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ brand_id: null, customer_id: null, employee_id: null }) })
    out.createInvoice = { status: invCreate.status, body: await safeJson(invCreate) }
    const invoiceId = out.createInvoice.body && (out.createInvoice.body.data?.invoice_id || out.createInvoice.body.invoice_id || null)
    if (invoiceId) {
      const invDetail = await fetch(`${API}/invoices/add-invoice-details`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ invoice_id: invoiceId, item_type: 'product', product_id: null, service_id: null, quantity: 1 }) })
      out.addInvoiceDetails = { status: invDetail.status, body: await safeJson(invDetail) }
    }

  } catch (err) {
    out.error = String(err.message || err)
  }
  const outPath = path.join(__dirname, 'e2e_results.json')
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2))
  console.log('E2E results written to', outPath)
}

async function safeJson(res) {
  try { return await res.json() } catch (e) { return await res.text().catch(() => null) }
}

run()
