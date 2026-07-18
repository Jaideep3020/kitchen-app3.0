import { eq } from 'drizzle-orm';
import { recipes } from './src/db/schema';
console.dir(eq(recipes.menuItemId, 'thu_lh'), { depth: null });
