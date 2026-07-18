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
const mockStorage: Record<string, any[]> = {
  inventory_items: [...INITIAL_PREP_ITEMS],
  active_orders: [...INITIAL_ACTIVE_ORDERS],
  activity_logs: [...INITIAL_ACTIVITY_LOGS],
  suppliers: [...INITIAL_SUPPLIERS],
  menu_items: [...INITIAL_MENU_ITEMS],
  issues: [],
  waste_logs: [],
  past_orders: [],
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
          try {
            if (clause.left && clause.left.name) {
              filterCol = clause.left.name;
              filterVal = clause.right !== undefined ? clause.right : clause.value;
            } else if (clause.value !== undefined) {
              filterVal = clause.value;
            }
          } catch (e) {
            // ignore
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
        const list = mockStorage[tableName] || [];
        
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
