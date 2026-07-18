const fs = require('fs');
const path = require('path');
const p = path.resolve('src/components/StudentOptIn.tsx');
let content = fs.readFileSync(p, 'utf8');

// Insert onConfirm(nextChoices)
content = content.replace(/setStudentChoices\(nextChoices\);\n\s*setMealOptIns/s, `setStudentChoices(nextChoices);\n    onConfirm(nextChoices);\n    setMealOptIns`);

fs.writeFileSync(p, content, 'utf8');
