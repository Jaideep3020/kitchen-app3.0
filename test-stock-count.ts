import { db } from './src/db/index';
import { stockTransactions } from './src/db/schema';

async function run() {
  const all = await db.select().from(stockTransactions);
  console.log('SELECT COUNT(*) FROM stock_transactions output:', all.length);
}
run();
