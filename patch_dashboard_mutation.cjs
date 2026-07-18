const fs = require('fs');
let content = fs.readFileSync('src/components/StaffDashboard.tsx', 'utf8');

const imports = `import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reportIssue } from '../api';
`;

content = content.replace("import { INITIAL_MENU_ITEMS } from '../data';", "import { INITIAL_MENU_ITEMS } from '../data';\n" + imports);

const hookStart = `  const { addToast } = useToast();
  const [showModal, setShowModal] = useState<string | null>(null);`;

const mutationHook = `  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const reportIssueMutation = useMutation({
    mutationFn: reportIssue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activityLogs'] });
      triggerHaptic('success');
      addToast('Issue reported successfully.', 'success');
      setShowModal(null);
    },
    onError: () => {
      addToast('Failed to report issue.', 'error');
    }
  });

  const [showModal, setShowModal] = useState<string | null>(null);`;

content = content.replace(hookStart, mutationHook);

const oldFormSubmit = `             <form onSubmit={async (e) => {
               e.preventDefault();
               const formData = new FormData(e.target as HTMLFormElement);
               await fetch('/api/issues', {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify(Object.fromEntries(formData))
               });
               triggerHaptic('success');
               addToast('Issue reported successfully.', 'success');
               setShowModal(null);
             }} className="space-y-3">`;

const oldFormSubmitRegex = /<form onSubmit=\{async \(e\) => \{\s*e.preventDefault\(\);\s*const formData = new FormData\(e.target(?: as HTMLFormElement)?\);\s*await fetch\('\/api\/issues', \{\s*method: 'POST',\s*headers: \{ 'Content-Type': 'application\/json' \},\s*body: JSON.stringify\(Object.fromEntries\(formData\)\)\s*\}\);\s*triggerHaptic\('success'\);\s*addToast\('Issue reported successfully.', 'success'\);\s*setShowModal\(null\);\s*\}\} className="space-y-3">/g;

content = content.replace(oldFormSubmitRegex, `<form onSubmit={(e) => {
               e.preventDefault();
               const formData = new FormData(e.target as HTMLFormElement);
               const data = Object.fromEntries(formData);
               data.itemName = data.type + ' Issue'; // simple placeholder since no itemName in this form
               reportIssueMutation.mutate(data);
             }} className="space-y-3">`);

fs.writeFileSync('src/components/StaffDashboard.tsx', content, 'utf8');
