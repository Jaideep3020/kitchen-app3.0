const fs = require('fs');
const path = require('path');
const p = path.resolve('src/contexts/DataContext.tsx');
let content = fs.readFileSync(p, 'utf8');

// Insert the rsvpStatsRes check
content = content.replace(/if \(weeklyRes\) \{/, `if (rsvpStatsRes) {
          // rsvpStatsRes is a Record<string, number> where keys are dishIds
          setMealOptIns(rsvpStatsRes);
        }
        if (weeklyRes) {`);

// Add an effect to fetch studentChoices
const studentEffect = `
  useEffect(() => {
    if (!currentUserEmail) return;
    fetch(\`/api/rsvps/student?email=\${encodeURIComponent(currentUserEmail)}\`)
      .then(r => r.ok ? r.json() : [])
      .then(rsvps => {
        const choices: any = {};
        rsvps.forEach((r: any) => {
          if (r.attending && r.choice) {
            choices[r.choice] = true;
          }
        });
        setStudentChoices(choices);
      })
      .catch(console.error);
  }, [currentUserEmail]);
`;

content = content.replace(/return \(\n    <DataContext.Provider/, `${studentEffect}\n  return (\n    <DataContext.Provider`);

fs.writeFileSync(p, content, 'utf8');
