sed -i '450,487c\
        <nav className="flex-1 px-4 py-6 flex flex-col gap-2 overflow-y-auto">\
          {role === '"'"'student'"'"' ? (\
            <>\
              <button onClick={() => { triggerHaptic('"'"'light'"'"'); setStudentTab('"'"'menu'"'"'); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${studentTab === '"'"'menu'"'"' ? '"'"'bg-[#16321F] text-[#D9E96B] dark:bg-[#D9E96B] dark:text-[#16321F] font-bold shadow-md'"'"' : '"'"'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'"'"'}`}>\
                <Utensils className="w-5 h-5" /> Weekly Menu\
              </button>\
              <button onClick={() => { triggerHaptic('"'"'light'"'"'); setStudentTab('"'"'checkin'"'"'); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${studentTab === '"'"'checkin'"'"' ? '"'"'bg-[#16321F] text-[#D9E96B] dark:bg-[#D9E96B] dark:text-[#16321F] font-bold shadow-md'"'"' : '"'"'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'"'"'}`}>\
                <Camera className="w-5 h-5" /> Scan & Check-in\
              </button>\
              <button onClick={() => { triggerHaptic('"'"'light'"'"'); setStudentTab('"'"'profile'"'"'); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${studentTab === '"'"'profile'"'"' ? '"'"'bg-[#16321F] text-[#D9E96B] dark:bg-[#D9E96B] dark:text-[#16321F] font-bold shadow-md'"'"' : '"'"'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'"'"'}`}>\
                <Users className="w-5 h-5" /> Profile\
              </button>\
            </>\
          ) : (\
            <>\
              <button onClick={() => { triggerHaptic('"'"'light'"'"'); setStaffTab('"'"'dashboard'"'"'); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${staffTab === '"'"'dashboard'"'"' ? '"'"'bg-[#16321F] text-[#D9E96B] dark:bg-[#D9E96B] dark:text-[#16321F] font-bold shadow-md'"'"' : '"'"'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'"'"'}`}>\
                <TrendingDown className="w-5 h-5" /> Ops Dashboard\
              </button>\
              <button onClick={() => { triggerHaptic('"'"'light'"'"'); setStaffTab('"'"'ops'"'"'); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${staffTab === '"'"'ops'"'"' ? '"'"'bg-[#16321F] text-[#D9E96B] dark:bg-[#D9E96B] dark:text-[#16321F] font-bold shadow-md'"'"' : '"'"'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'"'"'}`}>\
                <ChefHat className="w-5 h-5" /> Today'"'"'s Prep\
              </button>\
              <button onClick={() => { triggerHaptic('"'"'light'"'"'); setStaffTab('"'"'stock'"'"'); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all justify-between ${staffTab === '"'"'stock'"'"' ? '"'"'bg-[#16321F] text-[#D9E96B] dark:bg-[#D9E96B] dark:text-[#16321F] font-bold shadow-md'"'"' : '"'"'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'"'"'}`}>\
                <div className="flex items-center gap-3">\
                  <Package className="w-5 h-5" /> Stock\
                </div>\
                {lowStockCount > 0 && (\
                  <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black animate-pulse shadow-sm">\
                    {lowStockCount}\
                  </span>\
                )}\
              </button>\
              <button onClick={() => { triggerHaptic('"'"'light'"'"'); setStaffTab('"'"'reports'"'"'); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${staffTab === '"'"'reports'"'"' ? '"'"'bg-[#16321F] text-[#D9E96B] dark:bg-[#D9E96B] dark:text-[#16321F] font-bold shadow-md'"'"' : '"'"'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'"'"'}`}>\
                <ClipboardList className="w-5 h-5" /> Reports\
              </button>\
              <div className="my-2 border-t border-gray-100 dark:border-gray-800/50"></div>\
              <button onClick={() => { triggerHaptic('"'"'light'"'"'); setStaffTab('"'"'launch'"'"'); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${staffTab === '"'"'launch'"'"' ? '"'"'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 font-bold shadow-sm'"'"' : '"'"'text-amber-600/80 dark:text-amber-500/70 hover:bg-amber-50 dark:hover:bg-amber-900/20'"'"'}`}>\
                <Rocket className="w-5 h-5" /> Launch Campaign\
              </button>\
              {role === "manager" && (\
                <>\
                  <button onClick={() => { triggerHaptic('"'"'light'"'"'); setStaffTab('"'"'management'"'"'); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${staffTab === '"'"'management'"'"' ? '"'"'bg-[#16321F] text-[#D9E96B] dark:bg-[#D9E96B] dark:text-[#16321F] font-bold shadow-md'"'"' : '"'"'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'"'"'}`}>\
                    <Shield className="w-5 h-5" /> Admin Center\
                  </button>\
                  <button onClick={() => { triggerHaptic('"'"'light'"'"'); setStaffTab('"'"'menu-builder'"'"'); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${staffTab === '"'"'menu-builder'"'"' ? '"'"'bg-[#16321F] text-[#D9E96B] dark:bg-[#D9E96B] dark:text-[#16321F] font-bold shadow-md'"'"' : '"'"'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'"'"'}`}>\
                    <Utensils className="w-5 h-5" /> Menu Builder\
                  </button>\
                </>\
              )}\
            </>\
          )}\
        </nav>' src/App.tsx

sed -i '743,817c\
      <nav className="fixed bottom-0 w-full z-40 bg-white/95 dark:bg-[#121212]/95 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 shadow-sm flex justify-around items-center h-[calc(4rem+env(safe-area-inset-bottom))] pb-[env(safe-area-inset-bottom)] md:hidden">\
        {role === '"'"'student'"'"' ? (\
          <>\
            <button onClick={() => { triggerHaptic('"'"'light'"'"'); setStudentTab('"'"'menu'"'"'); }} className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all active:scale-90`}>\
              <div className={`p-1.5 rounded-full transition-all ${studentTab === '"'"'menu'"'"' ? '"'"'bg-[#16321F]/10 dark:bg-[#D9E96B]/10 text-[#16321F] dark:text-[#D9E96B]'"'"' : '"'"'text-gray-400 dark:text-gray-600'"'"'}`}>\
                <Utensils className="w-5 h-5" />\
              </div>\
              <span className={`text-xs mt-0.5 ${studentTab === '"'"'menu'"'"' ? '"'"'font-bold text-[#16321F] dark:text-[#D9E96B]'"'"' : '"'"'font-medium text-gray-500'"'"'}`}>Menu</span>\
            </button>\
            <button onClick={() => { triggerHaptic('"'"'light'"'"'); setStudentTab('"'"'checkin'"'"'); }} className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all active:scale-90`}>\
              <div className={`p-1.5 rounded-full transition-all ${studentTab === '"'"'checkin'"'"' ? '"'"'bg-[#16321F]/10 dark:bg-[#D9E96B]/10 text-[#16321F] dark:text-[#D9E96B]'"'"' : '"'"'text-gray-400 dark:text-gray-600'"'"'}`}>\
                <ClipboardList className="w-5 h-5" />\
              </div>\
              <span className={`text-xs mt-0.5 ${studentTab === '"'"'checkin'"'"' ? '"'"'font-bold text-[#16321F] dark:text-[#D9E96B]'"'"' : '"'"'font-medium text-gray-500'"'"'}`}>Check-in</span>\
            </button>\
            <button onClick={() => { triggerHaptic('"'"'light'"'"'); setStudentTab('"'"'profile'"'"'); }} className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all active:scale-90`}>\
              <div className={`p-1.5 rounded-full transition-all ${studentTab === '"'"'profile'"'"' ? '"'"'bg-[#16321F]/10 dark:bg-[#D9E96B]/10 text-[#16321F] dark:text-[#D9E96B]'"'"' : '"'"'text-gray-400 dark:text-gray-600'"'"'}`}>\
                <User className="w-5 h-5" />\
              </div>\
              <span className={`text-xs mt-0.5 ${studentTab === '"'"'profile'"'"' ? '"'"'font-bold text-[#16321F] dark:text-[#D9E96B]'"'"' : '"'"'font-medium text-gray-500'"'"'}`}>Profile</span>\
            </button>\
          </>\
        ) : (\
          <>\
            <button onClick={() => { triggerHaptic('"'"'light'"'"'); setStaffTab('"'"'dashboard'"'"'); }} className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all active:scale-90`}>\
              <div className={`p-1.5 rounded-full transition-all ${staffTab === '"'"'dashboard'"'"' ? '"'"'bg-[#16321F]/10 dark:bg-[#D9E96B]/10 text-[#16321F] dark:text-[#D9E96B]'"'"' : '"'"'text-gray-400 dark:text-gray-600'"'"'}`}>\
                <Users className="w-5 h-5" />\
              </div>\
              <span className={`text-xs mt-0.5 ${staffTab === '"'"'dashboard'"'"' ? '"'"'font-bold text-[#16321F] dark:text-[#D9E96B]'"'"' : '"'"'font-medium text-gray-500'"'"'}`}>Ops</span>\
            </button>\
            <button onClick={() => { triggerHaptic('"'"'light'"'"'); setStaffTab('"'"'ops'"'"'); }} className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all active:scale-90`}>\
              <div className={`p-1.5 rounded-full transition-all ${staffTab === '"'"'ops'"'"' ? '"'"'bg-[#16321F]/10 dark:bg-[#D9E96B]/10 text-[#16321F] dark:text-[#D9E96B]'"'"' : '"'"'text-gray-400 dark:text-gray-600'"'"'}`}>\
                <ChefHat className="w-5 h-5" />\
              </div>\
              <span className={`text-xs mt-0.5 ${staffTab === '"'"'ops'"'"' ? '"'"'font-bold text-[#16321F] dark:text-[#D9E96B]'"'"' : '"'"'font-medium text-gray-500'"'"'}`}>Prep</span>\
            </button>\
            <button onClick={() => { triggerHaptic('"'"'light'"'"'); setStaffTab('"'"'stock'"'"'); }} className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all active:scale-90 relative`}>\
              <div className={`p-1.5 rounded-full transition-all relative ${staffTab === '"'"'stock'"'"' ? '"'"'bg-[#16321F]/10 dark:bg-[#D9E96B]/10 text-[#16321F] dark:text-[#D9E96B]'"'"' : '"'"'text-gray-400 dark:text-gray-600'"'"'}`}>\
                <Package className="w-5 h-5" />\
                {lowStockCount > 0 && (\
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-[#0A170E] animate-pulse"></div>\
                )}\
              </div>\
              <span className={`text-xs mt-0.5 ${staffTab === '"'"'stock'"'"' ? '"'"'font-bold text-[#16321F] dark:text-[#D9E96B]'"'"' : '"'"'font-medium text-gray-500'"'"'}`}>Stock</span>\
            </button>\
            <button onClick={() => { triggerHaptic('"'"'light'"'"'); setStaffTab('"'"'reports'"'"'); }} className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all active:scale-90`}>\
              <div className={`p-1.5 rounded-full transition-all ${staffTab === '"'"'reports'"'"' ? '"'"'bg-[#16321F]/10 dark:bg-[#D9E96B]/10 text-[#16321F] dark:text-[#D9E96B]'"'"' : '"'"'text-gray-400 dark:text-gray-600'"'"'}`}>\
                <BarChart2 className="w-5 h-5" />\
              </div>\
              <span className={`text-xs mt-0.5 ${staffTab === '"'"'reports'"'"' ? '"'"'font-bold text-[#16321F] dark:text-[#D9E96B]'"'"' : '"'"'font-medium text-gray-500'"'"'}`}>Reports</span>\
            </button>\
            <button onClick={() => { triggerHaptic('"'"'light'"'"'); setStaffTab('"'"'launch'"'"'); }} className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all active:scale-90`}>\
              <div className={`p-1.5 rounded-full transition-all ${staffTab === '"'"'launch'"'"' ? '"'"'bg-amber-100 text-amber-600'"'"' : '"'"'text-[#D9E96B]/80'"'"'}`}>\
                <Rocket className={`w-5 h-5 ${staffTab === '"'"'launch'"'"' ? '"'"'animate-pulse'"'"' : '"'"''"'"'}`} />\
              </div>\
              <span className={`text-xs mt-0.5 ${staffTab === '"'"'launch'"'"' ? '"'"'font-bold text-amber-600'"'"' : '"'"'font-medium text-gray-500'"'"'}`}>Launch</span>\
            </button>\
            {role === "manager" && (\
              <>\
                <button onClick={() => { triggerHaptic('"'"'light'"'"'); setStaffTab('"'"'management'"'"'); }} className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all active:scale-90`}>\
                  <div className={`p-1.5 rounded-full transition-all ${staffTab === "management" ? "bg-[#16321F]/10 dark:bg-[#D9E96B]/10 text-[#16321F] dark:text-[#D9E96B]" : "text-gray-400 dark:text-gray-600"}`}>\
                    <Shield className="w-5 h-5" />\
                  </div>\
                  <span className={`text-xs mt-0.5 ${staffTab === "management" ? "font-bold text-[#16321F] dark:text-[#D9E96B]" : "font-medium text-gray-500"}`}>Admin Center</span>\
                </button>\
                <button onClick={() => { triggerHaptic('"'"'light'"'"'); setStaffTab('"'"'menu-builder'"'"'); }} className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all active:scale-90`}>\
                  <div className={`p-1.5 rounded-full transition-all ${staffTab === "menu-builder" ? "bg-[#16321F]/10 dark:bg-[#D9E96B]/10 text-[#16321F] dark:text-[#D9E96B]" : "text-gray-400 dark:text-gray-600"}`}>\
                    <Utensils className="w-5 h-5" />\
                  </div>\
                  <span className={`text-xs mt-0.5 ${staffTab === "menu-builder" ? "font-bold text-[#16321F] dark:text-[#D9E96B]" : "font-medium text-gray-500"}`}>Menu</span>\
                </button>\
              </>\
            )}\
          </>\
        )}\
      </nav>' src/App.tsx
