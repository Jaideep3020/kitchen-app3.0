import { db } from './src/db/index';
import { prepLogs } from './src/db/schema';
import { sql } from 'drizzle-orm';

async function run() {
  const all = await db.select().from(prepLogs);
  console.log('prep_logs count before:', all.length);

  await db.insert(prepLogs).values({
    date: '2026-07-16',
    mealType: 'lunch',
    menuItemId: 'thu_lh',
    actualQtyCooked: '42.0',
    loggedBy: 'staff@kitchenops.edu'
  });

  const all2 = await db.select().from(prepLogs);
  console.log('prep_logs count after:', all2.length);
  console.dir(all2[all2.length - 1], { depth: null });
}

run();
