const fs = require('fs');
let content = fs.readFileSync('seed.ts', 'utf8');

const insertInventory = "await db.insert(inventoryItems).values(INITIAL_PREP_ITEMS);";
const newInsertInventory = "await db.insert(inventoryItems).values(INITIAL_PREP_ITEMS.map(i => ({...i, currentStock: String(i.currentStock), targetStock: String(i.targetStock), reorderLevel: String(i.reorderLevel)})));";

content = content.replace(insertInventory, newInsertInventory);

fs.writeFileSync('seed.ts', content, 'utf8');
