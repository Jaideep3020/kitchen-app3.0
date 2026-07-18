const fs = require('fs');
let content = fs.readFileSync('src/components/StaffOps.tsx', 'utf8');

const injection = `
        <hr className="border-gray-50" />
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-medium text-gray-500 font-mono">
            <span>Actual Qty Cooked:</span>
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="number" 
              placeholder="e.g. 42"
              value={actualQtyCooked[dish.id] || ''}
              onChange={(e) => {
                const val = e.target.value;
                setActualQtyCooked(prev => ({ ...prev, [dish.id]: val }));
              }}
              className="w-full text-sm font-bold bg-gray-50 dark:bg-[#222222] border border-gray-100 dark:border-gray-800 rounded-lg px-3 py-2 text-[#16321F] dark:text-[#D9E96B]"
            />
            <span className="text-xs text-gray-500">{prepVolUnit}</span>
          </div>
        </div>
      </>
    );
`;

content = content.replace(/<\/div>\s*<\/div>\s*<\/>\s*\);\s*}\)\(\)}/g, injection + '\n          })()}');

const saveInjection = `
  const handleSavePrepProgress = async () => {
    triggerHaptic('success');
    setIsSavingPrep(true);
    
    const day = selectedDay || 'Thursday';
    const date = getPrepDate(day);
    
    try {
      const activePrepDayForWaste = selectedDay || 'Thursday';
      const dishesForDayForWaste = menuItems.filter(item => item.dayOfWeek === activePrepDayForWaste);
      
      for (const dish of dishesForDayForWaste) {
        if (actualQtyCooked[dish.id]) {
          await fetch('/api/prep-logs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              date,
              mealType: dish.mealType,
              menuItemId: dish.id,
              actualQtyCooked: actualQtyCooked[dish.id],
              loggedBy: 'staff@kitchenops.edu'
            })
          });
        }
      }
    } catch (err) {
      console.error(err);
    }
    
    setTimeout(() => {
`;

content = content.replace(/const handleSavePrepProgress = \(\) => \{\n    triggerHaptic\('success'\);\n    setIsSavingPrep\(true\);\n    \n    \/\/ Simulate network delay for the saving indicator\n    setTimeout\(\(\) => \{/g, saveInjection);

fs.writeFileSync('src/components/StaffOps.tsx', content, 'utf8');
