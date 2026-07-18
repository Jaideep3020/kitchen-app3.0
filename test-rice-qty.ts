import { db } from './src/db/index';
import { recipes, inventoryItems } from './src/db/schema';

async function run() {
  const allRecipes = await db.select().from(recipes);
  const riceRecipes = allRecipes.filter(r => r.ingredientId === 'grain_1');
  console.log("Recipes with grain_1 (Rice):", riceRecipes);
  
  const allInv = await db.select().from(inventoryItems);
  const rice = allInv.find(i => String(i.id) === 'grain_1');
  console.log("Rice current stock:", rice ? rice.currentStock : "not found");
}
run();
