with open('src/components/StaffManagement.tsx', 'r') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "Menu Builder" in line:
        # The button closes shortly after.
        for j in range(i, i+5):
            if "</button>" in lines[j]:
                lines[j+1] = "        </ScrollAffordance>\n"
                break
        break

with open('src/components/StaffManagement.tsx', 'w') as f:
    f.writelines(lines)
