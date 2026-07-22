import re

with open('src/components/StaffDashboard.tsx', 'r') as f:
    text = f.read()

text = text.replace("updateSharedConfig,", "")

with open('src/components/StaffDashboard.tsx', 'w') as f:
    f.write(text)
