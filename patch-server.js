const fs = require('fs');
const content = fs.readFileSync('server.ts', 'utf8');

// Also import prepLogs
const newImport = `import { dashboardConfigs, users, rsvps, prepLogs } from "./src/db/schema";`;
const updatedContent = content.replace(
  /import { dashboardConfigs, users, rsvps } from "\.\/src\/db\/schema";/,
  newImport
);

const endpoints = `
// --- PREP LOGS ---
app.get('/api/prep-logs', async (req, res) => {
  try {
    const { date } = req.query;
    let list;
    if (date) {
      // For mock Drizzle, we might just fetch all and filter to be safe
      list = await db.select().from(prepLogs);
      list = list.filter(l => String(l.date) === String(date));
    } else {
      list = await db.select().from(prepLogs);
    }
    res.json(list);
  } catch (err) {
    logEvent('ERROR', \`Failed to fetch prep logs: \${err}\`);
    res.status(500).json({ error: 'Failed to fetch prep logs' });
  }
});

app.post('/api/prep-logs', async (req, res) => {
  try {
    const { date, mealType, menuItemId, actualQtyCooked, loggedBy } = req.body;
    
    const existing = await db.select().from(prepLogs);
    const matching = existing.filter(e => e.menuItemId === menuItemId && e.date === date && e.mealType === mealType);
    
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
    logEvent('DATABASE', \`Saved prep log for \${menuItemId} on \${date}\`);
    res.json(result[0]);
  } catch (err) {
    logEvent('ERROR', \`Failed to save prep log: \${err}\`);
    res.status(500).json({ error: 'Failed to save prep log' });
  }
});
`;

fs.writeFileSync('server.ts', updatedContent.replace('// Provide simple activity log fetch API', endpoints + '\n// Provide simple activity log fetch API'), 'utf8');
