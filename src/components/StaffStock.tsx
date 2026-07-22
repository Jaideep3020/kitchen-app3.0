import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reportIssue, updateSupplier } from '../api';
import { triggerHaptic } from '../lib/haptics';
import { Pressable } from './Pressable';
import React, { useState } from 'react';
import FocusTrap from 'focus-trap-react';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { MoreVertical, Truck, Check, Plus, ShoppingCart, Eye, EyeOff, AlertCircle, Search, ChevronDown, ChevronUp, Maximize2, Minimize2, MapPin, Package, Clock, FileText, Camera, X, PhoneCall, Mail } from 'lucide-react';
import { Supplier, ActiveOrder } from '../types';
import { motion, useAnimation, PanInfo, AnimatePresence } from 'motion/react';

interface StaffStockProps {
  initialTab?: 'suppliers' | 'orders';
  initialSearchQuery?: string;
  suppliers: Supplier[];
  onTriggerReorder: (supplierId: string) => void;
  onAddSupplier?: (supplier: Supplier) => void;
  onAddActivityLog?: (log: any) => void;
  initialDraftPO?: { item: string; supplierId: string } | null;
  onClearInitialDraftPO?: () => void;
}




const itemVariants = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } };
const SwipeableSupplierCard = ({ supplier, hasOutStock, isReordering, isExpanded, toggleDetails, handleReorderClick, onOrder, onAddCorrespondence }: any) => {
  const [newNote, setNewNote] = useState('');
  const [noteType, setNoteType] = useState<'Call' | 'Email'>('Call');
  const controls = useAnimation();
  
  const handleDragEnd = (event: any, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset > 80 || velocity > 500) {
      // Swiped right
      onOrder(supplier);
      controls.start({ x: 0 });
    } else if (offset < -80 || velocity < -500) {
      // Swiped left
      toggleDetails(supplier.id);
      controls.start({ x: 0 });
    } else {
      controls.start({ x: 0 });
    }
  };

  return (
    <motion.div variants={itemVariants as any} className="relative overflow-hidden rounded-[16px]] border border-gray-100 dark:border-gray-800 shadow-sm bg-gray-50 dark:bg-[#1a1a1a]">
      {/* Background Actions */}
      <div className="absolute inset-0 flex items-center justify-between px-6 z-0">
        <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
          <Plus className="w-5 h-5" /> Order
        </div>
        <div className="flex items-center gap-2 text-[#16321F] dark:text-[#D9E96B] font-bold text-sm">
          Details <Eye className="w-5 h-5" />
        </div>
      </div>

      {/* Foreground Card */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.4}
        onDragEnd={handleDragEnd}
        animate={controls}
        className="relative z-10 bg-white dark:bg-[#121212] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 h-full border border-gray-100 dark:border-gray-800 rounded-[16px] md:cursor-grab active:cursor-grabbing"
      >
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">{supplier.name}</h3>
            {supplier.category && <span className="text-[10px] font-bold bg-gray-100 dark:bg-[#222] text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">{supplier.category}</span>}
            {hasOutStock && <AlertCircle className="w-3.5 h-3.5 text-red-500" />}
          </div>
          
          <p className="text-xs text-gray-500 line-clamp-1 mb-2 pointer-events-none">
            {supplier.items.map((i: any) => i.name).join(', ')}
          </p>

          {isExpanded && (
            <div className="mt-3 p-3 bg-gray-50 dark:bg-[#1a1a1a] rounded-[12px] border border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-top-2 flex flex-col gap-2" onPointerDown={(e) => e.stopPropagation()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                  <p><span className="font-semibold">Email:</span> {supplier.email || 'N/A'}</p>
                  <p><span className="font-semibold">Phone:</span> {supplier.phone || 'N/A'}</p>
                </div>
                <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                  <p><span className="font-semibold">Distance:</span> {supplier.distance ? `${supplier.distance} km` : 'N/A'}</p>
                  <p><span className="font-semibold">Lead Time:</span> {supplier.leadTime || 'N/A'}</p>
                </div>
              </div>
              
              
              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 pointer-events-auto" onPointerDown={(e) => e.stopPropagation()}>
                <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">Correspondence</h4>
                <div className="space-y-2 mb-3 max-h-[150px] overflow-y-auto pr-1">
                  {supplier.correspondence && supplier.correspondence.length > 0 ? supplier.correspondence.map((c: any) => (
                    <div key={c.id} className="bg-white dark:bg-[#121212] border border-gray-100 dark:border-gray-800 p-2 rounded-lg text-xs flex gap-2">
                      {c.type === 'Call' ? <PhoneCall className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" /> : <Mail className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />}
                      <div>
                        <div className="flex justify-between items-start mb-0.5">
                          <span className="font-bold text-gray-900 dark:text-white">{c.type}</span>
                          <span className="text-[10px] text-gray-500 font-mono">{c.date}</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">{c.notes}</p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-xs text-gray-500 italic">No correspondence logged. Track emails and calls here to maintain a record.</p>
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
                  <Pressable 
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
                  </Pressable>
                </div>
              </div>

              <div className="mt-2 flex flex-wrap gap-2">
                 {supplier.items.map((item: any, index: number) => {
                   const isOut = item.status === 'Out';
                   const isLow = item.status === 'Low Stock';
                   return (
                     <span key={index} className={`px-2 py-1 rounded-[8px] text-[10px] font-bold ${isOut ? 'bg-red-50 text-red-700 border border-red-100' : isLow ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
                       {item.name} {isOut ? '(Out)' : isLow ? '(Low)' : ''}
                     </span>
                   )
                 })}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2 shrink-0 relative z-20">
          <Pressable glowColor="gray" onClick={(e) => { e.stopPropagation(); toggleDetails(supplier.id); }} className="px-3 py-1.5 bg-gray-100 dark:bg-[#222] hover:bg-gray-200 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-full transition-colors flex items-center gap-1 cursor-pointer">
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5"/> : <Maximize2 className="w-3.5 h-3.5" />}
            {isExpanded ? 'Collapse' : 'Catalog'}
          </Pressable>
          {supplier.attentionNeeded && (
            <Pressable
              onClick={(e) => { e.stopPropagation(); handleReorderClick(supplier.id); }}
              disabled={isReordering}
              className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer ${isReordering ? 'bg-[#16321F] text-white animate-pulse' : 'bg-[#16321F] text-white hover:bg-[#4a7c59]'}`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              {isReordering ? 'Sent ✔' : 'Reorder'}
            </Pressable>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function StaffStock({ initialTab, initialSearchQuery, suppliers, onTriggerReorder, onAddSupplier, onAddActivityLog, initialDraftPO, onClearInitialDraftPO }: StaffStockProps) {
  const { suppliers: contextSuppliers, setSuppliers, prepItems, setPrepItems, setActivityLogs } = useData();
  const { addToast } = useToast();
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
  const [isLoading, setIsLoading] = React.useState(true);
  const [activeTab, setActiveTab] = useState<'suppliers' | 'orders'>(initialTab || 'suppliers');
  React.useEffect(() => { if (initialTab) setActiveTab(initialTab); }, [initialTab]);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [isSubmittingIssue, setIsSubmittingIssue] = useState(false);
  
  React.useEffect(() => {
    const timer = setTimeout(() => { setIsLoading(false); }, 400);
    return () => clearTimeout(timer);
  }, []);




  // Supplier State
  const [reorderedSupplierIds, setReorderedSupplierIds] = useState<{ [key: string]: boolean }>({});
  const [showNewSupplierModal, setShowNewSupplierModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery || '');
  React.useEffect(() => { if (initialSearchQuery) setSearchQuery(initialSearchQuery); }, [initialSearchQuery]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedDetails, setExpandedDetails] = useState<{ [key: string]: boolean }>({});
  const [poMenuOpen, setPoMenuOpen] = useState(false);

  const toggleDetails = (supplierId: string) => {
    setExpandedDetails(prev => ({ ...prev, [supplierId]: !prev[supplierId] }));
  };

  const [newSupplierData, setNewSupplierData] = useState({
    name: '',
    category: 'Fresh Produce & Vegetables',
    items: '',
    email: '',
    phone: '',
    distance: '',
    leadTime: ''
  });

  const handleSaveSupplier = () => {
    if (!newSupplierData.name) return;
    const newItemNames = newSupplierData.items.split(',').map(i => i.trim()).filter(i => i);
    const newSupplier: Supplier = {
      id: `sup_${Date.now()}`,
      name: newSupplierData.name,
      category: newSupplierData.category,
      email: newSupplierData.email,
      phone: newSupplierData.phone,
      distance: newSupplierData.distance,
      leadTime: newSupplierData.leadTime,
      items: newItemNames.map(name => ({ name, status: 'In Stock' })),
      attentionNeeded: null,
      criticalMessage: null,
      statusText: 'All items stocked up'
    };
    if (onAddSupplier) {
      onAddSupplier(newSupplier);
    }
    setShowNewSupplierModal(false);
    setNewSupplierData({
      name: '', category: 'Fresh Produce & Vegetables', items: '', email: '', phone: '', distance: '', leadTime: ''
    });
  };

  const handleReorderClick = (supplierId: string) => {
    setReorderedSupplierIds(prev => ({ ...prev, [supplierId]: true }));
    onTriggerReorder(supplierId);
    setTimeout(() => {
      setReorderedSupplierIds(prev => ({ ...prev, [supplierId]: false }));
    }, 2000);
  };

  const filteredSuppliers = suppliers.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || (s.category && s.category.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Purchase Order State
  const { activeOrders: orders, setActiveOrders: setOrders } = useData();
  const [orderSubTab, setOrderSubTab] = useState<ActiveOrder['status']>('Placed');
  const [showPOModal, setShowPOModal] = useState<boolean>(() => {
    const saved = localStorage.getItem('draft_po_show');
    return saved === 'true';
  });
  const [poData, setPoData] = useState<{ supplierId: string; item: string; quantity: number; price: number }>(() => {
    const saved = localStorage.getItem('draft_po_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing saved PO draft', e);
      }
    }
    return { supplierId: '', item: '', quantity: 1, price: 0 };
  });
  const [droppedOrder, setDroppedOrder] = useState<ActiveOrder | null>(null);
  const [poStep, setPoStep] = useState<number>(() => {
    const saved = localStorage.getItem('draft_po_step');
    return saved ? Number(saved) : 1;
  });

  React.useEffect(() => {
    localStorage.setItem('draft_po_show', String(showPOModal));
  }, [showPOModal]);

  React.useEffect(() => {
    localStorage.setItem('draft_po_data', JSON.stringify(poData));
  }, [poData]);

  React.useEffect(() => {
    localStorage.setItem('draft_po_step', String(poStep));
  }, [poStep]);

  const handleSavePO = (status: 'Draft' | 'Placed') => {
    if (!poData.supplierId || !poData.item) return;
    const sup = suppliers.find(s => s.id === poData.supplierId);
    const newPO: ActiveOrder = {
      id: `po_${Date.now()}`,
      supplierId: poData.supplierId,
      supplierName: sup ? sup.name : '',
      item: poData.item,
      quantity: poData.quantity,
      price: poData.price,
      status,
      date: new Date().toLocaleDateString(), eta: status === 'Placed' ? 'Tomorrow' : ''
    };
    setOrders([newPO, ...orders]);
    setShowPOModal(false);
    setPoStep(1);
    setPoData({ supplierId: '', item: '', quantity: 1, price: 0 });
    setOrderSubTab(status as any);
  };

    React.useEffect(() => {
    if (initialTab === 'orders' && initialSearchQuery) {
      const found = orders.find(o => o.id.toLowerCase().includes(initialSearchQuery.toLowerCase()) || o.supplierName.toLowerCase().includes(initialSearchQuery.toLowerCase()));
      if (found) {
        setOrderSubTab(found.status);
      }
    }
  }, [initialTab, initialSearchQuery, orders]);

  React.useEffect(() => {
    if (initialDraftPO) {
      setPoData({
        supplierId: initialDraftPO.supplierId,
        item: initialDraftPO.item,
        quantity: 10,
        price: 45
      });
      setShowPOModal(true);
      setPoStep(1);
      setActiveTab('orders');
      setOrderSubTab('Draft');
      
      if (onClearInitialDraftPO) {
        onClearInitialDraftPO();
      }
    }
  }, [initialDraftPO, onClearInitialDraftPO]);

  const filteredOrders = orders.filter(o => o.status === orderSubTab && (o.id.toLowerCase().includes(searchQuery.toLowerCase()) || o.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) || o.item.toLowerCase().includes(searchQuery.toLowerCase())));
  const selectedSupplierForMap = suppliers.find(s => s.id === poData.supplierId);


  if (isLoading) {
    return (
      <div id="staff_stock_skeleton" className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-8 py-6 flex flex-col gap-4">
        {/* Skeleton Header */}
        <div className="mb-4 space-y-2">
          <div className="h-8 w-48 bg-gray-200 dark:bg-[#333] rounded-[20px] animate-skeleton-pulse"></div>
          <div className="h-4 w-64 bg-gray-100 dark:bg-[#222] rounded-xl animate-skeleton-pulse"></div>
        </div>
        
        {/* Skeleton Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-800 mb-6 gap-6 justify-between items-end">
          <div className="flex gap-6">
            <div className="h-6 w-32 bg-gray-200 dark:bg-[#222] rounded-t-md animate-skeleton-pulse"></div>
            <div className="h-6 w-32 bg-gray-100 dark:bg-[#1a1a1a] rounded-t-md animate-skeleton-pulse"></div>
          </div>
          <div className="h-8 w-32 bg-amber-50 dark:bg-amber-900/10 rounded-lg mb-2 animate-skeleton-pulse"></div>
        </div>

        {/* Skeleton Search Bar */}
        <div className="bg-white dark:bg-[#121212] p-4 rounded-[20px] border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center gap-3 animate-skeleton-pulse">
           <div className="h-6 w-full bg-gray-50 dark:bg-[#1a1a1a] rounded"></div>
           <div className="flex gap-3 w-full md:w-auto mt-3 md:mt-0">
             <div className="h-8 w-full md:w-40 bg-gray-100 dark:bg-[#222] rounded-full"></div>
             <div className="h-8 w-8 bg-gray-200 dark:bg-[#333] rounded-full shrink-0"></div>
           </div>
        </div>

        {/* Skeleton Cards */}
        <div className="flex flex-col gap-3 mt-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white dark:bg-[#121212] p-4 rounded-[20px] border border-gray-100 dark:border-gray-800 flex justify-between items-center animate-skeleton-pulse">
               <div className="flex items-center gap-4">
                 <div className="h-12 w-12 bg-gray-100 dark:bg-[#1a1a1a] rounded-full"></div>
                 <div className="space-y-2">
                   <div className="h-4 w-40 bg-gray-200 dark:bg-[#222] rounded"></div>
                   <div className="h-3 w-24 bg-gray-100 dark:bg-[#1a1a1a] rounded"></div>
                 </div>
               </div>
               <div className="flex gap-2">
                 <div className="h-8 w-20 bg-gray-100 dark:bg-[#1a1a1a] rounded-full"></div>
                 <div className="h-8 w-8 bg-gray-200 dark:bg-[#222] rounded-full"></div>
               </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div id="staff_stock" className="flex-grow max-w-7xl mx-auto w-full px-4 md:px-8 py-6 space-y-6">
      <div className="mb-4">
        <h2 className="text-3xl font-extrabold text-[#0A170E] dark:text-white mb-1">Supply Chain Hub</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage suppliers and purchase orders efficiently.</p>
      </div>

      <div className="flex justify-between items-end border-b border-gray-100 dark:border-gray-800 mb-4">
        <div className="flex gap-6">
        <Pressable 
          onClick={() => setActiveTab('suppliers')} 
          className={`pb-2 text-sm font-bold transition-colors ${activeTab === 'suppliers' ? 'border-b-2 border-[#16321F] dark:border-[#D9E96B] text-[#16321F] dark:text-[#D9E96B]' : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
        >
          Supplier Directory
        </Pressable>
        <Pressable 
          onClick={() => setActiveTab('orders')} 
          className={`pb-2 text-sm font-bold transition-colors ${activeTab === 'orders' ? 'border-b-2 border-[#16321F] dark:border-[#D9E96B] text-[#16321F] dark:text-[#D9E96B]' : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
        >
          Purchase Orders
        </Pressable>
        </div>
        <Pressable onClick={() => setShowIssueModal(true)} className="mb-2 px-3 py-1.5 text-xs font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-500 rounded-lg flex items-center gap-1 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors">
          <AlertCircle className="w-4 h-4" /> Report Issue
        </Pressable>
      </div>

      {activeTab === 'suppliers' && (
        <section className="w-full flex flex-col gap-4">
          <div className="bg-white dark:bg-[#121212] p-4 rounded-[20px] border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col md:flex-row items-center gap-3">
            <div className="flex-grow flex items-center gap-3 w-full border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-800 pb-3 md:pb-0 md:pr-3">
              <Search className="w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search suppliers by name or category..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none focus:outline-none text-sm text-gray-900 dark:text-white placeholder:text-gray-400"
              />
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-between">
              <div className="relative group flex-grow md:flex-grow-0 min-w-[150px]">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full appearance-none bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 py-2 pl-4 pr-10 rounded-[12px] text-sm focus:outline-none focus:border-[#16321F] dark:focus:border-[#D9E96B] cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  {Array.from(new Set(suppliers.map(s => s.category).filter(Boolean))).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <Pressable onClick={() => setShowNewSupplierModal(true)} className="p-2 bg-[#16321F] text-white rounded-full hover:opacity-90 flex-shrink-0 transition-opacity">
                <Plus className="w-4 h-4" />
              </Pressable>
            </div>
          </div>

          <motion.div 
            initial="hidden" 
            animate="show" 
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
            className="flex flex-col gap-3"
          >
            {filteredSuppliers.map(supplier => {
              const hasOutStock = supplier.items.some(i => i.status === 'Out');
              const isReordering = !!reorderedSupplierIds[supplier.id];
              const isExpanded = expandedDetails[supplier.id];
              
              return (
                <SwipeableSupplierCard
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
                  onAddCorrespondence={async (id: string, type: 'Call' | 'Email', notes: string) => {
                     const newCorrespondence = {
                        id: `cor_${Date.now()}`,
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
                  }}
                />
              );
            })}
            {filteredSuppliers.length === 0 && (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <Search className="w-8 h-8 text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">No suppliers found matching your search. Try adjusting the name or add a new supplier.</p>
              </div>
            )}
          </motion.div>
        </section>
      )}

      
      {activeTab === 'orders' && (
        <section className="w-full flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Order Board</h3>
              <p className="text-xs text-gray-500">Drag and drop to update status</p>
            </div>
            <Pressable onClick={() => { setShowPOModal(true); setPoStep(1); }} className="bg-[#16321F] text-[#D9E96B] px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 hover:opacity-90">
              <Plus className="w-4 h-4" /> Create PO
            </Pressable>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory touch-pan-x">
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
                       setDroppedOrder(order);
                       return; // Do not update status until confirmed
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
                          <div className={`p-1.5 rounded-lg ${order.status === 'Placed' || order.status === 'In Transit' ? 'bg-blue-50 text-blue-600' : order.status === 'Received' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-600'}`}>
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
                         <span className="text-xs font-black text-gray-900 dark:text-white">${order.price?.toLocaleString() || 0}</span>
                       </div>
                       {(order.status === 'Placed' || order.status === 'In Transit') && (
                         <div className="mt-2">
                           <div className="flex justify-between items-center mb-1 text-[10px]">
                             <span className="font-bold text-gray-500 uppercase tracking-wider">
                               {order.eta.toLowerCase().includes('today') ? 'Arriving Today' : 
                                order.eta.toLowerCase().includes('tomorrow') ? 'Arriving Tomorrow' : 
                                order.eta}
                             </span>
                             <span className="font-bold text-gray-900 dark:text-white">
                               {order.eta.toLowerCase().includes('today') ? '80%' : 
                                order.eta.toLowerCase().includes('tomorrow') ? '40%' : '10%'}
                             </span>
                           </div>
                           <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                             <div 
                               className="bg-blue-500 h-full rounded-full transition-all duration-500"
                               style={{ width: order.eta.toLowerCase().includes('today') ? '80%' : order.eta.toLowerCase().includes('tomorrow') ? '40%' : '10%' }}
                             ></div>
                           </div>
                         </div>
                       )}
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
                <div className="absolute inset-0 opacity-40 dark:opacity-20" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%2316321F\' fill-opacity=\'0.2\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}></div>
                
                {/* Routes & Pins */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 400 250">
                  {/* Central Hub (Kitchen) */}
                  <circle cx="200" cy="125" r="8" fill="#16321F" className="dark:fill-[#D9E96B]" />
                  <circle cx="200" cy="125" r="16" fill="#16321F" opacity="0.2" className="animate-ping dark:fill-[#D9E96B]" />\n  <circle cx="200" cy="125" r="120" fill="none" stroke="#10b981" strokeWidth="1" strokeOpacity="0.15" />\n  <circle cx="200" cy="125" r="80" fill="none" stroke="#10b981" strokeWidth="1" strokeOpacity="0.15" />\n  <circle cx="200" cy="125" r="40" fill="none" stroke="#10b981" strokeWidth="1" strokeOpacity="0.15" />\n  <path d="M 200 125 L 200 5 A 120 120 0 0 1 320 125 Z" fill="#10b981" fillOpacity="0.05" className="animate-radar origin-[200px_125px]" />
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
                         <line x1={cx} y1={cy} x2="200" y2="125" stroke="#10b981" strokeWidth="2" strokeDasharray="4 4" className="opacity-50 animate-[dash_1s_linear_infinite]" />
                         <circle cx={cx} cy={cy} r="5" fill="#ef4444" />
                         <text x={cx} y={cy - 10} textAnchor="middle" fontSize="9" fontWeight="bold" fill="currentColor" className="text-gray-600 dark:text-gray-400">{order.supplierName.split(' ')[0]}</text>
                         
                         {/* Truck Icon (SVG) */}
                         <g transform={`translate(${tx - 8}, ${ty - 8})`}>
                           <rect width="16" height="16" rx="8" fill="white" className="dark:fill-gray-800" stroke="#10b981" strokeWidth="2" />
                           <circle cx="8" cy="8" r="3" fill="#10b981" />
                         </g>
                         
                         {/* ETA Tooltip */}
                         <g transform={`translate(${tx + 12}, ${ty - 12})`}>
                           <rect width="45" height="16" rx="4" fill="white" className="dark:fill-gray-800"  />
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

      {/* New PO Drawer */}
      <AnimatePresence>
      {showPOModal && (
        <FocusTrap>
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={() => setShowPOModal(false)}
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-[60] w-full md:w-[480px] bg-white dark:bg-[#121212] border-l border-gray-100 dark:border-gray-800 shadow-2xl flex flex-col"
          >
            <div className="p-4 md:p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-[#1a1a1a]/50 shrink-0">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Draft Purchase Order</h3>
                <p className="text-xs text-gray-500 mt-1">Step {poStep} of 2</p>
              </div>
              <Pressable onClick={() => setShowPOModal(false)} className="p-2 bg-gray-100 dark:bg-[#222] rounded-full hover:bg-gray-200 dark:hover:bg-[#333] transition-colors">
                <Plus className="w-5 h-5 rotate-45 text-gray-500" />
              </Pressable>
            </div>
            
            <div className="flex-grow overflow-y-auto p-4 md:p-6 space-y-6">
              {poStep === 1 ? (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-5"
                >
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">1. Select Supplier</label>
                    <select 
                      value={poData.supplierId} 
                      onChange={e => {
                        const supId = e.target.value;
                        const sup = suppliers.find(s => s.id === supId);
                        setPoData({...poData, supplierId: supId, item: sup && sup.items.length > 0 ? sup.items[0].name : ''});
                      }}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-[16px] text-sm bg-white dark:bg-[#121212] focus:outline-none focus:ring-2 focus:ring-[#16321F]/20 focus:border-[#16321F] dark:focus:ring-[#D9E96B]/20 font-medium transition-all"
                    >
                      <option value="" disabled>Choose a supplier...</option>
                      {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  
                  {poData.supplierId && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-5">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">2. Raw Material</label>
                        <select 
                          value={poData.item} 
                          onChange={e => setPoData({...poData, item: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-[16px] text-sm bg-white dark:bg-[#121212] focus:outline-none focus:ring-2 focus:ring-[#16321F]/20 focus:border-[#16321F] dark:focus:ring-[#D9E96B]/20 font-medium transition-all"
                        >
                          <option value="" disabled>Select material...</option>
                          {suppliers.find(s => s.id === poData.supplierId)?.items.map((i, idx) => (
                            <option key={idx} value={i.name}>{i.name}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">Quantity</label>
                          <div className="relative">
                            <input 
                              type="number" 
                              min="1" 
                              value={poData.quantity} 
                              onChange={e => setPoData({...poData, quantity: Number(e.target.value) || 0})} 
                              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-[16px] text-sm bg-white dark:bg-[#121212] focus:outline-none focus:ring-2 focus:ring-[#16321F]/20 focus:border-[#16321F] dark:focus:ring-[#D9E96B]/20 font-medium transition-all" 
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">Est. Price ($)</label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                            <input 
                              type="number" 
                              min="0" 
                              value={poData.price} 
                              onChange={e => setPoData({...poData, price: Number(e.target.value) || 0})} 
                              className="w-full pl-8 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-[16px] text-sm bg-white dark:bg-[#121212] focus:outline-none focus:ring-2 focus:ring-[#16321F]/20 focus:border-[#16321F] dark:focus:ring-[#D9E96B]/20 font-medium transition-all" 
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5 h-full flex flex-col"
                >
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Review Logistics & Map</h4>
                    <div className="bg-[#16321F]/5 dark:bg-[#D9E96B]/5 border border-[#16321F]/10 dark:border-[#D9E96B]/10 rounded-[16px] overflow-hidden flex flex-col h-[200px]">
                      <div className="p-3 flex items-center gap-3 bg-white/50 dark:bg-black/20 shrink-0">
                         <div className="bg-[#16321F]/10 dark:bg-[#D9E96B]/10 p-2 rounded-full shrink-0">
                           <MapPin className="w-4 h-4 text-[#16321F] dark:text-[#D9E96B]" />
                         </div>
                         <div>
                           <h4 className="text-xs font-bold text-gray-900 dark:text-white line-clamp-1">{selectedSupplierForMap?.name}</h4>
                           <p className="text-[10px] text-gray-600 dark:text-gray-400 font-medium">Distance: {selectedSupplierForMap?.distance || '15'} km • SLA: {selectedSupplierForMap?.leadTime || 'Daily'}</p>
                         </div>
                      </div>
                      <div className="flex-grow w-full relative">
                        <iframe 
                          width="100%" 
                          height="100%" 
                          className="border-0 pointer-events-none"
                          src="https://www.openstreetmap.org/export/embed.html?bbox=77.59,12.97,77.60,12.98&layer=mapnik&marker=12.975,77.595"
                          title="Supplier Location"
                        ></iframe>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-[#1a1a1a] rounded-[16px] p-4 border border-gray-100 dark:border-gray-800">
                    <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Order Summary</h4>
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-400">Supplier:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{selectedSupplierForMap?.name}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-400">Item:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{poData.item}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-400">Quantity:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{poData.quantity}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
                      <span className="font-bold text-gray-900 dark:text-white">Est. Total:</span>
                      <span className="font-black text-[#16321F] dark:text-[#D9E96B]">${poData.price}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
            
            <div className="p-4 md:p-6 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#121212] flex gap-3 shrink-0">
              {poStep === 1 ? (
                <>
                  <Pressable onClick={() => setShowPOModal(false)} className="flex-1 py-3 text-sm font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-[#222] hover:bg-gray-200 dark:hover:bg-[#333] rounded-[16px] transition-colors">
                    Cancel
                  </Pressable>
                  <Pressable 
                    onClick={() => setPoStep(2)} 
                    disabled={!poData.supplierId || !poData.item}
                    className="flex-1 py-3 text-sm font-bold text-white bg-[#16321F] hover:bg-[#1e4429] dark:text-black dark:bg-[#D9E96B] dark:hover:bg-[#c8d85b] rounded-[16px] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Step
                  </Pressable>
                </>
              ) : (
                <>
                  <Pressable onClick={() => setPoStep(1)} className="text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors flex items-center pr-2">
                    <ChevronDown className="w-4 h-4 rotate-90 mr-0.5" /> Back
                  </Pressable>
                  <div className="flex-1"></div>
                  <div className="relative">
                    <Pressable 
                      onClick={() => setPoMenuOpen(!poMenuOpen)} 
                      className="h-[48px] w-[48px] flex items-center justify-center text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-[#222] hover:bg-gray-200 dark:hover:bg-[#333] rounded-[16px] transition-colors"
                      aria-label="More options"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </Pressable>
                    {poMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setPoMenuOpen(false)}></div>
                        <div className="absolute bottom-full right-0 mb-2 w-48 bg-white dark:bg-[#2a2a2a] rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden z-50 animate-fade-in origin-bottom-right">
                          <Pressable 
                            onClick={() => { handleSavePO('Draft'); setPoMenuOpen(false); }} 
                            className="w-full text-left px-4 py-3 text-sm font-bold text-[#16321F] dark:text-[#D9E96B] hover:bg-gray-50 dark:hover:bg-[#333] transition-colors"
                          >
                            Save as Draft
                          </Pressable>
                        </div>
                      </>
                    )}
                  </div>
                  {/* Consolidated secondary actions per audit (surface action, not just data) */}
                  <Pressable onClick={() => handleSavePO('Placed')} className="px-6 h-[48px] text-sm font-bold text-white bg-[#16321F] hover:bg-[#1e4429] dark:text-black dark:bg-[#D9E96B] dark:hover:bg-[#c8d85b] rounded-[16px] transition-colors shadow-sm">
                    Place Order
                  </Pressable>
                </>
              )}
            </div>
          </motion.div>
        </>
        </FocusTrap>
      )}
      </AnimatePresence>

      {/* Report Issue Modal */}
      {showIssueModal && (
        <FocusTrap>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
           <div className="bg-white dark:bg-[#121212] rounded-[24px] w-full max-w-md p-6 shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-200">
             <Pressable onClick={() => setShowIssueModal(false)} className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-[#222] rounded-full hover:bg-gray-200 transition-colors">
               <X className="w-4 h-4" />
             </Pressable>
             <h3 className="text-lg font-bold mb-1 flex items-center gap-2"><AlertCircle className="w-5 h-5 text-amber-500"/> Report Stock Issue</h3>
             <p className="text-xs text-gray-500 mb-4">Log a discrepancy, damage, or quality issue with stock.</p>
             
             <form onSubmit={(e) => {
               e.preventDefault();
               setIsSubmittingIssue(true);
               const formData = new FormData(e.target as HTMLFormElement);
               const data = Object.fromEntries(formData);
               data.itemName = data.type + ' Issue'; // Mock item name
               
               // Ignore photo conversion for simplicity in React Query transition
               reportIssueMutation.mutate(data);
             }} className="space-y-4">
               <div>
                 <label className="block text-xs font-bold text-gray-500 mb-1">Issue Category</label>
                 <select name="type" className="touch-manipulation min-h-[44px] w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500">
                   <option value="Damage">Damage</option>
                   <option value="Missing Quantity">Missing Quantity</option>
                   <option value="Quality">Poor Quality / Spoilage</option>
                   <option value="Other">Other</option>
                 </select>
               </div>
               <div className="grid grid-cols-2 gap-3">
                 <div>
                   <label className="block text-xs font-bold text-gray-500 mb-1">Item Category</label>
                   <input required type="text" name="category" placeholder="e.g. Vegetables" className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-gray-500 mb-1">Item Name</label>
                   <input required type="text" name="itemName" placeholder="e.g. Tomatoes" className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                 </div>
               </div>
               <div>
                 <label className="block text-xs font-bold text-gray-500 mb-1">Description</label>
                 <textarea required name="description" rows={3} placeholder="Describe the issue in detail..." className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"></textarea>
               </div>
               <div>
                 <label className="block text-xs font-bold text-gray-500 mb-1">Photo Evidence (Required for verification)</label>
                 <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl cursor-pointer bg-gray-50 dark:bg-[#1a1a1a] hover:bg-gray-100 dark:hover:bg-[#222]">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Camera className="w-6 h-6 text-gray-400 mb-2" />
                            <p className="text-xs text-gray-500">Tap to upload a photo</p>
                        </div>
                        <input required type="file" name="image" className="hidden" accept="image/*" />
                    </label>
                 </div>
               </div>
               <Pressable disabled={isSubmittingIssue} type="submit" className="w-full bg-amber-500 text-white py-3 rounded-xl font-bold text-sm hover:bg-amber-600 transition-colors mt-2 disabled:opacity-50">
                 {isSubmittingIssue ? 'Submitting...' : 'Submit Issue'}
               </Pressable>
             </form>
           </div>
        </div>
        </FocusTrap>
      )}

      {/* New Supplier Modal */}
      
      {/* Inventory Update Modal */}
      {droppedOrder && (
        <FocusTrap>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
           <div className="bg-white dark:bg-[#121212] rounded-[24px] w-full max-w-md p-6 shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-200">
             <Pressable onClick={() => setDroppedOrder(null)} className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-[#222] rounded-full hover:bg-gray-200 transition-colors">
               <X className="w-4 h-4" />
             </Pressable>
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
                
                <Pressable 
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
                </Pressable>
             </div>
           </div>
        </div>
        </FocusTrap>
      )}
\n      {showNewSupplierModal && (
        <FocusTrap>
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#121212] rounded-[24px] p-6 w-full max-w-md border border-gray-100 dark:border-gray-800 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Add New Supplier</h3>
              <Pressable onClick={() => setShowNewSupplierModal(false)} className="text-gray-400 hover:text-gray-600">
                <Plus className="w-5 h-5 rotate-45" />
              </Pressable>
            </div>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Company Name</label>
                <input type="text" value={newSupplierData.name} onChange={e => setNewSupplierData({...newSupplierData, name: e.target.value})} placeholder="e.g. Fresh Farms Veggies" className="w-full px-3 py-2 border border-gray-200 rounded-[12px] text-sm focus:outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
                <select value={newSupplierData.category} onChange={e => setNewSupplierData({...newSupplierData, category: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-[12px] text-sm focus:outline-none focus:border-emerald-500">
                  <option>Fresh Produce & Vegetables</option>
                  <option>Dairy & Poultry</option>
                  <option>Dry Goods & Grains</option>
                  <option>Meat & Seafood</option>
                  <option>Beverages</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Items Supplied (comma separated)</label>
                <input type="text" value={newSupplierData.items} onChange={e => setNewSupplierData({...newSupplierData, items: e.target.value})} placeholder="e.g. Tomatoes, Sona Masuri Rice" className="w-full px-3 py-2 border border-gray-200 rounded-[12px] text-sm focus:outline-none focus:border-emerald-500" />
              </div>
            </div>
            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
              <Pressable onClick={() => setShowNewSupplierModal(false)} className="flex-1 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-[12px]">Cancel</Pressable>
              <Pressable onClick={handleSaveSupplier} className="flex-1 py-2 text-sm font-bold text-white bg-[#16321F] rounded-[12px]">Save Supplier</Pressable>
            </div>
          </div>
        </div>
        </FocusTrap>
      )}
    </div>
  );
}
