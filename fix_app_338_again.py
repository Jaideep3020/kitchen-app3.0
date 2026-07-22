import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = re.sub(r'const newOrder: ActiveOrder = {\s*supplierName,\s*eta:', r'const newOrder: ActiveOrder = { id: Date.now().toString(), supplierName, eta:', content)

with open('src/App.tsx', 'w') as f:
    f.write(content)
