const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const oldStaplesLogic = `    // Add staples
    const allStaples = await db.select().from(staples);
    const activeStaples = allStaples.filter(s => s.alwaysIncluded);
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    for (const day of days) {
      for (const staple of activeStaples) {
        slots.push({
          weeklyMenuId: menuId,
          dayOfWeek: day,
          mealType: staple.mealType,
          menuItemId: String(staple.menuItemId),
        });
      }
    }`;

const newStaplesLogic = `    // Add staples
    const allStaples = await db.select().from(staples);
    const activeStaples = allStaples.filter(s => s.alwaysIncluded);
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    for (const day of days) {
      for (const staple of activeStaples) {
        const exists = slots.find(s => s.dayOfWeek === day && s.mealType === staple.mealType && s.menuItemId === String(staple.menuItemId));
        if (!exists) {
          slots.push({
            weeklyMenuId: menuId,
            dayOfWeek: day,
            mealType: staple.mealType,
            menuItemId: String(staple.menuItemId),
          });
        }
      }
    }`;

content = content.replace(oldStaplesLogic, newStaplesLogic);
fs.writeFileSync('server.ts', content, 'utf8');
