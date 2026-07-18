const fs = require('fs');
let content = fs.readFileSync('src/db/schema.ts', 'utf8');
if (!content.includes("receivedQuantity: integer('received_quantity')")) {
  content = content.replace(
    "quantity: integer('quantity'),",
    "quantity: integer('quantity'),\n  receivedQuantity: integer('received_quantity'),"
  );
  fs.writeFileSync('src/db/schema.ts', content);
}
