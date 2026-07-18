const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const oldImport = "import { INITIAL_MENU_ITEMS, INITIAL_PREP_ITEMS.map(i => ({...i, currentStock: String(i.currentStock), targetStock: String(i.targetStock), reorderLevel: String(i.reorderLevel)})), INITIAL_ACTIVE_ORDERS, INITIAL_ACTIVITY_LOGS.map(l => ({ title: l.title, description: l.description, type: l.type })), INITIAL_SUPPLIERS, INITIAL_PAST_ORDERS } from './src/data.ts';";
const newImport = "import { INITIAL_MENU_ITEMS, INITIAL_PREP_ITEMS, INITIAL_ACTIVE_ORDERS, INITIAL_ACTIVITY_LOGS, INITIAL_SUPPLIERS, INITIAL_PAST_ORDERS } from './src/data.ts';";

content = content.replace(oldImport, newImport);

const insertInventory = "await db.insert(inventoryItems).values(INITIAL_PREP_ITEMS);";
const newInsertInventory = "await db.insert(inventoryItems).values(INITIAL_PREP_ITEMS.map(i => ({...i, currentStock: String(i.currentStock), targetStock: String(i.targetStock), reorderLevel: String(i.reorderLevel)})));";

content = content.replace(insertInventory, newInsertInventory);

const insertLogs = "await db.insert(activityLogs).values(INITIAL_ACTIVITY_LOGS);";
const newInsertLogs = "await db.insert(activityLogs).values(INITIAL_ACTIVITY_LOGS.map(l => ({ title: l.title, description: l.description, type: l.type })));";

content = content.replace(insertLogs, newInsertLogs);

fs.writeFileSync('server.ts', content, 'utf8');
