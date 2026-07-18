import { db } from './src/db/index';
import { prepLogs } from './src/db/schema';
import { sql } from 'drizzle-orm';

async function run() {
  try {
    // Pass a fake un-parseable clause
    await db.delete(prepLogs).where({ fake: 'clause', queryChunks: [] } as any);
    console.log("Delete succeeded unexpectedly!");
  } catch (err) {
    console.log("Caught expected error:");
    console.log(err.message);
  }
}

run();
