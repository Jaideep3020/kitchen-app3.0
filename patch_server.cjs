const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  'const { name, category, email, phone, distance, leadTime, statusText, items, attentionNeeded, criticalMessage } = req.body;',
  'const { name, category, email, phone, distance, leadTime, statusText, items, attentionNeeded, criticalMessage, correspondence } = req.body;'
);

code = code.replace(
  'name, category, email, phone, distance, leadTime, statusText, items, attentionNeeded, criticalMessage\n    }).where',
  'name, category, email, phone, distance, leadTime, statusText, items, attentionNeeded, criticalMessage, correspondence\n    }).where'
);

fs.writeFileSync('server.ts', code);
