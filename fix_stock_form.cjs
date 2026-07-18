const fs = require('fs');
let content = fs.readFileSync('src/components/StaffStock.tsx', 'utf8');

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

if(!content.includes("reportIssueMutation.mutate")) {
  content = content.replace(formRegex, newFormSubmit);
  fs.writeFileSync('src/components/StaffStock.tsx', content, 'utf8');
}
