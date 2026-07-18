const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const invEndpoints = `
app.get('/api/inventory', async (req, res) => {
  try {
    const items = await db.select().from(inventoryItems);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});
`;

if(!content.includes('/api/inventory')) {
  content = content.replace("app.get('/api/health'", invEndpoints + "\napp.get('/api/health'");
  fs.writeFileSync('server.ts', content, 'utf8');
}
