const fs = require('fs');
const path = require('path');
const p = path.resolve('src/contexts/DataContext.tsx');
let content = fs.readFileSync(p, 'utf8');

// Replace allStudentChoices useState and studentChoices extraction
content = content.replace(/const \[allStudentChoices, setAllStudentChoices\] = useState.*?\}\);/s, `const [allStudentChoices, setAllStudentChoices] = useState<{ [email: string]: { [key: string]: any } }>({});`);
content = content.replace(/const \[studentChoices, setStudentChoices_internal\] = useState.*?\}\);/s, `const [studentChoices, setStudentChoices_internal] = useState<{ [key: string]: any }>({});`);

// We'll just define studentChoices directly
content = content.replace(/const studentChoices = allStudentChoices\[currentUserEmail\] \|\| \{\};/, `const [studentChoices, setStudentChoices] = useState<{ [key: string]: any }>({});`);
content = content.replace(/const setStudentChoices = \(.*?\};/s, '');

content = content.replace(/const \[mealOptIns, setMealOptIns\] = useState.*?\}\);/s, `const [mealOptIns, setMealOptIns] = useState<{ [key: string]: number }>({});`);

// Remove localStorage syncing for these
content = content.replace(/useEffect\(\(\) => \{ localStorage\.setItem\('sync_allStudentChoices'.*?\n/g, '');
content = content.replace(/useEffect\(\(\) => \{ localStorage\.setItem\('sync_mealOptIns'.*?\n/g, '');

fs.writeFileSync(p, content, 'utf8');
