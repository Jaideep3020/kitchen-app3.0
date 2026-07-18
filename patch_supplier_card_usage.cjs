const fs = require('fs');
let code = fs.readFileSync('src/components/StaffStock.tsx', 'utf8');

const replacement = `<SwipeableSupplierCard
                  key={supplier.id}
                  supplier={supplier}
                  hasOutStock={hasOutStock}
                  isReordering={isReordering}
                  isExpanded={isExpanded}
                  toggleDetails={toggleDetails}
                  handleReorderClick={handleReorderClick}
                  onOrder={(sup: any) => {
                    setPoData({ supplierId: sup.id, item: sup.items.length > 0 ? sup.items[0].name : '', quantity: 1, price: 0 });
                    setShowPOModal(true);
                    setPoStep(1);
                  }}
                  onAddCorrespondence={(id: string, type: 'Call' | 'Email', notes: string) => {
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
                  }}
                />`;

code = code.replace(
  /<SwipeableSupplierCard[\s\S]*?onOrder=\{\(sup: any\) => \{[\s\S]*?\}\}[\s\S]*?\/>/m,
  replacement
);

fs.writeFileSync('src/components/StaffStock.tsx', code);
