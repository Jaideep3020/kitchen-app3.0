const fs = require('fs');
const path = require('path');
const p = path.resolve('src/contexts/DataContext.tsx');
let content = fs.readFileSync(p, 'utf8');

content = content.replace(/const \[studentChoices, setStudentChoices\] = useState.*?\}\);  \};/s, 'const [studentChoices, setStudentChoices] = useState<{ [key: string]: any }>({});');

// Replace the baselineOptIns and the useEffect for syncing mealOptIns with a simple fetch.
// Wait, I need to fetch RSVPs from the backend and populate studentChoices and mealOptIns.
// Let's find where we fetch data on mount.
content = content.replace(/fetch\('\/api\/weekly-menus'\)\.then\(r => r\.ok \? r\.json\(\) : null\)/, `fetch('/api/weekly-menus').then(r => r.ok ? r.json() : null),
          fetch('/api/rsvps/stats').then(r => r.ok ? r.json() : null)`);

// It's probably easier to just find the entire block.
