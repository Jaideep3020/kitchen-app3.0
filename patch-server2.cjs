const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const importRegex = /import\s+\{([^}]+)\}\s+from\s+['"]\.\/src\/db\/schema['"];/;
const match = content.match(importRegex);
if (match) {
  if (!match[1].includes('prepLogs')) {
    content = content.replace(importRegex, `import { $1, prepLogs } from "./src/db/schema";`);
  }
} else {
  console.log("Could not find schema import");
}

const endpoints = `
// --- PREP LOGS ---
app.get('/api/prep-logs', async (req, res) => {
  try {
    const { date } = req.query;
    let list;
    if (date) {
      list = await db.select().from(prepLogs);
      list = list.filter(l => String(l.date) === String(date));
    } else {
      list = await db.select().from(prepLogs);
    }
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch prep logs' });
  }
});

app.post('/api/prep-logs', async (req, res) => {
  try {
    const { date, mealType, menuItemId, actualQtyCooked, loggedBy } = req.body;
    
    const existing = await db.select().from(prepLogs);
    const matching = existing.filter(e => String(e.menuItemId) === String(menuItemId) && String(e.date) === String(date) && String(e.mealType) === String(mealType));
    
    let result;
    if (matching.length > 0) {
      const id = matching[0].id;
      result = await db.update(prepLogs).set({
        actualQtyCooked: String(actualQtyCooked),
        loggedBy,
        loggedAt: new Date()
      }).where(eq(prepLogs.id, id)).returning();
    } else {
      result = await db.insert(prepLogs).values({
        date,
        mealType,
        menuItemId,
        actualQtyCooked: String(actualQtyCooked),
        loggedBy
      }).returning();
    }
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save prep log' });
  }
});
`;

content = content.replace('// Dev/Prod SPA Serving', endpoints + '\n// Dev/Prod SPA Serving');

fs.writeFileSync('server.ts', content, 'utf8');
