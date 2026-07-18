const fs = require('fs');
const path = require('path');
const p = path.resolve('src/components/StudentOptIn.tsx');
let content = fs.readFileSync(p, 'utf8');

// The activeWeekStartDate in DataContext gives us the start date. We can use dish.dayOfWeek to calculate the date.
// But we don't have activeWeekStartDate imported here! Let's import it.
// Also we need currentUserEmail.
content = content.replace(/const \{ menuItems, studentChoices, setStudentChoices, setMealOptIns \} = useData\(\);/, `const { menuItems, studentChoices, setStudentChoices, setMealOptIns, currentUserEmail, activeWeekStartDate } = useData();`);

const newHandleToggle = `  const handleToggle = async (dishId: string) => {
    const isCurrentlyOptedIn = !!studentChoices[dishId];
    const dish = menuItems.find(d => d.id === dishId);
    if (!dish) return;

    // Get default choice if dish has options
    const options = getDishOptions(dish);
    const choiceValue = options ? options[0] : null;

    // Optimistic update
    const nextChoices = { ...studentChoices, [dishId]: !isCurrentlyOptedIn };
    setStudentChoices(nextChoices);
    
    setMealOptIns(prev => ({
      ...prev,
      [dishId]: Math.max(0, (prev[dishId] || 0) + (isCurrentlyOptedIn ? -1 : 1))
    }));

    triggerHaptic('success');
    addToast(isCurrentlyOptedIn ? \`Opted out of \${dish.name}\` : \`Opted into \${dish.name}\`, isCurrentlyOptedIn ? 'default' : 'success');

    // Calculate actual date based on activeWeekStartDate and dish.dayOfWeek
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const dateObj = new Date(activeWeekStartDate);
    dateObj.setDate(dateObj.getDate() + Math.max(0, days.indexOf(dish.dayOfWeek || 'Monday')));
    const dateStr = dateObj.toISOString().split('T')[0];

    try {
      const res = await fetch('/api/rsvps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: currentUserEmail,
          date: dateStr,
          mealType: dish.mealType,
          attending: !isCurrentlyOptedIn,
          choice: choiceValue,
          dishId: dish.id
        })
      });
      if (!res.ok) throw new Error('Network response was not ok');
    } catch (err) {
      console.error(err);
      addToast('Failed to save RSVP to server', 'error');
      // Rollback on error
      setStudentChoices(studentChoices);
      setMealOptIns(prev => ({
        ...prev,
        [dishId]: Math.max(0, (prev[dishId] || 0) + (isCurrentlyOptedIn ? 1 : -1))
      }));
    }
  };`;

content = content.replace(/const handleToggle = \(dishId: string\) => \{[\s\S]*?addToast.*?;/s, newHandleToggle);

fs.writeFileSync(p, content, 'utf8');
