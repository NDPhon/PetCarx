const fetch = global.fetch || require('node-fetch');
const urls = [
  { name: 'DEMO APPOINTMENTS', url: 'http://localhost:8000/api/demo/appointments' },
  { name: 'DEMO MEDICAL RECORDS', url: 'http://localhost:8000/api/demo/medical-records' },
  { name: 'DEMO SALES', url: 'http://localhost:8000/api/demo/sales' },
  { name: 'DEMO INVOICES', url: 'http://localhost:8000/api/demo/invoices' },
  { name: 'PRODUCTS', url: 'http://localhost:8000/api/products' }
];

(async () => {
  for (const u of urls) {
    try {
      console.log('\n=== ' + u.name + ' ===');
      const res = await fetch(u.url);
      const body = await res.text();
      try {
        const j = JSON.parse(body);
        console.log(JSON.stringify(j, null, 2));
      } catch (e) {
        console.log(body);
      }
    } catch (err) {
      console.error('Fetch error for', u.url, err.message || err);
    }
  }
})();
