import { db } from './src/db/index';
import { sql } from 'drizzle-orm';

async function main() {
  try {
    await db.execute(sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS name text;`);
    await db.execute(sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash text;`);
    console.log('Migration successful');
  } catch (err) {
    console.error('Migration failed:', err);
  }
}
main();
