with open('src/App.tsx', 'r') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "type: 'waste', description:" in line:
        # Check if the previous line has "description:"
        if "description:" in lines[i-1]:
            lines[i] = line.replace(", description: `High waste detected for ${itemName}`", "")

with open('src/App.tsx', 'w') as f:
    f.writelines(lines)
