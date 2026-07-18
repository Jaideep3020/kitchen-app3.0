const fs = require('fs');
let code = fs.readFileSync('src/components/StaffStock.tsx', 'utf8');

code = code.replace(
  '<div className="mt-3 p-3 bg-gray-50 dark:bg-[#1a1a1a] rounded-[12px] border border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-top-2 flex flex-col gap-2 pointer-events-none">',
  '<div className="mt-3 p-3 bg-gray-50 dark:bg-[#1a1a1a] rounded-[12px] border border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-top-2 flex flex-col gap-2" onPointerDown={(e) => e.stopPropagation()}>'
);

fs.writeFileSync('src/components/StaffStock.tsx', code);
