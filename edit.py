import re

with open('src/components/StaffOps.tsx', 'r') as f:
    text = f.read()

# 1. Remove dish.description
text = re.sub(r'<p className="text-xs text-gray-400 dark:text-gray-400 font-semibold line-clamp-2 leading-relaxed">[\s\n]*{dish\.description}[\s\n]*</p>[\s\n]*</div>', '</div>', text)
text = text.replace('className="space-y-2">\n <div className="flex justify-between items-start">', 'className="space-y-1">\n <div className="flex justify-between items-start">')
text = text.replace('text-xs font-medium px-2 py-0.5', 'text-[10px] font-bold px-2 py-0.5')
text = text.replace('text-xs text-gray-400 dark:text-gray-400 font-medium font-mono">{dish.calories}', 'text-[10px] text-gray-400 dark:text-gray-400 font-bold font-mono">{dish.calories}')
text = text.replace('text-xs font-extrabold', 'text-sm font-extrabold')

# 3. Min/Max Pax
text = re.sub(r'<div className="flex justify-between text-xs text-gray-400 dark:text-gray-400 font-medium">[\s\n]*<span>Min: \{minPax\}</span>[\s\n]*<span>Max: \{maxPax\}</span>[\s\n]*</div>[\s\n]*</div>', '</div>', text)

# 4. Min/Max Vol
text = re.sub(r'<div className="flex justify-between text-xs text-gray-400 dark:text-gray-400 font-medium">[\s\n]*<span>Min: \{minVol\}</span>[\s\n]*<span>Max: \{maxVol\}</span></div></div><hr className="border-gray-50" />', '</div><hr className="border-gray-50" />', text)

# 7. Over preparation
text = re.sub(r'p-4 border border-gray-100 dark:border-gray-800 flex flex-col justify-between">[\s\n]*<div>[\s\n]*<span className="text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-400 block">Over Preparation</span>[\s\n]*<span className="text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-400">Unused prepared food</span>[\s\n]*</div>[\s\n]*<div className="flex items-center justify-between mt-3">', 'p-3 border border-gray-100 dark:border-gray-800 flex flex-col justify-between">\n <div>\n <span className="text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-400 block">Over Preparation</span>\n </div>\n <div className="flex items-center justify-between mt-2">', text)

# 8. Plate waste
text = re.sub(r'p-4 border border-gray-100 dark:border-gray-800 flex flex-col justify-between">[\s\n]*<div>[\s\n]*<span className="text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-400 block">Plate Waste</span>[\s\n]*<span className="text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-400">Leftovers returned to bins</span>[\s\n]*</div>[\s\n]*<div className="flex items-center justify-between mt-3">', 'p-3 border border-gray-100 dark:border-gray-800 flex flex-col justify-between">\n <div>\n <span className="text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-400 block">Plate Waste</span>\n </div>\n <div className="flex items-center justify-between mt-2">', text)

with open('src/components/StaffOps.tsx', 'w') as f:
    f.write(text)
