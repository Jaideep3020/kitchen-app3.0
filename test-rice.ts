import { db } from './src/db/index';
import { menuItems } from './src/db/schema';
import { ilike } from 'drizzle-orm';

async function run() {
  const all = await db.select().from(menuItems);
  const rice = all.find(m => m.name.toLowerCase().includes('rice'));
  console.log(rice ? rice : 'No rice found');
}

run();
