with open('src/components/StaffDashboard.tsx', 'r') as f:
    content = f.read()

import re

# Remove the block:
#  {/* Daily Analysis Card */}
# ...
#    </ErrorBoundary>
#  </div>

pattern = re.compile(r'\s*\{/\*\s*Daily Analysis Card\s*\*/\}.*?</ErrorBoundary>\s*</div>', re.DOTALL)
content = re.sub(pattern, '', content)

with open('src/components/StaffDashboard.tsx', 'w') as f:
    f.write(content)

