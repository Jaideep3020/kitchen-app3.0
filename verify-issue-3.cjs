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
  console.log("=== ISSUE 3 ===");
  
  // Need to seed prep-logs and waste logs.
  
  // Case 1: Below threshold (avg 4.73 kg) -> wed_lh -> 'Rice, Spinach Dal & Bhindi Fry'
  const belowDish = 'Rice, Spinach Dal & Bhindi Fry';
  for (let i = 0; i < 3; i++) {
    await request('POST', '/api/prep-logs', { date: `2026-07-0${i+1}`, mealType: 'lunch', menuItemId: 'wed_lh', actualQtyCooked: 50, loggedBy: 'staff@example.com' });
  }
  const belowWeights = [4.5, 4.8, 4.9];
  for (let i = 0; i < 3; i++) {
    await request('POST', '/api/waste', {
      shift: 'Lunch', wasteType: 'Kitchen Waste', category: 'Over-Production', item: belowDish, weight: belowWeights[i]
    });
  }
  
  // Case 2: Above threshold (avg 5.3 kg) -> thu_lh -> 'Rice, Sambar & Carrot/Beans Poriyal'
  const aboveDish = 'Rice, Sambar & Carrot/Beans Poriyal';
  for (let i = 0; i < 3; i++) {
    await request('POST', '/api/prep-logs', { date: `2026-07-0${i+1}`, mealType: 'lunch', menuItemId: 'thu_lh', actualQtyCooked: 50, loggedBy: 'staff@example.com' });
  }
  const aboveWeights = [5.1, 5.3, 5.5];
  for (let i = 0; i < 3; i++) {
    await request('POST', '/api/waste', {
      shift: 'Lunch', wasteType: 'Kitchen Waste', category: 'Over-Production', item: aboveDish, weight: aboveWeights[i]
    });
  }
  
  const insights = await get('/api/recipe-insights');
  console.log(JSON.stringify(insights, null, 2));
}

run();
