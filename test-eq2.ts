import { eq } from 'drizzle-orm';
import { recipes } from './src/db/schema';
const clause = eq(recipes.menuItemId, 'thu_lh');
console.log(clause.queryChunks.map((c: any) => ({ name: c.constructor.name, val: c })));
