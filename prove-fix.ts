import { db } from './src/db/index';
import { recipes } from './src/db/schema';
import { eq } from 'drizzle-orm';

async function run() {
  const beforeDishA = await db.select().from(recipes).where(eq(recipes.menuItemId, 'thu_lh'));
  const beforeDishB = await db.select().from(recipes).where(eq(recipes.menuItemId, 'mon_bf'));
  
  console.log('--- BEFORE ---');
  console.log('Dish A (thu_lh) count:', beforeDishA.length);
  console.log('Dish B (mon_bf) count:', beforeDishB.length);
  
  // Simulate the batch save
  await db.delete(recipes).where(eq(recipes.menuItemId, 'thu_lh'));
  await db.insert(recipes).values({
    menuItemId: 'thu_lh',
    ingredientId: 'grain_1',
    qtyPerServing: '0.15',
    unit: 'kg'
  });

  const afterDishA = await db.select().from(recipes).where(eq(recipes.menuItemId, 'thu_lh'));
  const afterDishB = await db.select().from(recipes).where(eq(recipes.menuItemId, 'mon_bf'));
  
  console.log('\n--- AFTER ---');
  console.log('Dish A (thu_lh) count:', afterDishA.length);
  console.log('Dish B (mon_bf) count:', afterDishB.length);
}
run();
