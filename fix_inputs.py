import re

with open('src/components/StaffOps.tsx', 'r') as f:
    text = f.read()

# Make inputs larger and add touch-manipulation
text = text.replace('className="w-1/2 h-7 px-1.5 border', 'className="w-1/2 h-10 px-3 py-2 touch-manipulation border')

with open('src/components/StaffOps.tsx', 'w') as f:
    f.write(text)

