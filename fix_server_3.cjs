const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const newImport = "import { INITIAL_MENU_ITEMS, INITIAL_PREP_ITEMS, INITIAL_ACTIVE_ORDERS, INITIAL_ACTIVITY_LOGS, INITIAL_SUPPLIERS, INITIAL_PAST_ORDERS } from './src/data.ts';";
const fixedImport = "import { INITIAL_MENU_ITEMS, INITIAL_PREP_ITEMS, INITIAL_ACTIVE_ORDERS, INITIAL_ACTIVITY_LOGS, INITIAL_SUPPLIERS } from './src/data.ts';";

content = content.replace(newImport, fixedImport);

fs.writeFileSync('server.ts', content, 'utf8');
