const fs = require('fs');
let code = fs.readFileSync('src/db/schema.ts', 'utf8');

code = code.replace(
  "import { integer, pgTable, serial, text, timestamp, boolean, decimal, jsonb, index } from 'drizzle-orm/pg-core';",
  "import { integer, pgTable, serial, text, timestamp, boolean, decimal, jsonb, index, real } from 'drizzle-orm/pg-core';"
);

fs.writeFileSync('src/db/schema.ts', code);
