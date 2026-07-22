import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Replace the broken nav block
pattern = r'<nav className="flex-1 px-4 py-6 flex flex-col gap-2 overflow-y-auto">.*?</nav>'
replacement = """<nav className="flex-1 px-4 py-6 flex flex-col gap-2 overflow-y-auto">
          {role === 'student' ? (
            <>
              <button onClick={() => { triggerHaptic('light'); setStudentTab('menu'); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${studentTab === 'menu' ? 'bg-[#16321F] text-[#D9E96B] dark:bg-[#D9E96B] dark:text-[#16321F] font-bold shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                <Utensils className="w-5 h-5" /> Weekly Menu
              </button>
              <button onClick={() => { triggerHaptic('light'); setStudentTab('checkin'); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${studentTab === 'checkin' ? 'bg-[#16321F] text-[#D9E96B] dark:bg-[#D9E96B] dark:text-[#16321F] font-bold shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                <Camera className="w-5 h-5" /> Scan & Check-in
              </button>
              <button onClick={() => { triggerHaptic('light'); setStudentTab('profile'); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${studentTab === 'profile' ? 'bg-[#16321F] text-[#D9E96B] dark:bg-[#D9E96B] dark:text-[#16321F] font-bold shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                <Users className="w-5 h-5" /> Profile
              </button>
            </>
          ) : (
            <>
              <button onClick={() => { triggerHaptic('light'); setStaffTab('dashboard'); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${staffTab === 'dashboard' ? 'bg-[#16321F] text-[#D9E96B] dark:bg-[#D9E96B] dark:text-[#16321F] font-bold shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                <TrendingDown className="w-5 h-5" /> Ops Dashboard
              </button>
              <button onClick={() => { triggerHaptic('light'); setStaffTab('ops'); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${staffTab === 'ops' ? 'bg-[#16321F] text-[#D9E96B] dark:bg-[#D9E96B] dark:text-[#16321F] font-bold shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                <ChefHat className="w-5 h-5" /> Today's Prep
              </button>
              <button onClick={() => { triggerHaptic('light'); setStaffTab('stock'); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all justify-between ${staffTab === 'stock' ? 'bg-[#16321F] text-[#D9E96B] dark:bg-[#D9E96B] dark:text-[#16321F] font-bold shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5" /> Stock
                </div>
                {lowStockCount > 0 && (
                  <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black animate-pulse shadow-sm">
                    {lowStockCount}
                  </span>
                )}
              </button>
              <button onClick={() => { triggerHaptic('light'); setStaffTab('reports'); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${staffTab === 'reports' ? 'bg-[#16321F] text-[#D9E96B] dark:bg-[#D9E96B] dark:text-[#16321F] font-bold shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                <ClipboardList className="w-5 h-5" /> Reports
              </button>
              <div className="my-2 border-t border-gray-100 dark:border-gray-800/50"></div>
              <button onClick={() => { triggerHaptic('light'); setStaffTab('launch'); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${staffTab === 'launch' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 font-bold shadow-sm' : 'text-amber-600/80 dark:text-amber-500/70 hover:bg-amber-50 dark:hover:bg-amber-900/20'}`}>
                <Rocket className="w-5 h-5" /> Launch Campaign
              </button>
              {role === "manager" && (
                <>
                  <button onClick={() => { triggerHaptic('light'); setStaffTab('management'); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${staffTab === 'management' ? 'bg-[#16321F] text-[#D9E96B] dark:bg-[#D9E96B] dark:text-[#16321F] font-bold shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                    <Shield className="w-5 h-5" /> Admin Center
                  </button>
                </>
              )}
            </>
          )}
        </nav>"""

content = re.sub(pattern, replacement, content, flags=re.DOTALL)

# Let's also fix the missing )} from the end of the content area.
# In App.tsx, the AnimatePresence block for staffTabs:
#       {staffTab === "menu-builder" && (
#         <ManagerMenu />
#       )}
# Wait, I deleted ALL `)}` lines!
