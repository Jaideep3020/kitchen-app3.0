with open('src/App.tsx', 'r') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "const activeOrder: ActiveOrder = {" in line:
        for j in range(i, i+5):
            if "supplierName," in lines[j] and "id: Date.now().toString()" not in lines[j]:
                lines[j] = lines[j].replace("supplierName,", "id: Date.now().toString(), supplierName,")

with open('src/App.tsx', 'w') as f:
    f.writelines(lines)
