const http = require('http');

function get(path) {
  return new Promise(resolve => {
    http.get('http://localhost:3000' + path, res => {
      let b = ''; res.on('data', c => b += c);
      res.on('end', () => resolve(JSON.parse(b)));
    });
  });
}

async function run() {
  const reqs = await get(`/api/prep-requirements?date=2026-07-28`);
  console.log("Reqs:", reqs);
  
  const allRsvps = await get('/api/rsvps/all');
  console.log("Sample RSVP:", allRsvps[0]);
  
  const allItems = await get('/api/recipes'); // Need to see dishes
}
run();
