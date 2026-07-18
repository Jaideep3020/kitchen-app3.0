const fs = require('fs');
const path = require('path');
const p = path.resolve('src/db/index.ts');
let content = fs.readFileSync(p, 'utf8');

// The hack for mock drizzle
const whereReplacement = `where: (clause: any) => {
        if (clause) {
          try {
            if (clause.left && clause.left.name) {
              filterCol = clause.left.name;
              filterVal = clause.right !== undefined ? clause.right : clause.value;
            } else if (clause.queryChunks && clause.queryChunks.length >= 3) {
              // Hack for mock Drizzle
              const col = clause.queryChunks[0];
              const valChunk = clause.queryChunks[2];
              if (col && col.name) {
                // Determine the camelCase name of the column
                // Recipes uses 'menuItemId' instead of 'menu_item_id' in memory!
                filterCol = col.name === 'menu_item_id' ? 'menuItemId' : col.name === 'ingredient_id' ? 'ingredientId' : col.name;
              }
              if (valChunk && valChunk.sql && valChunk.sql.queryChunks) {
                filterVal = valChunk.sql.queryChunks[0].value[0];
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
