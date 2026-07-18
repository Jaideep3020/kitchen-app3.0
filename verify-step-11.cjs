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
  console.log("=== STEP 11 ===");
  const insights = await get('/api/recipe-insights');
  console.log("Recipe Insights JSON:");
  console.log(insights);
  
  // Explain the calculation
  console.log("\\nCalculation Details:");
  console.log("- Average Cooked: (50 + 55 + 60) / 3 = 55");
  console.log("- Average Waste: (6.5 + 7.5 + 8.5) / 3 = 7.5");
  console.log("- Expected Reduction %: (7.5 / 55) * 100 = 13.63%");
  console.log("- Rounded: 14%");
}

run();
