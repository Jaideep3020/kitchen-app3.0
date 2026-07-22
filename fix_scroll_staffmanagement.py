with open('src/components/StaffManagement.tsx', 'r') as f:
    content = f.read()

import re
content = content.replace("import ManagerMenu from './ManagerMenu';", "import ManagerMenu from './ManagerMenu';\nimport ScrollAffordance from './ScrollAffordance';")

old_container = r'<div className="flex p-1 bg-gray-100 dark:bg-\[#1a1a1a\] rounded-xl self-start overflow-x-auto max-w-full no-scrollbar">'
new_container = r'<ScrollAffordance className="flex p-1 bg-gray-100 dark:bg-[#1a1a1a] rounded-xl self-start max-w-full" fadeColorClass="from-gray-100 dark:from-[#1a1a1a]">'
content = re.sub(old_container, new_container, content)

# The end of that div is right before `<div className="mt-2">` or `<AnimatePresence mode="wait">`
# Let's search for `</button>\n        </div>` -> `</button>\n        </ScrollAffordance>`
content = re.sub(r'</button>\s*</div>\s*<AnimatePresence mode="wait">', r'</button>\n        </ScrollAffordance>\n\n      <AnimatePresence mode="wait">', content)

with open('src/components/StaffManagement.tsx', 'w') as f:
    f.write(content)
