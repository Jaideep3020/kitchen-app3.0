const fs = require('fs');
let serverContent = fs.readFileSync('server.ts', 'utf8');

const oldServerInsert = "await db.insert(inventoryItems).values(INITIAL_PREP_ITEMS.map(i => ({...i, id: undefined, currentStock: String(i.currentStock), targetStock: String(i.targetStock), reorderLevel: String(i.reorderLevel)})));";
const newServerInsert = "await db.insert(inventoryItems).values(INITIAL_PREP_ITEMS.map(i => ({...i, id: undefined, supplierId: undefined, currentStock: String(i.currentStock), targetStock: String(i.targetStock), reorderLevel: String(i.reorderLevel)})));";
serverContent = serverContent.replace(oldServerInsert, newServerInsert);

fs.writeFileSync('server.ts', serverContent, 'utf8');

let seedContent = fs.readFileSync('seed.ts', 'utf8');
seedContent = seedContent.replace(oldServerInsert, newServerInsert);
fs.writeFileSync('seed.ts', seedContent, 'utf8');
