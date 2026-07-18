import fs from 'fs';

let code = fs.readFileSync('src/contexts/DataContext.tsx', 'utf8');

// Ensure useToast is imported
if (!code.includes("import { useToast }")) {
  code = code.replace(/import \{ ([^}]+) \} from '\.\.\/types';/, "import { $1 } from '../types';\nimport { useToast } from './ToastContext';");
}

// Ensure addToast is available inside DataProvider
if (!code.includes("const { addToast } = useToast();")) {
  code = code.replace(/export function DataProvider\(\{ children \}: \{ children: React\.ReactNode \}\) \{/, "export function DataProvider({ children }: { children: React.ReactNode }) {\n  const { addToast } = useToast();");
}

// We need to replace all .catch(console.error) with our robust fetch execution inside DataContext.tsx

// A helper for robust fetch
const fetchWrapper = `
  const performFetch = async (url: string, options: any, successMsg: string) => {
    try {
      const res = await fetch(url, options);
      if (res.ok) {
        if (successMsg) addToast(successMsg, 'success');
      } else {
        addToast(\`Failed: \${res.statusText}\`, 'error');
      }
    } catch (err) {
      console.error(err);
      addToast('Network error', 'error');
    }
  };
`;

if (!code.includes("const performFetch")) {
  code = code.replace(/const isInitiallyLoaded = React\.useRef\(false\);/, fetchWrapper + "\n  const isInitiallyLoaded = React.useRef(false);");
}

// Replace all await fetch(...).catch(console.error); inside the useEffects
code = code.replace(/await fetch\(`\/api\/inventory\/\$\{item\.id\}`,\s*\{\s*method:\s*'DELETE'\s*\}\)\.catch\(console\.error\);/g, "await performFetch(`/api/inventory/${item.id}`, { method: 'DELETE' }, 'Inventory item deleted');");
code = code.replace(/await fetch\('\/api\/inventory',\s*\{\s*method:\s*'POST',\s*headers:\s*\{\s*'Content-Type':\s*'application\/json'\s*\},\s*body:\s*JSON\.stringify\(item\)\s*\}\)\.catch\(console\.error\);/g, "await performFetch('/api/inventory', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) }, 'Inventory item added');");
code = code.replace(/await fetch\(`\/api\/inventory\/\$\{item\.id\}`,\s*\{\s*method:\s*'PUT',\s*headers:\s*\{\s*'Content-Type':\s*'application\/json'\s*\},\s*body:\s*JSON\.stringify\(item\)\s*\}\)\.catch\(console\.error\);/g, "await performFetch(`/api/inventory/${item.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) }, 'Inventory item updated');");

code = code.replace(/await fetch\(`\/api\/suppliers\/\$\{item\.id\}`,\s*\{\s*method:\s*'DELETE'\s*\}\)\.catch\(console\.error\);/g, "await performFetch(`/api/suppliers/${item.id}`, { method: 'DELETE' }, 'Supplier deleted');");
code = code.replace(/await fetch\('\/api\/suppliers',\s*\{\s*method:\s*'POST',\s*headers:\s*\{\s*'Content-Type':\s*'application\/json'\s*\},\s*body:\s*JSON\.stringify\(item\)\s*\}\)\.catch\(console\.error\);/g, "await performFetch('/api/suppliers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) }, 'Supplier added');");
code = code.replace(/await fetch\(`\/api\/suppliers\/\$\{item\.id\}`,\s*\{\s*method:\s*'PUT',\s*headers:\s*\{\s*'Content-Type':\s*'application\/json'\s*\},\s*body:\s*JSON\.stringify\(item\)\s*\}\)\.catch\(console\.error\);/g, "await performFetch(`/api/suppliers/${item.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) }, 'Supplier updated');");

code = code.replace(/await fetch\(`\/api\/active-orders\/\$\{item\.id\}`,\s*\{\s*method:\s*'DELETE'\s*\}\)\.catch\(console\.error\);/g, "await performFetch(`/api/active-orders/${item.id}`, { method: 'DELETE' }, 'Order deleted');");
code = code.replace(/await fetch\('\/api\/active-orders',\s*\{\s*method:\s*'POST',\s*headers:\s*\{\s*'Content-Type':\s*'application\/json'\s*\},\s*body:\s*JSON\.stringify\(item\)\s*\}\)\.catch\(console\.error\);/g, "await performFetch('/api/active-orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) }, 'Order added');");
code = code.replace(/await fetch\(`\/api\/active-orders\/\$\{item\.id\}`,\s*\{\s*method:\s*'PUT',\s*headers:\s*\{\s*'Content-Type':\s*'application\/json'\s*\},\s*body:\s*JSON\.stringify\(item\)\s*\}\)\.catch\(console\.error\);/g, "await performFetch(`/api/active-orders/${item.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) }, 'Order updated');");

code = code.replace(/await fetch\(`\/api\/activity-logs\/\$\{item\.id\}`,\s*\{\s*method:\s*'DELETE'\s*\}\)\.catch\(console\.error\);/g, "await performFetch(`/api/activity-logs/${item.id}`, { method: 'DELETE' }, 'Activity log deleted');");
code = code.replace(/await fetch\('\/api\/activity-logs',\s*\{\s*method:\s*'POST',\s*headers:\s*\{\s*'Content-Type':\s*'application\/json'\s*\},\s*body:\s*JSON\.stringify\(item\)\s*\}\)\.catch\(console\.error\);/g, "await performFetch('/api/activity-logs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) }, 'Activity logged');");

code = code.replace(/await fetch\('\/api\/past-orders',\s*\{\s*method:\s*'POST',\s*headers:\s*\{\s*'Content-Type':\s*'application\/json'\s*\},\s*body:\s*JSON\.stringify\(item\)\s*\}\)\.catch\(console\.error\);/g, "await performFetch('/api/past-orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) }, 'Past order added');");

code = code.replace(/await fetch\(`\/api\/waste\/\$\{item\.id\}`,\s*\{\s*method:\s*'DELETE'\s*\}\)\.catch\(console\.error\);/g, "await performFetch(`/api/waste/${item.id}`, { method: 'DELETE' }, 'Waste log deleted');");
code = code.replace(/await fetch\('\/api\/waste',\s*\{\s*method:\s*'POST',\s*headers:\s*\{\s*'Content-Type':\s*'application\/json'\s*\},\s*body:\s*JSON\.stringify\(item\)\s*\}\)\.catch\(console\.error\);/g, "await performFetch('/api/waste', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) }, 'Waste logged');");


fs.writeFileSync('src/contexts/DataContext.tsx', code);
console.log("Successfully patched DataContext.tsx to use performFetch with toasts");
