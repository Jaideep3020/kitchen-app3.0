import { db } from './src/db/index';
import { recipes } from './src/db/schema';
import { eq } from 'drizzle-orm';
async function run() {
  const all1 = await db.select().from(recipes);
  console.log("Recipes count before:", all1.length);
  await db.delete(recipes).where(eq(recipes.menuItemId, 'thu_lh'));
  const all2 = await db.select().from(recipes);
  console.log("Recipes count after:", all2.length);
}
run();
