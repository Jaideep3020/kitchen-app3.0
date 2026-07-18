const fs = require('fs');
let content = fs.readFileSync('src/types.ts', 'utf8');

content = content.replace(
  /supplierId\?: number;/,
  "supplierId?: number;\n  expiryDate?: string;"
);

fs.writeFileSync('src/types.ts', content);
