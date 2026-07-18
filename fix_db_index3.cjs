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
            } else if (clause.queryChunks && clause.queryChunks.length >= 4) {
              // Hack for mock Drizzle
              const col = clause.queryChunks[1]; // Index 1 is the column PgText
              const valChunk = clause.queryChunks[3]; // Index 3 is the Param
              if (col && col.name) {
                filterCol = col.name === 'menu_item_id' ? 'menuItemId' : col.name === 'ingredient_id' ? 'ingredientId' : col.name;
              }
              if (valChunk && valChunk.value !== undefined) {
                filterVal = valChunk.value;
              } else if (valChunk && valChunk.sql && valChunk.sql.queryChunks) {
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
