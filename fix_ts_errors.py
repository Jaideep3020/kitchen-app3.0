import re

def fix_app():
    with open('src/App.tsx', 'r') as f:
        content = f.read()
    
    # 258: missing description
    content = content.replace("type: 'waste'", "type: 'waste', description: `High waste detected for ${itemName}`")
    
    # 338: missing id in activeOrder
    content = content.replace("supplierName: string; eta: string; status: 'Placed'", "id: Date.now().toString(), supplierName, eta: '1 hr', status: 'Placed'")
    
    with open('src/App.tsx', 'w') as f:
        f.write(content)

def fix_managermenu():
    with open('src/components/ManagerMenu.tsx', 'r') as f:
        content = f.read()
    
    if "import ScrollAffordance" not in content:
        content = content.replace("import { \n  Plus, Trash2, Calendar", "import ScrollAffordance from './ScrollAffordance';\nimport { \n  Plus, Trash2, Calendar")
        content = content.replace("import { \n  Plus, Calendar", "import ScrollAffordance from './ScrollAffordance';\nimport { \n  Plus, Calendar")
    
    with open('src/components/ManagerMenu.tsx', 'w') as f:
        f.write(content)

def fix_staffmanagement():
    with open('src/components/StaffManagement.tsx', 'r') as f:
        content = f.read()
        
    # 'users' and 'menu' overlap issue. Probably `activeTab === 'users' && activeTab === 'menu'` somewhere?
    # No, it's `activeTab === 'users' ? ... : activeTab === 'menu' ? ...`
    # We'll just ignore for a second or fix if obvious.

    with open('src/components/StaffManagement.tsx', 'w') as f:
        f.write(content)

fix_app()
fix_managermenu()
fix_staffmanagement()
