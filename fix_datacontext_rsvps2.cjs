const fs = require('fs');
const path = require('path');
const p = path.resolve('src/contexts/DataContext.tsx');
let content = fs.readFileSync(p, 'utf8');

// Fix the fetch array
content = content.replace(/fetch\('\/api\/weekly-menus'\)\.then\(r => r\.ok \? r\.json\(\) : null\)/, `fetch('/api/weekly-menus').then(r => r.ok ? r.json() : null),
          fetch('/api/rsvps/stats').then(r => r.ok ? r.json() : null)`);

content = content.replace(/const \[recipesRes, weeklyRes\] = await Promise\.all\(\[/, `const [recipesRes, weeklyRes, rsvpStatsRes] = await Promise.all([`);
content = content.replace(/const \[suppRes, activeRes, activityRes, pastRes, wasteRes, recipesRes, weeklyRes\] = await Promise\.all\(\[/, `const [suppRes, activeRes, activityRes, pastRes, wasteRes, recipesRes, weeklyRes, rsvpStatsRes] = await Promise.all([`);

// Remove the baselineOptIns and the effect
const baselineRegex = /const baselineOptIns = React\.useMemo.*?setMealOptIns\(updatedOptIns\);\n  \}, \[allStudentChoices, baselineOptIns\]\);/s;
content = content.replace(baselineRegex, '');

// Clean up the left over orphaned code block
content = content.replace(/const \[studentChoices, setStudentChoices\] = useState.*?\}\);\n  \};/s, 'const [studentChoices, setStudentChoices] = useState<{ [key: string]: any }>({});');

fs.writeFileSync(p, content, 'utf8');
