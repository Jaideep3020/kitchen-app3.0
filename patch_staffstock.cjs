const fs = require('fs');
let code = fs.readFileSync('src/components/StaffStock.tsx', 'utf8');

code = code.replace(
  "import { reportIssue } from '../api';",
  "import { reportIssue, updateSupplier } from '../api';"
);

const oldOnAdd = `onAddCorrespondence={(id: string, type: 'Call' | 'Email', notes: string) => {
                     setSuppliers(prev => prev.map(s => {
                        if (s.id === id) {
                           const newCorrespondence = {
                              id: \`cor_\${Date.now()}\`,
                              date: new Date().toLocaleDateString(),
                              type,
                              notes
                           };
                           return { ...s, correspondence: [newCorrespondence, ...(s.correspondence || [])] };
                        }
                        return s;
                     }));
                     addToast('Correspondence logged', 'success');
                     triggerHaptic('success');
                  }}`;

const newOnAdd = `onAddCorrespondence={async (id: string, type: 'Call' | 'Email', notes: string) => {
                     const newCorrespondence = {
                        id: \`cor_\${Date.now()}\`,
                        date: new Date().toLocaleDateString(),
                        type,
                        notes
                     };
                     
                     let updatedSupplier = null;
                     setSuppliers(prev => prev.map(s => {
                        if (s.id === id) {
                           updatedSupplier = { ...s, correspondence: [newCorrespondence, ...(s.correspondence || [])] };
                           return updatedSupplier;
                        }
                        return s;
                     }));
                     
                     if (updatedSupplier) {
                        try {
                           await updateSupplier(updatedSupplier);
                        } catch (err) {
                           console.error(err);
                        }
                     }
                     addToast('Correspondence logged', 'success');
                     triggerHaptic('success');
                  }}`;

code = code.replace(oldOnAdd, newOnAdd);

fs.writeFileSync('src/components/StaffStock.tsx', code);
