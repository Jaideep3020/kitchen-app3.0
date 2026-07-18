const fs = require('fs');
let content = fs.readFileSync('src/db/index.ts', 'utf8');

// I will add expiryDate to a few items.
// We need 3 cases:
// 1. Expiring in 2 days, IS used tomorrow
// 2. Expiring in 2 days, NOT used next 7 days
// 3. No expiry date

// Let's modify INITIAL_PREP_ITEMS
// Today is '2026-07-18' (Saturday).
// Expiring in 2 days = '2026-07-20' (Monday).

// Let's find an item used in Monday's menu (e.g. mon_lh -> grain_1)
// Let's set grain_1 expiryDate to '2026-07-20'.
// Let's find an item NOT used next 7 days... wait, the seed menu uses almost all ingredients. 
// We can just add a new item 'unused_veg' with expiryDate '2026-07-20'.
// grain_2 has no expiry.

content = content.replace(
  /{ id: 'grain_1', name: 'Sona Masuri Rice', category: 'Grains', unit: 'kg', currentStock: 250, targetStock: 300, reorderLevel: 50, status: 'Healthy', supplierId: 1 },/,
  "{ id: 'grain_1', name: 'Sona Masuri Rice', category: 'Grains', unit: 'kg', currentStock: 250, targetStock: 300, reorderLevel: 50, status: 'Healthy', supplierId: 1, expiryDate: '2026-07-20' },"
);

// Add an unused item
content = content.replace(
  /const INITIAL_PREP_ITEMS = \[/,
  "const INITIAL_PREP_ITEMS = [\n  { id: 'unused_veg', name: 'Random Spinach', category: 'Vegetables', unit: 'kg', currentStock: 10, targetStock: 20, reorderLevel: 5, status: 'Healthy', supplierId: 2, expiryDate: '2026-07-20' },"
);

fs.writeFileSync('src/db/index.ts', content);
