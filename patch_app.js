import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex1 = / const { data: queryPrepItems = \[\] } = useQuery\({ queryKey: \['inventory'\], queryFn: fetchInventory }\);\n const { data: queryActiveOrders = \[\] } = useQuery\({ queryKey: \['activeOrders'\], queryFn: fetchActiveOrders }\);\n const { data: queryActivityLogs = \[\] } = useQuery\({ queryKey: \['activityLogs'\], queryFn: fetchActivityLogs }\);\n/m;
code = code.replace(regex1, '');

const regex2 = /  \/\/ Use query data if available, fallback to context\n  const prepItems = queryPrepItems\.length > 0 \? queryPrepItems : contextPrepItems;\n  const activeOrders = queryActiveOrders\.length > 0 \? queryActiveOrders : contextActiveOrders;\n  const activityLogs = queryActivityLogs\.length > 0 \? queryActivityLogs : contextActivityLogs;\n/m;
code = code.replace(regex2, '');

const regex3 = /    prepItems: contextPrepItems, setPrepItems,/g;
code = code.replace(regex3, '    prepItems, setPrepItems,');

const regex4 = /    activeOrders: contextActiveOrders, setActiveOrders,/g;
code = code.replace(regex4, '    activeOrders, setActiveOrders,');

const regex5 = /    activityLogs: contextActivityLogs, setActivityLogs,/g;
code = code.replace(regex5, '    activityLogs, setActivityLogs,');


fs.writeFileSync('src/App.tsx', code);
console.log("Successfully patched App.tsx");
