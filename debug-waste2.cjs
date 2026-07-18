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
  const waste = await get('/api/waste');
  console.log("Total waste logs:", waste.length);
  if (waste.length > 0) console.log(waste[0]);
}
run();
