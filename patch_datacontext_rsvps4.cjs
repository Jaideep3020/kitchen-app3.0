const fs = require('fs');
const path = require('path');
const p = path.resolve('src/contexts/DataContext.tsx');
let content = fs.readFileSync(p, 'utf8');

// I need to update the useEffect that fetches rsvps to properly map to dishId
const fetchLogic = `fetch(\`/api/rsvps/student?email=\${encodeURIComponent(currentUserEmail)}\`)
      .then(r => r.ok ? r.json() : [])
      .then(rsvps => {
        const choices: any = {};
        
        // We need to map date + mealType -> dishId. 
        // We have masterMenuItems. 
        // date = activeWeekStartDate + days
        // It's easier to match by mealType and dayOfWeek!
        rsvps.forEach((r: any) => {
          if (r.attending) {
            // Find the dishId for this date and mealType
            const dateObj = new Date(r.date);
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const dayOfWeek = days[dateObj.getDay()];
            
            const dish = masterMenuItems.find(m => m.dayOfWeek === dayOfWeek && m.mealType === r.mealType && m.category.includes('main'));
            if (dish) {
              choices[dish.id] = true;
              if (r.choice && r.choice !== dish.id) {
                choices[\`\${dish.id}_choice\`] = r.choice;
              }
            }
          }
        });
        setStudentChoices(choices);
      })`;

content = content.replace(/fetch\(\`\/api\/rsvps\/student[\s\S]*?setStudentChoices\(choices\);\n      \}\)/, fetchLogic);

fs.writeFileSync(p, content, 'utf8');
