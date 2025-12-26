const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL not set in env');
  process.exit(1);
}

const pool = new Pool({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function seedDemoAppointments(total = 70000) {
  console.log('Seeding demo_appointments:', total);
  const batch = 1000;
  let inserted = 0;
  while (inserted < total) {
    const toInsert = Math.min(batch, total - inserted);
    const values = [];
    const params = [];
    for (let i = 0; i < toInsert; i++) {
      const idx = inserted + i + 1;
      const pet_name = `SeedPet${idx}`;
      const owner_name = `Owner${idx}`;
      const phone = `090${(1000000 + idx).toString().slice(-7)}`;
      const service = ['vet','grooming','vaccine'][idx % 3];
      const date = new Date(Date.now() + (idx % 365) * 86400000).toISOString().split('T')[0];
      const time = `${(8 + (idx % 10)).toString().padStart(2,'0')}:00`;
      const notes = null;
      params.push(pet_name, owner_name, phone, service, date, time, notes);
      const base = i * 7;
      values.push(`($${base+1},$${base+2},$${base+3},$${base+4},$${base+5},$${base+6},$${base+7})`);
    }
    const q = `INSERT INTO demo_appointments (pet_name, owner_name, phone, service, date, time, notes) VALUES ${values.join(',')}`;
    await pool.query(q, params);
    inserted += toInsert;
    if (inserted % (batch*5) === 0) console.log('Inserted', inserted);
  }
  console.log('Finished seeding demo_appointments');
}

async function seedDemoMedicalRecords(total = 20000) {
  console.log('Seeding demo_medical_records:', total);
  const batch = 1000;
  let inserted = 0;
  while (inserted < total) {
    const toInsert = Math.min(batch, total - inserted);
    const values = [];
    const params = [];
    for (let i = 0; i < toInsert; i++) {
      const idx = inserted + i + 1;
      const pet_name = `SeedPet${(idx % 1000) + 1}`;
      const owner_name = `Owner${(idx % 1000) + 1}`;
      const diagnosis = `Diagnosis ${idx}`;
      const treatment = `Treatment ${idx}`;
      const medications = `Medications ${idx}`;
      const symptoms = `Symptoms ${idx}`;
      const notes = `Notes ${idx}`;
      const created_at = new Date(Date.now() - (idx % 1000) * 86400000).toISOString();
      const follow_up_date = new Date(Date.now() + (idx % 30) * 86400000).toISOString().split('T')[0];
      params.push(pet_name, owner_name, diagnosis, treatment, medications, symptoms, notes, created_at, follow_up_date);
      const base = i * 9;
      values.push(`($${base+1},$${base+2},$${base+3},$${base+4},$${base+5},$${base+6},$${base+7},$${base+8},$${base+9})`);
    }
    const q = `INSERT INTO demo_medical_records (pet_name, owner_name, diagnosis, treatment, medications, symptoms, notes, created_at, follow_up_date) VALUES ${values.join(',')}`;
    await pool.query(q, params);
    inserted += toInsert;
    if (inserted % (batch*5) === 0) console.log('Inserted medical records', inserted);
  }
  console.log('Finished seeding demo_medical_records');
}

async function seedProductsAndInventory() {
  console.log('Ensuring sample products and inventory');
  await pool.query(`INSERT INTO product (product_id, product_name, price, description, product_type, unit, expiry_date, is_active) VALUES (999999, 'Seed Food', 100, 'Seeded product', 'food', 'pcs', NULL, true) ON CONFLICT (product_id) DO NOTHING`);
  await pool.query(`INSERT INTO inventory (product_id, warehouse_id, quantity, update_date) VALUES (999999, 1, 1000, now()) ON CONFLICT (inventory_id) DO NOTHING`);
}

async function seedInvoices(total = 10000) {
  console.log('Seeding demo_invoices:', total);
  const batch = 500;
  let inserted = 0;
  while (inserted < total) {
    const toInsert = Math.min(batch, total - inserted);
    const values = [];
    const params = [];
    for (let i = 0; i < toInsert; i++) {
      const idx = inserted + i + 1;
      const total_amount = 100000 + (idx % 1000) * 100;
      const created_at = new Date(Date.now() - (idx % 365) * 86400000).toISOString();
      const date = created_at.split('T')[0];
      const invoice_number = `INV${Date.now()}${idx}`;
      const subtotal = total_amount - 1000;
      const tax = 1000;
      const customer_name = `Customer ${idx}`;
      const phone = `090${(2000000 + idx).toString().slice(-7)}`;
      const notes = null;
      params.push(invoice_number, date, created_at, subtotal, tax, total_amount, customer_name, phone, notes);
      const base = i * 9;
      values.push(`($${base+1},$${base+2},$${base+3},$${base+4},$${base+5},$${base+6},$${base+7},$${base+8},$${base+9})`);
    }
    const q = `INSERT INTO demo_invoices (invoice_number, date, created_at, subtotal, tax, total, customer_name, phone, notes) VALUES ${values.join(',')}`;
    await pool.query(q, params);
    inserted += toInsert;
    if (inserted % (batch*5) === 0) console.log('Inserted invoices', inserted);
  }
  console.log('Finished seeding demo_invoices');
}

async function run() {
  const arg = process.argv[2];
  const apCount = parseInt(arg || '70000', 10);
  try {
    await seedDemoAppointments(apCount);
    await seedDemoMedicalRecords(Math.floor(apCount/3));
    await seedProductsAndInventory();
    await seedInvoices(Math.floor(apCount/7));
    console.log('Seeding complete');
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

run();
