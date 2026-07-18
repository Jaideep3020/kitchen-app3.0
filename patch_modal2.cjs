const fs = require('fs');
let code = fs.readFileSync('src/components/StaffStock.tsx', 'utf8');

code = code.replace(
  'const [poStep, setPoStep] = useState<number>(() => {',
  'const [droppedOrder, setDroppedOrder] = useState<ActiveOrder | null>(null);\n  const [poStep, setPoStep] = useState<number>(() => {'
);

const oldDropHandler = "if (status === 'Received') {\\n                    const order = orders.find(o => o.id === orderId);\\n                    if (order && order.status !== 'Received') {\\n                       addToast(`Inventory updated for ${order.item}`, 'success');\\n                       triggerHaptic('success');\\n                       // Just mock update for now\\n                    }\\n                  }\\n                  \\n                  const updatedOrders";

const newDropHandler = "if (status === 'Received') {\\n                    const order = orders.find(o => o.id === orderId);\\n                    if (order && order.status !== 'Received') {\\n                       setDroppedOrder(order);\\n                       return; // Do not update status until confirmed\\n                    }\\n                  }\\n                  \\n                  const updatedOrders";

code = code.replace(
  "if (status === 'Received') {\n                    const order = orders.find(o => o.id === orderId);\n                    if (order && order.status !== 'Received') {\n                       addToast(`Inventory updated for ${order.item}`, 'success');\n                       triggerHaptic('success');\n                       // Just mock update for now\n                    }\n                  }\n                  \n                  const updatedOrders",
  "if (status === 'Received') {\n                    const order = orders.find(o => o.id === orderId);\n                    if (order && order.status !== 'Received') {\n                       setDroppedOrder(order);\n                       return; // Do not update status until confirmed\n                    }\n                  }\n                  \n                  const updatedOrders"
);

const modalJSX = `
      {/* Inventory Update Modal */}
      {droppedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
           <div className="bg-white dark:bg-[#121212] rounded-[24px] w-full max-w-md p-6 shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-200">
             <button onClick={() => setDroppedOrder(null)} className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-[#222] rounded-full hover:bg-gray-200 transition-colors">
               <X className="w-4 h-4" />
             </button>
             <h3 className="text-lg font-bold mb-1 flex items-center gap-2"><Package className="w-5 h-5 text-emerald-500"/> Update Inventory</h3>
             <p className="text-xs text-gray-500 mb-4">Confirm quantity received to update inventory.</p>
             
             <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-[#1a1a1a] p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                   <div className="flex justify-between items-center mb-2 text-sm">
                      <span className="text-gray-500">Item</span>
                      <span className="font-bold text-gray-900 dark:text-white">{droppedOrder.item}</span>
                   </div>
                   <div className="flex justify-between items-center mb-2 text-sm">
                      <span className="text-gray-500">Supplier</span>
                      <span className="font-bold text-gray-900 dark:text-white line-clamp-1 text-right ml-4">{droppedOrder.supplierName}</span>
                   </div>
                   <div className="flex justify-between items-center text-sm border-t border-gray-200 dark:border-gray-700 pt-2">
                      <span className="text-gray-500">Ordered Qty</span>
                      <span className="font-bold text-gray-900 dark:text-white">{droppedOrder.quantity}</span>
                   </div>
                </div>
                
                <div>
                   <label className="block text-xs font-bold text-gray-500 mb-1">Received Quantity</label>
                   <input type="number" defaultValue={droppedOrder.quantity} className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                </div>
                
                <button 
                  onClick={() => {
                    const updatedOrders = orders.map(o => o.id === droppedOrder.id ? { ...o, status: 'Received' as any } : o);
                    setOrders(updatedOrders);
                    addToast('Inventory updated for ' + droppedOrder.item, 'success');
                    triggerHaptic('success');
                    setDroppedOrder(null);
                  }}
                  className="w-full bg-[#16321F] text-[#D9E96B] dark:text-[#D9E96B] dark:bg-[#16321F] hover:opacity-90 py-3 rounded-xl font-bold text-sm transition-colors mt-2"
                >
                  Confirm & Update
                </button>
             </div>
           </div>
        </div>
      )}
`;

code = code.replace(
  '{showNewSupplierModal && (',
  modalJSX + '\\n      {showNewSupplierModal && ('
);

fs.writeFileSync('src/components/StaffStock.tsx', code);
