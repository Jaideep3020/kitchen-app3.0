with open('src/components/ManagerMenu.tsx', 'r') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "</div>" in line and "grid grid-cols-1 lg:grid-cols-3" in lines[min(i+2, len(lines)-1)]:
        lines[i] = line.replace("</div>", "</ScrollAffordance>")
        break

with open('src/components/ManagerMenu.tsx', 'w') as f:
    f.writelines(lines)
