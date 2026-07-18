const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const oldEndpoint = `app.post('/api/prep-logs', async (req, res) => {
  try {
    const { date, mealType, menuItemId, actualQtyCooked, loggedBy } = req.body;
    
    const existing = await db.select().from(prepLogs);
    const matching = existing.filter(e => String(e.menuItemId) === String(menuItemId) && String(e.date) === String(date) && String(e.mealType) === String(mealType));
    
    let result;
    if (matching.length > 0) {
      const id = matching[0].id;
      result = await db.update(prepLogs).set({
        actualQtyCooked: String(actualQtyCooked),
        loggedBy,
        loggedAt: new Date()
      }).where(eq(prepLogs.id, id)).returning();
    } else {
      result = await db.insert(prepLogs).values({
        date,
        mealType,
        menuItemId,
        actualQtyCooked: String(actualQtyCooked),
        loggedBy
      }).returning();
    }
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save prep log' });
  }
});`;

const newEndpoint = `app.post('/api/prep-logs', async (req, res) => {
  try {
    const { date, mealType, menuItemId, actualQtyCooked, loggedBy } = req.body;
    
    const existing = await db.select().from(prepLogs);
    const matching = existing.filter(e => String(e.menuItemId) === String(menuItemId) && String(e.date) === String(date) && String(e.mealType) === String(mealType));
    
    let oldQty = 0;
    let result;
    let prepLogId;
    if (matching.length > 0) {
      const id = matching[0].id;
      oldQty = Number(matching[0].actualQtyCooked);
      result = await db.update(prepLogs).set({
        actualQtyCooked: String(actualQtyCooked),
        loggedBy,
        loggedAt: new Date()
      }).where(eq(prepLogs.id, id)).returning();
      prepLogId = id;
    } else {
      result = await db.insert(prepLogs).values({
        date,
        mealType,
        menuItemId,
        actualQtyCooked: String(actualQtyCooked),
        loggedBy
      }).returning();
      prepLogId = result[0].id;
    }
    
    const deltaQty = Number(actualQtyCooked) - oldQty;
    
    if (deltaQty !== 0) {
      // Deduct stock
      const allRecipes = await db.select().from(recipes);
      const dishRecipes = allRecipes.filter(r => String(r.menuItemId) === String(menuItemId));
      const allInventory = await db.select().from(inventoryItems);
      
      for (const rec of dishRecipes) {
        const deduction = Number(rec.qtyPerServing) * deltaQty;
        if (deduction !== 0) {
          const invItem = allInventory.find(i => String(i.id) === String(rec.ingredientId));
          if (!invItem) {
            throw new Error(\`Ingredient \${rec.ingredientId} not found in inventory for dish \${menuItemId}\`);
          }
          const newStock = Number(invItem.currentStock) - deduction;
          
          // Fail-closed where clause - if the eq() doesn't evaluate cleanly, our patched mock Drizzle will throw.
          await db.update(inventoryItems).set({
            currentStock: String(newStock)
          }).where(eq(inventoryItems.id, rec.ingredientId));
          
          await db.insert(stockTransactions).values({
            ingredientId: String(rec.ingredientId),
            amount: String(-deduction), // negative amount for deduction
            reason: 'prep',
            relatedPrepLogId: prepLogId,
            createdAt: new Date()
          });
        }
      }
    }
    
    // Broadcast inventory update
    events.emit('inventory-updated', { type: 'prep-deduction' });
    
    res.json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save prep log: ' + err.message });
  }
});`;

content = content.replace(oldEndpoint, newEndpoint);
fs.writeFileSync('server.ts', content, 'utf8');
