import re

with open('src/components/StaffDashboard.tsx', 'r') as f:
    text = f.read()

pattern = r'\{\/\* Global Kitchen & RSVP Settings \*\/\}.*?(?=\{\/\* Modals and other stuff \*\/\})'
text = re.sub(pattern, '', text, flags=re.DOTALL)

with open('src/components/StaffDashboard.tsx', 'w') as f:
    f.write(text)
