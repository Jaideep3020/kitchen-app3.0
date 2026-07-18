const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const newEndpoint = `
app.get('/api/stock-transactions', async (req, res) => {
  try {
    const list = await db.select().from(stockTransactions);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed' });
  }
});
`;

content = content.replace('// Recipes', newEndpoint + '\n// Recipes');
fs.writeFileSync('server.ts', content, 'utf8');
