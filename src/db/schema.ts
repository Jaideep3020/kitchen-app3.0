import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, boolean, decimal, jsonb, index, real } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  role: text('role').notNull().default('student'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const suppliers = pgTable('suppliers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category'),
  email: text('email'),
  phone: text('phone'),
  distance: text('distance'),
  leadTime: text('lead_time'),
  statusText: text('status_text'),
  items: jsonb('items'), 
  attentionNeeded: text('attention_needed'),
  criticalMessage: text('critical_message'),
  correspondence: jsonb('correspondence'),
});

export const inventoryItems = pgTable('inventory_items', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  unit: text('unit').notNull(),
  currentStock: decimal('current_stock').notNull(),
  targetStock: decimal('target_stock').notNull(),
  reorderLevel: decimal('reorder_level').notNull(),
  status: text('status').notNull(),
  supplierId: integer('supplier_id').references(() => suppliers.id),
}, (table) => ({
  categoryIdx: index('inv_category_idx').on(table.category),
  statusIdx: index('inv_status_idx').on(table.status),
  supplierIdx: index('inv_supplier_idx').on(table.supplierId),
}));

export const activeOrders = pgTable('active_orders', {
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
});

export const pastOrders = pgTable('past_orders', {
  id: serial('id').primaryKey(),
  invoiceNo: text('invoice_no').notNull(),
  supplierName: text('supplier_name').notNull(),
  amount: decimal('amount').notNull(),
  date: timestamp('date').defaultNow(),
});

export const activityLogs = pgTable('activity_logs', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  type: text('type').notNull(), // 'waste' | 'delivery' | 'prep' | 'order'
  createdAt: timestamp('created_at').defaultNow(),
});

export const menuItems = pgTable('menu_items', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  mealType: text('meal_type').notNull(),
  category: text('category').notNull(),
  description: text('description').notNull(),
  calories: integer('calories').notNull(),
  image: text('image'),
  inStock: boolean('in_stock').default(true),
  dayOfWeek: text('day_of_week'),
});

export const issues = pgTable('issues', {
  itemName: text('item_name'),
  category: text('category'),
  id: serial('id').primaryKey(),
  type: text('type').notNull(),
  description: text('description').notNull(),
  photoBase64: text('photo_base64'),
  status: text('status').default('Open'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const wasteLogs = pgTable('waste_logs', {
  id: serial('id').primaryKey(),
  shift: text('shift').notNull(),
  wasteType: text('waste_type').notNull(),
  category: text('category').notNull(),
  item: text('item').notNull(),
  weight: decimal('weight').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  createdAtIdx: index('waste_created_at_idx').on(table.createdAt),
  itemIdx: index('waste_item_idx').on(table.item),
}));

export const dashboardConfigs = pgTable('dashboard_configs', {
  id: serial('id').primaryKey(),
  organizationId: text('organization_id').notNull().default('default-org'),
  config: jsonb('config').notNull(),
  updatedBy: text('updated_by').notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
  version: integer('version').notNull().default(1),
});

