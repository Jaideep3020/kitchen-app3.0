import os
import re

def replace_in_file(filepath, old, new):
    with open(filepath, 'r') as f:
        content = f.read()
    content = content.replace(old, new)
    with open(filepath, 'w') as f:
        f.write(content)

# 1. ErrorBoundary
replace_in_file('src/components/ErrorBoundary.tsx', 
    "{this.props.fallbackMessage || 'Something went wrong loading this component.'}", 
    r"{this.props.fallbackMessage || 'This section couldn\'t be loaded. Try refreshing the page.'}")

# 2. StaffStock - Empty Suppliers
replace_in_file('src/components/StaffStock.tsx',
    'No suppliers match your search.',
    'No suppliers found matching your search. Try adjusting the name or add a new supplier.')

# 3. StaffStock - No correspondence
replace_in_file('src/components/StaffStock.tsx',
    'No correspondence logged yet.',
    'No correspondence logged. Track emails and calls here to maintain a record.')

# 4. StaffDashboard - No plate waste violations
replace_in_file('src/components/StaffDashboard.tsx',
    'No plate waste threshold violations detected today.',
    r"No threshold violations today. You'll see alerts here if waste exceeds targets.")

# 5. StaffDashboard - No pending orders
replace_in_file('src/components/StaffDashboard.tsx',
    'No pending orders',
    'All clear. Any purchase orders pending your approval will appear here.')

# 6. App.tsx - Global Search No Results
replace_in_file('src/App.tsx',
    'No results found for "{globalSearchQuery}"',
    r'We couldn\'t find anything matching "{globalSearchQuery}". Try adjusting your search.')

# 7. ManagerMenu - No ingredients
replace_in_file('src/components/ManagerMenu.tsx',
    'No ingredients configured. Add some below.',
    'No ingredients configured yet. Select items from inventory to build your recipe.')

# 8. StaffOps - No raw materials
replace_in_file('src/components/StaffOps.tsx',
    'No raw materials matched your search or filters.',
    'No raw materials found. Check your spelling or clear your filters.')

# 9. StaffOps - No dishes found
replace_in_file('src/components/StaffOps.tsx',
    'No dishes found for this weekday selection.',
    'No dishes scheduled for this day yet. Manage the weekly schedule in Menu Builder.')

# 10. TimeAndCalendarHub - No menu items scheduled
replace_in_file('src/components/TimeAndCalendarHub.tsx',
    'No menu items scheduled for this day.',
    'No menu items scheduled for this day yet. Add them in Menu Builder.')

