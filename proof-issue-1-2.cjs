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
  console.log("\n=== ISSUE 1.3: Independent Test Case ===");
  const recipes = await get('/api/recipes');
  // Just find the first recipe for wed_lh
  const diffRecipe = recipes.find(r => String(r.menuItemId) === 'wed_lh');
  
  const targetDishId = diffRecipe.menuItemId;
  const targetIngId = diffRecipe.ingredientId;
  const targetQty = diffRecipe.qtyPerServing;
  const cookedAmount = 25;
  
  console.log(`Selected independent test: dish ${targetDishId}, ingredient ${targetIngId}`);
  
  const invBefore = await get('/api/inventory');
  const ingBefore = invBefore.find(i => String(i.id) === String(targetIngId));
  console.log(`1. Starting inventoryItems.quantity for ${targetIngId} (${ingBefore.name}):`, ingBefore.currentStock);
  
  console.log(`\n2. Submitting prep log for ${targetDishId} with actualQtyCooked = ${cookedAmount}`);
  const postRes = await request('POST', '/api/prep-logs', {
    date: '2026-07-25', // Use a new date!
    mealType: 'lunch',
    menuItemId: targetDishId,
    actualQtyCooked: cookedAmount,
    loggedBy: 'staff@example.com'
  });
  const prepLogObj = JSON.parse(postRes.body);
  const newPrepLogId = prepLogObj.id;
  
  const invAfter = await get('/api/inventory');
  const ingAfter = invAfter.find(i => String(i.id) === String(targetIngId));
  console.log(`\n3. New inventoryItems.quantity for ${targetIngId} (${ingAfter.name}):`, ingAfter.currentStock);
  
  const transAfter = await get('/api/stock-transactions');
  const testTx = transAfter.find(t => t.relatedPrepLogId === newPrepLogId && String(t.ingredientId) === String(targetIngId));
  console.log("\n4. stock_transactions row matching this deduction:");
  console.log(testTx);
  
  console.log(`\nArithmetic check: qtyPerServing (${targetQty}) * ${cookedAmount} = ${Number(targetQty) * cookedAmount}`);
  console.log(`Amount deducted from stock: ${Number(ingBefore.currentStock) - Number(ingAfter.currentStock)}`);
  console.log(`Recorded transaction amount: ${testTx.amount}`);
}

run();
