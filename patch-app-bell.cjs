const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  /\{role === 'staff' && \(\n     <div className="relative">\n       <button \n         type="button"\n         onClick=\{\(\) => \{ triggerHaptic\('light'\); setShowNotifications\(true\); \}\}\n         className="w-9 h-9 rounded-full text-white hover:bg-white\/10 flex items-center justify-center transition-colors relative"\n         title="Notifications"\n       >\n         <Bell className="w-5 h-5" \/>\n         \{lowStockCount > 0 && \(\n           <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-\[#16321F\] dark:border-\[#1a1a1a\]"><\/span>\n         \)\}\n       <\/button>\n     <\/div>\n   \)\}/g,
  `{role === 'staff' || role === 'student' ? (
     <div className="relative">
       <button 
         type="button"
         onClick={() => { triggerHaptic('light'); setShowNotifications(true); }}
         className="w-9 h-9 rounded-full text-white hover:bg-white/10 flex items-center justify-center transition-colors relative"
         title="Notifications"
       >
         <Bell className="w-5 h-5" />
         {(role === 'staff' && lowStockCount > 0) || (role === 'student') ? (
           <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#16321F] dark:border-[#1a1a1a]"></span>
         ) : null}
       </button>
     </div>
   ) : null}`
);

content = content.replace(
  /<NotificationInbox \n        isOpen=\{showNotifications\}/,
  '<NotificationInbox \n        role={role}\n        isOpen={showNotifications}'
);

fs.writeFileSync('src/App.tsx', content);
