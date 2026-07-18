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
  await request('POST', '/api/prep-logs', { date: '2026-07-28', mealType: 'lunch', menuItemId: 'tue_lh', actualQtyCooked: 50, loggedBy: 'staff@example.com' });
  await request('POST', '/api/prep-logs', { date: '2026-07-21', mealType: 'lunch', menuItemId: 'tue_lh', actualQtyCooked: 55, loggedBy: 'staff@example.com' });
  await request('POST', '/api/prep-logs', { date: '2026-07-14', mealType: 'lunch', menuItemId: 'tue_lh', actualQtyCooked: 60, loggedBy: 'staff@example.com' });
  
  const dishName = 'Lemon Rice & Crispy Potato Fry'; // This matches tue_lh
  
  for (let i = 0; i < 3; i++) {
    await request('POST', '/api/waste', {
      shift: 'Lunch',
      wasteType: 'Kitchen Waste',
      category: 'Over-Production',
      item: dishName,
      weight: 6.5 + i // 6.5, 7.5, 8.5
    });
  }
}
run();
