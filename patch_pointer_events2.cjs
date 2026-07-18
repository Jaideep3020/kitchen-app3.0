const fs = require('fs');
let code = fs.readFileSync('src/components/StaffStock.tsx', 'utf8');

code = code.replace(
  '<div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 pointer-events-auto">',
  '<div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 pointer-events-auto" onPointerDown={(e) => e.stopPropagation()}>'
);

fs.writeFileSync('src/components/StaffStock.tsx', code);
