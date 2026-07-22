import re

with open('src/components/StaffDashboard.tsx', 'r') as f:
    content = f.read()

# I want to replace everything from `<div className="grid grid-cols-1 md:grid-cols-2 gap-6">` up to `      </div>\n    </div>\n  );\n }` that comes right before `const handleKeypadPress`
# actually it's easier to just match from `      {/* Skeleton Triage Center */}` to the end of the return.

find_str = """      {/* Skeleton Triage Center */}
      <div className="bg-white dark:bg-[#121212] rounded-2xl p-4 border border-gray-100 dark:border-gray-700 flex flex-col animate-skeleton-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 w-32 bg-gray-200 dark:bg-[#222] rounded"></div>
          <div className="h-4 w-16 bg-gray-200 dark:bg-[#222] rounded"></div>
        </div>
        <div className="space-y-2">
          <div className="h-14 w-full bg-gray-50 dark:bg-[#1a1a1a] rounded-lg border border-gray-100 dark:border-gray-700"></div>
          <div className="h-14 w-full bg-gray-50 dark:bg-[#1a1a1a] rounded-lg border border-gray-100 dark:border-gray-700"></div>
        </div>
      </div>"""

# Wait, this ends the grid. Let's see how the main `if (loading)` ends.
# I will just write a regex to replace everything from `      {/* Skeleton Triage Center */}` to ` );\n }` with just the `Triage Center` block and the closing tags.

pattern = re.compile(r'      \{/\*\s*Skeleton Triage Center\s*\*/\}.*?\);\n \}', re.DOTALL)

replacement = """      {/* Skeleton Triage Center */}
      <div className="bg-white dark:bg-[#121212] rounded-2xl p-4 border border-gray-100 dark:border-gray-700 flex flex-col animate-skeleton-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 w-32 bg-gray-200 dark:bg-[#222] rounded"></div>
          <div className="h-4 w-16 bg-gray-200 dark:bg-[#222] rounded"></div>
        </div>
        <div className="space-y-2">
          <div className="h-14 w-full bg-gray-50 dark:bg-[#1a1a1a] rounded-lg border border-gray-100 dark:border-gray-700"></div>
          <div className="h-14 w-full bg-gray-50 dark:bg-[#1a1a1a] rounded-lg border border-gray-100 dark:border-gray-700"></div>
        </div>
      </div>
    </div>
  );
 }"""

content = re.sub(pattern, replacement, content)

with open('src/components/StaffDashboard.tsx', 'w') as f:
    f.write(content)
