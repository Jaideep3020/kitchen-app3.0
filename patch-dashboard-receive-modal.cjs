const fs = require('fs');
let content = fs.readFileSync('src/components/StaffDashboard.tsx', 'utf8');

// 1. Change default checklistStatus to null
content = content.replace(
  "const [checklistStatus, setChecklistStatus] = useState<string>('full');",
  "const [checklistStatus, setChecklistStatus] = useState<string | null>(null);"
);

// 2. Change the initial set in the row's Receive button
content = content.replace(
  "setChecklistStatus('full');",
  "setChecklistStatus(null);"
);

// 3. Update the button in the modal to be disabled and to call fetch
const oldButton = `<button 
              className="w-full bg-[#16321F] dark:bg-[#D9E96B] text-white dark:text-[#16321F] py-3.5 rounded-xl font-bold text-sm hover:scale-[1.02] active:scale-95 transition-transform"
              onClick={() => {`;
              
const newButton = `<button 
              disabled={!checklistStatus}
              className={\`w-full py-3.5 rounded-xl font-bold text-sm transition-transform \${!checklistStatus ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#16321F] dark:bg-[#D9E96B] text-white dark:text-[#16321F] hover:scale-[1.02] active:scale-95'}\`}
              onClick={async () => {`;
              
content = content.replace(oldButton, newButton);

const oldOnConfirm = `                triggerHaptic('success');
                if (onReceiveOrder) onReceiveOrder(receivingOrder.id);
                if (onAddActivityLog) {
                   onAddActivityLog({
                     id: Date.now().toString(),
                     action: 'Order Received: ' + receivingOrder.id,
                     user: 'Staff',
                     timestamp: new Date().toISOString()
                   });
                }
                
                if (checklistStatus !== 'full') {
                  reportIssueMutation.mutate({
                    itemName: receivingOrder.item || receivingOrder.id,
                    type: checklistStatus === 'short' ? 'Quantity' : 'Quality',
                    description: checklistNotes || \`Reported \${checklistStatus} during receiving checklist.\`,
                    category: 'Ingredient'
                  });
                } else {
                  addToast('Order marked as received.', 'success');
                }
                
                setReceivingOrder(null);
                setChecklistStatus('full');
                setChecklistNotes('');`;

const newOnConfirm = `                triggerHaptic('success');
                
                try {
                  // Direct backend API call to update DB
                  const qty = receivingOrder.quantity || 0;
                  const receivedQty = checklistStatus === 'short' ? Math.floor(qty * 0.8) : checklistStatus === 'damaged' ? Math.floor(qty * 0.5) : qty; // simulate partial receipt for testing
                  
                  await fetch(\`/api/active-orders/\${receivingOrder.id}\`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...receivingOrder, status: 'Received', receivedQuantity: receivedQty })
                  });
                } catch(err) { console.error(err); }

                if (onReceiveOrder) onReceiveOrder(receivingOrder.id);
                if (onAddActivityLog) {
                   onAddActivityLog({
                     id: Date.now().toString(),
                     action: 'Order Received: ' + receivingOrder.id,
                     user: 'Staff',
                     timestamp: new Date().toISOString()
                   });
                }
                
                if (checklistStatus !== 'full') {
                  reportIssueMutation.mutate({
                    itemName: receivingOrder.item || receivingOrder.id,
                    type: checklistStatus === 'short' ? 'Quantity' : 'Quality',
                    description: checklistNotes || \`Reported \${checklistStatus} during receiving checklist.\`,
                    category: 'Ingredient'
                  });
                } else {
                  addToast('Order marked as received.', 'success');
                }
                
                setReceivingOrder(null);
                setChecklistStatus(null);
                setChecklistNotes('');`;
                
content = content.replace(oldOnConfirm, newOnConfirm);

fs.writeFileSync('src/components/StaffDashboard.tsx', content);
