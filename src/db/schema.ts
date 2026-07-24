import { relations, sql } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, boolean, decimal, jsonb, index, real, date, unique } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  name: text('name'),
  passwordHash: text('password_hash'),
  email: text('email').notNull(),
  role: text('role').notNull().default('student'),
  staffSubRole: text('staff_sub_role'),
  orgId: text('org_id').notNull(),
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
  orgId: text('org_id').notNull(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  unit: text('unit').notNull(),
  currentStock: decimal('current_stock').notNull(),
  targetStock: decimal('target_stock').notNull(),
  reorderLevel: decimal('reorder_level').notNull(),
  expiryDate: date('expiry_date'),
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
  receivedQuantity: integer('received_quantity'),
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
  orgId: text('org_id').notNull(),
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
  id: serial('id').primaryKey(),
  orgId: text('org_id').notNull(),
  itemName: text('item_name'),
  category: text('category'),
  type: text('type').notNull(),
  description: text('description').notNull(),
  photoBase64: text('photo_base64'),
  status: text('status').default('Open'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const mealSessions = pgTable('meal_sessions', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  orgId: text('org_id').notNull(),
  date: date('date').notNull(),
  mealType: text('meal_type').notNull(), // 'breakfast' | 'lunch' | 'snacks' | 'dinner'
  status: text('status').notNull().default('open'), // 'open' | 'logged' | 'closed'
  plannedMenuItemIds: jsonb('planned_menu_item_ids').notNull(),
  closedAt: timestamp('closed_at'),
  closedBy: text('closed_by'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  orgDateMealTypeUq: unique('meal_sessions_org_date_meal_type_unique').on(table.orgId, table.date, table.mealType),
}));

export const wasteLogs = pgTable('waste_logs', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  orgId: text('org_id').notNull(),
  mealSessionId: text('meal_session_id').references(() => mealSessions.id),
  sourceType: text('source_type').notNull(), // 'plate_waste' | 'cooking_failure' | 'reuse_writeoff'
  menuItemId: text('menu_item_id'),
  weightKg: decimal('weight_kg').notNull(),
  loggedBy: text('logged_by').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  createdAtIdx: index('waste_created_at_idx').on(table.createdAt),
  sourceTypeIdx: index('waste_source_type_idx').on(table.sourceType),
}));

export const menuChangeLogs = pgTable('menu_change_logs', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  orgId: text('org_id').notNull(),
  mealSessionId: text('meal_session_id').references(() => mealSessions.id),
  date: date('date'),
  mealType: text('meal_type'),
  originalMenuItemId: text('original_menu_item_id').notNull(),
  actualMenuItemId: text('actual_menu_item_id'),
  substitutedMenuItemId: text('substituted_menu_item_id'),
  reason: text('reason'),
  changedBy: text('changed_by').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const ingredientYields = pgTable('ingredient_yields', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  orgId: text('org_id').notNull(),
  ingredientId: text('ingredient_id').notNull().references(() => inventoryItems.id),
  rawQty: decimal('raw_qty').notNull(),
  rawUnit: text('raw_unit').notNull(),
  cookedQty: decimal('cooked_qty').notNull(),
  cookedUnit: text('cooked_unit').notNull(),
  notes: text('notes'),
}, (table) => ({
  orgIngredientUq: unique('ingredient_yields_org_ingredient_unique').on(table.orgId, table.ingredientId),
}));

export const reusePool = pgTable('reuse_pool', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  orgId: text('org_id').notNull(),
  sourceMealSessionId: text('source_meal_session_id').notNull().references(() => mealSessions.id),
  menuItemId: text('menu_item_id').notNull(),
  qty: decimal('qty').notNull(),
  unit: text('unit').notNull(),
  status: text('status').notNull().default('available'), // 'available' | 'reused' | 'written_off'
  expiresAt: timestamp('expires_at').notNull(),
  reusedInMealSessionId: text('reused_in_meal_session_id').references(() => mealSessions.id),
  writtenOffReason: text('written_off_reason'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  resolvedAt: timestamp('resolved_at'),
});

export const dashboardConfigs = pgTable('dashboard_configs', {
  id: serial('id').primaryKey(),
  organizationId: text('organization_id').notNull().default('default-org'),
  config: jsonb('config').notNull(),
  updatedBy: text('updated_by').notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
  version: integer('version').notNull().default(1),
});

export const recipes = pgTable('recipes', {
  id: serial('id').primaryKey(),
  orgId: text('org_id').notNull(),
  menuItemId: text('menu_item_id').notNull().references(() => menuItems.id),
  ingredientId: text('ingredient_id').notNull().references(() => inventoryItems.id),
  qtyPerServing: decimal('qty_per_serving').notNull(),
  unit: text('unit').notNull(),
});

export const weeklyMenus = pgTable('weekly_menus', {
  id: serial('id').primaryKey(),
  orgId: text('org_id').notNull(),
  weekStartDate: text('week_start_date').notNull(),
  status: text('status').notNull().default('draft'), // 'draft' | 'published'
});

export const menuSlots = pgTable('menu_slots', {
  id: serial('id').primaryKey(),
  orgId: text('org_id').notNull(),
  weeklyMenuId: integer('weekly_menu_id').notNull().references(() => weeklyMenus.id),
  dayOfWeek: text('day_of_week').notNull(),
  mealType: text('meal_type').notNull(),
  menuItemId: text('menu_item_id').notNull().references(() => menuItems.id),
});

export const rsvps = pgTable('rsvps', {
  id: serial('id').primaryKey(),
  orgId: text('org_id').notNull(),
  mealSessionId: text('meal_session_id').references(() => mealSessions.id),
  studentId: integer('student_id').notNull().references(() => users.id),
  date: text('date').notNull(),
  mealType: text('meal_type').notNull(),
  attending: boolean('attending').notNull().default(false),
  choice: text('choice'),
  submittedAt: timestamp('submitted_at').defaultNow(),
});

export const prepLogs = pgTable('prep_logs', {
  id: serial('id').primaryKey(),
  orgId: text('org_id').notNull(),
  mealSessionId: text('meal_session_id').references(() => mealSessions.id),
  date: date('date').notNull(),
  mealType: text('meal_type').notNull(),
  menuItemId: text('menu_item_id').notNull().references(() => menuItems.id),
  actualQtyCooked: decimal('actual_qty_cooked'),
  rawMaterialsUsed: jsonb('raw_materials_used'),
  cookedOutputQuantity: decimal('cooked_output_quantity'),
  wasteReason: text('waste_reason'),
  wasteQuantity: decimal('waste_quantity'),
  loggedBy: text('logged_by').notNull(),
  loggedAt: timestamp('logged_at').defaultNow()
});

export const prepCookLogs = prepLogs;

export const recipeYields = pgTable('recipe_yields', {
  id: serial('id').primaryKey(),
  menuItemId: text('menu_item_id').notNull().references(() => menuItems.id),
  ingredientId: text('ingredient_id').notNull().references(() => inventoryItems.id),
  yieldRatio: decimal('yield_ratio').notNull(),
});

export const mealHeadcounts = pgTable('meal_headcounts', {
  id: serial('id').primaryKey(),
  orgId: text('org_id').notNull(),
  mealSessionId: text('meal_session_id').references(() => mealSessions.id),
  date: date('date').notNull(),
  mealType: text('meal_type').notNull(),
  servedCount: integer('served_count').notNull(),
  loggedBy: text('logged_by').notNull(),
  loggedAt: timestamp('logged_at').defaultNow()
});

export const staples = pgTable('staples', {
  id: serial('id').primaryKey(),
  menuItemId: text('menu_item_id').notNull().references(() => menuItems.id),
  mealType: text('meal_type').notNull(),
  alwaysIncluded: boolean('always_included').notNull().default(true),
});

export const stockTransactions = pgTable('stock_transactions', {
  id: serial('id').primaryKey(),
  orgId: text('org_id').notNull(),
  ingredientId: text('ingredient_id').notNull(),
  amount: decimal('amount').notNull(),
  reason: text('reason').notNull(),
  relatedPrepLogId: integer('related_prep_log_id').references(() => prepLogs.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const inventoryAdjustments = pgTable('inventory_adjustments', {
  id: serial('id').primaryKey(),
  orgId: text('org_id').notNull(),
  ingredientId: text('ingredient_id').notNull(),
  type: text('type').notNull(), // 'stock_in' | 'correction'
  qty: decimal('qty').notNull(),
  reason: text('reason'),
  vendor: text('vendor'),
  unitCost: decimal('unit_cost'),
  createdBy: text('created_by').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const restockFlags = pgTable('restock_flags', {
  id: serial('id').primaryKey(),
  orgId: text('org_id').notNull(),
  ingredientId: text('ingredient_id').notNull(),
  flaggedBy: text('flagged_by').notNull(),
  flaggedAt: timestamp('flagged_at').defaultNow(),
  resolved: boolean('resolved').notNull().default(false),
  resolvedAt: timestamp('resolved_at'),
  resolvedBy: text('resolved_by'),
  notes: text('notes'),
});


