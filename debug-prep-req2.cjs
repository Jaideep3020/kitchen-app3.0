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
  const testDate = '2026-07-28'; // Tuesday
  
  // Set staple
  await request('POST', '/api/staples', { menuItemId: 'mon_lh', mealType: 'lunch', alwaysIncluded: true });
  
  // Create 8 test RSVPs
  for (let i = 0; i < 8; i++) {
    await request('POST', '/api/rsvps', {
      email: `student${i}@example.com`,
      date: testDate,
      mealType: 'lunch',
      attending: true,
      choice: 'tue_lh'
    });
  }
  
  const reqs = await get(`/api/prep-requirements?date=${testDate}`);
  console.log(reqs);
  
  const allRsvps = await get('/api/rsvps/all');
  console.log("RSVPs created:", allRsvps.length);
}
run();
