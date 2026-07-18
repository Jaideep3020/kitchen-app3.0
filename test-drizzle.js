import { pgTable, text } from "drizzle-orm/pg-core";
const t = pgTable('menu_items', { id: text('id') });
console.log(t._?.name || t.tableName || t[Symbol.for('drizzle:Name')] || 'unknown');
