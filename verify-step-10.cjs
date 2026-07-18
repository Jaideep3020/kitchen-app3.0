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
  console.log("=== STEP 10 ===");
  // Create 50 test RSVPs for 2026-07-28
  const testDate = '2026-07-28';
  for (let i = 0; i < 50; i++) {
    await request('POST', '/api/rsvps', {
      email: `student${i}@example.com`, date: testDate, mealType: 'lunch', attending: true, choice: 'tue_lh'
    });
  }
  
  const predictions = await get('/api/demand-prediction');
  console.log("JSON Response for 2026-07-28:", predictions.find(p => p.date === testDate));
  
  // Explain the calculation
  console.log("\\nCalculation Details:");
  console.log("- Historical servedCounts (last 4 Tuesdays): 80, 85, 90, 88");
  const avg = (80 + 85 + 90 + 88) / 4;
  console.log(`- Average = ${avg}`);
  console.log("- Upcoming RSVPs = 50");
  console.log("- Blend Formula: (HistoricalAvg * 0.4) + (UpcomingRSVPs * 0.6)");
  console.log(`- Calculation: (${avg} * 0.4) + (50 * 0.6) = ${avg * 0.4} + ${50 * 0.6} = ${(avg * 0.4) + (50 * 0.6)}`);
  console.log(`- Rounded = ${Math.round((avg * 0.4) + (50 * 0.6))}`);
}

run();
