const fs = require('fs');
let content = fs.readFileSync('src/components/StaffStock.tsx', 'utf8');

const hookStart = `  const { addToast } = useToast();
  const [isLoading, setIsLoading] = React.useState(true);`;

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

  const [isLoading, setIsLoading] = React.useState(true);`;

if(!content.includes("reportIssueMutation = useMutation")) {
  content = content.replace(hookStart, mutationHook);
  fs.writeFileSync('src/components/StaffStock.tsx', content, 'utf8');
}
