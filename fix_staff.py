import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace(" />\n {staffTab === 'ops'", " />\n )}\n {staffTab === 'ops'")
content = content.replace(" />\n {staffTab === 'stock'", " />\n )}\n {staffTab === 'stock'")

# Make sure they are fixed.
with open('src/App.tsx', 'w') as f:
    f.write(content)
