const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const endpoints = `
app.get('/api/expiry-insights', async (req, res) => {
  try {
    const { date } = req.query; // e.g. 2026-07-18
    const currentDateStr = date || new Date().toISOString().split('T')[0];
    const currentDate = new Date(currentDateStr);
    
    // Lookahead window: 7 days
    const windowEnd = new Date(currentDate);
    windowEnd.setDate(currentDate.getDate() + 7);
    
    // Get all inventory items
    const inventory = await db.select().from(inventoryItems);
    const expiringSoon = inventory.filter(item => {
      if (!item.expiryDate) return false;
      const expiry = new Date(item.expiryDate);
      return expiry >= currentDate && expiry <= windowEnd;
    });
    
    // Determine which ingredients are used in the next 7 days
    const allRecipes = await db.select().from(recipes);
    const allItems = await db.select().from(menuItems);
    
    // We get the days in the next 7 days
    const daysWindow = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(currentDate);
      d.setDate(currentDate.getDate() + i);
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      daysWindow.push(days[d.getDay()]);
    }
    
    const upcomingDishes = allItems.filter(i => daysWindow.includes(i.dayOfWeek));
    const upcomingDishIds = upcomingDishes.map(i => i.id);
    const usedIngredients = new Set();
    
    for (const r of allRecipes) {
      if (upcomingDishIds.includes(r.menuItemId)) {
        usedIngredients.add(r.ingredientId);
      }
    }
    
    const insights = {
      used: [],
      unused: [],
      noExpiry: []
    };
    
    for (const item of expiringSoon) {
      if (usedIngredients.has(item.id)) {
        insights.used.push(item);
      } else {
        insights.unused.push(item);
      }
    }
    
    // Find an item with no expiry to test graceful handling
    insights.noExpiry = inventory.filter(i => !i.expiryDate).slice(0, 1);
    
    res.json(insights);
  } catch (err) {
    res.status(500).json({ error: 'Failed', details: err.message });
  }
});
`;

content = content.replace('// Recipes', endpoints + '\n// Recipes');
fs.writeFileSync('server.ts', content);
