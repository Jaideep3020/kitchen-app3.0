const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const endpoints = `
app.get('/api/prep-requirements', async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: 'date is required' });
    
    const dayRsvps = await db.select().from(rsvps).where(eq(rsvps.date, date as string));
    
    const dateObj = new Date(date as string);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = days[dateObj.getDay()];
    
    const allStaples = await db.select().from(staples);
    const activeStaples = allStaples.filter(s => s.alwaysIncluded);
    
    const allItems = await db.select().from(menuItems);
    const dayItems = allItems.filter(i => i.dayOfWeek === dayOfWeek);
    
    for (const staple of activeStaples) {
      if (!dayItems.find(i => i.id === staple.menuItemId && i.mealType === staple.mealType)) {
        const sourceItem = allItems.find(i => i.id === staple.menuItemId);
        if (sourceItem) {
          dayItems.push({
            ...sourceItem,
            mealType: staple.mealType
          });
        }
      }
    }
    
    const allRecipes = await db.select().from(recipes);
    const requirements = {}; 
    const debug = { dayOfWeek, rsvpCount: dayRsvps.length, dishRsvpCounts: {} };
    
    for (const dish of dayItems) {
      const dishRecipes = allRecipes.filter(r => String(r.menuItemId) === String(dish.id));
      if (dishRecipes.length === 0) continue;
      
      const isStaple = activeStaples.some(s => s.menuItemId === dish.id && s.mealType === dish.mealType);
      
      let rsvpCount = 0;
      if (isStaple) {
        rsvpCount = dayRsvps.filter(r => r.mealType === dish.mealType).length;
      } else {
        rsvpCount = dayRsvps.filter(r => r.mealType === dish.mealType && (r.choice === dish.id || !r.choice)).length;
      }
      debug.dishRsvpCounts[dish.id] = { isStaple, rsvpCount, mealType: dish.mealType, matchingRsvps: dayRsvps.filter(r => r.mealType === dish.mealType && (r.choice === dish.id || !r.choice)) };
      
      for (const rec of dishRecipes) {
        const requiredQty = Number(rec.qtyPerServing) * rsvpCount;
        if (!requirements[rec.ingredientId]) {
          requirements[rec.ingredientId] = { totalQty: 0, unit: rec.unit };
        }
        requirements[rec.ingredientId].totalQty += requiredQty;
      }
    }
    
    res.json({ requirements, debug });
  } catch (err) {
    res.status(500).json({ error: 'Failed', details: err.message });
  }
});
`;

content = content.replace(/app\.get\('\/api\/prep-requirements', async \(req, res\) => \{[\s\S]*?\}\);/m, endpoints.trim());
fs.writeFileSync('server.ts', content);
