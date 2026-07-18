const fs = require('fs');
let content = fs.readFileSync('src/db/schema.ts', 'utf8');

content = content.replace(
  "uid: text('uid').notNull().unique(),",
  "uid: text('uid').notNull().unique(),\n  name: text('name'),\n  passwordHash: text('password_hash'),"
);

fs.writeFileSync('src/db/schema.ts', content);
