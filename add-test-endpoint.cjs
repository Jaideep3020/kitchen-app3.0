const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const endpoint = `
app.get('/api/test-users', async (req, res) => {
  const all = await db.select().from(users).orderBy(asc(users.role), asc(users.id));
  res.json(all);
});
`;

if (!content.includes('/api/test-users')) {
  // Add import asc if missing
  if (!content.includes('asc')) {
    content = content.replace("import { eq, desc, and } from 'drizzle-orm';", "import { eq, desc, and, asc } from 'drizzle-orm';");
  }
  content = content.replace("app.get('/api/health'", endpoint + "\napp.get('/api/health'");
  fs.writeFileSync('server.ts', content);
}
