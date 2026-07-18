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
  // Find a recipe for Tuesday lunch
  const recipes = await get('/api/recipes');
  // We published a menu for week 2026-07-27, so Tuesday is 2026-07-28.
  // We need to know which dishes are on Tuesday lunch.
  const diffRecipe = recipes.find(r => String(r.menuItemId) === 'tue_lh');
  const targetDishId = diffRecipe.menuItemId;
  const targetIngId = diffRecipe.ingredientId;
  const targetQty = diffRecipe.qtyPerServing;
  
  console.log(`Using Dish: ${targetDishId}, Ingredient: ${targetIngId}, qtyPerServing: ${targetQty}`);
  
  // Create 5 test RSVPs
  console.log("\\n--- Creating 5 RSVPs ---");
  for (let i = 0; i < 5; i++) {
    await request('POST', '/api/rsvps', {
      email: `student${i}@example.com`,
      date: testDate,
      mealType: 'lunch',
      attending: true,
      choice: targetDishId
    });
  }
  
  // Query computed requirements
  let reqs = await get(`/api/prep-requirements?date=${testDate}`);
  let ingReq = reqs[targetIngId];
  console.log(`Requirement for ${targetIngId}:`, ingReq?.totalQty);
  console.log(`Math: ${targetQty} * 5 = ${Number(targetQty) * 5}`);
  
  // Add 3 more RSVPs
  console.log("\\n--- Adding 3 more RSVPs ---");
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
  
  // Check staple
  console.log("\\n--- Checking staple requirement ---");
  // mon_lh was set as staple
  const stapleRecipe = recipes.find(r => String(r.menuItemId) === 'mon_lh' && String(r.ingredientId) === 'grain_1');
  const stapleIngId = stapleRecipe.ingredientId;
  const stapleQty = stapleRecipe.qtyPerServing;
  console.log(`Staple: mon_lh, Ingredient: ${stapleIngId}, qtyPerServing: ${stapleQty}`);
  
  const stapleReq = reqs[stapleIngId];
  console.log(`Staple Requirement for ${stapleIngId}:`, stapleReq?.totalQty);
  console.log(`Math (should use all 8 attending RSVPs): ${stapleQty} * 8 = ${Number(stapleQty) * 8}`);
}

run();
