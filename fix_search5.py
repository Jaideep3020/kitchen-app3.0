with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace('   </div>\n\n <div className="flex items-center gap-2 sm:gap-4 order-2 md:order-3 ml-auto">', '   </div>\n )}\n\n <div className="flex items-center gap-2 sm:gap-4 order-2 md:order-3 ml-auto">')

with open('src/App.tsx', 'w') as f:
    f.write(content)
