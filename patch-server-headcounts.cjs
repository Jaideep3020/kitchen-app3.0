const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const endpoints = `
app.get('/api/meal-headcounts', async (req, res) => {
  try {
    const list = await db.select().from(mealHeadcounts);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed' });
  }
});

app.post('/api/meal-headcounts', async (req, res) => {
  try {
    const { date, mealType, servedCount, loggedBy } = req.body;
    const existing = await db.select().from(mealHeadcounts);
    const matching = existing.filter(e => String(e.date) === String(date) && String(e.mealType) === String(mealType));
    
    let result;
    if (matching.length > 0) {
      result = await db.update(mealHeadcounts).set({
        servedCount: Number(servedCount),
        loggedBy,
        loggedAt: new Date()
      }).where(eq(mealHeadcounts.id, matching[0].id)).returning();
    } else {
      result = await db.insert(mealHeadcounts).values({
        date,
        mealType,
        servedCount: Number(servedCount),
        loggedBy
      }).returning();
    }
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed' });
  }
});
`;

content = content.replace('// Recipes', endpoints + '\n// Recipes');
fs.writeFileSync('server.ts', content);
