import { db } from './src/db/index';
import { prepLogs } from './src/db/schema';
async function run() {
  const all = await db.select().from(prepLogs);
  console.log('COUNT:', all.length);
}
run();
