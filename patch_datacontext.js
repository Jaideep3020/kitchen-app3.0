import fs from 'fs';
let code = fs.readFileSync('src/contexts/DataContext.tsx', 'utf8');

if (!code.includes("import { useToast } from './ToastContext';")) {
  code = code.replace(/import \{ ([^}]+) \} from '\.\.\/types';/m, "import { $1 } from '../types';\nimport { useToast } from './ToastContext';");
}

code = code.replace(/export function DataProvider\(\{ children \}: \{ children: React\.ReactNode \}\) \{/, "export function DataProvider({ children }: { children: React.ReactNode }) {\n  const { addToast } = useToast();");

// Replace .catch(console.error) with addToast('Error', 'error') for DELETEs
// We'll replace it inside the sync functions
code = code.replace(/\.catch\(console\.error\);/g, ".catch(err => { console.error(err); addToast('Operation failed', 'error'); });");

// Inside fetch requests, we don't have .then for success inside sync, they are just awaited.
// Let's refactor the sync logic or replace using regex to add success toasts.
// Wait, the user wants: "Ensure all API mutations in the application use the ToastProvider to provide success or error feedback to the user on every operation."

fs.writeFileSync('src/contexts/DataContext_temp.tsx', code);
