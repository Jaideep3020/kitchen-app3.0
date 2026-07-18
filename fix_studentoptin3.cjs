const fs = require('fs');
const path = require('path');
const p = path.resolve('src/components/StudentOptIn.tsx');
let content = fs.readFileSync(p, 'utf8');

function fixOnClick(content, dishVarName) {
  const regex = new RegExp(`onClick=\\{\\(\\) => \\{\\s*const nextChoices = \\{ \\.\\.\\.studentChoices, \\[choiceKey\\]: opt \\};\\s*setStudentChoices\\(nextChoices\\);\\s*onConfirm\\(nextChoices\\);\\s*addToast\\(\\\`Selected \\$\\{opt\\} for \\$\\{${dishVarName}\\.name\\}! 🍳\\\`, 'success'\\);\\s*triggerHaptic\\('light'\\);\\s*\\}\\}`, 'g');
  
  const replacement = `onClick={async () => {
                   const isCurrentlyOptedIn = !!studentChoices[${dishVarName}.id];
                   const nextChoices = { ...studentChoices, [choiceKey]: opt };
                   setStudentChoices(nextChoices);
                   onConfirm(nextChoices);
                   addToast(\`Selected \${opt} for \${${dishVarName}.name}! 🍳\`, 'success');
                   triggerHaptic('light');
                   
                   const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                   const dateObj = new Date(activeWeekStartDate);
                   dateObj.setDate(dateObj.getDate() + Math.max(0, days.indexOf(${dishVarName}.dayOfWeek || 'Monday')));
                   const dateStr = dateObj.toISOString().split('T')[0];

                   try {
                     await fetch('/api/rsvps', {
                       method: 'POST',
                       headers: { 'Content-Type': 'application/json' },
                       body: JSON.stringify({
                         email: currentUserEmail,
                         date: dateStr,
                         mealType: ${dishVarName}.mealType,
                         attending: isCurrentlyOptedIn,
                         choice: opt,
                         dishId: ${dishVarName}.id
                       })
                     });
                   } catch (e) { console.error(e); }
                 }}`;
                 
  return content.replace(regex, replacement);
}

content = fixOnClick(content, 'breakfastDish');
content = fixOnClick(content, 'lunchDish');
content = fixOnClick(content, 'dinnerDish');

fs.writeFileSync(p, content, 'utf8');
