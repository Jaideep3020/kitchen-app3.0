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
  console.log("=== CHECK A ===");
  const txs = await get('/api/stock-transactions');
  console.log("SELECT COUNT(*) FROM stock_transactions output:", txs.length);
  
  console.log("\n=== CHECK B ===");
  const allMenus = await get('/api/weekly-menus');
  // Find published week, likely the one we created in the last step
  const pubMenus = allMenus.menus;
  const slots = allMenus.slots;
  
  if (pubMenus.length > 0) {
    const pubMenuId = pubMenus[pubMenus.length - 1].id;
    const pubSlots = slots.filter(s => s.weeklyMenuId === pubMenuId);
    const monLhSlots = pubSlots.filter(s => s.menuItemId === 'mon_lh' && s.mealType === 'lunch');
    
    console.log("Total occurrences of mon_lh (lunch) across the week:", monLhSlots.length);
    console.log("Occurrences by day:");
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    days.forEach(d => {
      console.log(`${d}:`, monLhSlots.filter(s => s.dayOfWeek === d).length);
    });
  } else {
    console.log("No published menus found.");
  }
}
run();
