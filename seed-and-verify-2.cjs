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
  const tuesdays = ['2026-07-21', '2026-07-14', '2026-07-07', '2026-06-30'];
  const counts = [80, 85, 90, 88];
  for (let i = 0; i < tuesdays.length; i++) {
    await request('POST', '/api/meal-headcounts', { date: tuesdays[i], mealType: 'lunch', servedCount: counts[i], loggedBy: 'staff@example.com' });
  }

  const testDate = '2026-07-28';
  for (let i = 0; i < 50; i++) {
    await request('POST', '/api/rsvps', { email: `student${i}@example.com`, date: testDate, mealType: 'lunch', attending: true, choice: 'tue_lh' });
  }

  const predictions = await get('/api/demand-prediction');
  const prediction = predictions.find(p => p.date === testDate);
  
  console.log("=== ISSUE 2 ===");
  console.log(JSON.stringify(prediction, null, 2));
}

run();
