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
      res.on('end', () => resolve(b));
    });
  });
}

async function run() {
  console.log("=== 1. ENFORCE CUTOFF ===");
  await request('PUT', '/api/dashboard-config', {
    organizationId: 'default-org',
    config: { visibleWidgets: ['waste'], cutoffExempted: true },
    version: 1,
    updatedBy: 'admin'
  }, { 'x-user-role': 'admin' });
  console.log("Enforcement ON");
  
  console.log("\\n=== 2. RAW POST PAST CUTOFF (TODAY) ===");
  const postFail = await request('POST', '/api/rsvps', {
    email: 'test@example.com', date: '2026-07-18', mealType: 'lunch', attending: true, choice: 'test choice'
  });
  console.log('Status Code:', postFail.status);
  console.log('Body:', postFail.body);
  
  let allRsvps = await get('/api/rsvps/all');
  console.log('rsvps table count:', JSON.parse(allRsvps).length);
  
  console.log("\\n=== 3. TOGGLE CUTOFF OFF ===");
  await request('PUT', '/api/dashboard-config', {
    organizationId: 'default-org',
    config: { visibleWidgets: ['waste'], cutoffExempted: false },
    version: 2,
    updatedBy: 'admin'
  }, { 'x-user-role': 'admin' });
  console.log("Enforcement OFF");
  
  console.log("\\n=== 4. REPEAT RAW POST ===");
  const postSuccess = await request('POST', '/api/rsvps', {
    email: 'test@example.com', date: '2026-07-18', mealType: 'lunch', attending: true, choice: 'test choice'
  });
  console.log('Status Code:', postSuccess.status);
  console.log('Body:', postSuccess.body);
  
  allRsvps = await get('/api/rsvps/all');
  console.log('rsvps table count:', JSON.parse(allRsvps).length);
}

run();
