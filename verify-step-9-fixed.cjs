const http = require('http');

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

function get(path) {
  return new Promise(resolve => {
    http.get('http://localhost:3000' + path, res => {
      let b = ''; res.on('data', c => b += c);
      res.on('end', () => resolve(JSON.parse(b)));
    });
  });
}

async function run() {
  console.log("=== STEP 9 ===");
  const testDate = '2026-07-28'; // Tuesday
  
  await request('POST', '/api/staples', { menuItemId: 'mon_lh', mealType: 'lunch', alwaysIncluded: true });
  
  const recipes = await get('/api/recipes');
  const diffRecipe = recipes.find(r => String(r.menuItemId) === 'tue_lh');
  const targetDishId = diffRecipe.menuItemId;
  const targetIngId = diffRecipe.ingredientId;
  const targetQty = diffRecipe.qtyPerServing;
  
  console.log(`Using Dish: ${targetDishId}, Ingredient: ${targetIngId}, qtyPerServing: ${targetQty}`);
  
  console.log("\n--- Creating 5 RSVPs ---");
  for (let i = 0; i < 5; i++) {
    await request('POST', '/api/rsvps', {
      email: `student${i}@example.com`,
      date: testDate,
      mealType: 'lunch',
      attending: true,
      choice: targetDishId
    });
  }
  
  let reqs = await get(`/api/prep-requirements?date=${testDate}`);
  let ingReq = reqs[targetIngId];
  console.log(`Requirement for ${targetIngId}:`, ingReq?.totalQty);
  console.log(`Math: ${targetQty} * 5 = ${Number(targetQty) * 5}`);
  
  console.log("\n--- Adding 3 more RSVPs ---");
  for (let i = 5; i < 8; i++) {
    await request('POST', '/api/rsvps', {
      email: `student${i}@example.com`,
      date: testDate,
      mealType: 'lunch',
      attending: true,
      choice: targetDishId
    });
  }
  
  reqs = await get(`/api/prep-requirements?date=${testDate}`);
  ingReq = reqs[targetIngId];
  console.log(`New Requirement for ${targetIngId}:`, ingReq?.totalQty);
  console.log(`Math: ${targetQty} * 8 = ${Number(targetQty) * 8}`);
  
  console.log("\n--- Checking staple requirement ---");
  const stapleRecipe = recipes.find(r => String(r.menuItemId) === 'mon_lh' && String(r.ingredientId) === 'grain_1');
  const stapleIngId = stapleRecipe.ingredientId;
  const stapleQty = stapleRecipe.qtyPerServing;
  console.log(`Staple: mon_lh, Ingredient: ${stapleIngId}, qtyPerServing: ${stapleQty}`);
  
  const stapleReq = reqs[stapleIngId];
  console.log(`Staple Requirement for ${stapleIngId}:`, stapleReq?.totalQty);
  console.log(`Math (should use all 8 attending RSVPs): ${stapleQty} * 8 = ${Number(stapleQty) * 8}`);
}

run();
