const fs = require('fs');
let content = fs.readFileSync('src/db/schema.ts', 'utf8');

const tableDefinition = `
export const staples = pgTable('staples', {
  id: serial('id').primaryKey(),
  menuItemId: text('menu_item_id').notNull().references(() => menuItems.id),
  mealType: text('meal_type').notNull(),
  alwaysIncluded: boolean('always_included').notNull().default(true),
});
`;

content += '\n' + tableDefinition + '\n';
fs.writeFileSync('src/db/schema.ts', content, 'utf8');
