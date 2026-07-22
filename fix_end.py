import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace('onActiveDayChange={setSelectedDay}\n />\n {studentTab === \'checkin\'', 'onActiveDayChange={setSelectedDay}\n />\n )}\n {studentTab === \'checkin\'')
content = content.replace('onLogPlateWaste={handleStudentPlateWasteLog}\n />\n {studentTab === \'profile\'', 'onLogPlateWaste={handleStudentPlateWasteLog}\n />\n )}\n {studentTab === \'profile\'')

# Profile:
#  <StudentProfile onSignOut={handleSignOut} optInCount={optInCount}
#  <StudentProfile ... />
#  </motion.div>
content = content.replace(' />\n </ErrorBoundary>\n </motion.div>\n </AnimatePresence>', ' />\n )}\n </ErrorBoundary>\n </motion.div>\n </AnimatePresence>')
# wait, for student it's StudentProfile

with open('src/App.tsx', 'w') as f:
    f.write(content)
