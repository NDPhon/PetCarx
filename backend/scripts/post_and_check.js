const fetch = global.fetch || require('node-fetch');

const posts = [
  { url: 'http://localhost:8000/api/invoices', body: { invoiceNumber: 'INV-TEST-1', customerName: 'Test User', phone: '090000000', date: '2025-12-23', subtotal: 100000, tax: 10000, total: 110000, notes: 'test insertion' } },
  { url: 'http://localhost:8000/api/sales', body: { customerName: 'Test Buyer', phone: '090000001', productName: 'Test Product', quantity: 1, unitPrice: 50000, total: 50000 } },
  { url: 'http://localhost:8000/api/appointments', body: { petName: 'TestPet2', ownerName: 'Owner Test', phone: '090000002', service: 'vet', date: '2025-12-30', time: '15:00', notes: 'test appointment 2' } },
  { url: 'http://localhost:8000/api/medical-records', body: { petName: 'TestPet2', ownerName: 'Owner Test', symptoms: 'none', diagnosis: 'checkup', treatment: 'none', medications: 'none', notes: 'test record', followUpDate: null } }
];

const checks = [
  { name: 'DEMO INVOICES', url: 'http://localhost:8000/api/demo/invoices' },
  { name: 'DEMO SALES', url: 'http://localhost:8000/api/demo/sales' },
  { name: 'DEMO APPOINTMENTS', url: 'http://localhost:8000/api/demo/appointments' },
  { name: 'DEMO MEDICAL RECORDS', url: 'http://localhost:8000/api/demo/medical-records' },
  { name: 'PRODUCTS', url: 'http://localhost:8000/api/products' }
];

(async () => {
  for (const p of posts) {
    try {
      const res = await fetch(p.url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p.body) });
      const j = await res.json().catch(() => null);
      console.log('POST', p.url, '=>', res.status, j);
    } catch (err) {
      console.error('POST error', p.url, err.message || err);
    }
  }

  for (const c of checks) {
    try {
      console.log('\n=== ' + c.name + ' ===');
      const res = await fetch(c.url);
      const j = await res.json().catch(() => null);
      console.log(JSON.stringify(j, null, 2));
    } catch (err) {
      console.error('Fetch error', c.url, err.message || err);
    }
  }
})();
