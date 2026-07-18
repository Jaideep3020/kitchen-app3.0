const fs = require('fs');
let content = fs.readFileSync('src/db/index.ts', 'utf8');

const oldCode = `          if (clause.left && clause.left.name) {
            filterCol = clause.left.name;
            filterVal = clause.right !== undefined ? clause.right : clause.value;
          }`;
          
const newCode = `          if (clause.left && clause.left.name) {
            filterCol = clause.left.name;
            filterCol = filterCol === 'menu_item_id' ? 'menuItemId' : filterCol === 'ingredient_id' ? 'ingredientId' : filterCol === 'organization_id' ? 'organizationId' : filterCol;
            filterVal = clause.right !== undefined ? clause.right : clause.value;
          }`;

content = content.replace(oldCode, newCode);
fs.writeFileSync('src/db/index.ts', content, 'utf8');
