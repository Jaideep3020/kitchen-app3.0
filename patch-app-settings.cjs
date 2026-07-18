const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

if (!content.includes('ManagerSettings')) {
  content = content.replace("import ManagerMenu from './components/ManagerMenu';", "import ManagerMenu from './components/ManagerMenu';\nimport ManagerSettings from './components/ManagerSettings';");
  
  content = content.replace("staffTab === \"menu-builder\" ? \"bg-[#16321F] text-[#D9E96B] dark:bg-[#D9E96B] dark:text-[#16321F] shadow-md\" : \"text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200\"}`}>\n                    <Sparkles className=\"w-4 h-4\" />\n                    Menu Planner\n                  </button>", "staffTab === \"menu-builder\" ? \"bg-[#16321F] text-[#D9E96B] dark:bg-[#D9E96B] dark:text-[#16321F] shadow-md\" : \"text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200\"}`}>\n                    <Sparkles className=\"w-4 h-4\" />\n                    Menu Planner\n                  </button>\n                  <button onClick={() => setStaffTab(\"settings\")} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${staffTab === \"settings\" ? \"bg-[#16321F] text-[#D9E96B] dark:bg-[#D9E96B] dark:text-[#16321F] shadow-md\" : \"text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200\"}`}>\n                    <Settings className=\"w-4 h-4\" />\n                    Settings\n                  </button>");
                  
  content = content.replace("staffTab === 'dashboard' ? 'Operations Center' :", "staffTab === 'settings' ? 'Global Settings' :\n       staffTab === 'dashboard' ? 'Operations Center' :");
  
  content = content.replace("{staffTab === \"menu-builder\" && (\n    <ManagerMenu />\n )}", "{staffTab === \"menu-builder\" && (\n    <ManagerMenu />\n )}\n {staffTab === 'settings' && (\n   <ManagerSettings />\n )}");
  
  content = content.replace("import { WifiOff } from 'lucide-react';", "import { WifiOff, Settings } from 'lucide-react';");
  
  fs.writeFileSync('src/App.tsx', content, 'utf8');
}
