import re

with open('src/components/StaffStock.tsx', 'r') as f:
    text = f.read()

# Add createPortal import
if "createPortal" not in text:
    text = text.replace("import React, { useState", "import React, { useState")
    text = text.replace("import { Package, Truck", "import { createPortal } from 'react-dom';\nimport { Package, Truck")

text = text.replace(
    "{isAddSupplierModalOpen && (",
    "{isAddSupplierModalOpen && createPortal("
)
text = text.replace(
    "            </form>\n          </motion.div>\n        </FocusTrap>\n      )}",
    "            </form>\n          </motion.div>\n        </FocusTrap>\n      ), document.body)}"
)

text = text.replace(
    "{reorderModalItem && (",
    "{reorderModalItem && createPortal("
)
text = text.replace(
    "          </div>\n        </div>\n      )}",
    "          </div>\n        </div>\n      ), document.body)}"
)

text = text.replace(
    "{purchaseOrderDetails && (",
    "{purchaseOrderDetails && createPortal("
)
text = text.replace(
    "          </div>\n        </div>\n      )}",
    "          </div>\n        </div>\n      ), document.body)}"
)

with open('src/components/StaffStock.tsx', 'w') as f:
    f.write(text)
