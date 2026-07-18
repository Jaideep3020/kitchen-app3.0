import { db } from './src/db/index';
import { sql } from 'drizzle-orm';

async function main() {
  try {
    await db.execute(sql`ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS expiry_date date;`);
    console.log('Migration successful');
  } catch (err) {
    console.error('Migration failed:', err);
  }
}
main();
