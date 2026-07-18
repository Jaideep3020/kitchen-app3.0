import { db } from './src/db/index.ts';
import { menuItems } from './src/db/schema.ts';
db.select().from(menuItems).then(res => console.log(res.length));
