const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace(
  `console.log('dishRecipes length:', allRecipes.filter(r => String(r.menuItemId) === String(dish.id)).length);`,
  `console.log('dishRecipes length:', allRecipes.filter(r => String(r.menuItemId) === String(dish.id)).length);
   console.log('dish:', dish.id, 'isStaple:', isStaple, 'choices in dayRsvps:', dayRsvps.map(r => r.choice));`
);
fs.writeFileSync('server.ts', content);
