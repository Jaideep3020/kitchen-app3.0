const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace(
  `console.log('dish:', dish.id, 'isStaple:', isStaple, 'choices in dayRsvps:', dayRsvps.map(r => r.choice));`,
  ``
);

content = content.replace(
  `const isStaple = activeStaples.some(s => s.menuItemId === dish.id && s.mealType === dish.mealType);`,
  `const isStaple = activeStaples.some(s => s.menuItemId === dish.id && s.mealType === dish.mealType);
   console.log('dish:', dish.id, 'isStaple:', isStaple, 'choices in dayRsvps:', dayRsvps.map(r => r.choice));`
);

fs.writeFileSync('server.ts', content);
