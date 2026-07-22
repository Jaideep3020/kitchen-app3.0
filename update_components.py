import re
import glob
import os

files_to_check = [
    'src/components/StaffDashboard.tsx',
    'src/components/StaffOps.tsx',
    'src/components/StaffStock.tsx',
    'src/components/StaffReports.tsx',
    'src/components/StudentOptIn.tsx',
    'src/components/StudentCheckIn.tsx',
    'src/components/StudentProfile.tsx',
    'src/components/NotificationInbox.tsx',
    'src/components/StaffLaunchHub.tsx',
    'src/components/ManagerMenu.tsx',
    'src/components/TimeAndCalendarHub.tsx'
]

for filename in files_to_check:
    if not os.path.exists(filename):
        continue
    with open(filename, 'r') as f:
        text = f.read()
        
    if "<button" in text:
        if "import { Pressable }" not in text:
            # find first import
            text = text.replace("import React", "import { Pressable } from './Pressable';\nimport React")
            if "import { Pressable } from './Pressable';" not in text:
                text = "import { Pressable } from './Pressable';\n" + text
        
        text = text.replace("<button", "<Pressable")
        text = text.replace("</button>", "</Pressable>")
        text = text.replace("triggerHaptic('light'); ", "")
        text = text.replace("triggerHaptic('light');", "")
        
        with open(filename, 'w') as f:
            f.write(text)

