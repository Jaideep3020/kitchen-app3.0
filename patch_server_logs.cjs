const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const logEndpoints = `
app.get('/api/activity-logs', async (req, res) => {
  try {
    const logs = await db.select().from(activityLogs).orderBy(desc(activityLogs.createdAt));
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch activity logs' });
  }
});

app.post('/api/activity-logs', async (req, res) => {
  try {
    const { title, description, type } = req.body;
    const result = await db.insert(activityLogs).values({ title, description, type }).returning();
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create activity log' });
  }
});
`;

content = content.replace("app.get('/api/active-orders', async (req, res) => {", logEndpoints + "\napp.get('/api/active-orders', async (req, res) => {");

fs.writeFileSync('server.ts', content, 'utf8');
