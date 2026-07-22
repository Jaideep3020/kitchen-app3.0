with open('src/App.tsx', 'r') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if '<div className="flex items-center gap-2 sm:gap-4 order-2 md:order-3 ml-auto">' in line:
        # Check if the previous line is `   </div>`
        if '</div>' in lines[i-1]:
            lines.insert(i, ' )}\n')
            break

with open('src/App.tsx', 'w') as f:
    f.writelines(lines)
