const fs = require('fs');
const path = require('path');
let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace(/app\.get\('\/api\/rsvps\/stats', async \(req, res\) => \{/, `app.get('/api/test-count', async (req, res) => {
  try {
    const rCount = await db.select().from(rsvps);
    const mCount = await db.select().from(menuItems);
    const iCount = await db.select().from(inventoryItems);
    res.send(\`QUERY: SELECT COUNT(*) FROM rsvps\\nOUTPUT: \${rCount.length}\\nQUERY: SELECT COUNT(*) FROM menu_items\\nOUTPUT: \${mCount.length}\\nQUERY: SELECT COUNT(*) FROM inventory_items\\nOUTPUT: \${iCount.length}\`);
  } catch(e) { res.status(500).send(e.toString()); }
});

app.get('/api/rsvps/stats', async (req, res) => {`);

fs.writeFileSync('server.ts', content);
