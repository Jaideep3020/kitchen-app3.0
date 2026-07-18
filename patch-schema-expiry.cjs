const fs = require('fs');
let content = fs.readFileSync('src/db/schema.ts', 'utf8');

if (!content.includes("expiryDate: date('expiry_date')")) {
  content = content.replace(
    /reorderLevel: decimal\('reorder_level'\)\.notNull\(\),/,
    "reorderLevel: decimal('reorder_level').notNull(),\n  expiryDate: date('expiry_date'),"
  );
  fs.writeFileSync('src/db/schema.ts', content);
}
