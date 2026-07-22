with open('src/components/StudentOptIn.tsx', 'r') as f:
    content = f.read()

import re
content = content.replace("import { \n  Calendar, Flame, AlertCircle,", "import ScrollAffordance from './ScrollAffordance';\nimport { \n  Calendar, Flame, AlertCircle,")

old_container = r'<div className="bg-white/80 backdrop-blur-md p-2 rounded-\[24px\] border border-gray-100 flex overflow-x-auto gap-2 no-scrollbar snap-x snap-mandatory touch-pan-x">'
new_container = r'<ScrollAffordance className="bg-white/80 backdrop-blur-md p-2 rounded-[24px] border border-gray-100 flex gap-2" fadeColorClass="from-white dark:from-[#121212]">'

content = re.sub(old_container, new_container, content)

# Need to replace the closing div
# The container closes right before `{/* Meal Selection Cards */}`
# So we can search for `</div>\n\n      {/* Meal Selection Cards */}`
content = content.replace("        </div>\n\n      {/* Meal Selection Cards */}", "        </ScrollAffordance>\n\n      {/* Meal Selection Cards */}")
content = content.replace("        </div>\n\n        {/* Meal Selection Cards */}", "        </ScrollAffordance>\n\n        {/* Meal Selection Cards */}")

with open('src/components/StudentOptIn.tsx', 'w') as f:
    f.write(content)
