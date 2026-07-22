import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace("<StaffReports efficiencyRecords={INITIAL_EFFICIENCY_RECORDS} optInCount={optInCount} prepItems={prepItems} suppliers={suppliers} activityLogs={activityLogs} isDarkMode={isDarkMode} />\n {staffTab === 'launch'", "<StaffReports efficiencyRecords={INITIAL_EFFICIENCY_RECORDS} optInCount={optInCount} prepItems={prepItems} suppliers={suppliers} activityLogs={activityLogs} isDarkMode={isDarkMode} />\n )}\n {staffTab === 'launch'")
content = content.replace("<StaffLaunchHub />\n {staffTab === \"management\"", "<StaffLaunchHub />\n )}\n {staffTab === \"management\"")
content = content.replace("<StaffManagement />\n  {staffTab === \"menu-builder\"", "<StaffManagement />\n )}\n  {staffTab === \"menu-builder\"")
content = content.replace("<ManagerMenu />\n\n </ErrorBoundary>", "<ManagerMenu />\n )}\n\n </ErrorBoundary>")

# Also the one before StaffReports
# Let's check StaffStock
content = content.replace("initialDraftPO={initialDraftPO}\n />\n {staffTab === 'reports'", "initialDraftPO={initialDraftPO}\n />\n )}\n {staffTab === 'reports'")

with open('src/App.tsx', 'w') as f:
    f.write(content)
