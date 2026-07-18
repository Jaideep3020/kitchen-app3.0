const fs = require('fs');
let content = fs.readFileSync('src/types.ts', 'utf8');
if (!content.includes('receivedQuantity?: number;')) {
  content = content.replace(
    'quantity?: number;',
    'quantity?: number;\n  receivedQuantity?: number;'
  );
  fs.writeFileSync('src/types.ts', content);
}
