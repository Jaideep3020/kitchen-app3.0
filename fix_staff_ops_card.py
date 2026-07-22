with open('src/components/StaffOps.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

import re

# Fix Portions Row
find_str = """<div className="flex justify-between items-center text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-400 font-mono">
 <span>Portions:</span>
 <div className="flex items-center gap-1.5"><button type="button" onClick={() => { triggerHaptic('success'); setPrepPortions(prev => ({ ...prev, [portionKey]: mealOptIns[portionKey] || 150 })); addToast(`Synced portions for ${dish.name} to live opt-ins! 🚀`, 'success'); }} className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100/30 dark:border-emerald-900/40 rounded-lg px-2 py-0.5 hover:scale-105 transition-all flex items-center gap-1 cursor-pointer" title="Click to sync prep portions with live student opt-ins">Sync Opt-ins: {mealOptIns[portionKey] || 150}</button><span className="text-[#16321F] dark:text-[#D9E96B] font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-xl">{currentPortions} pax</span></div>
 </div>"""

replace_str = """<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 font-mono mb-1">
 <span>Portions:</span>
 <div className="flex items-center justify-between gap-1.5"><button type="button" onClick={() => { triggerHaptic('success'); setPrepPortions(prev => ({ ...prev, [portionKey]: mealOptIns[portionKey] || 150 })); addToast(`Synced portions for ${dish.name} to live opt-ins! 🚀`, 'success'); }} className="text-[10px] whitespace-nowrap font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100/30 dark:border-emerald-900/40 rounded-lg px-2 py-0.5 hover:scale-105 transition-all flex items-center gap-1 cursor-pointer" title="Click to sync prep portions with live student opt-ins">Sync Opt-ins: {mealOptIns[portionKey] || 150}</button><span className="text-[10px] whitespace-nowrap text-[#16321F] dark:text-[#D9E96B] font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-lg">{currentPortions} pax</span></div>
 </div>"""

content = content.replace(find_str, replace_str)

# Fix Est. Prepared Vol
find_str2 = """<div className="flex justify-between items-center text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-400 font-mono">
 <span className="flex items-center gap-1.5">
 Est. Prepared Vol:
 </span>"""

replace_str2 = """<div className="flex flex-wrap justify-between items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 font-mono">
 <span className="flex items-center gap-1.5 whitespace-nowrap">
 Est. Prepared Vol:
 </span>"""

content = content.replace(find_str2, replace_str2)

# Fix Actual Qty Cooked
find_str3 = """<div className="flex justify-between items-center text-xs font-medium text-gray-500 font-mono">
           <span>Actual Qty Cooked:</span>
         </div>"""

replace_str3 = """<div className="flex justify-between items-center text-xs font-medium text-gray-500 font-mono">
           <span className="whitespace-nowrap">Actual Qty Cooked:</span>
         </div>"""

content = content.replace(find_str3, replace_str3)

with open('src/components/StaffOps.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

