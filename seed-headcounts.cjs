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

async function run() {
  // Tuesday is 2026-07-28. Last 4 Tuesdays:
  // 2026-07-21, 2026-07-14, 2026-07-07, 2026-06-30
  const tuesdays = ['2026-07-21', '2026-07-14', '2026-07-07', '2026-06-30'];
  const counts = [80, 85, 90, 88];
  
  for (let i = 0; i < tuesdays.length; i++) {
    await request('POST', '/api/meal-headcounts', {
      date: tuesdays[i], mealType: 'lunch', servedCount: counts[i], loggedBy: 'staff@example.com'
    });
  }
}
run();
