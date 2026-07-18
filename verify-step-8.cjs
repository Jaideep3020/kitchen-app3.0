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
  const headcounts = await get('/api/meal-headcounts');
  console.log("=== STEP 8 ===");
  console.log("SELECT COUNT(*) FROM meal_headcounts output:", headcounts.length);
  console.log("Row data:", headcounts[0]);
}
run();
