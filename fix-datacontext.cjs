const fs = require('fs');
let content = fs.readFileSync('src/contexts/DataContext.tsx', 'utf8');
content = content.replace("'student@kitchenops.edu'", "'student1@mess.edu'");
fs.writeFileSync('src/contexts/DataContext.tsx', content);
