import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.ts';
import { 
  INITIAL_MENU_ITEMS, 
  INITIAL_PREP_ITEMS, 
  INITIAL_ACTIVE_ORDERS, 
  INITIAL_ACTIVITY_LOGS, 
  INITIAL_SUPPLIERS 
} from '../data.ts';

// In-memory tables for mock fallback
// In-memory tables for mock fallback
const SEED_RECIPES = [
  { menuItemId: 'mon_bf', ingredientId: 'grain_2', qtyPerServing: '0.08', unit: 'kg' },
  { menuItemId: 'mon_bf', ingredientId: 'grain_5', qtyPerServing: '0.05', unit: 'kg' },
  { menuItemId: 'mon_bf', ingredientId: 'veg_9', qtyPerServing: '0.03', unit: 'pcs' },
  { menuItemId: 'mon_bf', ingredientId: 'spice_5', qtyPerServing: '0.01', unit: 'kg' },
  { menuItemId: 'mon_lh', ingredientId: 'grain_1', qtyPerServing: '0.10', unit: 'kg' },
  { menuItemId: 'mon_lh', ingredientId: 'grain_5', qtyPerServing: '0.05', unit: 'kg' },
  { menuItemId: 'mon_lh', ingredientId: 'veg_1', qtyPerServing: '0.04', unit: 'kg' },
  { menuItemId: 'mon_lh', ingredientId: 'veg_3', qtyPerServing: '0.06', unit: 'kg' },
  { menuItemId: 'mon_dn', ingredientId: 'grain_4', qtyPerServing: '0.08', unit: 'kg' },
  { menuItemId: 'mon_dn', ingredientId: 'veg_3', qtyPerServing: '0.06', unit: 'kg' },
  { menuItemId: 'mon_dn', ingredientId: 'grain_1', qtyPerServing: '0.10', unit: 'kg' },
  { menuItemId: 'mon_dn', ingredientId: 'prot_3', qtyPerServing: '0.12', unit: 'L' },
  { menuItemId: 'tue_bf', ingredientId: 'grain_7', qtyPerServing: '0.08', unit: 'kg' },
  { menuItemId: 'tue_bf', ingredientId: 'grain_6', qtyPerServing: '0.03', unit: 'kg' },
  { menuItemId: 'tue_bf', ingredientId: 'veg_10', qtyPerServing: '0.15', unit: 'pcs' },
  { menuItemId: 'tue_lh', ingredientId: 'grain_1', qtyPerServing: '0.10', unit: 'kg' },
  { menuItemId: 'tue_lh', ingredientId: 'grain_5', qtyPerServing: '0.05', unit: 'kg' },
  { menuItemId: 'tue_lh', ingredientId: 'veg_2', qtyPerServing: '0.04', unit: 'kg' },
  { menuItemId: 'tue_lh', ingredientId: 'veg_10', qtyPerServing: '0.15', unit: 'pcs' },
  { menuItemId: 'tue_dn', ingredientId: 'grain_3', qtyPerServing: '0.10', unit: 'kg' },
  { menuItemId: 'tue_dn', ingredientId: 'prot_4', qtyPerServing: '0.15', unit: 'kg' },
  { menuItemId: 'tue_dn', ingredientId: 'prot_3', qtyPerServing: '0.12', unit: 'L' },
  { menuItemId: 'tue_dn', ingredientId: 'veg_1', qtyPerServing: '0.04', unit: 'kg' },
  { menuItemId: 'wed_bf', ingredientId: 'grain_2', qtyPerServing: '0.08', unit: 'kg' },
  { menuItemId: 'wed_bf', ingredientId: 'veg_2', qtyPerServing: '0.04', unit: 'kg' },
  { menuItemId: 'wed_bf', ingredientId: 'veg_1', qtyPerServing: '0.04', unit: 'kg' },
  { menuItemId: 'wed_bf', ingredientId: 'grain_5', qtyPerServing: '0.05', unit: 'kg' },
  { menuItemId: 'wed_lh', ingredientId: 'grain_1', qtyPerServing: '0.10', unit: 'kg' },
  { menuItemId: 'wed_lh', ingredientId: 'veg_6', qtyPerServing: '0.05', unit: 'kg' },
  { menuItemId: 'wed_lh', ingredientId: 'veg_4', qtyPerServing: '0.08', unit: 'kg' },
  { menuItemId: 'wed_lh', ingredientId: 'prot_3', qtyPerServing: '0.12', unit: 'L' },
  { menuItemId: 'wed_dn', ingredientId: 'grain_4', qtyPerServing: '0.08', unit: 'kg' },
  { menuItemId: 'wed_dn', ingredientId: 'prot_1', qtyPerServing: '0.04', unit: 'kg' },
  { menuItemId: 'wed_dn', ingredientId: 'grain_1', qtyPerServing: '0.10', unit: 'kg' },
  { menuItemId: 'wed_dn', ingredientId: 'veg_1', qtyPerServing: '0.04', unit: 'kg' },
  { menuItemId: 'thu_bf', ingredientId: 'grain_1', qtyPerServing: '0.10', unit: 'kg' },
  { menuItemId: 'thu_bf', ingredientId: 'grain_5', qtyPerServing: '0.05', unit: 'kg' },
  { menuItemId: 'thu_bf', ingredientId: 'grain_2', qtyPerServing: '0.08', unit: 'kg' },
  { menuItemId: 'thu_bf', ingredientId: 'veg_9', qtyPerServing: '0.03', unit: 'pcs' },
  { menuItemId: 'thu_lh', ingredientId: 'grain_1', qtyPerServing: '0.10', unit: 'kg' },
  { menuItemId: 'thu_lh', ingredientId: 'grain_5', qtyPerServing: '0.05', unit: 'kg' },
  { menuItemId: 'thu_lh', ingredientId: 'veg_3', qtyPerServing: '0.06', unit: 'kg' },
  { menuItemId: 'thu_lh', ingredientId: 'spice_8', qtyPerServing: '0.02', unit: 'kg' },
  { menuItemId: 'thu_dn', ingredientId: 'grain_1', qtyPerServing: '0.10', unit: 'kg' },
  { menuItemId: 'thu_dn', ingredientId: 'grain_5', qtyPerServing: '0.05', unit: 'kg' },
  { menuItemId: 'thu_dn', ingredientId: 'grain_4', qtyPerServing: '0.08', unit: 'kg' },
  { menuItemId: 'thu_dn', ingredientId: 'prot_3', qtyPerServing: '0.12', unit: 'L' },
  { menuItemId: 'fri_bf', ingredientId: 'grain_7', qtyPerServing: '0.08', unit: 'kg' },
  { menuItemId: 'fri_bf', ingredientId: 'grain_6', qtyPerServing: '0.03', unit: 'kg' },
  { menuItemId: 'fri_bf', ingredientId: 'prot_4', qtyPerServing: '0.15', unit: 'kg' },
  { menuItemId: 'fri_bf', ingredientId: 'veg_7', qtyPerServing: '0.01', unit: 'kg' },
  { menuItemId: 'fri_lh', ingredientId: 'grain_1', qtyPerServing: '0.10', unit: 'kg' },
  { menuItemId: 'fri_lh', ingredientId: 'veg_6', qtyPerServing: '0.05', unit: 'kg' },
  { menuItemId: 'fri_lh', ingredientId: 'veg_4', qtyPerServing: '0.08', unit: 'kg' },
  { menuItemId: 'fri_lh', ingredientId: 'grain_5', qtyPerServing: '0.05', unit: 'kg' },
  { menuItemId: 'fri_dn', ingredientId: 'grain_4', qtyPerServing: '0.08', unit: 'kg' },
  { menuItemId: 'fri_dn', ingredientId: 'prot_2', qtyPerServing: '0.06', unit: 'kg' },
  { menuItemId: 'fri_dn', ingredientId: 'grain_1', qtyPerServing: '0.10', unit: 'kg' },
  { menuItemId: 'fri_dn', ingredientId: 'prot_3', qtyPerServing: '0.12', unit: 'L' },
  { menuItemId: 'sat_bf', ingredientId: 'grain_4', qtyPerServing: '0.08', unit: 'kg' },
  { menuItemId: 'sat_bf', ingredientId: 'veg_2', qtyPerServing: '0.04', unit: 'kg' },
  { menuItemId: 'sat_bf', ingredientId: 'veg_1', qtyPerServing: '0.04', unit: 'kg' },
  { menuItemId: 'sat_bf', ingredientId: 'spice_1', qtyPerServing: '0.015', unit: 'L' },
  { menuItemId: 'sat_lh', ingredientId: 'grain_1', qtyPerServing: '0.10', unit: 'kg' },
  { menuItemId: 'sat_lh', ingredientId: 'spice_6', qtyPerServing: '0.02', unit: 'kg' },
  { menuItemId: 'sat_lh', ingredientId: 'grain_5', qtyPerServing: '0.05', unit: 'kg' },
  { menuItemId: 'sat_lh', ingredientId: 'veg_3', qtyPerServing: '0.06', unit: 'kg' },
  { menuItemId: 'sat_dn', ingredientId: 'grain_3', qtyPerServing: '0.10', unit: 'kg' },
  { menuItemId: 'sat_dn', ingredientId: 'veg_3', qtyPerServing: '0.06', unit: 'kg' },
  { menuItemId: 'sat_dn', ingredientId: 'veg_5', qtyPerServing: '0.08', unit: 'kg' },
  { menuItemId: 'sat_dn', ingredientId: 'spice_9', qtyPerServing: '0.01', unit: 'L' },
  { menuItemId: 'sun_bf', ingredientId: 'grain_8', qtyPerServing: '0.08', unit: 'kg' },
  { menuItemId: 'sun_bf', ingredientId: 'prot_3', qtyPerServing: '0.12', unit: 'L' },
  { menuItemId: 'sun_bf', ingredientId: 'veg_8', qtyPerServing: '0.015', unit: 'kg' },
  { menuItemId: 'sun_bf', ingredientId: 'spice_6', qtyPerServing: '0.02', unit: 'kg' },
  { menuItemId: 'sun_lh', ingredientId: 'grain_3', qtyPerServing: '0.10', unit: 'kg' },
  { menuItemId: 'sun_lh', ingredientId: 'prot_4', qtyPerServing: '0.15', unit: 'kg' },
  { menuItemId: 'sun_lh', ingredientId: 'veg_1', qtyPerServing: '0.04', unit: 'kg' },
  { menuItemId: 'sun_lh', ingredientId: 'spice_10', qtyPerServing: '0.04', unit: 'kg' },
  { menuItemId: 'sun_dn', ingredientId: 'grain_2', qtyPerServing: '0.08', unit: 'kg' },
  { menuItemId: 'sun_dn', ingredientId: 'grain_5', qtyPerServing: '0.05', unit: 'kg' },
  { menuItemId: 'sun_dn', ingredientId: 'veg_9', qtyPerServing: '0.03', unit: 'pcs' },
  { menuItemId: 'sun_dn', ingredientId: 'spice_5', qtyPerServing: '0.01', unit: 'kg' }
].map((r, i) => ({ id: i + 1, ...r }));

const mockStorage: Record<string, any[]> = {
  inventory_items: [...INITIAL_PREP_ITEMS],
  active_orders: [...INITIAL_ACTIVE_ORDERS],
  activity_logs: [...INITIAL_ACTIVITY_LOGS],
  suppliers: [...INITIAL_SUPPLIERS],
  menu_items: [...INITIAL_MENU_ITEMS],
  recipes: [...SEED_RECIPES],
  issues: [],
  waste_logs: [],
  past_orders: [],
  prep_logs: [],
  dashboard_configs: [
    {
      id: 1,
      organizationId: 'default-org',
      config: {
        visibleWidgets: ['waste', 'inventory', 'delivery'],
        dateRange: 'today',
        kpiLayout: 'bento',
        showTrends: true
      },
      updatedBy: 'system@kitchenops.edu',
      updatedAt: new Date(),
      version: 1
    }
  ]
};

const getTableName = (table: any): string => {
  if (!table) return '';
  if (typeof table === 'string') return table;
  return table._?.name || table.tableName || table[Symbol.for('drizzle:Name')] || '';
};

function createMockDrizzle() {
  const queryBuilder = (type: string, tableObj: any = null) => {
    const tableName = getTableName(tableObj);
    let data: any = null;
    let filterCol: string | null = null;
    let filterVal: any = null;
    
    const builder: any = {
      from: (targetTable: any) => {
        return queryBuilder(type, targetTable);
      },
      where: (clause: any) => {
        if (clause) {
          if (clause.left && clause.left.name) {
            filterCol = clause.left.name;
            filterVal = clause.right !== undefined ? clause.right : clause.value;
          } else if (clause.queryChunks && clause.queryChunks.length >= 4) {
            // Hack for mock Drizzle
            const col = clause.queryChunks[1]; // Index 1 is the column PgText
            const valChunk = clause.queryChunks[3]; // Index 3 is the Param
            if (col && col.name) {
              filterCol = col.name === 'menu_item_id' ? 'menuItemId' : col.name === 'ingredient_id' ? 'ingredientId' : col.name;
            }
            if (valChunk && valChunk.value !== undefined) {
              filterVal = valChunk.value;
            } else if (valChunk && valChunk.sql && valChunk.sql.queryChunks) {
              filterVal = valChunk.sql.queryChunks[0].value[0];
            }
          } else if (clause.value !== undefined) {
            // Some other fallback
            filterVal = clause.value;
          }
          
          if (!filterCol || filterVal === undefined) {
            throw new Error("Fail-Closed Guard: Could not resolve column name or value from where clause: " + JSON.stringify(clause));
          }
        }
        return builder;
      },
      orderBy: () => builder,
      limit: () => builder,
      offset: () => builder,
      set: (values: any) => {
        data = values;
        return builder;
      },
      values: (values: any) => {
        data = values;
        return builder;
      },
      returning: () => builder,
      
      // Thenable interface so it can be awaited
      then: (resolve: any) => {
        if (!mockStorage[tableName]) {
          mockStorage[tableName] = [];
        }
        const list = mockStorage[tableName];
        
        if (type === 'select') {
          if (filterCol && filterVal !== undefined) {
            const filtered = list.filter(item => String(item[filterCol!]) === String(filterVal));
            resolve(filtered);
          } else {
            resolve(list);
          }
        } else if (type === 'insert') {
          const rowsToInsert = Array.isArray(data) ? data : [data];
          const insertedRows = rowsToInsert.map((item, idx) => {
            const newRow = { 
              id: item.id !== undefined ? item.id : (list.length + idx + 1),
              createdAt: new Date(),
              ...item 
            };
            list.push(newRow);
            return newRow;
          });
          resolve(Array.isArray(data) ? insertedRows : [insertedRows[0]]);
        } else if (type === 'update') {
          const updatedRows: any[] = [];
          list.forEach(item => {
            let matches = true;
            if (filterCol && filterVal !== undefined) {
              matches = String(item[filterCol]) === String(filterVal);
            }
            if (matches) {
              Object.assign(item, data);
              updatedRows.push(item);
            }
          });
          resolve(updatedRows);
        } else if (type === 'delete') {
          const remaining: any[] = [];
          const deleted: any[] = [];
          list.forEach(item => {
            let matches = true;
            if (filterCol && filterVal !== undefined) {
              matches = String(item[filterCol]) === String(filterVal);
            }
            if (matches) {
              deleted.push(item);
            } else {
              remaining.push(item);
            }
          });
          mockStorage[tableName] = remaining;
          resolve(deleted);
        } else {
          resolve([]);
        }
      }
    };
    return builder;
  };

  const mockDb: any = {
    select: () => queryBuilder('select'),
    insert: (table: any) => queryBuilder('insert', table),
    update: (table: any) => queryBuilder('update', table),
    delete: (table: any) => queryBuilder('delete', table),
    execute: async () => []
  };

  return mockDb;
}

let db: any;

if (process.env.SQL_HOST) {
  try {
    const pool = new Pool({
      host: process.env.SQL_HOST,
      user: process.env.SQL_USER,
      password: process.env.SQL_PASSWORD,
      database: process.env.SQL_DB_NAME,
      connectionTimeoutMillis: 15000,
    });
    
    pool.on('error', (err) => {
      console.error('Unexpected error on idle SQL pool client:', err);
    });
    
    db = drizzle(pool, { schema });
    console.log('[Drizzle] Initialized real database connection pool.');
  } catch (error) {
    console.warn('[Drizzle] Connection initialization failed, falling back to mock.', error);
    db = createMockDrizzle();
  }
} else {
  console.log('[Drizzle] SQL_HOST not set, using in-memory mock database.');
  db = createMockDrizzle();
}

export { db };
