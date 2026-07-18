import { db } from './src/db/index';
import { rsvps } from './src/db/schema';
import { sql } from 'drizzle-orm';

async function run() {
  const all = await db.select().from(rsvps);
  console.log('QUERY: SELECT COUNT(*) FROM rsvps');
  console.log('OUTPUT:', all.length);
}
run();
