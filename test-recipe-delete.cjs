const http = require('http');

const data = JSON.stringify({
  menuItemId: 'thu_lh',
  ingredients: [
    { ingredientId: 'grain_1', qtyPerServing: 0.15, unit: 'kg' }
  ]
});

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/recipes/batch',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, (res) => {
  let d = '';
  res.on('data', chunk => d += chunk);
  res.on('end', () => console.log('POST:', d));
});
req.write(data);
req.end();
