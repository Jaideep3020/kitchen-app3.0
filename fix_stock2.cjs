const fs = require('fs');
let content = fs.readFileSync('src/components/StaffStock.tsx', 'utf8');

const imports = `import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reportIssue } from '../api';
import { triggerHaptic } from '../lib/haptics';
`;

if(!content.includes("useQueryClient")) {
  content = content.replace("import React", imports + "import React");
}

const mutationHook = `  const queryClient = useQueryClient();
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
  });`;

if(!content.includes("reportIssueMutation = useMutation")) {
  content = content.replace("const [isLoading, setIsLoading]", mutationHook + "\n  const [isLoading, setIsLoading]");
}

fs.writeFileSync('src/components/StaffStock.tsx', content, 'utf8');
