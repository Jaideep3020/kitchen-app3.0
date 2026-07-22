with open('src/components/StaffOps.tsx', 'r') as f:
    content = f.read()

import re
content = content.replace("import { motion, AnimatePresence } from 'motion/react';", "import { motion, AnimatePresence } from 'motion/react';\nimport ScrollAffordance from './ScrollAffordance';")

old_container = r'<div className="flex overflow-x-auto gap-1\.5 pb-2 border-b border-gray-100 dark:border-gray-800 no-scrollbar snap-x snap-mandatory touch-pan-x">'
new_container = r'<ScrollAffordance className="flex gap-1.5 pb-2 border-b border-gray-100 dark:border-gray-800" fadeColorClass="from-white dark:from-[#121212]">'
content = re.sub(old_container, new_container, content)

content = re.sub(r'</button>\s*</div>\s*\{/\* Stats Row \*/\}', r'</button>\n          </ScrollAffordance>\n\n          {/* Stats Row */}', content)

with open('src/components/StaffOps.tsx', 'w') as f:
    f.write(content)
