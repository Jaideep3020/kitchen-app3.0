import re

with open('src/components/StaffDashboard.tsx', 'r') as f:
    lines = f.readlines()

in_pressable = False
pressable_depth = 0

for i, line in enumerate(lines):
    if '<Pressable' in line and 'onClick={() => { setShowModal(' in line and 'className="bg-white' in lines[i+1]:
        in_pressable = True
        pressable_depth = 1
    elif '<Pressable' in line and 'onClick={() => { if (onNavigate)' in line:
        in_pressable = True
        pressable_depth = 1
        
    if in_pressable:
        if '<div' in line:
            pressable_depth += line.count('<div')
        if '</div>' in line:
            pressable_depth -= line.count('</div>')
            if pressable_depth == 0:
                lines[i] = line.replace('</div>', '</Pressable>')
                in_pressable = False

with open('src/components/StaffDashboard.tsx', 'w') as f:
    f.writelines(lines)

