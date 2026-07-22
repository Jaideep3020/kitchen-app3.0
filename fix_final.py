with open('src/App.tsx', 'r') as f:
    content = f.read()

import re

# We want to replace from `{staffTab === 'reports' && (` up to `      <nav className="fixed bottom-0`
pattern = r"\{staffTab === 'reports' && \(\s*<nav className=\"fixed bottom-0"

replacement = """{staffTab === 'reports' && (
   <StaffReports efficiencyRecords={INITIAL_EFFICIENCY_RECORDS} optInCount={optInCount} prepItems={prepItems} suppliers={suppliers} activityLogs={activityLogs} isDarkMode={isDarkMode} />
 )}
 {staffTab === 'launch' && (
   <StaffLaunchHub />
 )}
 {staffTab === 'management' && (
   <StaffManagement />
 )}
 {staffTab === 'menu-builder' && (
   <ManagerMenu />
 )}
 </ErrorBoundary>
 </motion.div>
 </AnimatePresence>
 )}
 </main>
 <nav className="fixed bottom-0"""

content = re.sub(pattern, replacement, content)

with open('src/App.tsx', 'w') as f:
    f.write(content)
