const fs = require('fs');
let content = fs.readFileSync('src/components/StaffStock.tsx', 'utf8');

const imports = `import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reportIssue } from '../api';
`;

content = content.replace("import { motion, AnimatePresence } from 'motion/react';", "import { motion, AnimatePresence } from 'motion/react';\n" + imports);

const hookStart = `  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'inventory' | 'suppliers' | 'orders'>(initialTab || 'inventory');`;

const mutationHook = `  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const reportIssueMutation = useMutation({
    mutationFn: reportIssue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activityLogs'] });
      triggerHaptic('success');
      addToast('Issue reported successfully.', 'success');
      setShowIssueModal(false);
      setIsSubmittingIssue(false);
    },
    onError: () => {
      addToast('Failed to report issue.', 'error');
      setIsSubmittingIssue(false);
    }
  });

  const [activeTab, setActiveTab] = useState<'inventory' | 'suppliers' | 'orders'>(initialTab || 'inventory');`;

content = content.replace(hookStart, mutationHook);

const formRegex = /<form onSubmit=\{async \(e\) => \{[\s\S]*?\}\} className="space-y-4">/m;
const newFormSubmit = `<form onSubmit={(e) => {
               e.preventDefault();
               setIsSubmittingIssue(true);
               const formData = new FormData(e.target as HTMLFormElement);
               const data = Object.fromEntries(formData);
               data.itemName = data.type + ' Issue'; // Mock item name
               
               // Ignore photo conversion for simplicity in React Query transition
               reportIssueMutation.mutate(data);
             }} className="space-y-4">`;

content = content.replace(formRegex, newFormSubmit);

fs.writeFileSync('src/components/StaffStock.tsx', content, 'utf8');
