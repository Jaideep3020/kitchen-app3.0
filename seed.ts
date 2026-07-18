import { db } from './src/db/index.ts';
import { activeOrders, activityLogs, inventoryItems } from "./src/db/schema.ts";
import { INITIAL_PREP_ITEMS, INITIAL_ACTIVE_ORDERS, INITIAL_ACTIVITY_LOGS } from './src/data.ts';

async function seed() {
  const existing = await db.select().from(inventoryItems);
  if (existing.length === 0 && INITIAL_PREP_ITEMS.length > 0) {
    console.log("Seeding inventory items...");
    await db.insert(inventoryItems).values(INITIAL_PREP_ITEMS.map(i => ({...i, id: undefined, supplierId: undefined, currentStock: String(i.currentStock), targetStock: String(i.targetStock), reorderLevel: String(i.reorderLevel)})));
  }
  
  const existingOrders = await db.select().from(activeOrders);
  if (existingOrders.length === 0 && INITIAL_ACTIVE_ORDERS.length > 0) {
    console.log("Seeding active orders...");
    await db.insert(activeOrders).values(INITIAL_ACTIVE_ORDERS.map(o => ({...o, orderId: o.id, id: undefined})));
  }

  const existingLogs = await db.select().from(activityLogs);
  if (existingLogs.length === 0 && INITIAL_ACTIVITY_LOGS.length > 0) {
    console.log("Seeding activity logs...");
    await db.insert(activityLogs).values(INITIAL_ACTIVITY_LOGS.map(l => ({ title: l.title, description: l.description, type: l.type })));
  }
  
  console.log("Done");
  process.exit(0);
}
seed();
