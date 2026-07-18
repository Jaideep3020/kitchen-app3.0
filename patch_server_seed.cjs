const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const seedData = `
import { INITIAL_MENU_ITEMS, INITIAL_PREP_ITEMS, INITIAL_ACTIVE_ORDERS, INITIAL_ACTIVITY_LOGS, INITIAL_SUPPLIERS, INITIAL_PAST_ORDERS } from './src/data.ts';
app.post('/api/seed', async (req, res) => {
  try {
    const existing = await db.select().from(inventoryItems);
    if (existing.length === 0) {
      await db.insert(inventoryItems).values(INITIAL_PREP_ITEMS);
      await db.insert(activeOrders).values(INITIAL_ACTIVE_ORDERS.map(o => ({...o, orderId: o.id, id: undefined})));
      await db.insert(activityLogs).values(INITIAL_ACTIVITY_LOGS);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Seed failed', details: err });
  }
});
`;

if(!content.includes('/api/seed')) {
  content = content.replace("app.get('/api/health'", seedData + "\napp.get('/api/health'");
  fs.writeFileSync('server.ts', content, 'utf8');
}
