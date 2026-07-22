with open('src/components/StaffDashboard.tsx', 'r') as f:
    text = f.read()

text = text.replace("), document.body)}", ", document.body)}")

with open('src/components/StaffDashboard.tsx', 'w') as f:
    f.write(text)

with open('src/components/StaffStock.tsx', 'r') as f:
    text = f.read()

text = text.replace("), document.body)}", ", document.body)}")

with open('src/components/StaffStock.tsx', 'w') as f:
    f.write(text)
