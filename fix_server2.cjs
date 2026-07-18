const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const regex = /app\.post\('\/api\/seed', async \(req, res\) => \{[\s\S]*?\}\);/m;
content = content.replace(regex, "");

fs.writeFileSync('server.ts', content, 'utf8');
