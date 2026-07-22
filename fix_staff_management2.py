with open('src/components/StaffManagement.tsx', 'r') as f:
    content = f.read()

# Replace the closing div
content = content.replace("          </button>\n        </div>\n      </div>\n      <AnimatePresence mode=\"wait\">", "          </button>\n        </ScrollAffordance>\n      </div>\n      <AnimatePresence mode=\"wait\">")

with open('src/components/StaffManagement.tsx', 'w') as f:
    f.write(content)
