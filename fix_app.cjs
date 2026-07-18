const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

if(!content.includes("from '@tanstack/react-query'")) {
  const imports = `import { useQuery, useQueryClient } from '@tanstack/react-query';\nimport { fetchInventory, fetchActiveOrders, fetchActivityLogs } from './api';\n`;
  content = imports + content;
  fs.writeFileSync('src/App.tsx', content, 'utf8');
}
