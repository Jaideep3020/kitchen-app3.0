const fs = require('fs');
let content = fs.readFileSync('src/components/StaffDashboard.tsx', 'utf8');

const checklistState = `
  const [receivingOrder, setReceivingOrder] = useState<ActiveOrder | null>(null);
  const [checklistStatus, setChecklistStatus] = useState<string>('full'); // 'full' | 'short' | 'damaged'
  const [checklistNotes, setChecklistNotes] = useState<string>('');
`;

content = content.replace(
  /const \[showModal, setShowModal\] = useState<string \| null>\(null\);/,
  "const [showModal, setShowModal] = useState<string | null>(null);\n" + checklistState
);

const oldReceiveButton = `<button className="bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-600 transition-colors" onClick={() => {
                     triggerHaptic('success');
                     if (onReceiveOrder) onReceiveOrder(order.id);
                     if (onAddActivityLog) {
                       onAddActivityLog({
                         id: Date.now().toString(),
                         action: 'Order Received: ' + order.id,
                         user: 'Staff',
                         timestamp: new Date().toISOString()
                       });
                     }
                   }}>
                     Receive
                   </button>`;

const newReceiveButton = `<button className="bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-600 transition-colors" onClick={() => {
                     triggerHaptic('light');
                     setReceivingOrder(order);
                     setChecklistStatus('full');
                   }}>
                     Receive
                   </button>`;

content = content.replace(oldReceiveButton, newReceiveButton);

const modalCode = `
      {/* Receiving Checklist Modal */}
      {receivingOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-[#121212] rounded-[24px] p-6 max-w-md w-full shadow-2xl border border-gray-100 dark:border-gray-800"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold font-display text-gray-900 dark:text-white">Receiving Checklist</h3>
              <button onClick={() => setReceivingOrder(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="p-4 bg-gray-50 dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-gray-900 dark:text-white">{receivingOrder.item || 'Multiple Items'}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Qty: {receivingOrder.quantity || 'N/A'}</span>
                </div>
                <p className="text-xs text-gray-500">Supplier: {receivingOrder.supplierName}</p>
                <p className="text-xs text-gray-500">PO: {receivingOrder.id}</p>
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-[#1a1a1a] ${checklistStatus === 'full' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-gray-200 dark:border-gray-700'}">
                  <input type="radio" name="receive_status" checked={checklistStatus === 'full'} onChange={() => setChecklistStatus('full')} className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-gray-300" />
                  <span className="font-medium text-gray-900 dark:text-white text-sm">Full Quantity Received</span>
                </label>
                
                <label className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-[#1a1a1a] ${checklistStatus === 'short' ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'border-gray-200 dark:border-gray-700'}">
                  <input type="radio" name="receive_status" checked={checklistStatus === 'short'} onChange={() => setChecklistStatus('short')} className="w-4 h-4 text-amber-600 focus:ring-amber-500 border-gray-300" />
                  <span className="font-medium text-gray-900 dark:text-white text-sm">Short Delivery (Missing Items)</span>
                </label>
                
                <label className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-[#1a1a1a] ${checklistStatus === 'damaged' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-700'}">
                  <input type="radio" name="receive_status" checked={checklistStatus === 'damaged'} onChange={() => setChecklistStatus('damaged')} className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300" />
                  <span className="font-medium text-gray-900 dark:text-white text-sm">Damaged Goods</span>
                </label>
              </div>
              
              {checklistStatus !== 'full' && (
                <textarea 
                  className="w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-[#16321F] dark:focus:ring-[#D9E96B] outline-none resize-none"
                  rows={3}
                  placeholder="Describe the issue..."
                  value={checklistNotes}
                  onChange={(e) => setChecklistNotes(e.target.value)}
                />
              )}
            </div>
            
            <button 
              className="w-full bg-[#16321F] dark:bg-[#D9E96B] text-white dark:text-[#16321F] py-3.5 rounded-xl font-bold text-sm hover:scale-[1.02] active:scale-95 transition-transform"
              onClick={() => {
                triggerHaptic('success');
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
                setChecklistNotes('');
              }}
            >
              Confirm & Receive
            </button>
          </motion.div>
        </div>
      )}
`;

content = content.replace('</AnimatePresence>', '</AnimatePresence>\n' + modalCode);
fs.writeFileSync('src/components/StaffDashboard.tsx', content);
