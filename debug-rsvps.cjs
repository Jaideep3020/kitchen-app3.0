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
  const rsvps = await get('/api/rsvps/all');
  console.log("Total RSVPs:", rsvps.length);
  if (rsvps.length > 0) console.log(rsvps[0]);
}
run();
