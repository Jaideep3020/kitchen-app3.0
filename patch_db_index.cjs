const fs = require('fs');
let code = fs.readFileSync('src/db/index.ts', 'utf8');

code = code.replace(
  "id: list.length + idx + 1,",
  "id: item.id !== undefined ? item.id : (list.length + idx + 1),"
);

fs.writeFileSync('src/db/index.ts', code);
