const http = require('http');

function get(path) {
  return new Promise(resolve => {
    http.get('http://localhost:3000' + path, res => {
      let b = ''; res.on('data', c => b += c);
      res.on('end', () => resolve(JSON.parse(b)));
    });
  });
}

function request(method, path, body, headers = {}) {
  return new Promise(resolve => {
    const data = JSON.stringify(body);
    const req = http.request('http://localhost:3000' + path, {
      method,
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data), ...headers }
    }, res => {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => resolve({ status: res.statusCode, body: b }));
    });
    if (body) req.write(data);
    req.end();
  });
}

async function run() {
  const invBefore = await get('/api/inventory');
  const riceBefore = invBefore.find(i => i.id === 'grain_1' || String(i.id) === 'grain_1');
  console.log("1. Starting inventoryItems.quantity for Sona Masuri / Raw Rice (grain_1):", riceBefore.currentStock);
  
  console.log("\n2. Submitting prep log for 'mon_lh' (Rice, Tomato Dal & Cabbage Poriyal) with actualQtyCooked = 10.");
  await request('POST', '/api/prep-logs', {
    date: '2026-07-20',
    mealType: 'lunch',
    menuItemId: 'mon_lh',
    actualQtyCooked: 10,
    loggedBy: 'staff@example.com'
  });
  
  const invAfter = await get('/api/inventory');
  const riceAfter = invAfter.find(i => i.id === 'grain_1' || String(i.id) === 'grain_1');
  console.log("\n3. New inventoryItems.quantity for Sona Masuri / Raw Rice (grain_1):", riceAfter.currentStock);
  
  const transactions = await get('/api/stock-transactions');
  const riceTrans = transactions.find(t => String(t.ingredientId) === 'grain_1');
  console.log("\n4. stock_transactions row matching this deduction:");
  console.log(riceTrans);
}

run();
