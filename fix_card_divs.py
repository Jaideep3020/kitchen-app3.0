import re

with open('src/components/StaffDashboard.tsx', 'r') as f:
    text = f.read()

text = text.replace("""  <div 
    onClick={() => { triggerHaptic('medium'); setShowModal('diners'); }}
    className="bg-white dark:bg-[#121212] rounded-2xl p-2 sm:p-2.5 border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center text-center group hover:border-[#16321F]/20 hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all shadow-sm h-full cursor-pointer"
    title="Click to view breakdown for all meals today"
  >""", """  <Pressable 
    onClick={() => setShowModal('diners')}
    className="bg-white dark:bg-[#121212] rounded-2xl p-2 sm:p-2.5 border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center text-center group hover:border-[#16321F]/20 hover:shadow-md hover:scale-[1.02] transition-all shadow-sm h-full cursor-pointer outline-none focus:outline-none"
    title="Click to view breakdown for all meals today"
  >""")

# find the matching closing div for the Patrons Card.
# It ends with:
#     <div className="text-[8px] sm:text-[9px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100/50 dark:border-emerald-900/40 rounded-full px-1.5 py-0.5 font-bold whitespace-nowrap">
#       {studentActiveShiftRSVP ? `+1 Yours Active` : `+12 RSVP'd`}
#     </div>
#   </div>
#   </ErrorBoundary>

old_close = """    <div className="text-[8px] sm:text-[9px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100/50 dark:border-emerald-900/40 rounded-full px-1.5 py-0.5 font-bold whitespace-nowrap">
      {studentActiveShiftRSVP ? `+1 Yours Active` : `+12 RSVP'd`}
    </div>
  </div>
  </ErrorBoundary>"""

new_close = """    <div className="text-[8px] sm:text-[9px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100/50 dark:border-emerald-900/40 rounded-full px-1.5 py-0.5 font-bold whitespace-nowrap">
      {studentActiveShiftRSVP ? `+1 Yours Active` : `+12 RSVP'd`}
    </div>
  </Pressable>
  </ErrorBoundary>"""

text = text.replace(old_close, new_close)

with open('src/components/StaffDashboard.tsx', 'w') as f:
    f.write(text)

