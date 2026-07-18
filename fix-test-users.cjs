const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace(
  "const all = await db.select().from(users).orderBy(asc(users.role), asc(users.id));",
  "const all = await db.select().from(users);"
);

fs.writeFileSync('server.ts', content);
