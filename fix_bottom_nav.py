with open('src/App.tsx', 'r') as f:
    content = f.read()

import re

# Remove the menu-builder button from the mobile bottom nav
pattern = r'<button[^>]*onClick=\{\(\) => \{ triggerHaptic\(\'light\'\); setStaffTab\(\'menu-builder\'\); \}\}.*?Menu</span>\s*</button>'
content = re.sub(pattern, '', content, flags=re.DOTALL)

with open('src/App.tsx', 'w') as f:
    f.write(content)
