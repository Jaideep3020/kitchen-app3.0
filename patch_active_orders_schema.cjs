const fs = require('fs');
let code = fs.readFileSync('src/db/schema.ts', 'utf8');

const oldSchema = `export const activeOrders = pgTable('active_orders', {
  id: serial('id').primaryKey(),
  orderId: text('order_id').notNull(),
  supplierName: text('supplier_name').notNull(),
  eta: text('eta').notNull(),
  status: text('status').notNull(), // Draft -> Sent -> Partial Delivery -> Fulfilled -> Reconciled
  routeMap: text('route_map'),
});`;

const newSchema = `export const activeOrders = pgTable('active_orders', {
  id: text('id').primaryKey(),
  supplierName: text('supplier_name').notNull(),
  eta: text('eta').notNull(),
  status: text('status').notNull(),
  routeMap: text('route_map'),
  supplierId: text('supplier_id'),
  item: text('item'),
  quantity: integer('quantity'),
  price: real('price'),
  date: text('date'),
});`;

code = code.replace(oldSchema, newSchema);

// Need to import integer and real if they aren't imported
if (!code.includes('integer')) {
  code = code.replace("import { pgTable, serial, text, boolean, timestamp, decimal, jsonb } from 'drizzle-orm/pg-core';", "import { pgTable, serial, text, boolean, timestamp, decimal, jsonb, integer, real } from 'drizzle-orm/pg-core';");
}

fs.writeFileSync('src/db/schema.ts', code);
