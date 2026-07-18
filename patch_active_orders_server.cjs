const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const oldPost = `app.post('/api/active-orders', async (req, res) => {
  try {
    const { orderId, supplierName, eta, status, routeMap } = req.body;
    const result = await db.insert(activeOrders).values({
      orderId, supplierName, eta, status, routeMap
    }).returning();
    logEvent('DATABASE', \`Created active order ID \${result[0]?.id}\`);
    res.json(result[0]);
  } catch (err) {
    logEvent('ERROR', \`Failed to create active order: \${err}\`);
    res.status(500).json({ error: 'Failed to create active order' });
  }
});`;

const newPost = `app.post('/api/active-orders', async (req, res) => {
  try {
    const { id, supplierName, eta, status, routeMap, supplierId, item, quantity, price, date } = req.body;
    const result = await db.insert(activeOrders).values({
      id, supplierName, eta, status, routeMap, supplierId, item, quantity, price, date
    }).returning();
    logEvent('DATABASE', \`Created active order ID \${result[0]?.id}\`);
    res.json(result[0]);
  } catch (err) {
    logEvent('ERROR', \`Failed to create active order: \${err}\`);
    res.status(500).json({ error: 'Failed to create active order' });
  }
});`;

code = code.replace(oldPost, newPost);

const oldPut = `app.put('/api/active-orders/:id', async (req, res) => {
  try {
    let id: any = req.params.id; if (!isNaN(parseInt(id))) id = parseInt(id);
    const { orderId, supplierName, eta, status, routeMap } = req.body;
    const result = await db.update(activeOrders).set({
      orderId, supplierName, eta, status, routeMap
    }).where(eq(activeOrders.id, id)).returning();
    logEvent('DATABASE', \`Updated active order ID \${id}\`);
    res.json(result[0]);
  } catch (err) {
    logEvent('ERROR', \`Failed to update active order: \${err}\`);
    res.status(500).json({ error: 'Failed to update active order' });
  }
});`;

const newPut = `app.put('/api/active-orders/:id', async (req, res) => {
  try {
    let id: any = req.params.id;
    const { supplierName, eta, status, routeMap, supplierId, item, quantity, price, date } = req.body;
    const result = await db.update(activeOrders).set({
      supplierName, eta, status, routeMap, supplierId, item, quantity, price, date
    }).where(eq(activeOrders.id, id)).returning();
    logEvent('DATABASE', \`Updated active order ID \${id}\`);
    res.json(result[0]);
  } catch (err) {
    logEvent('ERROR', \`Failed to update active order: \${err}\`);
    res.status(500).json({ error: 'Failed to update active order' });
  }
});`;

code = code.replace(oldPut, newPut);

fs.writeFileSync('server.ts', code);
