const fs = require('fs');
let content = fs.readFileSync('src/components/StaffOps.tsx', 'utf8');

content = content.replace(/<span>Max: \{maxVol\}<\/span>\s*<hr className="border-gray-50" \/>/g, 
  '<span>Max: {maxVol}</span></div></div><hr className="border-gray-50" />');
fs.writeFileSync('src/components/StaffOps.tsx', content, 'utf8');
