with open('src/components/StaffDashboard.tsx', 'r') as f:
    content = f.read()

import re

# Add activeShiftPrepped definition
new_code = """  const todayPrep = useMemo(() => {
    return prepProgress.find((p: any) => p.day === day);
  }, [prepProgress, day]);

  const activeShiftPrepped = useMemo(() => {
    if (!activeShiftDish || !todayPrep) return 0;
    return todayPrep.portions?.[activeShiftDish.id] || 0;
  }, [activeShiftDish, todayPrep]);"""

content = content.replace("""  const todayPrep = useMemo(() => {
    return prepProgress.find((p: any) => p.day === day);
  }, [prepProgress, day]);""", new_code)

# Update portions prepared to use activeShiftPrepped
content = content.replace("120 / {activeShiftOptIns}", "{activeShiftPrepped} / {activeShiftOptIns}")

with open('src/components/StaffDashboard.tsx', 'w') as f:
    f.write(content)

