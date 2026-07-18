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
  const testDate = '2026-07-29'; // Wednesday
  
  await request('POST', '/api/staples', { menuItemId: 'mon_lh', mealType: 'lunch', alwaysIncluded: true });
  
  const recipes = await get('/api/recipes');
  
  // Wed lunch has: wed_lh (Rice, Spinach Dal & Bhindi Fry)
  const diffRecipe = recipes.find(r => String(r.menuItemId) === 'wed_lh');
  const targetDishId = diffRecipe.menuItemId;
  
  console.log(`Setting up test on date: ${testDate}`);
  
  // Let's create 5 students who chose wed_lh
  for (let i = 0; i < 5; i++) {
    await request('POST', '/api/rsvps', {
      email: `student_wed_${i}@example.com`, date: testDate, mealType: 'lunch', attending: true, choice: targetDishId
    });
  }
  
  // And 3 students who chose a DIFFERENT fake choice to show staple handles it
  for (let i = 5; i < 8; i++) {
    await request('POST', '/api/rsvps', {
      email: `student_wed_${i}@example.com`, date: testDate, mealType: 'lunch', attending: true, choice: 'some_other_dish'
    });
  }
  
  let reqs = await get(`/api/prep-requirements?date=${testDate}`);
  
  const stapleRecipe = recipes.find(r => String(r.menuItemId) === 'mon_lh' && String(r.ingredientId) === 'grain_1');
  const stapleIngId = stapleRecipe.ingredientId;
  const stapleQty = stapleRecipe.qtyPerServing; // 0.10
  
  console.log(`\n--- Staple Item: mon_lh (White Rice), Ingredient: ${stapleIngId} ---`);
  console.log(`Staple Qty Per Serving: ${stapleQty}`);
  
  // Requirements for grain_1 on Wednesday
  let grain1Req = reqs['grain_1'];
  
  // Notice that wed_lh uses grain_1 too (0.10). 
  // wed_lh had 5 RSVPs = 0.5kg
  // mon_lh (staple) had 8 RSVPs = 0.8kg
  // Total grain_1 should be 1.3kg. Let's verify.
  console.log(`Total grain_1 Requirement: ${grain1Req?.totalQty}`);
  console.log(`Math:`);
  console.log(` - wed_lh (5 choices) -> 5 * 0.10 = 0.5kg`);
  console.log(` - mon_lh (Staple, 8 total attending) -> 8 * 0.10 = 0.8kg`);
  console.log(` - Total = 1.3kg`);
}

run();
