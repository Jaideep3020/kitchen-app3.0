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
  const testDate = '2026-07-28';
  const predictions = await get('/api/demand-prediction');
  const prediction = predictions.find(p => p.date === testDate);
  
  console.log("=== ISSUE 2 ===");
  console.log("Prediction Details for 2026-07-28:");
  console.log(JSON.stringify(prediction, null, 2));
}

run();
