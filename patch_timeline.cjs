const fs = require('fs');
let code = fs.readFileSync('src/components/StaffDashboard.tsx', 'utf8');

const replacement = `<div className="mt-2">
                       <div className="flex justify-between items-center mb-1">
                         <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                           {order.eta.toLowerCase().includes('today') ? 'Arriving Today' : 
                            order.eta.toLowerCase().includes('tomorrow') ? 'Arriving Tomorrow' : 
                            order.eta}
                         </span>
                         <span className="text-[10px] font-bold text-gray-900 dark:text-white">
                           {order.eta.toLowerCase().includes('today') ? '80%' : 
                            order.eta.toLowerCase().includes('tomorrow') ? '40%' : '10%'}
                         </span>
                       </div>
                       <div className="w-full bg-blue-100 dark:bg-blue-900/50 h-1.5 rounded-full overflow-hidden">
                         <div 
                           className="bg-blue-500 h-full rounded-full transition-all duration-500"
                           style={{ width: order.eta.toLowerCase().includes('today') ? '80%' : order.eta.toLowerCase().includes('tomorrow') ? '40%' : '10%' }}
                         ></div>
                       </div>
                     </div>`;

code = code.replace(
  '<div className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-300">Expected: {order.eta}</div>',
  replacement
);

fs.writeFileSync('src/components/StaffDashboard.tsx', code);
