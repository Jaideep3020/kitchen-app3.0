const fs = require('fs');
let content = fs.readFileSync('src/components/StaffOps.tsx', 'utf8');

const oldStr = ` <span>Max: {maxVol}</span>
         <hr className="border-gray-50" />`;

const newStr = ` <span>Max: {maxVol}</span>
        </div>
        </div>
        <hr className="border-gray-50" />`;

content = content.replace(oldStr, newStr);
fs.writeFileSync('src/components/StaffOps.tsx', content, 'utf8');
