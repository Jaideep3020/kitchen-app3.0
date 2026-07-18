const fs = require('fs');
let code = fs.readFileSync('src/components/StaffStock.tsx', 'utf8');

const replacement = '<circle cx="200" cy="125" r="16" fill="#16321F" opacity="0.2" className="animate-ping dark:fill-[#D9E96B]" />\\n' +
'  <circle cx="200" cy="125" r="120" fill="none" stroke="#10b981" strokeWidth="1" strokeOpacity="0.15" />\\n' +
'  <circle cx="200" cy="125" r="80" fill="none" stroke="#10b981" strokeWidth="1" strokeOpacity="0.15" />\\n' +
'  <circle cx="200" cy="125" r="40" fill="none" stroke="#10b981" strokeWidth="1" strokeOpacity="0.15" />\\n' +
'  <path d="M 200 125 L 200 5 A 120 120 0 0 1 320 125 Z" fill="#10b981" fillOpacity="0.05" className="animate-radar origin-[200px_125px]" />';

code = code.replace(
  '<circle cx="200" cy="125" r="16" fill="#16321F" opacity="0.2" className="animate-ping dark:fill-[#D9E96B]" />',
  replacement
);

fs.writeFileSync('src/components/StaffStock.tsx', code);
