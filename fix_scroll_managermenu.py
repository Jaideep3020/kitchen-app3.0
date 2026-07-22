with open('src/components/ManagerMenu.tsx', 'r') as f:
    content = f.read()

import re
content = content.replace("import { \n  Plus, Trash2, Calendar", "import ScrollAffordance from './ScrollAffordance';\nimport { \n  Plus, Trash2, Calendar")

old_container = r'<div className="bg-white dark:bg-\[#121212\] p-1\.5 rounded-2xl border border-gray-100 dark:border-gray-800 flex overflow-x-auto gap-1 shadow-xs no-scrollbar snap-x snap-mandatory touch-pan-x">'
new_container = r'<ScrollAffordance className="bg-white dark:bg-[#121212] p-1.5 rounded-2xl border border-gray-100 dark:border-gray-800 flex gap-1 shadow-xs" fadeColorClass="from-white dark:from-[#121212]">'
content = re.sub(old_container, new_container, content)

content = re.sub(r'</div>\s*\{/\* Main Content Grid \*/\}', r'</ScrollAffordance>\n\n      {/* Main Content Grid */}', content)

with open('src/components/ManagerMenu.tsx', 'w') as f:
    f.write(content)
