const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const imports = `import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchInventory, fetchActiveOrders, fetchActivityLogs } from './api';
`;

content = content.replace("import { INITIAL_MENU_ITEMS", imports + "import { INITIAL_MENU_ITEMS");

const hookStart = `export default function App() {
 const [role, setRole] = useState<Role>(null);`;

const newHooks = `export default function App() {
 const [role, setRole] = useState<Role>(null);
 const queryClient = useQueryClient();
 
 const { data: queryPrepItems = [] } = useQuery({ queryKey: ['inventory'], queryFn: fetchInventory });
 const { data: queryActiveOrders = [] } = useQuery({ queryKey: ['activeOrders'], queryFn: fetchActiveOrders });
 const { data: queryActivityLogs = [] } = useQuery({ queryKey: ['activityLogs'], queryFn: fetchActivityLogs });
`;

content = content.replace(hookStart, newHooks);

// Override the destructured variables from useData with the query ones if needed.
// Or just replace them.
const oldUseData = `const { menuItems, setMenuItems, prepItems, setPrepItems, suppliers, setSuppliers, activeOrders, setActiveOrders, activityLogs, setActivityLogs, pastOrders, setPastOrders } = useData();`;
const newUseData = `const { menuItems, setMenuItems, prepItems: contextPrepItems, setPrepItems, suppliers, setSuppliers, activeOrders: contextActiveOrders, setActiveOrders, activityLogs: contextActivityLogs, setActivityLogs, pastOrders, setPastOrders } = useData();

  // Use query data if available, fallback to context
  const prepItems = queryPrepItems.length > 0 ? queryPrepItems : contextPrepItems;
  const activeOrders = queryActiveOrders.length > 0 ? queryActiveOrders : contextActiveOrders;
  const activityLogs = queryActivityLogs.length > 0 ? queryActivityLogs : contextActivityLogs;
`;

content = content.replace(oldUseData, newUseData);

fs.writeFileSync('src/App.tsx', content, 'utf8');
