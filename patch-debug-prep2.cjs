const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace(
  `for (const dish of dayItems) {`,
  `for (const dish of dayItems) {
      console.log('dish:', dish.id, dish.mealType);
      console.log('dishRecipes length:', allRecipes.filter(r => String(r.menuItemId) === String(dish.id)).length);`
);
fs.writeFileSync('server.ts', content);
