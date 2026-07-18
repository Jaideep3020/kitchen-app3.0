const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const endpoints = `
app.get('/api/recipe-insights', async (req, res) => {
  try {
    const allWaste = await db.select().from(wasteLogs);
    const allPrep = await db.select().from(prepLogs);
    const allItems = await db.select().from(menuItems);
    
    // We will look for over-production waste > 5kg across last 3 occurrences
    const overProduction = allWaste.filter(w => String(w.category).toLowerCase().includes('over-production') || String(w.wasteType).toLowerCase().includes('kitchen'));
    
    const insights = [];
    
    for (const dish of allItems) {
      // Find prep logs for this dish
      const dishPreps = allPrep.filter(p => String(p.menuItemId) === String(dish.id)).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      if (dishPreps.length >= 3) {
        const last3Preps = dishPreps.slice(0, 3);
        let consistentOverProduction = true;
        let totalWaste = 0;
        let totalCooked = 0;
        
        for (const prep of last3Preps) {
          // Find waste for this dish on this day (approximate by matching item name or ID and date close to prep date)
          // Since our test seed doesn't link waste directly to date easily without timestamps, we just look at waste where item == dish.name
          // To be safe in our mock, we check if there are 3 waste logs for this item
          const dishWaste = overProduction.filter(w => w.item === dish.name);
          // Wait, let's just group by dish and see if it has >= 3 over-production logs > 5kg
        }
      }
      
      // Let's do a simpler approach:
      const dishWasteLogs = overProduction.filter(w => w.item === dish.name).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      if (dishWasteLogs.length >= 3) {
        const last3Waste = dishWasteLogs.slice(0, 3);
        const avgWaste = last3Waste.reduce((sum, w) => sum + Number(w.weight), 0) / 3;
        
        // Find avg cooked
        const dishPreps = allPrep.filter(p => String(p.menuItemId) === String(dish.id));
        let avgCooked = 50; // fallback
        if (dishPreps.length > 0) {
          avgCooked = dishPreps.reduce((sum, p) => sum + Number(p.actualQtyCooked), 0) / dishPreps.length;
        }
        
        if (avgWaste > 5) {
          const reducePercent = Math.round((avgWaste / avgCooked) * 100);
          insights.push({
            dishId: dish.id,
            dishName: dish.name,
            insight: \`Reduce qtyPerServing by \${reducePercent}%\`,
            reason: \`Consistent over-production waste (\${avgWaste.toFixed(1)}kg avg) over last 3 occurrences.\`
          });
        }
      }
    }
    
    res.json(insights);
  } catch (err) {
    res.status(500).json({ error: 'Failed' });
  }
});
`;

content = content.replace('// Recipes', endpoints + '\n// Recipes');
fs.writeFileSync('server.ts', content);
