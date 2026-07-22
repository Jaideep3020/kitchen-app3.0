import re

with open('src/components/StaffDashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace(" </div>\n </div>\n\n  {/* Live Student", " </div>\n\n  {/* Live Student")

with open('src/components/StaffDashboard.tsx', 'w') as f:
    f.write(content)
