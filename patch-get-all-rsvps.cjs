const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const newEndpoint = `
app.get('/api/rsvps/all', async (req, res) => {
  try {
    const list = await db.select().from(rsvps);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed' });
  }
});
`;

content = content.replace('// Suppliers', newEndpoint + '\n// Suppliers');
fs.writeFileSync('server.ts', content, 'utf8');
