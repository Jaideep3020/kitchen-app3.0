const fs = require('fs');
let content = fs.readFileSync('src/db/schema.ts', 'utf8');

const tableDefinition = `
export const stockTransactions = pgTable('stock_transactions', {
  id: serial('id').primaryKey(),
  ingredientId: text('ingredient_id').notNull(),
  amount: decimal('amount').notNull(),
  reason: text('reason').notNull(),
  relatedPrepLogId: integer('related_prep_log_id').references(() => prepLogs.id),
  createdAt: timestamp('created_at').defaultNow(),
});
`;

content += '\n' + tableDefinition + '\n';
fs.writeFileSync('src/db/schema.ts', content, 'utf8');

let serverContent = fs.readFileSync('server.ts', 'utf8');
serverContent = serverContent.replace(', staples }', ', staples, stockTransactions }');
serverContent = serverContent.replace(', prepLogs }', ', prepLogs, stockTransactions }');
fs.writeFileSync('server.ts', serverContent, 'utf8');

let indexContent = fs.readFileSync('src/db/index.ts', 'utf8');
indexContent = indexContent.replace('staples: [],', 'staples: [],\n  stock_transactions: [],');
fs.writeFileSync('src/db/index.ts', indexContent, 'utf8');
