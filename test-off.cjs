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
    req.write(data);
    req.end();
  });
}

async function run() {
  const putRes = await request('PUT', '/api/dashboard-config', {
    organizationId: 'default-org',
    config: { visibleWidgets: ['waste'], cutoffExempted: false },
    version: 2,
    updatedBy: 'admin'
  }, { 'x-user-role': 'admin' });
  console.log('PUT Config:', putRes);
  
  const postRes = await request('POST', '/api/rsvps', {
    email: 'test@example.com',
    date: '2026-07-18',
    mealType: 'lunch',
    attending: true,
    choice: 'test choice'
  });
  console.log('POST Status:', postRes.status, 'Body:', postRes.body);
  
  http.get('http://localhost:3000/api/rsvps?date=2026-07-18&mealType=lunch', res => {
    let body = ''; res.on('data', c => body += c);
    res.on('end', () => console.log('RSVPs:', body));
  });
}

run();
