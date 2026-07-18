import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, RotateCw, Plus, Minus, AlertTriangle, CheckCircle2, Search, Filter, Trash2, Utensils, Scale, LayoutGrid, ShoppingCart, Truck, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { InventoryItem, PrepProgress } from '../types';
import { triggerHaptic } from '../lib/haptics';
import { ErrorBoundary } from './ErrorBoundary';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';

interface StaffOpsProps {
 initialSearchQuery?: string;
 prepItems: InventoryItem[];
 setPrepItems: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
 optInCount: number;
 onLogWaste: (itemName: string, kitchenQty: number, plateQty: number) => void;
 onPlacePurchaseOrder?: (itemName: string, qty: number, unit: string, supplierName: string) => void;
 selectedDate?: Date;
 selectedDay?: string;
 onDateChange?: (date: Date) => void;
 onDayChange?: (day: string) => void;
}

type CategoryType = 'all' | 'grains_lentils' | 'proteins_dairy' | 'vegetables' | 'spices_condiments';

 export default function StaffOps({ 
 initialSearchQuery,
 prepItems, 
 setPrepItems, 
 optInCount, 
 onLogWaste, 
 onPlacePurchaseOrder,
 selectedDate,
 selectedDay,
 onDateChange,
 onDayChange
}: StaffOpsProps) {
 const { menuItems, wasteLogs, setWasteLogs, prepProgress, setPrepProgress, mealOptIns, activeOrders, recipes } = useData();
 const { addToast } = useToast();
 // Stateful filter & category options
 const [isSavingPrep, setIsSavingPrep] = useState(false);
 const [isLoading, setIsLoading] = useState(true);

 // Simulate skeleton loaders for high-performance feel
 React.useEffect(() => {
 const timer = setTimeout(() => {
 setIsLoading(false);
 }, 400);
 return () => clearTimeout(timer);
 }, []);

 const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
 const [searchQuery, setSearchQuery] = useState(initialSearchQuery || '');
 React.useEffect(() => { if (initialSearchQuery) { setSearchQuery(initialSearchQuery); setIsTrackerExpanded(true); } }, [initialSearchQuery]);
 const [filterLowStock, setFilterLowStock] = useState(false);

 // Date Stock Filter Mode
 const [stockDateFilterMode, setStockDateFilterMode] = useState<'all' | 'active-day' | 'custom'>('all');
 const [customFilterDate, setCustomFilterDate] = useState<string>('2026-07-09');
 const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

 // Reorder panel states
 const [activeReorderItemId, setActiveReorderItemId] = useState<string | null>(null);
 const [orderQty, setOrderQty] = useState<number>(30);
 const [orderSupplier, setOrderSupplier] = useState<string>('Rice-Corp');
 const [orderUnit, setOrderUnit] = useState<string>('kg');
 const AVAILABLE_UNITS = ['kg', 'g', 'L', 'ml', 'pcs', 'boxes', 'packets', 'bunches'];

  // Dynamic waste log entry state
 const [selectedIngredientId, setSelectedIngredientId] = useState('');
 React.useEffect(() => {
   const activePrepDayForWaste = selectedDay || 'Thursday';
   const dishesForDayForWaste = menuItems.filter(item => item.dayOfWeek === activePrepDayForWaste);
   if (dishesForDayForWaste.length > 0 && !dishesForDayForWaste.find(d => d.id === selectedIngredientId)) {
     setSelectedIngredientId(dishesForDayForWaste[0].id);
   }
 }, [selectedDay, selectedIngredientId, menuItems]);
 const [kitchenWaste, setKitchenWaste] = useState(1.5);
 const [plateWaste, setPlateWaste] = useState(2.0);

 // Historical waste logging list for this session
 const [loggedWasteEntries, setLoggedWasteEntries] = useState<Array<{
 id: string;
 itemName: string;
 kitchenQty: number;
 plateQty: number;
 timestamp: string;
 }>>([
 { id: '1', itemName: 'Sona Masuri / Raw Rice', kitchenQty: 2.5, plateQty: 4.2, timestamp: '10:15 AM' },
 { id: '2', itemName: 'Toor Dal & Moong Dal', kitchenQty: 1.0, plateQty: 3.8, timestamp: '09:45 AM' },
 { id: '3', itemName: 'Milk, Curd & Buttermilk', kitchenQty: 0.5, plateQty: 1.5, timestamp: '08:30 AM' }
 ]);


 // Minimization / Expansion of Raw Materials Tracker
 const [isTrackerExpanded, setIsTrackerExpanded] = useState(true);
 const [isWasteExpanded, setIsWasteExpanded] = useState(false);
 const [isPrepExpanded, setIsPrepExpanded] = useState(false);

 // Preparation tracker states
 const [prepVolUnit, setPrepVolUnit] = useState<'kg' | 'lbs'>('kg');
 const [prepPortions, setPrepPortions] = useState<{ [key: string]: number }>({
 'mon_bf': 180, 'mon_lh': 220, 'mon_dn': 200,
 'tue_bf': 170, 'tue_lh': 230, 'tue_dn': 250,
 'wed_bf': 190, 'wed_lh': 210, 'wed_dn': 200,
 'thu_bf': 180, 'thu_lh': 240, 'thu_dn': 210,
 'fri_bf': 200, 'fri_lh': 250, 'fri_dn': 220,
 'sat_bf': 160, 'sat_lh': 220, 'sat_dn': 200,
 'sun_bf': 220, 'sun_lh': 280, 'sun_dn': 240
 });

 
  React.useEffect(() => {
    const day = selectedDay || 'Thursday';
    const saved = prepProgress.find((p: PrepProgress) => p.day === day);
    if (saved) {
      setPrepPortions(saved.portions);
    }
  }, [selectedDay, prepProgress]);

 // Category display names
 const categoryLabels: Record<CategoryType, string> = {
 all: 'All Ingredients',
 grains_lentils: 'Grains & Lentils',
 proteins_dairy: 'Proteins & Dairy',
 vegetables: 'Vegetables',
 spices_condiments: 'Spices & Condiments'
 };

 // Day of week to ingredient names map
 const DAY_INGREDIENTS: { [key: string]: string[] } = {
 Monday: [
 'Idli Rice & Urad Dal', 'Toor Dal & Moong Dal', 'Fresh Coconuts', 'Sambar & Rasam Powder',
 'Sona Masuri / Raw Rice', 'Onions & Tomatoes', 'Cabbage & Carrots & Beans',
 'Wheat Flour (Atta)', 'Milk, Curd & Buttermilk'
 ],
 Tuesday: [
 'Rava (Semolina) & Poha', 'Chana Dal & Peanuts', 'Lemons & Bananas',
 'Sona Masuri / Raw Rice', 'Toor Dal & Moong Dal', 'Potatoes',
 'Basmati / Jeera Samba Rice', 'Eggs, Chicken, Paneer', 'Milk, Curd & Buttermilk', 'Onions & Tomatoes'
 ],
 Wednesday: [
 'Idli Rice & Urad Dal', 'Potatoes', 'Onions & Tomatoes', 'Toor Dal & Moong Dal',
 'Sona Masuri / Raw Rice', 'Spinach/Palak & Mango/Gongura', 'Bhindi (Okra) & Ivy Gourd', 'Milk, Curd & Buttermilk',
 'Wheat Flour (Atta)', 'Soya Chunks (Meal Maker)'
 ],
 Thursday: [
 'Sona Masuri / Raw Rice', 'Toor Dal & Moong Dal', 'Idli Rice & Urad Dal', 'Fresh Coconuts',
 'Cabbage & Carrots & Beans', 'Pickles & Papad',
 'Wheat Flour (Atta)', 'Milk, Curd & Buttermilk'
 ],
 Friday: [
 'Rava (Semolina) & Poha', 'Chana Dal & Peanuts', 'Eggs, Chicken, Paneer', 'Coriander, Mint & Curry Leaves',
 'Sona Masuri / Raw Rice', 'Spinach/Palak & Mango/Gongura', 'Bhindi (Okra) & Ivy Gourd', 'Toor Dal & Moong Dal',
 'Wheat Flour (Atta)', 'White Chana (Chickpeas)', 'Milk, Curd & Buttermilk'
 ],
 Saturday: [
 'Wheat Flour (Atta)', 'Potatoes', 'Onions & Tomatoes', 'Cooking Oil & Ghee',
 'Sona Masuri / Raw Rice', 'Tamarind & Jaggery', 'Toor Dal & Moong Dal', 'Cabbage & Carrots & Beans',
 'Basmati / Jeera Samba Rice', 'Cauliflower (Gobi)', 'Soy Sauce & Vinegar'
 ],
 Sunday: [
 'Maida & Besan', 'Milk, Curd & Buttermilk', 'Green Chilies, Ginger & Garlic', 'Tamarind & Jaggery',
 'Basmati / Jeera Samba Rice', 'Eggs, Chicken, Paneer', 'Onions & Tomatoes', 'Sugar / Vermicelli / Sago',
 'Idli Rice & Urad Dal', 'Toor Dal & Moong Dal', 'Fresh Coconuts', 'Sambar & Rasam Powder'
 ]
 };

 const getWeekdayName = (dateStr: string) => {
 if (!dateStr) return 'Thursday';
 const d = new Date(dateStr);
 const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
 return weekdays[d.getDay()];
 };

 // Filter raw materials based on search query, category, and low stock status
 const filteredPrepItems = prepItems.filter(item => {
 const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
 const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
 const matchesLowStock = !filterLowStock || item.status === 'Low' || item.status === 'Out';
 
 // Day/Date filter
 let matchesDate = true;
 if (stockDateFilterMode === 'active-day') {
 const activeDayName = selectedDay || 'Thursday';
 const itemsForDay = DAY_INGREDIENTS[activeDayName] || [];
 matchesDate = itemsForDay.some(dayItem => 
 dayItem.toLowerCase().includes(item.name.toLowerCase()) || 
 item.name.toLowerCase().includes(dayItem.toLowerCase())
 );
 } else if (stockDateFilterMode === 'custom') {
 const activeDayName = getWeekdayName(customFilterDate);
 const itemsForDay = DAY_INGREDIENTS[activeDayName] || [];
 matchesDate = itemsForDay.some(dayItem => 
 dayItem.toLowerCase().includes(item.name.toLowerCase()) || 
 item.name.toLowerCase().includes(dayItem.toLowerCase())
 );
 }

 return matchesSearch && matchesCategory && matchesLowStock && matchesDate;
 });

 const handleLogWasteClick = (e: React.FormEvent) => {
 e.preventDefault();
 const activePrepDayForWaste = selectedDay || 'Thursday';
 const dishesForDayForWaste = menuItems.filter(item => item.dayOfWeek === activePrepDayForWaste);
 const targetItem = dishesForDayForWaste.find(item => item.id === selectedIngredientId);
 if (!targetItem) return;

 onLogWaste(targetItem.name, kitchenWaste, plateWaste);

 // Add locally to session list
 const newEntry = {
 id: Date.now().toString(),
 itemName: targetItem.name,
 kitchenQty: kitchenWaste,
 plateQty: plateWaste,
 timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
 };
 setLoggedWasteEntries(prev => [newEntry, ...prev]);

 // Highlight update
 addToast(`Successfully logged ${kitchenWaste}kg over-prep & ${plateWaste}kg plate waste for ${targetItem.name}.`, 'success');
 
 // Reset values slightly
 setKitchenWaste(1.0);
 setPlateWaste(1.5);

 setTimeout(() => {
 }, 4000);
 };

 // Waste Tracker calculations based on session waste logs
 const totalPrepared = 160; // Base target total in kg prepared across standard staples + daily special rotation
 const totalKitchenWaste = parseFloat(loggedWasteEntries.reduce((sum, entry) => sum + entry.kitchenQty, 0).toFixed(1));
 const totalPlateWaste = parseFloat(loggedWasteEntries.reduce((sum, entry) => sum + entry.plateQty, 0).toFixed(1));
 const totalWaste = parseFloat((totalKitchenWaste + totalPlateWaste).toFixed(1));
 const totalServed = parseFloat((totalPrepared - totalWaste).toFixed(1));
 const wastePercentage = Math.round((totalWaste / totalPrepared) * 100);

 // Quick increment/decrement helpers
 const adjustQty = (type: 'kitchen' | 'plate', amount: number) => {
 if (type === 'kitchen') {
 setKitchenWaste(prev => Math.max(0, parseFloat((prev + amount).toFixed(1))));
 } else {
 setPlateWaste(prev => Math.max(0, parseFloat((prev + amount).toFixed(1))));
 }
 };

 const handleAdjustStock = (itemId: string, change: number) => {
 setPrepItems(prev => prev.map(item => {
 if (item.id !== itemId) return item;
 const newStock = Math.max(0, parseFloat((item.currentStock + change).toFixed(1)));
 let newStatus: 'In Stock' | 'Low' | 'Out' = 'In Stock';
 if (newStock === 0) {
 newStatus = 'Out';
 } else if (newStock <= item.reorderLevel) {
 newStatus = 'Low';
 }
 return {
 ...item,
 currentStock: newStock,
 status: newStatus
 };
 }));
 triggerHaptic('light');
 };

 const handleSetStock = (itemId: string, newStockVal: number) => {
 const stock = Math.max(0, parseFloat(newStockVal.toFixed(1)) || 0);
 setPrepItems(prev => prev.map(item => {
 if (item.id !== itemId) return item;
 let newStatus: 'In Stock' | 'Low' | 'Out' = 'In Stock';
 if (stock === 0) {
 newStatus = 'Out';
 } else if (stock <= item.reorderLevel) {
 newStatus = 'Low';
 }
 return {
 ...item,
 currentStock: stock,
 status: newStatus
 };
 }));
 };

 const openReorderPanel = (item: InventoryItem) => {
 triggerHaptic('medium');
 if (activeReorderItemId === item.id) {
 setActiveReorderItemId(null);
 } else {
 setActiveReorderItemId(item.id);
 setOrderQty(Math.max(10, item.targetStock - item.currentStock));
 // Guess supplier based on category
 let defaultSup = 'Rice-Corp';
 if (item.category === 'proteins_dairy') defaultSup = 'DairyPlus';
 else if (item.category === 'vegetables') defaultSup = 'VeggieDirect';
 setOrderSupplier(defaultSup);
 }
 };

 const handleDispatchPO = (item: InventoryItem) => {
 if (onPlacePurchaseOrder) {
 onPlacePurchaseOrder(item.name, orderQty, orderUnit, orderSupplier);
 }
 addToast(`Successfully placed Grocery Order for ${orderQty}${orderUnit} of ${item.name} with ${orderSupplier}!`, 'success');
 setActiveReorderItemId(null);
 triggerHaptic('success');
 setTimeout(() => {
 }, 4000);
 };

 
 const activePrepDayForWaste = selectedDay || 'Thursday';
 const dishesForDayForWaste = menuItems.filter(item => item.dayOfWeek === activePrepDayForWaste);
 const activeIngredientNames = new Set(
 dishesForDayForWaste.flatMap(dish => recipes.filter((r: any) => String(r.menuItemId) === String(dish.id)).map((r: any) => { const item = prepItems.find((p: any) => String(p.id) === String(r.ingredientId)); return item ? item.name : ''; }).filter(Boolean))
 );
 const activeWasteIngredients = prepItems.filter(item => 
 activeIngredientNames.has(item.name)
 );

 const handleSavePrepProgress = () => {
    triggerHaptic('success');
    setIsSavingPrep(true);
    
    // Simulate network delay for the saving indicator
    setTimeout(() => {
      const day = selectedDay || 'Thursday';
      setPrepProgress(prev => [...prev.filter((p: PrepProgress) => p.day !== day), { day, portions: prepPortions }]);
      
      // Deduct stock globally
      const deductions: { [key: string]: number } = {};
      const dishesForDay = menuItems.filter(item => item.dayOfWeek === day);

      dishesForDay.forEach(dish => {
          const dishRecipes = recipes.filter((r: any) => String(r.menuItemId) === String(dish.id));
          const portionCount = prepPortions[dish.id] || 200;
          dishRecipes.forEach(rec => {
              const item = prepItems.find((p: any) => String(p.id) === String(rec.ingredientId));
              if (item) {
                  const qtyPerServing = Number(rec.qtyPerServing) || 0.05;
                  const demandVal = portionCount * qtyPerServing;
                  deductions[item.name] = (deductions[item.name] || 0) + demandVal;
              }
	});
      });

      setPrepItems(prev => prev.map(item => {
          if (deductions[item.name]) {
              const newStock = Math.max(0, item.currentStock - deductions[item.name]);
              let newStatus = item.status;
              if (newStock === 0) newStatus = 'Out';
              else if (newStock <= item.reorderLevel) newStatus = 'Low';
              return { ...item, currentStock: newStock, status: newStatus as 'In Stock' | 'Low' | 'Out' };
          }
          return item;
      }));

      setIsSavingPrep(false);
      addToast('Preparation tracker progress saved and synced successfully.', 'success');
      setTimeout(() => {
             }, 4000);
    }, 800);
 };

 const handleSyncWasteToAnalytics = () => {
    triggerHaptic('success');
    
    setLoggedWasteEntries([]); // clear session

    addToast('Daily waste logs have been successfully synced to analytics.', 'success');
 };

 return (
 <div id="staff_ops" className="flex-grow max-w-7xl mx-auto w-full px-4 md:px-8 pt-0 pb-6 space-y-6">

 {/* Title & Stats Ribbon */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div>
 <h2 className="text-3xl font-extrabold text-[#0A170E] dark:text-white mb-1">Kitchen & Inventory Ops</h2>
 </div>
 <div className="bg-[#16321F] text-white px-4 py-2 rounded-[20px] text-xs font-bold flex items-center gap-1.5 shadow-sm w-fit">
 <Users className="w-4 h-4" />
 {245 + optInCount} Active Patrons Today
 </div>
 </div>

 {/* Raw Material Inventory Display Panel */}
 {!isTrackerExpanded ? (
 <div 
 onClick={() => { triggerHaptic('medium'); setIsTrackerExpanded(true); }}
 className="bg-white dark:bg-[#121212] hover:bg-emerald-50/10 rounded-[20px] p-4 border border-gray-100 dark:border-gray-800 shadow-xs cursor-pointer flex items-center justify-between transition-all hover:border-[#16321F]/40 group"
 >
 <div className="flex items-center gap-3.5">
 <div className="w-10 h-10 rounded-[20px] bg-emerald-100/40 border border-emerald-100/60 flex items-center justify-center shrink-0">
 <LayoutGrid className="w-5 h-5 text-[#16321F] dark:text-[#D9E96B]" />
 </div>
 <div>
 <h3 className="text-sm font-bold text-[#0A170E] dark:text-white group-hover:text-[#16321F] dark:text-[#D9E96B] transition-colors">
 Raw Materials Stock Tracker
 </h3>
 </div>
 </div>
 <div className="flex items-center gap-2">
 <span className="text-xs font-medium px-2.5 py-1 bg-gray-100 dark:bg-[#222222] text-gray-500 dark:text-gray-400 dark:text-gray-400 rounded-[20px] font-mono">
 {stockDateFilterMode === 'all' ? 'All Stock' : stockDateFilterMode === 'active-day' ? `${selectedDay || 'Thursday'}'s Menu` : 'Custom Date'}
 </span>
 <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-400 group-hover:text-[#16321F] dark:text-[#D9E96B] group-hover:translate-y-0.5 transition-all" />
 </div>
 </div>
 ) : (
 <section className="bg-white dark:bg-[#121212] rounded-[24px] p-6 shadow-xs space-y-6">
 <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 border-b border-gray-50 pb-3">
 <div 
 className="flex items-center gap-2 cursor-pointer group"
 onClick={() => { triggerHaptic('medium'); setIsTrackerExpanded(false); }}
 >
 <LayoutGrid className="w-5 h-5 text-[#16321F] dark:text-[#D9E96B]" />
 <h3 className="text-lg font-bold text-[#0A170E] dark:text-white group-hover:text-[#16321F] dark:text-[#D9E96B] transition-colors">Raw Materials Tracker</h3>
 <ChevronUp className="w-4 h-4 text-gray-400 dark:text-gray-400 group-hover:text-[#16321F] dark:text-[#D9E96B] transition-colors" />
 </div>

 {/* Quick search & filter controls */}
 <div className="flex flex-wrap items-center gap-3">
 {/* Date Stock Filter Selector */}
 <div className="flex items-center gap-1 bg-gray-50 dark:bg-[#1a1a1a] p-1 rounded-[20px] border border-gray-200/50">
 <button
 type="button"
 onClick={() => { triggerHaptic('light'); setStockDateFilterMode('all'); }}
 className={`px-2.5 py-1.5 rounded-[20px] text-xs font-bold transition-all ${
 stockDateFilterMode === 'all'
 ? 'bg-white dark:bg-[#121212] text-gray-800 dark:text-gray-100 shadow-xs border border-gray-200/30 font-bold'
 : 'text-gray-500 dark:text-gray-400 dark:text-gray-400 hover:text-gray-800 dark:text-gray-100'
 }`}
 >
                      All
                    </button>
 <button
 type="button"
 onClick={() => { triggerHaptic('light'); setStockDateFilterMode('active-day'); }}
 className={`px-2.5 py-1.5 rounded-[20px] text-xs font-bold transition-all flex items-center gap-1 ${
 stockDateFilterMode === 'active-day'
 ? 'bg-[#16321F] text-white shadow-xs font-bold'
 : 'text-gray-500 dark:text-gray-400 dark:text-gray-400 hover:text-gray-800 dark:text-gray-100'
 }`}
 >
 <Calendar className="w-3.5 h-3.5" />
 {selectedDay || 'Today'}'s Menu
 </button>
 <button
 type="button"
 onClick={() => { triggerHaptic('light'); setStockDateFilterMode('custom'); }}
 className={`px-2.5 py-1.5 rounded-[20px] text-xs font-bold transition-all flex items-center gap-1 ${
 stockDateFilterMode === 'custom'
 ? 'bg-amber-500 text-white shadow-xs font-bold'
 : 'text-gray-500 dark:text-gray-400 dark:text-gray-400 hover:text-gray-800 dark:text-gray-100'
 }`}
 >
                      Date
                    </button>
 </div>

 {stockDateFilterMode === 'custom' && (
 <input
 type="date"
 value={customFilterDate}
 onChange={(e) => { triggerHaptic('light'); setCustomFilterDate(e.target.value); }}
 className="px-2.5 py-1.5 border border-amber-200 bg-amber-50/20 text-amber-900 rounded-[20px] text-xs font-bold focus:outline-none focus:border-amber-500"
 />
 )}

 <div className="relative">
 <Search className="w-4 h-4 text-gray-400 dark:text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
 <input
 type="text"
 placeholder="Search..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-[20px] text-xs font-semibold focus:outline-none focus:border-[#16321F] w-32 bg-gray-50/50 dark:bg-[#1a1a1a]/80"
 />
 </div>

 <button
 type="button"
 onClick={() => setFilterLowStock(prev => !prev)}
 className={`px-3 py-2 border rounded-[20px] text-xs font-bold flex items-center gap-1.5 transition-all ${
 filterLowStock
 ? 'bg-amber-50 text-amber-800 border-amber-200'
 : 'bg-white dark:bg-[#121212] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:bg-[#1a1a1a]'
 }`}
 >
 <AlertTriangle className="w-4 h-4" />
                      Low
                    </button>

 
 </div>
 </div>

 {/* Category horizontal scrolling tabs */}
 <div className="flex overflow-x-auto gap-1.5 pb-2 border-b border-gray-100 dark:border-gray-800 no-scrollbar">
 {(Object.keys(categoryLabels) as CategoryType[]).map((cat) => (
 <button
 key={cat}
 onClick={() => setSelectedCategory(cat)}
 className={`px-3 py-1.5 text-xs font-extrabold rounded-[16px] shrink-0 transition-all ${
 selectedCategory === cat
 ? 'bg-[#16321F]/10 text-[#16321F] dark:text-[#D9E96B] border border-[#16321F]/20'
 : 'text-gray-500 dark:text-gray-400 dark:text-gray-400 hover:text-gray-800 dark:text-gray-100'
 }`}
 >
 {categoryLabels[cat]}
 </button>
 ))}
 </div>

 {/* Date Filter Status Strip */}
 {stockDateFilterMode !== 'all' && (
 <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-[12px] p-2 flex items-center justify-between gap-2 text-xs mb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[#16321F] dark:text-[#D9E96B]" />
                  <span className="font-extrabold text-[#0A170E] dark:text-white">
                    Showing ingredients for {stockDateFilterMode === 'active-day' ? (selectedDay || 'Thursday') : getWeekdayName(customFilterDate)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => { triggerHaptic('light'); setStockDateFilterMode('all'); }}
                  className="text-[10px] font-bold text-[#16321F] dark:text-[#D9E96B] bg-emerald-100/50 hover:bg-emerald-100/80 px-2 py-1 rounded-[8px] transition-all whitespace-nowrap"
                >
                  Clear
                </button>
              </div>
 )}

 {/* Grid display of raw materials */}
 {filteredPrepItems.length > 0 ? (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
 {filteredPrepItems.map((item) => {
 const isLow = item.status === 'Low';
 const isOut = item.status === 'Out';
 const percentage = Math.min(100, Math.round((item.currentStock / item.targetStock) * 100));
 const avgDailyConsumption = item.targetStock / 7;
 const daysRemaining = avgDailyConsumption > 0 ? Math.max(0, parseFloat((item.currentStock / avgDailyConsumption).toFixed(1))) : 0;
 
 const incomingOrders = activeOrders.filter(o => o.item === item.name && (o.status === 'Placed' || o.status === 'In Transit'));
 let nextDeliveryDays = Infinity;
 let nextDeliveryEtaText = '';
 incomingOrders.forEach(o => {
    let days = Infinity;
    const eta = o.eta.toLowerCase();
    if (eta.includes('today')) days = 0;
    else if (eta.includes('tomorrow')) days = 1;
    else {
       const match = eta.match(/\d+/);
       if (match) days = parseInt(match[0], 10);
    }
    if (days < nextDeliveryDays) {
       nextDeliveryDays = days;
       nextDeliveryEtaText = o.eta;
    }
 });
 const runsOutBeforeDelivery = daysRemaining < nextDeliveryDays && nextDeliveryDays !== Infinity;
 const isExpanded = expandedItemId === item.id || activeReorderItemId === item.id;

 const toggleExpand = () => {
 triggerHaptic('light');
 if (isExpanded) {
 setExpandedItemId(null);
 if (activeReorderItemId === item.id) {
 setActiveReorderItemId(null);
 }
 } else {
 setExpandedItemId(item.id);
 }
 };

 const handleAdjustStockLocal = (id: string, diff: number, e: React.MouseEvent) => {
 e.stopPropagation();
 handleAdjustStock(id, diff);
 };

 const handleSetStockLocal = (id: string, val: number) => {
 handleSetStock(id, val);
 };

 const handleOpenReorderPanelLocal = (e: React.MouseEvent, itemObj: InventoryItem) => {
 e.stopPropagation();
 openReorderPanel(itemObj);
 };

 const handleDispatchPOLocal = (e: React.MouseEvent, itemObj: InventoryItem) => {
 e.stopPropagation();
 handleDispatchPO(itemObj);
 };

 if (!isExpanded) {
 // Squeezed compact card layout (resembles a sleek tag / line)
 return (
 <div
 key={item.id}
 onClick={toggleExpand}
 className="bg-white dark:bg-[#121212] hover:bg-emerald-50/20 rounded-[20px] p-3 border border-gray-100 dark:border-gray-800 shadow-3xs cursor-pointer flex items-center justify-between transition-all duration-200 hover:border-emerald-200/60 hover:shadow-2xs group relative"
 >
 <div className="flex flex-col min-w-0 pr-2">
 <span className="text-xs font-medium text-gray-400 dark:text-gray-400 block mb-0.5">
 {item.category.replace('_', ' ')}
 </span>
 <h4 className="text-xs font-extrabold text-[#0A170E] dark:text-white truncate font-display group-hover:text-[#16321F] dark:text-[#D9E96B] transition-colors" title={item.name}>
 {item.name}
 </h4>
 <span className={`text-[10px] font-medium mt-0.5 flex items-center gap-1 ${runsOutBeforeDelivery ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
 {runsOutBeforeDelivery && <AlertTriangle className="w-3 h-3" />}
 {daysRemaining} days left {runsOutBeforeDelivery ? `(Delivery in ${nextDeliveryDays}d)` : ''}
 </span>
 </div>

 <div className="flex items-center gap-2 shrink-0">
 <span className={`text-xs font-bold px-1.5 py-0.5 rounded-xl ${
 isOut
 ? 'bg-red-50 text-red-700 border border-red-100/50'
 : isLow
 ? 'bg-amber-50 text-amber-700 border border-amber-100/50'
 : 'bg-emerald-50 dark:bg-emerald-950/40 text-[#16321F] dark:text-[#D9E96B] border border-emerald-100/50'
 }`}>
 {item.status}
 </span>
 <span className="font-mono text-xs font-bold text-gray-700 dark:text-gray-200">
 {item.currentStock} {item.unit}
 </span>
 <ChevronDown className="w-3.5 h-3.5 text-gray-400 dark:text-gray-400 group-hover:text-gray-600 dark:text-gray-300 transition-transform duration-200" />
 </div>
 </div>
 );
 }

 // Expanded Full-Control layout (shown when actively managing)
 return (
 <div 
 key={item.id} 
 onClick={toggleExpand}
 className="bg-white dark:bg-[#121212] rounded-[20px] p-4 border border-[#16321F]/40 shadow-sm relative transition-all duration-200 flex flex-col gap-2 cursor-pointer"
 >
 <div className="absolute top-4 right-4 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
 <span className={`text-xs font-medium px-2 py-0.5 rounded-xl ${
 isOut
 ? 'bg-red-100 text-red-800 border border-red-200'
 : isLow
 ? 'bg-amber-100 text-amber-800 border border-amber-200'
 : 'bg-emerald-100 text-[#16321F] dark:text-[#D9E96B] border border-emerald-200'
 }`}>
 {item.status}
 </span>
 <button
 type="button"
 onClick={toggleExpand}
 className="text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:text-gray-300 focus:outline-none"
 >
 <ChevronUp className="w-4 h-4" />
 </button>
 </div>

 <div onClick={(e) => e.stopPropagation()} className="cursor-default">
 <span className="text-xs font-medium text-gray-400 dark:text-gray-400 block mb-0.5">
 {item.category.replace('_', ' ')}
 </span>
 <h4 className="text-sm font-extrabold text-[#0A170E] dark:text-white truncate pr-16" title={item.name}>
 {item.name}
 </h4>

 <div className="flex justify-between items-end mt-3 mb-1 text-xs">
 <span className="text-gray-500 dark:text-gray-400 dark:text-gray-400 font-semibold">Stock Level:</span>
 <span className="font-extrabold text-gray-900 dark:text-white">
 {item.currentStock} / {item.targetStock} {item.unit} ({percentage}%)
 </span>
 </div>
 
 <div className="flex justify-between items-end mb-2 text-xs">
 <span className="text-gray-500 dark:text-gray-400 dark:text-gray-400 font-semibold">Days Remaining:</span>
 <span className="font-extrabold text-gray-900 dark:text-white">
 {daysRemaining} days (avg {avgDailyConsumption.toFixed(1)} {item.unit}/day)
 </span>
 </div>
 
 {runsOutBeforeDelivery && (
   <div className="mb-2 bg-red-50 dark:bg-red-950/30 p-2 rounded-lg border border-red-100 dark:border-red-900/50 flex items-start gap-2">
     <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
     <p className="text-[10px] text-red-700 dark:text-red-400 font-medium leading-tight">
       Warning: Stock will deplete in {daysRemaining} days, but next delivery arrives in {nextDeliveryDays} days. Consider reordering!
     </p>
   </div>
 )}
 
 {/* Progress bar */}
 <div className="w-full bg-gray-200/60 h-2 rounded-full overflow-hidden">
 <div
 className={`h-full rounded-full transition-all duration-300 ${
 isOut ? 'bg-red-500' : isLow ? 'bg-amber-500' : 'bg-[#16321F]'
 }`}
 style={{ width: `${percentage}%` }}
 ></div>
 </div>

 {/* Tactile Stock Adjustment and Reorder Panel */}
 <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-2">
 <div className="flex items-center justify-between gap-2">
 
 {/* Decrement/Increment controls */}
 <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#222222] p-0.5 rounded-[20px] border border-gray-200/40" onClick={(e) => e.stopPropagation()}>
 <button
 type="button"
 onClick={(e) => handleAdjustStockLocal(item.id, -5, e)}
 className="w-8 h-8 flex items-center justify-center text-gray-500 dark:text-gray-400 dark:text-gray-400 hover:text-red-600 bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-700 rounded-[20px] hover:bg-gray-50 dark:bg-[#1a1a1a] active:scale-90 transition-all font-mono text-xs font-bold"
 title="Decrease by 5"
 >
 -5
 </button>
 <button
 type="button"
 onClick={(e) => handleAdjustStockLocal(item.id, -1, e)}
 className="w-8 h-8 flex items-center justify-center text-gray-500 dark:text-gray-400 dark:text-gray-400 hover:text-red-600 bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-700 rounded-[20px] hover:bg-gray-50 dark:bg-[#1a1a1a] active:scale-90 transition-all text-sm"
 title="Decrease by 1"
 >
 <Minus className="w-3 h-3" />
 </button>
 
 <div className="flex items-center px-1">
 <input
 type="number"
 value={item.currentStock}
 onChange={(e) => handleSetStockLocal(item.id, parseFloat(e.target.value) || 0)}
 className="w-10 text-center bg-transparent text-sm font-bold text-gray-800 dark:text-gray-100 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
 />
 </div>

 <button
 type="button"
 onClick={(e) => handleAdjustStockLocal(item.id, 1, e)}
 className="w-8 h-8 flex items-center justify-center text-gray-500 dark:text-gray-400 dark:text-gray-400 hover:text-[#16321F] dark:text-[#D9E96B] bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-700 rounded-[20px] hover:bg-gray-50 dark:bg-[#1a1a1a] active:scale-90 transition-all text-sm"
 title="Increase by 1"
 >
 <Plus className="w-3 h-3" />
 </button>
 <button
 type="button"
 onClick={(e) => handleAdjustStockLocal(item.id, 5, e)}
 className="w-8 h-8 flex items-center justify-center text-gray-500 dark:text-gray-400 dark:text-gray-400 hover:text-[#16321F] dark:text-[#D9E96B] bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-700 rounded-[20px] hover:bg-gray-50 dark:bg-[#1a1a1a] active:scale-90 transition-all font-mono text-xs font-bold"
 title="Increase by 5"
 >
 +5
 </button>
 </div>

 {/* Reorder Action Button */}
 <button
 type="button"
 onClick={(e) => handleOpenReorderPanelLocal(e, item)}
 className={`h-9 px-3 rounded-[20px] text-xs font-bold transition-all active:scale-95 flex items-center gap-1 ${
 activeReorderItemId === item.id
 ? 'bg-[#16321F] text-white shadow-sm'
 : 'bg-[#d9eddb] text-[#16321F] dark:text-[#D9E96B] hover:bg-emerald-100'
 }`}
 >
 <ShoppingCart className="w-3 h-3" />
 {activeReorderItemId === item.id ? 'Close' : 'Reorder'}
 </button>
 </div>

 {/* Inline Grocery Order Configuration */}
 {activeReorderItemId === item.id && (
 <div className="bg-emerald-50/50 p-2.5 rounded-[20px] border border-emerald-100/50 mt-1 space-y-2 animate-tab-transition">
 <div className="flex justify-between items-center">
 <span className="text-xs font-medium text-[#16321F] dark:text-[#D9E96B] font-mono">
 Grocery Order
 </span>
 <span className="text-xs font-semibold text-gray-400 dark:text-gray-400">Instant Dispatch</span>
 </div>

 <div className="grid grid-cols-2 gap-2">
 <div>
 <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-400 mb-0.5 font-mono">
 Vendor
 </label>
 <select
 value={orderSupplier}
 onChange={(e) => setOrderSupplier(e.target.value)}
 className="w-full h-7 px-1.5 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold bg-white dark:bg-[#121212] focus:outline-none focus:border-[#16321F]"
 >
 <option value="Rice-Corp">Rice-Corp</option>
 <option value="VeggieDirect">VeggieDirect</option>
 <option value="DairyPlus">DairyPlus</option>
 </select>
 </div>

 <div>
 <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-400 mb-0.5 font-mono">
 Qty & Unit
 </label>
 <div className="flex flex-col gap-2 w-full">
 <div className="flex gap-1.5 w-full">
 <input
 type="number"
 value={orderQty}
 onChange={(e) => setOrderQty(Math.max(1, parseFloat(e.target.value) || 0))}
 className="w-1/2 h-7 px-1.5 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold bg-white dark:bg-[#121212] focus:outline-none focus:border-[#16321F]"
 />
 <select
 value={orderUnit}
 onChange={(e) => setOrderUnit(e.target.value)}
 className="w-1/2 h-7 px-1.5 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold bg-white dark:bg-[#121212] focus:outline-none focus:border-[#16321F]"
 >
 {AVAILABLE_UNITS.map(unit => (
 <option key={unit} value={unit}>{unit}</option>
 ))}
 </select>
 </div>
 <input 
 type="range" 
 min="1" 
 max="100" 
 value={orderQty} 
 onChange={(e) => setOrderQty(parseInt(e.target.value))} 
 className="w-full accent-[#16321F]" 
 />
 </div>
 </div>
 </div>

 <button
 type="button"
 onClick={(e) => handleDispatchPOLocal(e, item)}
 className="w-full h-7 bg-[#D9E96B] hover:bg-[#D9E96B]/90 text-[#16321F] dark:text-[#D9E96B] font-bold text-xs rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1 shadow-2xs"
 >
 <Truck className="w-3 h-3" />
 Confirm Dispatch
 </button>
 </div>
 )}
 </div>
 </div>
 </div>
 );
 })}
 </div>
 ) : (
 <div className="text-center py-8 bg-gray-50/50 dark:bg-[#1a1a1a]/80 rounded-[20px] border border-dashed border-gray-200 dark:border-gray-700">
 <span className="text-xs text-gray-400 dark:text-gray-400 font-semibold">No raw materials matched your search or filters.</span>
 </div>
 )}

 </section>
 )}

 {/* Preparation Tracker Section */}
 {!isPrepExpanded ? (
 <div 
 onClick={() => { triggerHaptic('medium'); setIsPrepExpanded(true); }}
 className="bg-white dark:bg-[#121212] hover:bg-emerald-50/10 rounded-[20px] p-4 border border-gray-100 dark:border-gray-800 shadow-xs cursor-pointer flex items-center justify-between transition-all hover:border-[#16321F]/40 group"
 >
 <div className="flex items-center gap-3.5">
 <div className="w-10 h-10 rounded-[20px] bg-emerald-100/40 border border-emerald-100/60 flex items-center justify-center shrink-0">
 <Utensils className="w-5 h-5 text-[#16321F] dark:text-[#D9E96B]" />
 </div>
 <div>
 <h3 className="text-sm font-bold text-[#0A170E] dark:text-white group-hover:text-[#16321F] dark:text-[#D9E96B] transition-colors">
 Preparation Tracker & Ingredient Scaler
 </h3>
 </div>
 </div>
 <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-400 group-hover:text-[#16321F] dark:text-[#D9E96B] group-hover:translate-y-0.5 transition-all" />
 </div>
 ) : (
 <section className="bg-white dark:bg-[#121212] rounded-[24px] p-6 shadow-xs space-y-6">
 <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-50 pb-4">
 <div>
 <div className="flex items-center gap-2 cursor-pointer group mb-1" onClick={() => { triggerHaptic('medium'); setIsPrepExpanded(false); }}>
 <Utensils className="w-5 h-5 text-[#16321F] dark:text-[#D9E96B]" />
 <h3 className="text-lg font-bold text-[#0A170E] dark:text-white group-hover:text-[#16321F] dark:text-[#D9E96B] transition-colors">Preparation Tracker & Ingredient Scaler</h3>
 <ChevronUp className="w-4 h-4 text-gray-400 dark:text-gray-400 group-hover:text-[#16321F] dark:text-[#D9E96B] transition-colors" />
 </div>
 
 </div>
 <button onClick={handleSavePrepProgress} disabled={isSavingPrep} className="px-4 py-2 bg-[#16321F] hover:bg-[#1e4429] dark:bg-[#D9E96B] dark:hover:bg-[#c8d85b] dark:text-black text-white text-sm font-bold rounded-xl shadow-sm transition-colors flex items-center gap-2 w-fit disabled:opacity-70 disabled:cursor-not-allowed">
   {isSavingPrep ? (
     <>
       <RotateCw className="w-4 h-4 animate-spin" /> Saving...
     </>
   ) : (
     <>
       <CheckCircle2 className="w-4 h-4" /> Save Progress
     </>
   )}
 </button>
 </div>

 {/* Display of scheduled dishes with sliders */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
 {(() => {
 const activePrepDay = selectedDay || 'Thursday';
 // Get the breakfast, lunch, and dinner menu items for this day
 const dishesForDay = menuItems.filter(item => item.dayOfWeek === activePrepDay);

 return dishesForDay.map(dish => {
 const portionKey = dish.id; // e.g. 'mon_bf'
 const currentPortions = prepPortions[portionKey] || 200;

 return (
 <motion.div 
 layout
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.2 }}
 key={dish.id} 
 className="bg-gray-50/50 dark:bg-[#1a1a1a]/80 rounded-[20px] p-4 border border-gray-100/80 flex flex-col justify-between space-y-4 hover:border-emerald-100 transition-all"
 >
 <div className="space-y-2">
 <div className="flex justify-between items-start">
 <span className="text-xs font-medium px-2 py-0.5 rounded bg-emerald-100/60 text-[#16321F] dark:text-[#D9E96B] font-mono">
 {dish.mealType}
 </span>
 <span className="text-xs text-gray-400 dark:text-gray-400 font-medium font-mono">{dish.calories} Kcal</span>
 </div>
 <h5 className="text-xs font-extrabold text-[#0A170E] dark:text-white line-clamp-1" title={dish.name}>
 {dish.name}
 </h5>
 <p className="text-xs text-gray-400 dark:text-gray-400 font-semibold line-clamp-2 leading-relaxed">
 {dish.description}
 </p>
 </div>

 {/* Slider Controls for Portion and Volume adjustment */}
 <div className="bg-white dark:bg-[#121212] p-3.5 rounded-[20px] border border-gray-100 dark:border-gray-800 space-y-4 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
 {(() => {
 const multiplier = recipes.filter((r: any) => String(r.menuItemId) === String(dish.id)).reduce((sum: number, rec: any) => sum + (Number(rec.qtyPerServing) || 0.05), 0);
 const isLbs = prepVolUnit === 'lbs';
 const conversion = isLbs ? 2.20462 : 1;
 
 const minPax = 50;
 const maxPax = 400;
 
 const displayVol = (multiplier * currentPortions * conversion).toFixed(1);
 const minVol = (multiplier * minPax * conversion).toFixed(1);
 const maxVol = (multiplier * maxPax * conversion).toFixed(1);

 return (
 <>
 {/* Portions Section */}
 <div className="space-y-2">
 <div className="flex justify-between items-center text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-400 font-mono">
 <span>Portions:</span>
 <div className="flex items-center gap-1.5"><button type="button" onClick={() => { triggerHaptic('success'); setPrepPortions(prev => ({ ...prev, [portionKey]: mealOptIns[portionKey] || 150 })); addToast(`Synced portions for ${dish.name} to live opt-ins! 🚀`, 'success'); }} className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100/30 dark:border-emerald-900/40 rounded-lg px-2 py-0.5 hover:scale-105 transition-all flex items-center gap-1 cursor-pointer" title="Click to sync prep portions with live student opt-ins">Sync Opt-ins: {mealOptIns[portionKey] || 150}</button><span className="text-[#16321F] dark:text-[#D9E96B] font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-xl">{currentPortions} pax</span></div>
 </div>
 <input
 type="range"
 min={minPax}
 max={maxPax}
 step="10"
 value={currentPortions}
 onChange={(e) => {
 triggerHaptic('light');
 const newVal = parseInt(e.target.value);
 setPrepPortions(prev => ({ ...prev, [portionKey]: newVal }));
 }}
 className="w-full h-2 bg-gray-100 dark:bg-[#222222] rounded-[20px] appearance-none cursor-pointer accent-[#16321F]"
 />
 <div className="flex justify-between text-xs text-gray-400 dark:text-gray-400 font-medium">
 <span>Min: {minPax}</span>
 <span>Max: {maxPax}</span>
 </div>
 </div>

 <hr className="border-gray-50" />

 {/* Prepared Volume Section */}
 <div className="space-y-2">
 <div className="flex justify-between items-center text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-400 font-mono">
 <span className="flex items-center gap-1.5">
 Est. Prepared Vol:
 </span>
 <div className="flex items-center gap-1.5">
 <span className="text-[#16321F] dark:text-[#D9E96B] font-bold">{displayVol}</span>
 <select 
 value={prepVolUnit}
 onChange={(e) => {
 triggerHaptic('light');
 setPrepVolUnit(e.target.value as 'kg'|'lbs')
 }}
 className="text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-[#16321F] dark:text-[#D9E96B] border-none rounded px-1 py-0.5 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#16321F]/50"
 >
 <option value="kg">kg</option>
 <option value="lbs">lbs</option>
 </select>
 </div>
 </div>
 <input
 type="range"
 min={minVol}
 max={maxVol}
 step={isLbs ? "1" : "0.5"}
 value={displayVol}
 onChange={(e) => {
 triggerHaptic('light');
 let newVol = parseFloat(e.target.value);
 if (isLbs) {
 newVol = newVol / 2.20462;
 }
 const newPortions = Math.max(minPax, Math.min(maxPax, Math.round(newVol / multiplier)));
 setPrepPortions(prev => ({ ...prev, [portionKey]: newPortions }));
 }}
 className="w-full h-2 bg-gray-100 dark:bg-[#222222] rounded-[20px] appearance-none cursor-pointer accent-[#16321F]"
 />
 <div className="flex justify-between text-xs text-gray-400 dark:text-gray-400 font-medium">
 <span>Min: {minVol}</span>
 <span>Max: {maxVol}</span>
 </div>
 </div>
 </>
 );
 })()}
 </div>
 </motion.div>
 );
 });
 })()}
 </div>

 {/* Calculated Ingredient Requirements Board */}
 <div className="bg-emerald-50/20 rounded-[20px] p-4 border border-emerald-100/30 space-y-3">
 <h5 className="text-xs font-medium text-[#16321F] dark:text-[#D9E96B] font-mono">
 Scaled Ingredient Stock Allocation Report
 </h5>
 
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="border-b border-gray-100 dark:border-gray-800 text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-400 ">
 <th className="py-2">Ingredient</th>
 <th className="py-2">Daily Meals Needed For</th>
 <th className="py-2 text-right">Scaled Demand</th>
 <th className="py-2 text-right">Available Stock</th>
 <th className="py-2 text-right">Status</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-gray-50 text-xs font-semibold text-gray-600 dark:text-gray-300">
 {(() => {
 const activePrepDay = selectedDay || 'Thursday';
 const dishesForDay = menuItems.filter(item => item.dayOfWeek === activePrepDay);

 // Gather all ingredients and their cumulative demands
 const ingredientDemands: { [key: string]: { amount: number, meals: string[] } } = {};

 dishesForDay.forEach(dish => {
 const dishRecipes = recipes.filter((r: any) => String(r.menuItemId) === String(dish.id));
 const portionCount = prepPortions[dish.id] || 200;

 dishRecipes.forEach(rec => {
  const item = prepItems.find((p: any) => String(p.id) === String(rec.ingredientId));
  if (item) {
  const ingName = item.name;
 const qtyPerServing = Number(rec.qtyPerServing) || 0.05;
const demandVal = portionCount * qtyPerServing;
 const mealLabel = dish.mealType.charAt(0).toUpperCase() + dish.mealType.slice(1);

 if (ingredientDemands[ingName]) {
 ingredientDemands[ingName].amount += demandVal;
 if (!ingredientDemands[ingName].meals.includes(mealLabel)) {
 ingredientDemands[ingName].meals.push(mealLabel);
 }
 } else {
 ingredientDemands[ingName] = {
 amount: demandVal,
 meals: [mealLabel]
 };
 }
 }
});
 });

 const demandRows = Object.keys(ingredientDemands);

 if (demandRows.length === 0) {
 return (
 <tr>
 <td colSpan={5} className="py-4 text-center text-xs text-gray-400 dark:text-gray-400">
 No dishes found for this weekday selection.
 </td>
 </tr>
 );
 }

 return demandRows.map(ingName => {
 const info = ingredientDemands[ingName];
 // Match with available items in prepItems state
 const matchingItem = prepItems.find(p => p.name.toLowerCase().includes(ingName.toLowerCase()) || ingName.toLowerCase().includes(p.name.toLowerCase()));
 const availableQty = matchingItem ? matchingItem.currentStock : 0;
 const unit = matchingItem ? matchingItem.unit : 'kg';
 const isShortage = availableQty < info.amount;
 const shortageAmount = parseFloat((info.amount - availableQty).toFixed(1));

 return (
 <tr key={ingName} className="hover:bg-white/40 transition-colors">
 <td className="py-2 font-extrabold text-gray-800 dark:text-gray-100">{ingName}</td>
 <td className="py-2">
 <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-100 dark:bg-[#222222] text-gray-500 dark:text-gray-400 dark:text-gray-400 font-mono">
 {info.meals.join(' + ')}
 </span>
 </td>
 <td className="py-2 text-right font-mono text-gray-800 dark:text-gray-100 font-extrabold">
 {info.amount.toFixed(1)} {unit}
 </td>
 <td className="py-2 text-right font-mono font-bold">
 {availableQty} {unit}
 </td>
 <td className="py-2 text-right">
 {isShortage ? (
 <div className="flex items-center justify-end gap-1.5">
 <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded-[20px] text-xs font-bold font-mono">
 Shortage: {shortageAmount} {unit}
 </span>
 {matchingItem && (
 <button
 type="button"
 onClick={() => {
 triggerHaptic('medium');
 openReorderPanel(matchingItem);
 }}
 className="px-2 py-0.5 bg-red-100 hover:bg-red-200 text-red-800 text-xs font-bold rounded-xl transition-all"
 title="Order raw material dispatch"
 >
 Order
 </button>
 )}
 </div>
 ) : (
 <span className="text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-[20px] text-xs font-bold font-mono">
 ✓ Sufficient Stock
 </span>
 )}
 </td>
 </tr>
 );
 });
 })()}
 </tbody>
 </table>
 </div>
 </div>
 </section>
 )}

 {/* Flex container for Dynamic Waste Entry and Mass-Balance */}
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
 
 {/* Dynamic Waste Entry Form */}
 {!isWasteExpanded ? (
 <section className="lg:col-span-12 bg-white dark:bg-[#121212] hover:bg-emerald-50/10 rounded-[24px] p-5 border border-gray-100 dark:border-gray-800 shadow-xs cursor-pointer flex items-center justify-between transition-all hover:border-[#16321F]/40 group" onClick={() => { triggerHaptic('medium'); setIsWasteExpanded(true); }}>
 <div className="flex items-center gap-3.5">
 <div className="w-10 h-10 rounded-[20px] bg-emerald-100/40 border border-emerald-100/60 flex items-center justify-center shrink-0">
 <Trash2 className="w-5 h-5 text-[#16321F] dark:text-[#D9E96B]" />
 </div>
 <div>
 <h3 className="text-sm font-bold text-[#0A170E] dark:text-white group-hover:text-[#16321F] dark:text-[#D9E96B] transition-colors">
 Dynamic Waste Logger
 </h3>
 </div>
 </div>
 <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-400 group-hover:text-[#16321F] dark:text-[#D9E96B] group-hover:translate-y-0.5 transition-all" />
 </section>
 ) : (
 <section className="lg:col-span-12 bg-white dark:bg-[#121212] rounded-[24px] p-6 border border-gray-100 dark:border-gray-800 shadow-xs flex flex-col justify-between">
 <form onSubmit={handleLogWasteClick} className="space-y-5">
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-50 pb-4">
 <div className="flex items-center gap-2 cursor-pointer group" onClick={() => { triggerHaptic('medium'); setIsWasteExpanded(false); }}>
 <Trash2 className="w-5 h-5 text-[#16321F] dark:text-[#D9E96B]" />
 <h3 className="text-lg font-bold text-[#0A170E] dark:text-white group-hover:text-[#16321F] dark:text-[#D9E96B] transition-colors">Dynamic Waste Logger</h3>
 <ChevronUp className="w-4 h-4 text-gray-400 dark:text-gray-400 group-hover:text-[#16321F] dark:text-[#D9E96B] transition-colors" />
 </div>
 <button type="button" onClick={handleSyncWasteToAnalytics} className="px-4 py-2 bg-[#16321F] hover:bg-[#1e4429] dark:bg-[#D9E96B] dark:hover:bg-[#c8d85b] dark:text-black text-white text-sm font-bold rounded-xl shadow-sm transition-colors flex items-center gap-2 w-fit">
   <CheckCircle2 className="w-4 h-4" /> Push to Analytics
 </button>
 </div>

 {/* Selector for Menu Item */}
 <div>
 <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-400 mb-1">
 Select Menu Item
 </label>
 <select
 value={selectedIngredientId}
 onChange={(e) => setSelectedIngredientId(e.target.value)}
 className="w-full h-11 px-3 border border-gray-200 dark:border-gray-700 rounded-[20px] text-xs font-semibold focus:outline-none focus:border-[#16321F] bg-gray-50 dark:bg-[#1a1a1a]"
 >
 {dishesForDayForWaste.map(item => (
 <option key={item.id} value={item.id}>
 {item.name} ({item.mealType})
 </option>
 ))}
 </select>
 </div>

 {/* Waste entries */}
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 
 {/* Kitchen Waste Counter */}
 <div className="bg-gray-50 dark:bg-[#1a1a1a] rounded-[20px] p-4 border border-gray-100 dark:border-gray-800 flex flex-col justify-between">
 <div>
 <span className="text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-400 block">Over Preparation</span>
 <span className="text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-400">Unused prepared food</span>
 </div>

 <div className="flex items-center justify-between mt-3">
 <button
 type="button"
 onClick={() => adjustQty('kitchen', -0.5)}
 className="w-9 h-9 flex items-center justify-center text-[#16321F] dark:text-[#D9E96B] bg-white dark:bg-[#121212] border border-gray-100 dark:border-gray-800 rounded-[20px] hover:bg-gray-50 dark:bg-[#1a1a1a] active:scale-95 transition-all"
 >
 <Minus className="w-4 h-4" />
 </button>
 <div className="flex flex-col items-center">
 <span className="text-lg font-bold text-gray-900 dark:text-white">
 {kitchenWaste} <small className="text-xs font-semibold text-gray-400 dark:text-gray-400">kg</small>
 </span>
 <input type="range" min="0" max="20" step="0.5" value={kitchenWaste} onChange={(e) => setKitchenWaste(parseFloat(e.target.value))} className="w-full accent-[#16321F] h-1 mt-1" />
 </div>
 <button
 type="button"
 onClick={() => adjustQty('kitchen', 0.5)}
 className="w-9 h-9 flex items-center justify-center text-[#16321F] dark:text-[#D9E96B] bg-white dark:bg-[#121212] border border-gray-100 dark:border-gray-800 rounded-[20px] hover:bg-gray-50 dark:bg-[#1a1a1a] active:scale-95 transition-all"
 >
 <Plus className="w-4 h-4" />
 </button>
 </div>
 </div>

 {/* Plate Waste Counter */}
 <div className="bg-gray-50 dark:bg-[#1a1a1a] rounded-[20px] p-4 border border-gray-100 dark:border-gray-800 flex flex-col justify-between">
 <div>
 <span className="text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-400 block">Plate Waste</span>
 <span className="text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-400">Leftovers returned to bins</span>
 </div>

 <div className="flex items-center justify-between mt-3">
 <button
 type="button"
 onClick={() => adjustQty('plate', -0.5)}
 className="w-9 h-9 flex items-center justify-center text-[#16321F] dark:text-[#D9E96B] bg-white dark:bg-[#121212] border border-gray-100 dark:border-gray-800 rounded-[20px] hover:bg-gray-50 dark:bg-[#1a1a1a] active:scale-95 transition-all"
 >
 <Minus className="w-4 h-4" />
 </button>
 <div className="flex flex-col items-center">
 <span className="text-lg font-bold text-gray-900 dark:text-white">
 {plateWaste} <small className="text-xs font-semibold text-gray-400 dark:text-gray-400">kg</small>
 </span>
 <input type="range" min="0" max="20" step="0.5" value={plateWaste} onChange={(e) => setPlateWaste(parseFloat(e.target.value))} className="w-full accent-[#16321F] h-1 mt-1" />
 </div>
 <button
 type="button"
 onClick={() => adjustQty('plate', 0.5)}
 className="w-9 h-9 flex items-center justify-center text-[#16321F] dark:text-[#D9E96B] bg-white dark:bg-[#121212] border border-gray-100 dark:border-gray-800 rounded-[20px] hover:bg-gray-50 dark:bg-[#1a1a1a] active:scale-95 transition-all"
 >
 <Plus className="w-4 h-4" />
 </button>
 </div>
 </div>

 </div>

 <button
 type="submit"
 className="w-full h-11 bg-[#16321F] hover:bg-[#4a7c59] text-white font-bold rounded-[20px] transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer mt-2"
 >
 <Trash2 className="w-4 h-4" />
 Log Scraps & Balance Stock
 </button>
 </form>
 </section>
 )}

 

 </div>
 </div>
 );
}
