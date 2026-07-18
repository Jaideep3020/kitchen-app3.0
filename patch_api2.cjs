const fs = require('fs');
let code = fs.readFileSync('src/api.ts', 'utf8');

code = code.replace(
  /let id = supplier\.id;\s*if \(typeof id === 'string' && id\.startsWith\('sup_'\)\) \{\s*id = id\.replace\('sup_', ''\);\s*\}/g,
  "const id = supplier.id;"
);

fs.writeFileSync('src/api.ts', code);
