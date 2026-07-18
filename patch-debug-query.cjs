const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace(
  '// Recipes',
  `app.get('/api/debug-rsvps-query', async (req, res) => {
    const r = await db.select().from(rsvps).where(eq(rsvps.date, '2026-07-28'));
    res.json(r);
  });\n// Recipes`
);
fs.writeFileSync('server.ts', content);
