const fs = require('fs');
let code = fs.readFileSync('src/components/StaffStock.tsx', 'utf8');

// Add Phone Call / Mail icons import
code = code.replace(
  "MapPin, Package, Clock, FileText, Camera, X }",
  "MapPin, Package, Clock, FileText, Camera, X, PhoneCall, Mail }"
);

// Update SwipeableSupplierCard signature
code = code.replace(
  "const SwipeableSupplierCard = ({ supplier, hasOutStock, isReordering, isExpanded, toggleDetails, handleReorderClick, onOrder }: any) => {",
  "const SwipeableSupplierCard = ({ supplier, hasOutStock, isReordering, isExpanded, toggleDetails, handleReorderClick, onOrder, onAddCorrespondence }: any) => {\n  const [newNote, setNewNote] = useState('');\n  const [noteType, setNoteType] = useState<'Call' | 'Email'>('Call');"
);

// Add Correspondence UI
const correspondenceUI = `
              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">Correspondence</h4>
                <div className="space-y-2 mb-3 max-h-[150px] overflow-y-auto pr-1">
                  {supplier.correspondence && supplier.correspondence.length > 0 ? supplier.correspondence.map((c: any) => (
                    <div key={c.id} className="bg-white dark:bg-[#121212] border border-gray-100 dark:border-gray-800 p-2 rounded-lg text-xs flex gap-2">
                      {c.type === 'Call' ? <PhoneCall className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" /> : <Mail className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />}
                      <div>
                        <div className="flex justify-between items-start mb-0.5">
                          <span className="font-bold text-gray-900 dark:text-white">{c.type}</span>
                          <span className="text-[10px] text-gray-500">{c.date}</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">{c.notes}</p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-xs text-gray-500 italic">No correspondence logged yet.</p>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <select 
                    value={noteType} 
                    onChange={(e) => setNoteType(e.target.value as any)}
                    className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="Call">Call</option>
                    <option value="Email">Email</option>
                  </select>
                  <input 
                    type="text" 
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Notes..."
                    className="flex-grow bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newNote.trim()) {
                        e.preventDefault();
                        if (onAddCorrespondence) {
                          onAddCorrespondence(supplier.id, noteType, newNote.trim());
                          setNewNote('');
                        }
                      }
                    }}
                  />
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      if (newNote.trim() && onAddCorrespondence) {
                        onAddCorrespondence(supplier.id, noteType, newNote.trim());
                        setNewNote('');
                      }
                    }}
                    disabled={!newNote.trim()}
                    className="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-500 px-3 py-1.5 rounded-lg text-xs font-bold disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>
              </div>
`;

code = code.replace(
  '<div className="mt-2 flex flex-wrap gap-2">',
  correspondenceUI + '\n              <div className="mt-2 flex flex-wrap gap-2">'
);

fs.writeFileSync('src/components/StaffStock.tsx', code);
