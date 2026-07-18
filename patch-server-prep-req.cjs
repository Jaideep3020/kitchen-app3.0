const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const endpoints = `
app.get('/api/prep-requirements', async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: 'date is required' });
    
    // 1. Get RSVPs for date
    const dayRsvps = await db.select().from(rsvps).where(sql\`\${rsvps.date} = \${date as string} AND \${rsvps.attending} = true\`);
    
    // 2. Get active menu items and staples
    const dateObj = new Date(date as string);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = days[dateObj.getDay()];
    
    const allStaples = await db.select().from(staples);
    const activeStaples = allStaples.filter(s => s.alwaysIncluded);
    
    const allItems = await db.select().from(menuItems);
    const dayItems = allItems.filter(i => i.dayOfWeek === dayOfWeek);
    
    // Include staples in the day's scheduled items
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
    
    // 3. Get all recipes
    const allRecipes = await db.select().from(recipes);
    
    const requirements = {}; // ingredientId -> { totalQty: number, unit: string }
    
    for (const dish of dayItems) {
      const dishRecipes = allRecipes.filter(r => String(r.menuItemId) === String(dish.id));
      if (dishRecipes.length === 0) continue;
      
      const isStaple = activeStaples.some(s => s.menuItemId === dish.id && s.mealType === dish.mealType);
      
      // Calculate how many people get this dish
      let rsvpCount = 0;
      if (isStaple) {
        rsvpCount = dayRsvps.filter(r => r.mealType === dish.mealType).length;
      } else {
        rsvpCount = dayRsvps.filter(r => r.mealType === dish.mealType && (r.choice === dish.id || !r.choice)).length;
      }
      
      for (const rec of dishRecipes) {
        const requiredQty = Number(rec.qtyPerServing) * rsvpCount;
        if (!requirements[rec.ingredientId]) {
          requirements[rec.ingredientId] = { totalQty: 0, unit: rec.unit };
        }
        requirements[rec.ingredientId].totalQty += requiredQty;
      }
    }
    
    res.json(requirements);
  } catch (err) {
    res.status(500).json({ error: 'Failed' });
  }
});
`;

content = content.replace('// Recipes', endpoints + '\n// Recipes');
fs.writeFileSync('server.ts', content);
