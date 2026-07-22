with open('src/App.tsx', 'r') as f:
    content = f.read()

import re
# Fix active order
content = re.sub(r'const activeOrder: ActiveOrder = {\s*supplierName,\s*eta: [^,]+,\s*status: \'Placed\'\s*};', r'const activeOrder: ActiveOrder = { id: Date.now().toString(), supplierName, eta: "1 hr", status: "Placed" };', content)

with open('src/App.tsx', 'w') as f:
    f.write(content)

with open('src/components/ManagerMenu.tsx', 'r') as f:
    content = f.read()

if "import ScrollAffordance" not in content:
    content = "import ScrollAffordance from './ScrollAffordance';\n" + content

with open('src/components/ManagerMenu.tsx', 'w') as f:
    f.write(content)
