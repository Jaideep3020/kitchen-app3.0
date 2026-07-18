const fs = require('fs');
const path = require('path');
const p = path.resolve('src/db/index.ts');
let content = fs.readFileSync(p, 'utf8');

const whereReplacement = `where: (clause: any) => {
        if (clause) {
          try {
            if (clause.left && clause.left.name) {
              filterCol = clause.left.name;
              filterVal = clause.right !== undefined ? clause.right : clause.value;
            } else if (clause.queryChunks && clause.queryChunks.length >= 3) {
              const col = clause.queryChunks[0];
              const val = clause.queryChunks[2];
              if (col && col.name) {
                // Get the mapped camelCase name from the schema if possible, or just use the name
                filterCol = col.name; 
                // Wait, mockStorage keys might be camelCase because the seed data uses camelCase!
                // menu_item_id -> menuItemId
                filterCol = Object.keys(col.table || {}).find(k => col.table[k] === col) || col.name;
              }
              if (val && val.value !== undefined) {
                filterVal = Array.isArray(val.value) ? val.value[0] : val.value;
              }
            } else if (clause.value !== undefined) {
              filterVal = clause.value;
            }
          } catch (e) {
            // ignore
          }
        }
        return builder;
      },`;

content = content.replace(/where: \(clause: any\) => \{[\s\S]*?return builder;\n      \},/s, whereReplacement);

fs.writeFileSync(p, content, 'utf8');
