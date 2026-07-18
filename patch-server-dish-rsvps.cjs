const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const endpoints = `
app.get('/api/dish-rsvps', async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: 'date is required' });
    
    const dayRsvps = await db.select().from(rsvps).where(sql\`\${rsvps.date} = \${date as string} AND \${rsvps.attending} = true\`);
    
    const allStaples = await db.select().from(staples);
    const activeStaples = allStaples.filter(s => s.alwaysIncluded);
    
    const counts = {}; // menuItemId -> count
    
    // To properly count, we just return all dishes counts.
    // For staples, we need to know they are staples, but the frontend can just get the raw counts,
    // or the backend can just return the computed counts.
    // Let's compute counts for ALL menu items on that day.
    const allItems = await db.select().from(menuItems);
    
    for (const dish of allItems) {
      const isStaple = activeStaples.some(s => s.menuItemId === dish.id && s.mealType === dish.mealType);
      if (isStaple) {
        counts[dish.id] = dayRsvps.filter(r => r.mealType === dish.mealType).length;
      } else {
        counts[dish.id] = dayRsvps.filter(r => r.mealType === dish.mealType && (r.choice === dish.id || !r.choice)).length;
      }
    }
    
    res.json(counts);
  } catch (err) {
    res.status(500).json({ error: 'Failed' });
  }
});
`;

content = content.replace('// Recipes', endpoints + '\n// Recipes');
fs.writeFileSync('server.ts', content);
