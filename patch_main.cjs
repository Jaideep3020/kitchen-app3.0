const fs = require('fs');
let content = fs.readFileSync('src/main.tsx', 'utf8');

const queryImports = `import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();`;

content = content.replace("import { ToastProvider } from './contexts/ToastContext';", "import { ToastProvider } from './contexts/ToastContext';\n" + queryImports);

content = content.replace("<StrictMode>", "<StrictMode>\n    <QueryClientProvider client={queryClient}>");
content = content.replace("</StrictMode>", "    </QueryClientProvider>\n  </StrictMode>");

fs.writeFileSync('src/main.tsx', content, 'utf8');
