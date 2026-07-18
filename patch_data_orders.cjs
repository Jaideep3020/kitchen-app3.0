const fs = require('fs');
let code = fs.readFileSync('src/data.ts', 'utf8');

const ordersData = `export const INITIAL_ACTIVE_ORDERS: ActiveOrder[] = [
  {
    id: 'po_102',
    supplierName: 'Krishna Fresh Vegetable Suppliers',
    eta: 'Today',
    status: 'In Transit',
    item: 'Tomatoes',
    quantity: 50,
    price: 1200,
    date: '10/02/2026'
  },
  {
    id: 'po_103',
    supplierName: 'Golden Harvest Dairy Pvt Ltd',
    eta: 'Today',
    status: 'In Transit',
    item: 'Milk',
    quantity: 100,
    price: 3500,
    date: '10/02/2026'
  },
  {
    id: 'po_104',
    supplierName: 'Fresh Farm Poultry & Eggs Co',
    eta: 'Tomorrow',
    status: 'Placed',
    item: 'Eggs',
    quantity: 500,
    price: 2500,
    date: '10/02/2026'
  },
  {
    id: 'po_105',
    supplierName: 'Sri Venkateswara Rice & Grain Mills',
    eta: 'Delivered',
    status: 'Received',
    item: 'Sona Masuri Rice',
    quantity: 200,
    price: 8500,
    date: '08/02/2026'
  }
];`;

code = code.replace('export const INITIAL_ACTIVE_ORDERS: ActiveOrder[] = [];', ordersData);
fs.writeFileSync('src/data.ts', code);
