const fs = require('fs');
let content = fs.readFileSync('src/db/schema.ts', 'utf8');

const newTable = `
export const mealHeadcounts = pgTable('meal_headcounts', {
  id: serial('id').primaryKey(),
  date: date('date').notNull(),
  mealType: text('meal_type').notNull(),
  servedCount: integer('served_count').notNull(),
  loggedBy: text('logged_by').notNull(),
  loggedAt: timestamp('logged_at').defaultNow()
});
`;

content = content.replace("export const staples =", newTable + "\nexport const staples =");
fs.writeFileSync('src/db/schema.ts', content);

let indexContent = fs.readFileSync('src/db/index.ts', 'utf8');
indexContent = indexContent.replace('staples: [],', 'staples: [],\n  meal_headcounts: [],');
fs.writeFileSync('src/db/index.ts', indexContent);

let serverContent = fs.readFileSync('server.ts', 'utf8');
serverContent = serverContent.replace('prepLogs, staples', 'prepLogs, mealHeadcounts, staples');
fs.writeFileSync('server.ts', serverContent);
