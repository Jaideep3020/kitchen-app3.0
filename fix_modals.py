import re

with open('src/components/StaffDashboard.tsx', 'r') as f:
    text = f.read()

# Add createPortal import
if "createPortal" not in text:
    text = text.replace("import React, { useState", "import React, { useState")
    text = text.replace("import FocusTrap from 'focus-trap-react';", "import FocusTrap from 'focus-trap-react';\nimport { createPortal } from 'react-dom';")

# Fix Check Pantry button to scrollTo top
text = text.replace(
    "onClick={() => { triggerHaptic('light'); if (onNavigate) onNavigate('ops'); }}",
    "onClick={() => { triggerHaptic('light'); if (onNavigate) { window.scrollTo(0,0); onNavigate('ops'); } }}"
)

# Use createPortal for delivery modal
text = text.replace(
    "{showModal === 'delivery' && (",
    "{showModal === 'delivery' && createPortal("
)
# Close for delivery modal (it's closed before showModal === 'leftovers')
text = text.replace(
    "        </FocusTrap>\n      )}\n\n      {showModal === 'leftovers'",
    "        </FocusTrap>\n      ), document.body)}\n\n      {showModal === 'leftovers'"
)

# Use createPortal for leftovers modal
text = text.replace(
    "{showModal === 'leftovers' && (",
    "{showModal === 'leftovers' && createPortal("
)
text = text.replace(
    "        </FocusTrap>\n      )}\n\n      {showModal === 'issue'",
    "        </FocusTrap>\n      ), document.body)}\n\n      {showModal === 'issue'"
)

# Use createPortal for issue modal
text = text.replace(
    "{showModal === 'issue' && (",
    "{showModal === 'issue' && createPortal("
)
text = text.replace(
    "        </FocusTrap>\n      )}\n\n      {showModal === 'diners'",
    "        </FocusTrap>\n      ), document.body)}\n\n      {showModal === 'diners'"
)

# Use createPortal for diners modal
text = text.replace(
    "{showModal === 'diners' && (",
    "{showModal === 'diners' && createPortal("
)
text = text.replace(
    "        </FocusTrap>\n      )}\n\n      {showWasteInsight && (",
    "        </FocusTrap>\n      ), document.body)}\n\n      {showWasteInsight && ("
)

# Use createPortal for waste insight modal
text = text.replace(
    "{showWasteInsight && (",
    "{showWasteInsight && createPortal("
)
text = text.replace(
    "        </FocusTrap>\n      )}\n    </div>\n  );\n}",
    "        </FocusTrap>\n      ), document.body)}\n    </div>\n  );\n}"
)

with open('src/components/StaffDashboard.tsx', 'w') as f:
    f.write(text)
