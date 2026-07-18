const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');
content = content.replace(
  'const { supplierName, eta, status, routeMap, supplierId, item, quantity, price, date } = req.body;',
  'const { supplierName, eta, status, routeMap, supplierId, item, quantity, price, date, receivedQuantity } = req.body;'
);
content = content.replace(
  'supplierName, eta, status, routeMap, supplierId, item, quantity, price, date\n    }).where',
  'supplierName, eta, status, routeMap, supplierId, item, quantity, price, date, receivedQuantity\n    }).where'
);
fs.writeFileSync('server.ts', content);
