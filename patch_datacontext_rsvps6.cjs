const fs = require('fs');
const path = require('path');
const p = path.resolve('src/contexts/DataContext.tsx');
let content = fs.readFileSync(p, 'utf8');

const mapStats = `if (rsvpStatsRes) {
          const optIns: any = {};
          const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          
          Object.keys(rsvpStatsRes).forEach(key => {
            const [dateStr, mealType] = key.split('_');
            const dateObj = new Date(dateStr);
            const dayOfWeek = days[dateObj.getDay()];
            
            const dish = menuRes.find((m: any) => m.dayOfWeek === dayOfWeek && m.mealType === mealType && m.category.includes('main'));
            if (dish) {
              optIns[dish.id] = rsvpStatsRes[key];
            }
          });
          setMealOptIns(optIns);
        }`;

content = content.replace(/if \(rsvpStatsRes\) \{\n\s*\/\/[^\n]*\n\s*setMealOptIns\(rsvpStatsRes\);\n\s*\}/s, mapStats);

fs.writeFileSync(p, content, 'utf8');
