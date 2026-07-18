const fs = require('fs');
let code = fs.readFileSync('src/components/StaffStock.tsx', 'utf8');

code = code.replace(
  '<span className="font-bold text-gray-500 uppercase tracking-wider">{order.eta}</span>',
  `<span className="font-bold text-gray-500 uppercase tracking-wider">
                               {order.eta.toLowerCase().includes('today') ? 'Arriving Today' : 
                                order.eta.toLowerCase().includes('tomorrow') ? 'Arriving Tomorrow' : 
                                order.eta}
                             </span>`
);

fs.writeFileSync('src/components/StaffStock.tsx', code);
