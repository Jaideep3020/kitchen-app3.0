with open('src/components/StaffDashboard.tsx', 'r') as f:
    content = f.read()

import re

# Remove the block:
#  {/* Skeleton Analysis Card */}
# ...

pattern = re.compile(r'\s*\{/\*\s*Skeleton Analysis Card\s*\*/\}.*?(?=</div>\s*</div>)', re.DOTALL)
# wait, it's inside a div. Let's just remove the specific block.
pattern2 = r'\s*\{/\*\s*Skeleton Analysis Card\s*\*/\}\s*<div className="bg-white dark:bg-\[#121212\] rounded-2xl p-5 border border-gray-100 dark:border-gray-700 col-span-full animate-skeleton-pulse">.*?</div>\s*</div>'
content = re.sub(pattern2, '', content, flags=re.DOTALL)

with open('src/components/StaffDashboard.tsx', 'w') as f:
    f.write(content)

