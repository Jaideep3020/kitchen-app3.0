import { db } from './src/db/index';
import { recipes, menuItems, inventoryItems } from './src/db/schema';

async function run() {
  try {
    const rCount = await db.select().from(recipes);
    console.log('QUERY: SELECT COUNT(*) FROM recipes');
    console.log('OUTPUT:', rCount.length);

    const mCount = await db.select().from(menuItems);
    console.log('QUERY: SELECT COUNT(*) FROM menu_items');
    console.log('OUTPUT:', mCount.length);

    const iCount = await db.select().from(inventoryItems);
    console.log('QUERY: SELECT COUNT(*) FROM inventory_items');
    console.log('OUTPUT:', iCount.length);
  } catch (e) {
    console.error(e);
  }
}
run();
