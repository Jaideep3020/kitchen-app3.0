const http = require('http');

function get(path) {
  return new Promise(resolve => {
    http.get('http://localhost:3000' + path, res => {
      let b = ''; res.on('data', c => b += c);
      res.on('end', () => resolve(b));
    });
  });
}

async function run() {
  const reqs = await get('/api/prep-requirements?date=2026-07-28');
  console.log(reqs);
}
run();
