import { db } from './src/db/index';
import { staples } from './src/db/schema';
import { sql } from 'drizzle-orm';

async function run() {
  const all = await db.select().from(staples);
  console.log('SELECT COUNT(*) FROM staples output:', all.length);
}

run();
