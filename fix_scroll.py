with open('src/components/StaffDashboard.tsx', 'r') as f:
    text = f.read()

text = text.replace("onNavigate('stock');", "window.scrollTo(0,0); onNavigate('stock');")

with open('src/components/StaffDashboard.tsx', 'w') as f:
    f.write(text)
