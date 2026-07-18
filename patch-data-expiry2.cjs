const fs = require('fs');
let content = fs.readFileSync('src/data.ts', 'utf8');

content = content.replace(
  /id: 'grain_1',\n    name: 'Sona Masuri \/ Raw Rice',[\s\S]*?supplierId: undefined\n  },/,
  "id: 'grain_1',\n    name: 'Sona Masuri / Raw Rice',\n    category: 'grains_lentils',\n    unit: 'kg',\n    currentStock: 120,\n    targetStock: 150,\n    reorderLevel: 40,\n    status: 'In Stock',\n    supplierId: undefined,\n    expiryDate: '2026-07-20'\n  },"
);

fs.writeFileSync('src/data.ts', content);
