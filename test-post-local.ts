import { db } from './src/db/index';
import { prepLogs, recipes, inventoryItems, stockTransactions } from './src/db/schema';
import { eq } from 'drizzle-orm';

async function run() {
  const actualQtyCooked = 10;
  const oldQty = 0;
  const deltaQty = actualQtyCooked - oldQty;
  const menuItemId = 'mon_lh';
  
  const allRecipes = await db.select().from(recipes);
  const dishRecipes = allRecipes.filter(r => String(r.menuItemId) === String(menuItemId));
  const allInventory = await db.select().from(inventoryItems);
  
  console.log('deltaQty:', deltaQty);
  console.log('allRecipes length:', allRecipes.length, 'dishRecipes length:', dishRecipes.length);
  
  for (const rec of dishRecipes) {
    const deduction = Number(rec.qtyPerServing) * deltaQty;
    if (deduction !== 0) {
      const invItem = allInventory.find(i => String(i.id) === String(rec.ingredientId));
      if (!invItem) {
        throw new Error(`Ingredient ${rec.ingredientId} not found`);
      }
      const newStock = Number(invItem.currentStock) - deduction;
      console.log('Deducting', deduction, 'from', invItem.name, 'newStock:', newStock);
      
      await db.update(inventoryItems).set({
        currentStock: String(newStock)
      }).where(eq(inventoryItems.id, rec.ingredientId));
      
      await db.insert(stockTransactions).values({
        ingredientId: String(rec.ingredientId),
        amount: String(-deduction),
        reason: 'prep',
        relatedPrepLogId: 1,
        createdAt: new Date()
      });
    }
  }
}
run();
