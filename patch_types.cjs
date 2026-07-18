const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

code = code.replace(
  "items: { name: string; status: 'In Stock' | 'Low Stock' | 'Out' }[];",
  "items: { name: string; status: 'In Stock' | 'Low Stock' | 'Out' }[];\n  correspondence?: { id: string, date: string, type: 'Call' | 'Email', notes: string }[];"
);

fs.writeFileSync('src/types.ts', code);
