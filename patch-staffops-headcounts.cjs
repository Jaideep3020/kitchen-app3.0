const fs = require('fs');
let content = fs.readFileSync('src/components/StaffOps.tsx', 'utf8');

// 1. Add state
const stateLine = `  const [actualQtyCooked, setActualQtyCooked] = useState<{ [key: string]: string }>({});`;
const newState = stateLine + `\n  const [mealHeadcounts, setMealHeadcounts] = useState<{ [key: string]: string }>({});\n  const [isSavingHeadcounts, setIsSavingHeadcounts] = useState(false);`;
content = content.replace(stateLine, newState);

// 2. Fetch data
const fetchLine = `        setActualQtyCooked(qtys);
      }).catch(console.error);`;
const newFetch = fetchLine + `
    fetch('/api/meal-headcounts?date=' + date)
      .then(res => res.json())
      .then(data => {
        const hc: any = {};
        if (Array.isArray(data)) {
          data.filter(d => String(d.date) === String(date)).forEach(log => {
            hc[log.mealType] = String(log.servedCount);
          });
        }
        setMealHeadcounts(hc);
      }).catch(console.error);`;
content = content.replace(fetchLine, newFetch);

// 3. Render Headcount UI
const renderPoint = ` {/* Display of scheduled dishes with sliders */}`;
const headcountUI = `
 {/* Headcount Entry Section */}
 <div className="mb-6 p-4 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-gray-800">
   <div className="flex items-center justify-between mb-4">
     <h3 className="font-bold text-[#16321F] dark:text-[#D9E96B] flex items-center gap-2">
       <Users className="w-5 h-5 text-gray-400" /> Meal Headcounts (Tokens/Plates Served)
     </h3>
     <button 
       onClick={async () => {
         setIsSavingHeadcounts(true);
         const date = getPrepDate(selectedDay || 'Thursday');
         try {
           for (const [mealType, count] of Object.entries(mealHeadcounts)) {
             if (count) {
               await fetch('/api/meal-headcounts', {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({ date, mealType, servedCount: Number(count), loggedBy: 'staff' })
               });
             }
           }
         } catch(e) {}
         setIsSavingHeadcounts(false);
       }}
       disabled={isSavingHeadcounts}
       className="px-3 py-1.5 bg-[#16321F] text-white dark:bg-[#D9E96B] dark:text-black text-xs font-bold rounded-lg"
     >
       {isSavingHeadcounts ? 'Saving...' : 'Save Headcounts'}
     </button>
   </div>
   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
     {['breakfast', 'lunch', 'dinner'].map(mealType => (
       <div key={mealType} className="flex flex-col gap-1">
         <label className="text-xs font-semibold text-gray-500 capitalize">{mealType}</label>
         <input 
           type="number"
           placeholder="e.g. 150"
           value={mealHeadcounts[mealType] || ''}
           onChange={e => setMealHeadcounts(prev => ({ ...prev, [mealType]: e.target.value }))}
           className="px-3 py-2 bg-gray-50 dark:bg-[#222222] border border-gray-100 dark:border-gray-800 rounded-lg text-sm font-bold"
         />
       </div>
     ))}
   </div>
 </div>

 {/* Display of scheduled dishes with sliders */}`;

content = content.replace(renderPoint, headcountUI);
fs.writeFileSync('src/components/StaffOps.tsx', content);
