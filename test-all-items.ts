import { db } from './src/db/index';
import { menuItems } from './src/db/schema';

async function run() {
  const all = await db.select().from(menuItems);
  all.forEach(m => console.log(m.id, m.name));
}

run();
