const fs = require('fs');
let code = fs.readFileSync('src/components/StaffStock.tsx', 'utf8');

const replacement = `<div className="mt-2 pt-2 border-t border-gray-50 dark:border-gray-800/50 flex justify-between items-center">
                         <span className="text-[10px] text-gray-400">PO #{order.id.split('_')[1] || order.id}</span>
                         <span className="text-xs font-black text-gray-900 dark:text-white">$\${order.price?.toLocaleString() || 0}</span>
                       </div>
                       {(order.status === 'Placed' || order.status === 'In Transit') && (
                         <div className="mt-2">
                           <div className="flex justify-between items-center mb-1 text-[10px]">
                             <span className="font-bold text-gray-500 uppercase tracking-wider">{order.eta}</span>
                             <span className="font-bold text-gray-900 dark:text-white">
                               {order.eta.toLowerCase().includes('today') ? '80%' : 
                                order.eta.toLowerCase().includes('tomorrow') ? '40%' : '10%'}
                             </span>
                           </div>
                           <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                             <div 
                               className="bg-blue-500 h-full rounded-full transition-all duration-500"
                               style={{ width: order.eta.toLowerCase().includes('today') ? '80%' : order.eta.toLowerCase().includes('tomorrow') ? '40%' : '10%' }}
                             ></div>
                           </div>
                         </div>
                       )}`;

code = code.replace(
  /<div className="mt-2 pt-2 border-t border-gray-50 dark:border-gray-800\/50 flex justify-between items-center">\s*<span className="text-\[10px\] text-gray-400">PO #\{order\.id\.split\('_'\)\[1\] \|\| order\.id\}<\/span>\s*<span className="text-xs font-black text-gray-900 dark:text-white">\$?\$\{order\.price\?\.toLocaleString\(\) \|\| 0\}<\/span>\s*<\/div>/g,
  replacement
);

fs.writeFileSync('src/components/StaffStock.tsx', code);
