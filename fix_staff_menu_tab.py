with open('src/components/StaffManagement.tsx', 'r') as f:
    content = f.read()

menu_tab_code = """
        {activeTab === 'menu' && (
          <motion.div
            key="menu"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <ManagerMenu />
          </motion.div>
        )}
      </AnimatePresence>
"""
content = content.replace("      </AnimatePresence>", menu_tab_code)

with open('src/components/StaffManagement.tsx', 'w') as f:
    f.write(content)
