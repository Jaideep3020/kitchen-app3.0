import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace('No results found for "{globalSearchQuery}"</div>\n           </div>', 'No results found for "{globalSearchQuery}"</div>\n             )}\n           </div>')
content = content.replace('No results found for "{globalSearchQuery}"</div>\n             </div>', 'No results found for "{globalSearchQuery}"</div>\n             )}\n           </div>')
content = content.replace('<span className="text-sm font-medium">Create new order</span>\n             </div>\n           </div>\n         </motion.div>', '<span className="text-sm font-medium">Create new order</span>\n             </div>\n           </div>\n         </motion.div>\n       )}')

with open('src/App.tsx', 'w') as f:
    f.write(content)
