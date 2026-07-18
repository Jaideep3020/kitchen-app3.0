const http = require('http');

const data = JSON.stringify({
  date: '2026-07-16',
  mealType: 'lunch',
  menuItemId: 'thu_lh',
  actualQtyCooked: '42',
  loggedBy: 'staff@kitchenops.edu'
});

const req = http.request('http://localhost:3000/api/prep-logs', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
}, (res) => {
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => console.log('POST Response:', body));
});

req.write(data);
req.end();
