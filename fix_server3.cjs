const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace("  } catch (err) {\n    res.status(500).json({ error: 'Seed failed', details: err });\n  }\n});\n", "");

fs.writeFileSync('server.ts', content, 'utf8');
