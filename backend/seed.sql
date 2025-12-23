-- Demo tables for frontend-backend demo
CREATE TABLE IF NOT EXISTS demo_appointments (
  id SERIAL PRIMARY KEY,
  pet_name TEXT,
  owner_name TEXT,
  phone TEXT,
  service TEXT,
  date DATE,
  time TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS demo_medical_records (
  id SERIAL PRIMARY KEY,
  pet_name TEXT,
  owner_name TEXT,
  symptoms TEXT,
  diagnosis TEXT,
  treatment TEXT,
  medications TEXT,
  notes TEXT,
  follow_up_date DATE,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS demo_sales (
  id SERIAL PRIMARY KEY,
  customer_name TEXT,
  phone TEXT,
  product_name TEXT,
  quantity INTEGER,
  unit_price NUMERIC,
  total NUMERIC,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS demo_invoices (
  id SERIAL PRIMARY KEY,
  invoice_number TEXT,
  customer_name TEXT,
  phone TEXT,
  date DATE,
  subtotal NUMERIC,
  tax NUMERIC,
  total NUMERIC,
  notes TEXT,
  created_at TIMESTAMP DEFAULT now()
);
