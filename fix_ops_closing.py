with open('src/components/StaffOps.tsx', 'r') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "</div>" in line and "categoryLabels" in lines[i-3]:
        lines[i] = line.replace("</div>", "</ScrollAffordance>")
        break

with open('src/components/StaffOps.tsx', 'w') as f:
    f.writelines(lines)
