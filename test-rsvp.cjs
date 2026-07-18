const http = require('http');

const data = JSON.stringify({
  email: 'student@kitchenops.edu',
  date: '2026-07-20',
  mealType: 'lunch',
  attending: true,
  choice: 'thu_lh',
  dishId: 'thu_lh'
});

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/rsvps',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, (res) => {
  let d = '';
  res.on('data', chunk => d += chunk);
  res.on('end', () => console.log('RSVP:', d));
});
req.write(data);
req.end();
