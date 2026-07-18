import { db } from './src/db/index';
import { menuSlots } from './src/db/schema';

async function run() {
  const all = await db.select().from(menuSlots);
  const mon_lh_slots = all.filter(s => s.menuItemId === 'mon_lh');
  console.log('Total slots:', all.length);
  console.log('Slots with mon_lh:', mon_lh_slots);
}

run();
