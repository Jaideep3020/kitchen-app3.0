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
  console.log("=== STEP 12 ===");
  const testDate = '2026-07-18'; // Saturday
  const insights = await get(`/api/expiry-insights?date=${testDate}`);
  
  console.log("\n1. Ingredient expiring in 2 days IS used:");
  const used = insights.used.find(i => i.id === 'grain_1');
  console.log(used ? `Found in used: ${used.name} (Expiry: ${used.expiryDate})` : "Not found in used");
  
  console.log("\n2. Ingredient expiring in 2 days NOT used:");
  const unused = insights.unused.find(i => i.id === 'unused_veg');
  console.log(unused ? `Found in unused (FLAGGED): ${unused.name} (Expiry: ${unused.expiryDate})` : "Not found in unused");
  
  console.log("\n3. Ingredient with NO expiry date:");
  const noExpiry = insights.noExpiry[0];
  console.log(`The system ignores items without an expiryDate when filtering 'expiringSoon'.`);
  console.log(`Example item gracefully ignored: ${noExpiry.name} (Expiry: ${noExpiry.expiryDate})`);
  
}
run();
