import re

with open('src/components/StaffOps.tsx', 'r') as f:
    text = f.read()

# Make selects larger and add touch-manipulation
text = text.replace('className="w-full h-7 px-1.5', 'className="w-full h-10 px-3 py-2 touch-manipulation')
text = text.replace('className="w-1/2 h-7 px-1.5', 'className="w-1/2 h-10 px-3 py-2 touch-manipulation')
text = text.replace('className="text-xs font-bold bg-emerald-50', 'className="text-sm font-bold bg-emerald-50 touch-manipulation px-2 py-1')

with open('src/components/StaffOps.tsx', 'w') as f:
    f.write(text)

with open('src/components/StaffDashboard.tsx', 'r') as f:
    text = f.read()

text = text.replace('className="w-full bg-gray-50', 'className="w-full touch-manipulation min-h-[44px] bg-gray-50')

with open('src/components/StaffDashboard.tsx', 'w') as f:
    f.write(text)

