const fs = require('fs');
let content = fs.readFileSync('src/db/index.ts', 'utf8');

const oldWhere = `      where: (clause: any) => {
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

const newWhere = `      where: (clause: any) => {
        if (clause) {
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
            // Some other fallback
            filterVal = clause.value;
          }
          
          if (!filterCol || filterVal === undefined) {
            throw new Error("Fail-Closed Guard: Could not resolve column name or value from where clause: " + JSON.stringify(clause));
          }
        }
        return builder;
      },`;

content = content.replace(oldWhere, newWhere);
fs.writeFileSync('src/db/index.ts', content, 'utf8');
