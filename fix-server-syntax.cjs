const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const regex = /app\.get\('\/api\/prep-requirements', async \(req, res\) => \{[\s\S]*?\}\);([\s\S]*?)app\.get\('\/api\/dish-rsvps'/;
// We know there are two prep-requirements definitions or something broken?
// Let's just delete the broken one.
content = content.replace(/app\.get\('\/api\/prep-requirements', async \(req, res\) => \{[\s\S]*?res\.json\(requirements\);\n  \} catch \(err\) \{\n    res\.status\(500\)\.json\(\{ error: 'Failed' \}\);\n  \}\n\}\);\n/, "");
fs.writeFileSync('server.ts', content);
