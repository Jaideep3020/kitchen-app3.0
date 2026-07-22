import re

with open('src/App.tsx', 'r') as f:
    text = f.read()

# 1. Import Lock, Unlock
if 'Shield, Lock, Unlock' not in text:
    text = text.replace('Shield\n} from \'lucide-react\';', 'Shield, Lock, Unlock\n} from \'lucide-react\';')

# 2. Extract sharedConfig from useData
if 'sharedConfig, updateSharedConfig' not in text:
    text = text.replace(
        'currentUserEmail, setCurrentUserEmail\n  } = useData();',
        'currentUserEmail, setCurrentUserEmail,\n    sharedConfig, updateSharedConfig\n  } = useData();'
    )

old_div = """ {/* Interactive Brand Logo - Top Left */}
 <div
    className="pointer-events-auto bg-white/95 dark:bg-[#121212]/95 backdrop-blur-md px-2 py-2 sm:px-3 sm:py-2 rounded-full border border-gray-200 dark:border-gray-800 shadow-sm flex md:hidden items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-all group shrink-0"
 >
   <div className="w-8 h-8 rounded-full bg-[#16321F] dark:bg-[#D9E96B] text-[#D9E96B] dark:text-[#16321F] flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
     <ChefHat className="w-4 h-4" />
   </div>
   <span className="font-extrabold font-display text-gray-900 dark:text-white tracking-tight hidden sm:block">Kitchen Ops</span>
 </div>"""

new_div = """ {/* Interactive Brand Logo - Top Left */}
 <div className="flex items-center gap-2 pointer-events-auto shrink-0">
 <div
    className="bg-white/95 dark:bg-[#121212]/95 backdrop-blur-md px-2 py-2 sm:px-3 sm:py-2 rounded-full border border-gray-200 dark:border-gray-800 shadow-sm flex md:hidden items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-all group shrink-0"
 >
   <div className="w-8 h-8 rounded-full bg-[#16321F] dark:bg-[#D9E96B] text-[#D9E96B] dark:text-[#16321F] flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
     <ChefHat className="w-4 h-4" />
   </div>
   <span className="font-extrabold font-display text-gray-900 dark:text-white tracking-tight hidden sm:block">Kitchen Ops</span>
 </div>
 
 {/* Mini RSVP Toggle */}
 {role === 'staff' && (
   <button
     onClick={async () => {
       import('./lib/haptics').then(m => m.triggerHaptic('medium'));
       const nextExempted = !sharedConfig?.config?.cutoffExempted;
       const nextConfig = { ...sharedConfig?.config, cutoffExempted: nextExempted };
       const success = await updateSharedConfig(nextConfig, 'admin');
     }}
     className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-sm transition-all text-[10px] font-bold h-9 ${
       sharedConfig?.config?.cutoffExempted 
         ? 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-900/50 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60' 
         : 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-900/50 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/60'
     }`}
     title="Toggle RSVP Cutoff"
   >
     {sharedConfig?.config?.cutoffExempted ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
     <span className="hidden sm:inline whitespace-nowrap">{sharedConfig?.config?.cutoffExempted ? 'RSVP Closed' : 'RSVP Open'}</span>
   </button>
 )}
 </div>"""

text = text.replace(old_div, new_div)

with open('src/App.tsx', 'w') as f:
    f.write(text)
