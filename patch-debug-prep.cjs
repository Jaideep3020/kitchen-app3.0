const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace(
  'const dayRsvps = await db.select().from(rsvps).where(sql\\`\\${rsvps.date} = \\${date as string} AND \\${rsvps.attending} = true\\`);',
  'const dayRsvps = await db.select().from(rsvps).where(eq(rsvps.date, date as string));'
);
fs.writeFileSync('server.ts', content);
