with open('src/components/StaffManagement.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { motion, AnimatePresence } from 'motion/react';", "import { motion, AnimatePresence } from 'motion/react';\nimport ManagerMenu from './ManagerMenu';\nimport { Utensils } from 'lucide-react';")

content = content.replace("const [activeTab, setActiveTab] = useState<'users' | 'settings'>('users');", "const [activeTab, setActiveTab] = useState<'users' | 'settings' | 'menu'>('users');")

tabs_html = """
          <button
            onClick={() => { triggerHaptic('light'); setActiveTab('settings'); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'settings' 
                ? 'bg-white dark:bg-[#2a2a2a] text-[#16321F] dark:text-[#D9E96B] shadow-sm' 
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Settings className="w-4 h-4" />
            Global Settings
          </button>
          <button
            onClick={() => { triggerHaptic('light'); setActiveTab('menu'); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'menu' 
                ? 'bg-white dark:bg-[#2a2a2a] text-[#16321F] dark:text-[#D9E96B] shadow-sm' 
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Utensils className="w-4 h-4" />
            Menu Builder
          </button>
"""

import re
content = re.sub(r'<button[^>]*onClick=\{\(\) => \{ triggerHaptic\(\'light\'\); setActiveTab\(\'settings\'\); \}\}.*?Global Settings\s*</button>', tabs_html, content, flags=re.DOTALL)

# Now for the rendering part.
#       <AnimatePresence mode="wait">
#        {activeTab === 'users' ? ( ... ) : ( ... )}
# We need to change to:
#        {activeTab === 'users' && ( ... )}
#        {activeTab === 'settings' && ( ... )}
#        {activeTab === 'menu' && ( ... )}
render_old = r"\{activeTab === 'users' \? \(\s*<motion\.div"
render_new = r"{activeTab === 'users' && (\n          <motion.div"
content = re.sub(render_old, render_new, content)

# Instead of regex for the big `) : (`, let's just do standard replacement.
content = content.replace("              </div>\n            </div>\n          </motion.div>\n        ) : (\n          <motion.div", "              </div>\n            </div>\n          </motion.div>\n        )}\n        {activeTab === 'settings' && (\n          <motion.div")

# And add the menu tab at the end
content = content.replace("            </div>\n          </motion.div>\n        )}\n      </AnimatePresence>", "            </div>\n          </motion.div>\n        )}\n        {activeTab === 'menu' && (\n          <motion.div\n            key=\"menu\"\n            initial={{ opacity: 0, y: 10 }}\n            animate={{ opacity: 1, y: 0 }}\n            exit={{ opacity: 0, y: -10 }}\n            transition={{ duration: 0.2 }}\n          >\n            <ManagerMenu />\n          </motion.div>\n        )}\n      </AnimatePresence>")

with open('src/components/StaffManagement.tsx', 'w') as f:
    f.write(content)
