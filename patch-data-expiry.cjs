const fs = require('fs');
let content = fs.readFileSync('src/data.ts', 'utf8');

content = content.replace(
  /id: 'grain_1',\n    name: 'Sona Masuri \/ Raw Rice',\n    category: 'Grains',\n    unit: 'kg',\n    currentStock: 250,\n    targetStock: 300,\n    reorderLevel: 50,\n    status: 'Healthy',\n    supplierId: 1\n  },/,
  "id: 'grain_1',\n    name: 'Sona Masuri / Raw Rice',\n    category: 'Grains',\n    unit: 'kg',\n    currentStock: 250,\n    targetStock: 300,\n    reorderLevel: 50,\n    status: 'Healthy',\n    supplierId: 1,\n    expiryDate: '2026-07-20'\n  },"
);

content = content.replace(
  /export const INITIAL_PREP_ITEMS: InventoryItem\[\] = \[/,
  "export const INITIAL_PREP_ITEMS: InventoryItem[] = [\n  {\n    id: 'unused_veg',\n    name: 'Random Spinach',\n    category: 'Vegetables',\n    unit: 'kg',\n    currentStock: 10,\n    targetStock: 20,\n    reorderLevel: 5,\n    status: 'Healthy',\n    supplierId: 2,\n    expiryDate: '2026-07-20'\n  },"
);

fs.writeFileSync('src/data.ts', content);
