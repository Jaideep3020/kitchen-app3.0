with open('src/App.tsx', 'r') as f:
    content = f.read()

import re
# We need to add `id: Date.now().toString(),` to the new activity logs or similar where it's missing.
# Let's just fix the TS errors dynamically or with sed.
content = re.sub(r'(\{\s*title:\s*[^,]+,\s*timeAgo:\s*[^,]+,)', r'{ id: Date.now().toString(), \1', content)
content = re.sub(r'(\{\s*supplierName:\s*[^,]+,\s*eta:\s*[^,]+,\s*status:\s*[^,]+)', r'{ id: Date.now().toString(), \1', content)

# Cannot find name 'alertId' -> Date.now().toString()
content = content.replace("id: alertId,", "id: Date.now().toString(),")
content = content.replace("id: poId,", "id: Date.now().toString(),")
content = content.replace("poId", "Date.now().toString()")

with open('src/App.tsx', 'w') as f:
    f.write(content)
