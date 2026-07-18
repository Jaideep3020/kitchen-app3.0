const fs = require('fs');
let code = fs.readFileSync('src/db/schema.ts', 'utf8');

code = code.replace(
  "criticalMessage: text('critical_message'),",
  "criticalMessage: text('critical_message'),\n  correspondence: jsonb('correspondence'),"
);

fs.writeFileSync('src/db/schema.ts', code);
