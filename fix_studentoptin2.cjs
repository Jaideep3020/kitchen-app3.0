const fs = require('fs');
const path = require('path');
const p = path.resolve('src/components/StudentOptIn.tsx');
let content = fs.readFileSync(p, 'utf8');

// I need to find all the "onClick={() => { const nextChoices = { ...studentChoices, [choiceKey]: opt }; setStudentChoices(nextChoices); onConfirm(nextChoices); ... }}"
const choiceClickRegex = /onClick=\{\(\) => \{\n\s*const nextChoices = \{ \.\.\.studentChoices, \[choiceKey\]: opt \};\n\s*setStudentChoices\(nextChoices\);\n\s*onConfirm\(nextChoices\);\n\s*addToast\(`Selected \$\{opt\} for \$\{(.*?)\}\.name\}! 🍳`, 'success'\);\n\s*triggerHaptic\('light'\);\n\s*\}\}/g;

const replacement = `onClick={async () => {
                   const isCurrentlyOptedIn = !!studentChoices[dishId];
                   const nextChoices = { ...studentChoices, [choiceKey]: opt };
                   setStudentChoices(nextChoices);
                   onConfirm(nextChoices);
                   addToast(\`Selected \${opt} for \${$1.name}! 🍳\`, 'success');
                   triggerHaptic('light');
                   
                   const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                   const dateObj = new Date(activeWeekStartDate);
                   dateObj.setDate(dateObj.getDate() + Math.max(0, days.indexOf($1.dayOfWeek || 'Monday')));
                   const dateStr = dateObj.toISOString().split('T')[0];

                   try {
                     await fetch('/api/rsvps', {
                       method: 'POST',
                       headers: { 'Content-Type': 'application/json' },
                       body: JSON.stringify({
                         email: currentUserEmail,
                         date: dateStr,
                         mealType: $1.mealType,
                         attending: isCurrentlyOptedIn,
                         choice: opt,
                         dishId: dishId
                       })
                     });
                   } catch (e) { console.error(e); }
                 }}`;

content = content.replace(choiceClickRegex, replacement);

fs.writeFileSync(p, content, 'utf8');
