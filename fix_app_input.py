with open('src/App.tsx', 'r') as f:
    content = f.read()

import re
old_input = """     <input
       type="text"
       value={globalSearchQuery}
       placeholder="Search inventory, suppliers, or past orders..."
       className="w-full h-10 md:h-11 bg-white/95 dark:bg-[#121212]/95 backdrop-blur-md rounded-full border border-gray-200 dark:border-gray-800 pl-10 pr-4 text-sm focus:outline-none focus:border-[#16321F] dark:focus:border-[#D9E96B] focus:ring-1 focus:ring-[#16321F] dark:focus:ring-[#D9E96B] shadow-sm transition-all text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
     />"""

new_input = """     <input
       type="text"
       value={globalSearchQuery}
       onChange={(e) => setGlobalSearchQuery(e.target.value)}
       placeholder="Search inventory, suppliers, or past orders..."
       className="w-full h-10 md:h-11 bg-white/95 dark:bg-[#121212]/95 backdrop-blur-md rounded-full border border-gray-200 dark:border-gray-800 pl-10 pr-4 text-sm focus:outline-none focus:border-[#16321F] dark:focus:border-[#D9E96B] focus:ring-1 focus:ring-[#16321F] dark:focus:ring-[#D9E96B] shadow-sm transition-all text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
     />"""

content = content.replace(old_input, new_input)

with open('src/App.tsx', 'w') as f:
    f.write(content)
