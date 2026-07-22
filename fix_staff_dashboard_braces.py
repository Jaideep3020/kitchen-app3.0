import re

with open('src/components/StaffDashboard.tsx', 'r') as f:
    content = f.read()

# I see `)}` at line 400ish, which might be left over from removing `Daily Analysis Card`
# Let's see the context. The parent component is returning a JSX tree.

# Let's remove the `)}`
content = content.replace(" </div>\n   )}\n </div>", " </div>\n </div>")

with open('src/components/StaffDashboard.tsx', 'w') as f:
    f.write(content)
