import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

const sseHook = `
  useEffect(() => {
    const eventSource = new EventSource('/api/events');
    eventSource.addEventListener('inventory-updated', () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    });
    return () => eventSource.close();
  }, [queryClient]);

  const { data: queryPrepItems = [] } = useQuery({ queryKey: ['inventory'], queryFn: fetchInventory });
`;

// Insert after useOnlineStatus
code = code.replace(/const isOnline = useOnlineStatus\(\);/, 'const isOnline = useOnlineStatus();\n' + sseHook);

// Override prepItems from context with query data if available
const replacement = `  // Use query data if available, fallback to context
  const prepItems = queryPrepItems.length > 0 ? queryPrepItems : contextPrepItems;`;

code = code.replace(/    prepItems, setPrepItems,/g, '    prepItems: contextPrepItems, setPrepItems,');

code = code.replace(/const \[studentChoicesUnused/, replacement + '\n\n const [studentChoicesUnused');

fs.writeFileSync('src/App.tsx', code);
console.log("Successfully patched App.tsx for SSE");
