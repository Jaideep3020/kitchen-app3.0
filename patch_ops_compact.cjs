const fs = require('fs');
let code = fs.readFileSync('src/components/StaffOps.tsx', 'utf8');

const oldCompact = `<div className="flex flex-col min-w-0 pr-2">
 <span className="text-xs font-medium text-gray-400 dark:text-gray-400 block mb-0.5">
 {item.category.replace('_', ' ')}
 </span>
 <h4 className="text-xs font-extrabold text-[#0A170E] dark:text-white truncate font-display group-hover:text-[#16321F] dark:text-[#D9E96B] transition-colors" title={item.name}>
 {item.name}
 </h4>
 </div>`;

const newCompact = `<div className="flex flex-col min-w-0 pr-2">
 <span className="text-xs font-medium text-gray-400 dark:text-gray-400 block mb-0.5">
 {item.category.replace('_', ' ')}
 </span>
 <h4 className="text-xs font-extrabold text-[#0A170E] dark:text-white truncate font-display group-hover:text-[#16321F] dark:text-[#D9E96B] transition-colors" title={item.name}>
 {item.name}
 </h4>
 <span className={\`text-[10px] font-medium mt-0.5 flex items-center gap-1 \${runsOutBeforeDelivery ? 'text-red-500 font-bold' : 'text-gray-500'}\`}>
 {runsOutBeforeDelivery && <AlertTriangle className="w-3 h-3" />}
 {daysRemaining} days left {runsOutBeforeDelivery ? \`(Delivery in \${nextDeliveryDays}d)\` : ''}
 </span>
 </div>`;

code = code.replace(oldCompact, newCompact);

fs.writeFileSync('src/components/StaffOps.tsx', code);
