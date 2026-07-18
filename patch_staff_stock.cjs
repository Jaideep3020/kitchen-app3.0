const fs = require('fs');
let code = fs.readFileSync('src/components/StaffStock.tsx', 'utf8');

// Replace orderSubTab with order state mapping and drag handlers
// actually, I'll write the replacement code in a constant.

const kanbanCode = `
      {activeTab === 'orders' && (
        <section className="w-full flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Order Board</h3>
              <p className="text-xs text-gray-500">Drag and drop to update status</p>
            </div>
            <button onClick={() => { setShowPOModal(true); setPoStep(1); }} className="bg-[#16321F] text-[#D9E96B] px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 hover:opacity-90">
              <Plus className="w-4 h-4" /> Create PO
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
            {['Draft', 'Placed', 'In Transit', 'Received'].map((status) => (
              <div 
                key={status} 
                className="flex-1 min-w-[280px] bg-gray-50/50 dark:bg-[#1a1a1a]/50 p-3 rounded-[20px] border border-gray-100 dark:border-gray-800 snap-center flex flex-col"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add('bg-gray-100', 'dark:bg-[#222]');
                }}
                onDragLeave={(e) => {
                  e.currentTarget.classList.remove('bg-gray-100', 'dark:bg-[#222]');
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('bg-gray-100', 'dark:bg-[#222]');
                  const orderId = e.dataTransfer.getData('text/plain');
                  
                  // If transitioning to Received, we might want to update inventory
                  if (status === 'Received') {
                    const order = orders.find(o => o.id === orderId);
                    if (order && order.status !== 'Received') {
                       addToast(\`Inventory updated for \${order.item}\`, 'success');
                       triggerHaptic('success');
                       // Just mock update for now
                    }
                  }
                  
                  const updatedOrders = orders.map(o => o.id === orderId ? { ...o, status: status as any } : o);
                  setOrders(updatedOrders);
                }}
              >
                <div className="flex justify-between items-center mb-3 px-1">
                  <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">{status}</h4>
                  <span className="text-xs font-bold bg-white dark:bg-[#121212] px-2 py-0.5 rounded-full border border-gray-100 dark:border-gray-800">
                    {orders.filter(o => o.status === status).length}
                  </span>
                </div>
                
                <div className="flex flex-col gap-3 flex-grow">
                  {orders.filter(o => o.status === status).map(order => (
                    <div 
                      key={order.id} 
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', order.id);
                        e.currentTarget.classList.add('opacity-50');
                      }}
                      onDragEnd={(e) => {
                        e.currentTarget.classList.remove('opacity-50');
                      }}
                      className="bg-white dark:bg-[#121212] p-3 rounded-[16px] border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col cursor-grab active:cursor-grabbing hover:border-gray-300 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <div className={\`p-1.5 rounded-lg \${order.status === 'Placed' || order.status === 'In Transit' ? 'bg-blue-50 text-blue-600' : order.status === 'Received' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-600'}\`}>
                            {order.status === 'In Transit' ? <Truck className="w-3.5 h-3.5" /> : order.status === 'Received' ? <Check className="w-3.5 h-3.5" /> : <Package className="w-3.5 h-3.5" />}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-gray-900 dark:text-white line-clamp-1">{order.supplierName}</h4>
                          </div>
                        </div>
                      </div>
                      <div className="mb-2">
                        <p className="text-[11px] text-gray-500 font-medium">{order.item} × {order.quantity}</p>
                      </div>
                      <div className="mt-2 pt-2 border-t border-gray-50 dark:border-gray-800/50 flex justify-between items-center">
                         <span className="text-[10px] text-gray-400">PO #{order.id.split('_')[1] || order.id}</span>
                         <span className="text-xs font-black text-gray-900 dark:text-white">$\${order.price?.toLocaleString() || 0}</span>
                      </div>
                    </div>
                  ))}
                  {orders.filter(o => o.status === status).length === 0 && (
                    <div className="py-8 flex flex-col items-center justify-center text-center bg-gray-50/50 dark:bg-[#1a1a1a]/50 rounded-[12px] border border-dashed border-gray-200 dark:border-gray-800">
                       <p className="text-xs text-gray-400">Drop here</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-2 bg-white dark:bg-[#121212] p-5 rounded-[20px] border border-gray-100 dark:border-gray-800 shadow-sm">
             <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                  <MapPin className="w-4 h-4 text-emerald-600" /> Live Delivery Radar
                </h4>
                <div className="flex gap-2">
                   <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> {orders.filter(o => o.status === 'In Transit').length} Incoming</span>
                </div>
             </div>
             
             {/* Map Container */}
             <div className="relative w-full h-[250px] bg-[#eef3ea] dark:bg-[#151a15] rounded-[16px] overflow-hidden border border-gray-100 dark:border-gray-800">
                {/* Simulated Map Background */}
                <div className="absolute inset-0 opacity-40 dark:opacity-20" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%2316321F\\' fill-opacity=\\'0.2\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}></div>
                
                {/* Routes & Pins */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 400 250">
                  {/* Central Hub (Kitchen) */}
                  <circle cx="200" cy="125" r="8" fill="#16321F" className="dark:fill-[#D9E96B]" />
                  <circle cx="200" cy="125" r="16" fill="#16321F" opacity="0.2" className="animate-ping dark:fill-[#D9E96B]" />
                  <text x="200" y="150" textAnchor="middle" fontSize="10" fontWeight="bold" fill="currentColor" className="text-gray-800 dark:text-gray-200">Main Kitchen</text>
                  
                  {/* Active Routes */}
                  {orders.filter(o => o.status === 'In Transit').map((order, i) => {
                     const angles = [45, 135, 225, 315];
                     const angle = angles[i % angles.length];
                     const rad = angle * Math.PI / 180;
                     const distance = 80 + (i * 15); // Simulated distance
                     const cx = 200 + Math.cos(rad) * distance;
                     const cy = 125 + Math.sin(rad) * distance;
                     
                     // Calculate truck position (simulated progress)
                     const progress = 0.6 + (i * 0.1); 
                     const tx = cx + (200 - cx) * progress;
                     const ty = cy + (125 - cy) * progress;
                     
                     return (
                       <g key={order.id}>
                         <line x1={cx} y1={cy} x2="200" y2="125" stroke="#10b981" strokeWidth="2" strokeDasharray="4 4" className="opacity-50" />
                         <circle cx={cx} cy={cy} r="5" fill="#ef4444" />
                         <text x={cx} y={cy - 10} textAnchor="middle" fontSize="9" fontWeight="bold" fill="currentColor" className="text-gray-600 dark:text-gray-400">{order.supplierName.split(' ')[0]}</text>
                         
                         {/* Truck Icon (SVG) */}
                         <g transform={\`translate(\${tx - 8}, \${ty - 8})\`}>
                           <rect width="16" height="16" rx="8" fill="white" className="dark:fill-gray-800" stroke="#10b981" strokeWidth="2" />
                           <circle cx="8" cy="8" r="3" fill="#10b981" />
                         </g>
                         
                         {/* ETA Tooltip */}
                         <g transform={\`translate(\${tx + 12}, \${ty - 12})\`}>
                           <rect width="45" height="16" rx="4" fill="white" className="dark:fill-gray-800" shadow="sm" />
                           <text x="22.5" y="11" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#10b981">ETA 20m</text>
                         </g>
                       </g>
                     )
                  })}
                </svg>
             </div>
          </div>
        </section>
      )}
`

const startIndex = code.indexOf(`{activeTab === 'orders' && (`);
const endIndex = code.indexOf(`{/* New PO Drawer */}`);

if (startIndex !== -1 && endIndex !== -1) {
  code = code.substring(0, startIndex) + kanbanCode + '\n      ' + code.substring(endIndex);
  fs.writeFileSync('src/components/StaffStock.tsx', code);
  console.log("Updated StaffStock.tsx");
} else {
  console.log("Could not find boundaries");
}
