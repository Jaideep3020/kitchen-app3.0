const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const endpoints = `
// --- STAPLES ---
app.get('/api/staples', async (req, res) => {
  try {
    const list = await db.select().from(staples);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch staples' });
  }
});

app.post('/api/staples', async (req, res) => {
  try {
    const { menuItemId, mealType, alwaysIncluded } = req.body;
    const existing = await db.select().from(staples);
    const matching = existing.filter(e => String(e.menuItemId) === String(menuItemId) && String(e.mealType) === String(mealType));
    
    let result;
    if (matching.length > 0) {
      const id = matching[0].id;
      result = await db.update(staples).set({
        alwaysIncluded
      }).where(eq(staples.id, id)).returning();
    } else {
      result = await db.insert(staples).values({
        menuItemId: String(menuItemId),
        mealType: String(mealType),
        alwaysIncluded
      }).returning();
    }
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save staple' });
  }
});
`;

content = content.replace('// Recipes', endpoints + '\n// Recipes');

const oldPublish = `    // Generate menu slots from the current menuItems table
    const currentDishes = await db.select().from(menuItems);
    const slots = currentDishes
      .filter(d => d.dayOfWeek && d.mealType)
      .map(d => ({
        weeklyMenuId: menuId,
        dayOfWeek: d.dayOfWeek!,
        mealType: d.mealType,
        menuItemId: String(d.id),
      }));

    if (slots.length > 0) {
      await db.insert(menuSlots).values(slots);
    }`;

const newPublish = `    // Generate menu slots from the current menuItems table
    const currentDishes = await db.select().from(menuItems);
    const slots = currentDishes
      .filter(d => d.dayOfWeek && d.mealType)
      .map(d => ({
        weeklyMenuId: menuId,
        dayOfWeek: d.dayOfWeek!,
        mealType: d.mealType,
        menuItemId: String(d.id),
      }));
      
    // Add staples
    const allStaples = await db.select().from(staples);
    const activeStaples = allStaples.filter(s => s.alwaysIncluded);
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    for (const day of days) {
      for (const staple of activeStaples) {
        slots.push({
          weeklyMenuId: menuId,
          dayOfWeek: day,
          mealType: staple.mealType,
          menuItemId: String(staple.menuItemId),
        });
      }
    }

    if (slots.length > 0) {
      await db.insert(menuSlots).values(slots);
    }`;

content = content.replace(oldPublish, newPublish);
fs.writeFileSync('server.ts', content, 'utf8');
