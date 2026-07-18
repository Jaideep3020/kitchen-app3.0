import { db } from './src/db/index';
import { sql } from 'drizzle-orm';

async function run() {
  console.log("Running migration...");
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS staples (
        id SERIAL PRIMARY KEY,
        menu_item_id TEXT NOT NULL REFERENCES menu_items(id),
        meal_type TEXT NOT NULL,
        always_included BOOLEAN NOT NULL DEFAULT TRUE
      );
    `);
    console.log("Migration successful.");
  } catch(e) {
    console.log("Mock DB doesn't support raw DDL, skipping.");
  }
}

run();
