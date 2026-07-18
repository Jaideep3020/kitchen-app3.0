import { db } from './src/db/index';
import { sql } from 'drizzle-orm';

async function main() {
  try {
    await db.execute(sql`ALTER TABLE active_orders ADD COLUMN IF NOT EXISTS received_quantity integer;`);
    console.log('Migration successful');
  } catch (err) {
    console.error('Migration failed:', err);
  }
}
main();
