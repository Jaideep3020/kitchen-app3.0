import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/import \{ useData \} from '\.\/contexts\/DataContext';/, "import { useData } from './contexts/DataContext';\nimport { useToast } from './contexts/ToastContext';");

// Insert useToast inside App component
code = code.replace(/export default function App\(\) \{/, "export default function App() {\n  const { addToast } = useToast();");

// Update the fetch in handleReceiveOrder
const fetchRegex = /fetch\('\/api\/deliveries\/receive', \{\n\s*method: 'POST',\n\s*headers: \{ 'Content-Type': 'application\/json' \},\n\s*body: JSON\.stringify\(\{ id: orderId, receivedItems: \[\] \}\)\n\s*\}\)\.catch\(err => console\.error\(err\)\);/m;

const replacement = `fetch('/api/deliveries/receive', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: orderId, receivedItems: [] })
    })
    .then(res => {
      if (res.ok) addToast('Order received successfully', 'success');
      else addToast('Failed to receive order', 'error');
    })
    .catch(err => {
      console.error(err);
      addToast('Network error', 'error');
    });`;

code = code.replace(fetchRegex, replacement);

fs.writeFileSync('src/App.tsx', code);
console.log("Successfully patched App.tsx");
