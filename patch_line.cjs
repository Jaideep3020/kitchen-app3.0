const fs = require('fs');
let code = fs.readFileSync('src/components/StaffStock.tsx', 'utf8');

code = code.replace(
  /strokeDasharray="4 4" className="opacity-50"/g,
  'strokeDasharray="4 4" className="opacity-50 animate-[dash_1s_linear_infinite]"'
);

fs.writeFileSync('src/components/StaffStock.tsx', code);
