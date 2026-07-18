import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');
code = code.replace(
    /await db\.delete\(inventoryItems\)\.where\(eq\(inventoryItems\.id, id\)\);\n    logEvent\('DATABASE', `Deleted inventory item ID \${id}`\);/,
    `await db.delete(inventoryItems).where(eq(inventoryItems.id, id));\n    logEvent('DATABASE', \`Deleted inventory item ID \${id}\`);\n    cache.del('inventory');`
);
fs.writeFileSync('server.ts', code);
console.log("Successfully patched server.ts");
