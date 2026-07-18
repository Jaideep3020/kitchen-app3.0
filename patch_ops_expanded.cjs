const fs = require('fs');
let code = fs.readFileSync('src/components/StaffOps.tsx', 'utf8');

const replacement = `<div className="flex justify-between items-end mt-3 mb-1 text-xs">
 <span className="text-gray-500 dark:text-gray-400 dark:text-gray-400 font-semibold">Stock Level:</span>
 <span className="font-extrabold text-gray-900 dark:text-white">
 {item.currentStock} / {item.targetStock} {item.unit} ({percentage}%)
 </span>
 </div>
 
 <div className="flex justify-between items-end mb-2 text-xs">
 <span className="text-gray-500 dark:text-gray-400 dark:text-gray-400 font-semibold">Days Remaining:</span>
 <span className="font-extrabold text-gray-900 dark:text-white">
 {daysRemaining} days (avg {avgDailyConsumption.toFixed(1)} {item.unit}/day)
 </span>
 </div>
 
 {runsOutBeforeDelivery && (
   <div className="mb-2 bg-red-50 dark:bg-red-950/30 p-2 rounded-lg border border-red-100 dark:border-red-900/50 flex items-start gap-2">
     <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
     <p className="text-[10px] text-red-700 dark:text-red-400 font-medium leading-tight">
       Warning: Stock will deplete in {daysRemaining} days, but next delivery arrives in {nextDeliveryDays} days. Consider reordering!
     </p>
   </div>
 )}
 
 {/* Progress bar */}`;

code = code.replace(
  /<div className="flex justify-between items-end mt-3 mb-1 text-xs">\s*<span className="text-gray-500 dark:text-gray-400 dark:text-gray-400 font-semibold">Stock Level:<\/span>\s*<span className="font-extrabold text-gray-900 dark:text-white">\s*\{item.currentStock\} \/ \{item.targetStock\} \{item.unit\} \(\{percentage\}%\)\s*<\/span>\s*<\/div>\s*\{\/\* Progress bar \*\/\}/g,
  replacement
);

fs.writeFileSync('src/components/StaffOps.tsx', code);
