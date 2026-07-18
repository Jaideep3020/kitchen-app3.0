import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchInventory, fetchActiveOrders, fetchActivityLogs } from './api';
import React, { useState, useEffect } from 'react';
import { useData } from './contexts/DataContext';
import { useToast } from './contexts/ToastContext';
import { motion, AnimatePresence } from "motion/react";
import { 
 Menu, RotateCw, Moon, Sun, Bell, Search,
  Clock, Calendar, Flame, CheckCircle2, 
 Plus, Users, ChefHat, Trash2, Truck, Utensils, 
 BarChart2, Package, User, LogOut, ArrowRight, ClipboardList, Rocket, TrendingDown, Camera, Shield
} from 'lucide-react';
import { 
 Role, StudentTab, StaffTab, MenuItem, InventoryItem, 
 Supplier, ActiveOrder, ActivityLog, EfficiencyRecord,
 PlateWasteThreshold, ThresholdAlert
} from './types';
import { 
 INITIAL_MENU_ITEMS, INITIAL_PREP_ITEMS, INITIAL_ACTIVE_ORDERS, 
 INITIAL_SUPPLIERS, INITIAL_EFFICIENCY_RECORDS, INITIAL_ACTIVITY_LOGS 
} from './data';

// Component imports
import SignIn from './components/SignIn';
import NotificationInbox from './components/NotificationInbox';
import StudentOptIn from './components/StudentOptIn';
import StudentCheckIn from './components/StudentCheckIn';
import StudentProfile from './components/StudentProfile';
import StaffDashboard from './components/StaffDashboard';
import StaffOps from './components/StaffOps';
import StaffStock from './components/StaffStock';
import StaffReports from './components/StaffReports';
import { ErrorBoundary } from './components/ErrorBoundary';
import StaffManagement from "./components/StaffManagement";
import StaffLaunchHub from './components/StaffLaunchHub';
import ManagerMenu from './components/ManagerMenu';
import TimeAndCalendarHub from './components/TimeAndCalendarHub';
import { triggerHaptic } from './lib/haptics';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';


export default function App() {
  const { addToast } = useToast();
 const [role, setRole] = useState<Role>(null);
 const queryClient = useQueryClient();
 const isOnline = useOnlineStatus();

  useEffect(() => {
    const eventSource = new EventSource('/api/events');
    eventSource.addEventListener('inventory-updated', () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    });
    return () => eventSource.close();
  }, [queryClient]);

  const { data: queryPrepItems = [] } = useQuery({ queryKey: ['inventory'], queryFn: fetchInventory });

 

 const [studentTab, setStudentTab] = useState<StudentTab>(() =>
   (new URLSearchParams(window.location.search).get('studentTab') as StudentTab) || 'menu'
 );
 const [staffTab, setStaffTab] = useState<StaffTab>(() =>
   (new URLSearchParams(window.location.search).get('staffTab') as StaffTab) || 'dashboard'
 );

 useEffect(() => {
   if (role === 'staff') {
     const url = new URL(window.location.href);
     url.searchParams.set('staffTab', staffTab);
     window.history.replaceState({}, '', url);
   } else if (role === 'student') {
     const url = new URL(window.location.href);
     url.searchParams.set('studentTab', studentTab);
     window.history.replaceState({}, '', url);
   }
 }, [staffTab, studentTab, role]);

 // Core synchronized states
  const { 
    menuItems, setMenuItems, 
    prepItems: contextPrepItems, setPrepItems, 
    suppliers, setSuppliers, 
    activeOrders, setActiveOrders, 
    activityLogs, setActivityLogs, 
    pastOrders, setPastOrders,
    wasteLogs, setWasteLogs,
    plateWasteThresholds, setPlateWasteThresholds,
    thresholdAlerts, setThresholdAlerts,
    studentChoices, setStudentChoices,
    mealOptIns,
    currentUserEmail, setCurrentUserEmail
  } = useData();


 
   // Use query data if available, fallback to context
  const prepItems = queryPrepItems.length > 0 ? queryPrepItems : contextPrepItems;

 const [studentChoicesUnused, setStudentChoicesUnused] = useState<{ [key: string]: boolean }>({
 dish_1: true,
 dish_3: true,
 });

  const optInCount = React.useMemo(() => {
    return Object.values(studentChoices).filter(Boolean).length;
  }, [studentChoices]);
 const [riceOrdered, setRiceOrdered] = useState(false);

 // Time & Calendar Hub synchronized states
 const [selectedDay, setSelectedDay] = useState<string>('Thursday');
 const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 6, 9)); // Default to Thursday July 9, 2026
  
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [targetOpsSearch, setTargetOpsSearch] = useState('');
  const [targetStockSearch, setTargetStockSearch] = useState('');
  const [targetStockTab, setTargetStockTab] = useState<'suppliers' | 'orders'>('suppliers');
  const [initialDraftPO, setInitialDraftPO] = useState<{ item: string; supplierId: string } | null>(null);


  const searchResults = React.useMemo(() => {
    if (!globalSearchQuery.trim()) return [];
    
    const query = globalSearchQuery.toLowerCase();
    const results: any[] = [];
    
    // Search Inventory
    prepItems.forEach(item => {
      if (item.name.toLowerCase().includes(query) || (item.category && item.category.toLowerCase().includes(query))) {
        results.push({
          id: item.id,
          type: 'inventory',
          title: item.name,
          subtitle: `Inventory • ${item.currentStock || (item as any).current} ${item.unit} in stock`,
          action: () => { setStaffTab('stock'); setGlobalSearchQuery(''); }
        });
      }
    });

    // Search Suppliers
    suppliers.forEach(supplier => {
      if (supplier.name.toLowerCase().includes(query) || (supplier.category && supplier.category.toLowerCase().includes(query))) {
        results.push({
          id: supplier.id,
          type: 'supplier',
          title: supplier.name,
          subtitle: `Supplier • ${supplier.category}`,
          action: () => { setStaffTab('stock'); setTargetStockTab('suppliers'); setTargetStockSearch(supplier.name); setGlobalSearchQuery(''); }
        });
      }
    });

    // Search Active Orders
    activeOrders.forEach(order => {
      if (order.id.toLowerCase().includes(query) || order.supplierName.toLowerCase().includes(query)) {
        results.push({
          id: order.id,
          type: 'order',
          title: order.id,
          subtitle: `Order • ${order.supplierName} • ${order.status}`,
          action: () => { setStaffTab('dashboard'); setGlobalSearchQuery(''); }
        });
      }
    });

    // Search Past Orders/Invoices
    pastOrders.forEach(order => {
      if (order.invoiceNo.toLowerCase().includes(query) || order.supplierName.toLowerCase().includes(query)) {
        results.push({
          id: order.id,
          type: 'invoice',
          title: `Invoice ${order.invoiceNo}`,
          subtitle: `Past Order • ${order.supplierName} • ₹${order.amount}`,
          action: () => { setStaffTab('dashboard'); setGlobalSearchQuery(''); }
        });
      }
    });

    return results.slice(0, 5);
  }, [globalSearchQuery, prepItems, suppliers, activeOrders, pastOrders]);

  useEffect(() => {

    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);


 // Synchronized Handlers
 const handleStudentConfirm = (choices: { [key: string]: boolean }) => {
 // Increment count of confirmed student RSVPs dynamically
 const chosenCount = Object.values(choices).filter(v => v).length;
 
 // Add to recent activity logs
 const newLog: ActivityLog = {
 id: `act_${Date.now()}`,
 title: 'Patron Opted In',
 timeAgo: 'Just now',
 description: `Student confirmed preference for ${chosenCount} items.`,
 type: 'prep'
 };
 setActivityLogs(prev => [newLog, ...prev]);
 };

  const checkWasteThreshold = (itemName: string, addedPlateQty: number) => {
    const menuItem = menuItems.find(item => item.name.toLowerCase() === itemName.toLowerCase());
    if (!menuItem) return;

    const thresholdConfig = plateWasteThresholds.find(t => t.menuItemId === menuItem.id);
    const thresholdLimit = thresholdConfig ? thresholdConfig.threshold : 4.0;

    const todayStr = selectedDate ? selectedDate.toLocaleDateString('en-CA') : new Date().toLocaleDateString('en-CA');

    // 1. Check single recorded waste
    if (addedPlateQty > thresholdLimit) {
      triggerThresholdAlert(menuItem.id, menuItem.name, thresholdLimit, addedPlateQty, 'single');
    }

    // 2. Check cumulative recorded waste for today
    const todaysLogs = wasteLogs.filter(w => w.itemName === menuItem.name && w.date === todayStr);
    const cumulativeWaste = todaysLogs.reduce((sum, w) => sum + (Number(w.plateQty) || 0), 0) + addedPlateQty;

    if (cumulativeWaste > thresholdLimit) {
      triggerThresholdAlert(menuItem.id, menuItem.name, thresholdLimit, cumulativeWaste, 'cumulative');
    }
  };

  const triggerThresholdAlert = (menuItemId: string, itemName: string, threshold: number, actual: number, type: 'single' | 'cumulative') => {
    const todayStr = selectedDate ? selectedDate.toLocaleDateString('en-CA') : new Date().toLocaleDateString('en-CA');
    const alreadyAlerted = thresholdAlerts.some(
      a => a.menuItemId === menuItemId && a.type === type && a.date === todayStr && a.status === 'active'
    );
    if (alreadyAlerted) return;

    const alertId = `alert_${Date.now()}`;
    const newAlert: ThresholdAlert = {
      id: alertId,
      menuItemId,
      itemName,
      thresholdValue: threshold,
      actualValue: Number(actual.toFixed(2)),
      type,
      date: todayStr,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'active'
    };

    setThresholdAlerts(prev => [newAlert, ...prev]);

    // Add to activity logs for dashboard visibility
    const activityLog: ActivityLog = {
      id: `act_alert_${Date.now()}`,
      title: `🚨 WASTE ALERT: ${itemName}`,
      timeAgo: 'Just now',
      description: `${type === 'single' ? 'Single entry' : 'Cumulative daily'} plate waste of ${actual.toFixed(1)}kg exceeded the threshold of ${threshold.toFixed(1)}kg!`,
      type: 'waste'
    };
    setActivityLogs(prev => [activityLog, ...prev]);
  };

  const handleStudentPlateWasteLog = (dishId: string, level: 'none' | 'a_little' | 'half' | 'most') => {
    const dish = menuItems.find(d => d.id === dishId);
    const dishName = dish?.name || 'Dish';
    const amountDesc = level === 'none' ? '0% waste' : level === 'a_little' ? '15% waste' : level === 'half' ? '50% waste' : '80% waste';
    const wasteWeight = level === 'none' ? 0 : level === 'a_little' ? 1.2 : level === 'half' ? 2.5 : 5.2;
    
    const newLog: ActivityLog = {
      id: `act_${Date.now()}`,
      title: 'Plate Waste Logged',
      timeAgo: 'Just now',
      description: `Student checked in ${dishName} with ${amountDesc}.`,
      type: 'waste'
    };
    setActivityLogs(prev => [newLog, ...prev]);

    if (wasteWeight > 0) {
      const todayStr = selectedDate ? selectedDate.toLocaleDateString('en-CA') : new Date().toLocaleDateString('en-CA');
      const newGlobalLog = {
        id: Date.now().toString(),
        date: todayStr,
        day: selectedDay || 'Thursday',
        itemName: dishName,
        category: dish?.category || 'main',
        kitchenQty: 0,
        plateQty: wasteWeight,
        unit: 'kg'
      };
      setWasteLogs(prev => [...prev, newGlobalLog]);
      checkWasteThreshold(dishName, wasteWeight);
    }
  };

  const handleStaffLogWaste = (itemName: string, kitchenQty: number, plateQty: number) => {
    const newLog: ActivityLog = {
      id: `act_${Date.now()}`,
      title: `${itemName} Waste Logged`,
      timeAgo: 'Just now',
      description: `${kitchenQty}kg Kitchen + ${plateQty}kg Plate waste entered.`,
      type: 'waste'
    };
    setActivityLogs(prev => [newLog, ...prev]);

    const dish = menuItems.find(d => d.name.toLowerCase() === itemName.toLowerCase());
    const todayStr = selectedDate ? selectedDate.toLocaleDateString('en-CA') : new Date().toLocaleDateString('en-CA');
    const newGlobalLog = {
      id: Date.now().toString(),
      date: todayStr,
      day: selectedDay || 'Thursday',
      itemName: itemName,
      category: dish?.category || 'main',
      kitchenQty: kitchenQty,
      plateQty: plateQty,
      unit: 'kg'
    };
    setWasteLogs(prev => [...prev, newGlobalLog]);

    if (plateQty > 0) {
      checkWasteThreshold(itemName, plateQty);
    }
  };

 const handleTriggerReorder = (supplierId: string) => {
 const supplierName = suppliers.find(s => s.id === supplierId)?.name || 'Supplier';
 
 // Log the order dispatch
 const newLog: ActivityLog = {
 id: `act_${Date.now()}`,
 title: `Order Dispatched`,
 timeAgo: 'Just now',
 description: `Reordered materials with ${supplierName} under active delivery SLA.`,
 type: 'order'
 };
 setActivityLogs(prev => [newLog, ...prev]);

 // Create a new active order dynamically
 const newOrder: ActiveOrder = {
 id: `PO-${Math.floor(2000 + Math.random() * 100)}`,
 supplierName,
 eta: 'In 2 days',
 status: 'Placed'
 };
 setActiveOrders(prev => [newOrder, ...prev]);

 // Update low inventory stocks dynamically
 if (supplierId === 'sup_1') { // Rice Corp
 setPrepItems(prev => prev.map(item => 
 item.id === 'prep_1' ? { ...item, status: 'In Stock' } : item
 ));
 } else if (supplierId === 'sup_2') { // VeggieDirect
 setPrepItems(prev => prev.map(item => 
 item.id === 'prep_3' ? { ...item, status: 'In Stock' } : item
 ));
 }
 };

 
  const handleAddSupplier = (supplier: Supplier) => {
    setSuppliers([...suppliers, supplier]);
    
  };

  const handlePlacePurchaseOrder = (itemName: string, qty: number, unit: string, supplierName: string) => {
 const poId = `PO-${Math.floor(2100 + Math.random() * 100)}`;
 
 const newOrder: ActiveOrder = {
 id: poId,
 supplierName,
 eta: 'In 1-2 days',
 status: 'Placed'
 };
 setActiveOrders(prev => [newOrder, ...prev]);

 const newLog: ActivityLog = {
 id: `act_${Date.now()}`,
 title: `Order Placed: ${itemName}`,
 timeAgo: 'Just now',
 description: `Dispatched Grocery Order ${poId} for ${qty}${unit} with ${supplierName}.`,
 type: 'order'
 };
 setActivityLogs(prev => [newLog, ...prev]);
 };

 const lowStockCount = prepItems.filter(item => item.status === 'Low').length;

  
  const handleReceiveOrder = (orderId: string) => {
    setActiveOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: 'Received' } : order
    ));
    addToast('Order received successfully', 'success');
  };

  const handleAutoOrderRice = () => {
 setRiceOrdered(true);
 handleTriggerReorder('sup_1');
 };

 // Switch modes
 const handleSignIn = (selectedRole: 'student' | 'staff' | 'manager', email: string) => {
 setRole(selectedRole);
 if (email) {
   setCurrentUserEmail(email);
 }
 };

 const handleSignOut = () => {
 setRole(null);
 };

 // If logged out, render the login view
 if (!role) {
 return (
 <div className="bg-gradient-to-b from-[#EAF5E4] to-white text-gray-900 min-h-screen flex flex-col font-sans selection:bg-[#16321F]/10 dark:selection:bg-[#D9E96B]/20 selection:text-[#16321F] dark:selection:text-[#D9E96B]">
 <SignIn onSignIn={handleSignIn} />
 </div>
 );
 }

 return (
 <>
  <NotificationInbox 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
        prepItems={prepItems} 
        onNavigateToStock={(draftPO) => {
          setStaffTab('stock');
          if (draftPO) {
            setInitialDraftPO(draftPO);
          }
        }}
      />
      <div className="bg-gradient-to-b from-[#EAF5E4] to-white dark:from-[#0A0A0A] dark:to-black text-gray-900 dark:text-gray-100 h-[100dvh] overflow-hidden flex flex-row font-sans transition-colors duration-300 selection:bg-[#16321F]/10 dark:selection:bg-[#D9E96B]/20 selection:text-[#16321F] dark:selection:text-[#D9E96B]">

      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-red-500 text-white text-xs font-bold py-1.5 px-4 flex items-center justify-center gap-2">
          <WifiOff className="w-4 h-4" />
          You are currently offline. Local changes will sync when connection is restored.
        </div>
      )}

      <aside className="hidden md:flex w-[240px] lg:w-[260px] flex-col bg-white/60 dark:bg-[#0A0A0A]/60 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-800/50 shrink-0 z-50">
        <div 
          onClick={() => triggerHaptic('medium')}
          className="p-6 flex items-center gap-3 cursor-pointer border-b border-gray-100/50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-[#16321F] dark:bg-[#D9E96B] text-[#D9E96B] dark:text-[#16321F] flex items-center justify-center shadow-sm">
            <ChefHat className="w-5 h-5" />
          </div>
          <span className="font-extrabold font-display text-lg text-gray-900 dark:text-white tracking-tight">Kitchen Ops</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 flex flex-col gap-2 overflow-y-auto">
          {role === 'student' ? (
            <>
              <button onClick={() => setStudentTab('menu')} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${studentTab === 'menu' ? 'bg-[#16321F] text-[#D9E96B] dark:bg-[#D9E96B] dark:text-[#16321F] shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'}`}>
                <Utensils className="w-5 h-5" /> Weekly Menu
              </button>
              <button onClick={() => setStudentTab('checkin')} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${studentTab === 'checkin' ? 'bg-[#16321F] text-[#D9E96B] dark:bg-[#D9E96B] dark:text-[#16321F] shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'}`}>
                <Camera className="w-5 h-5" /> Scan & Check-in
              </button>
              <button onClick={() => setStudentTab('profile')} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${studentTab === 'profile' ? 'bg-[#16321F] text-[#D9E96B] dark:bg-[#D9E96B] dark:text-[#16321F] shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'}`}>
                <Users className="w-5 h-5" /> Profile
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setStaffTab('dashboard')} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${staffTab === 'dashboard' ? 'bg-[#16321F] text-[#D9E96B] dark:bg-[#D9E96B] dark:text-[#16321F] shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'}`}>
                <TrendingDown className="w-5 h-5" /> Ops Dashboard
              </button>
              <button onClick={() => setStaffTab('ops')} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${staffTab === 'ops' ? 'bg-[#16321F] text-[#D9E96B] dark:bg-[#D9E96B] dark:text-[#16321F] shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'}`}>
                <ChefHat className="w-5 h-5" /> Today's Prep
              </button>
              <button onClick={() => setStaffTab('stock')} className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${staffTab === 'stock' ? 'bg-[#16321F] text-[#D9E96B] dark:bg-[#D9E96B] dark:text-[#16321F] shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'}`}>
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5" /> Stock
                </div>
                {lowStockCount > 0 && (
                  <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black animate-pulse shadow-sm">
                    {lowStockCount}
                  </span>
                )}
              </button>
              <button onClick={() => setStaffTab('reports')} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${staffTab === 'reports' ? 'bg-[#16321F] text-[#D9E96B] dark:bg-[#D9E96B] dark:text-[#16321F] shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'}`}>
                <ClipboardList className="w-5 h-5" /> Reports
              </button>
              <div className="my-2 border-t border-gray-100 dark:border-gray-800/50"></div>
              <button onClick={() => setStaffTab('launch')} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${staffTab === 'launch' ? 'bg-amber-500 text-white shadow-md' : 'text-amber-600 dark:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10'}`}>
                <Rocket className="w-5 h-5" /> Launch Campaign
              </button>
              {role === "manager" && (
                <>
                  <button onClick={() => setStaffTab("management")} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${staffTab === "management" ? "bg-[#16321F] text-[#D9E96B] dark:bg-[#D9E96B] dark:text-[#16321F] shadow-md" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"}`}>
                    <Shield className="w-5 h-5" /> Management
                  </button>
                  <button onClick={() => setStaffTab("menu-builder")} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${staffTab === "menu-builder" ? "bg-[#16321F] text-[#D9E96B] dark:bg-[#D9E96B] dark:text-[#16321F] shadow-md" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"}`}>
                    <Utensils className="w-5 h-5" /> Menu Builder
                  </button>
                </>
              )}
            </>
          )}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 relative h-[100dvh]">
 {/* Top App Bar Header */}
 <header className="absolute top-0 left-0 right-0 z-50 pointer-events-none px-3 pt-3 pb-4 bg-gradient-to-b from-[#EAF5E4] via-[#EAF5E4]/95 to-transparent dark:from-[#0A0A0A] dark:via-[#0A0A0A]/95 dark:to-transparent shrink-0">
 <div className="max-w-[1400px] mx-auto flex flex-wrap lg:flex-nowrap justify-between items-center gap-y-2 gap-x-2 sm:gap-4">
 
 {/* Interactive Brand Logo - Top Left */}
 <div 
   onClick={() => triggerHaptic('medium')}
   className="pointer-events-auto bg-white/95 dark:bg-[#121212]/95 backdrop-blur-md px-2 py-2 sm:px-3 sm:py-2 rounded-full border border-gray-200 dark:border-gray-800 shadow-sm flex md:hidden items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-all group shrink-0"
 >
   <div className="w-8 h-8 rounded-full bg-[#16321F] dark:bg-[#D9E96B] text-[#D9E96B] dark:text-[#16321F] flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
     <ChefHat className="w-4 h-4" />
   </div>
   <span className="font-extrabold font-display text-gray-900 dark:text-white tracking-tight hidden sm:block">Kitchen Ops</span>
 </div>

 {/* Global Search Bar */}
 {role === 'staff' && (
   <div className="pointer-events-auto flex w-full md:w-auto md:flex-1 md:max-w-lg order-3 md:order-2 mt-3 md:mt-0 relative z-50 mx-0 md:mx-2">
     <Search className="w-[18px] h-[18px] absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
     <input
       type="text"
       value={globalSearchQuery}
       onChange={(e) => setGlobalSearchQuery(e.target.value)}
       onFocus={() => setIsSearchFocused(true)}
       onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
       placeholder="Search inventory, suppliers, or past orders..."
       className="w-full h-10 md:h-11 bg-white/95 dark:bg-[#121212]/95 backdrop-blur-md rounded-full border border-gray-200 dark:border-gray-800 pl-10 pr-4 text-sm focus:outline-none focus:border-[#16321F] dark:focus:border-[#D9E96B] focus:ring-1 focus:ring-[#16321F] dark:focus:ring-[#D9E96B] shadow-sm transition-all text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
     />
     <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
        <kbd className="hidden xl:inline-flex h-6 items-center gap-1 rounded bg-gray-100 dark:bg-[#222] px-2 font-mono text-[10px] font-medium text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
          <span className="text-xs">⌘</span>K
        </kbd>
     </div>
     
     {/* Search Dropdown Mockup */}
     <AnimatePresence>
       {isSearchFocused && globalSearchQuery.length > 0 && (
         <motion.div
           initial={{ opacity: 0, y: -10 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -10 }}
           className="absolute top-14 left-0 right-0 bg-white dark:bg-[#121212] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl overflow-hidden"
         >
           <div className="p-2 border-b border-gray-50 dark:border-gray-800/50">
             <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Top Results</div>
             {searchResults.length > 0 ? (
               searchResults.map((result) => (
                 <div 
                   key={`${result.type}-${result.id}`}
                   className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] rounded-xl cursor-pointer transition-colors"
                   onClick={result.action}
                 >
                   <div className={`p-2 rounded-lg ${
                     result.type === 'inventory' ? 'bg-[#16321F]/10 dark:bg-[#D9E96B]/20 text-[#16321F] dark:text-[#D9E96B]' :
                     result.type === 'supplier' ? 'bg-blue-500/10 text-blue-500' :
                     'bg-purple-500/10 text-purple-500'
                   }`}>
                     {result.type === 'inventory' ? <Package className="w-4 h-4" /> : result.type === 'supplier' ? <Truck className="w-4 h-4" /> : <ClipboardList className="w-4 h-4" />}
                   </div>
                   <div>
                     <div className="text-sm font-bold text-gray-900 dark:text-white">{result.title}</div>
                     <div className="text-xs text-gray-500">{result.subtitle}</div>
                   </div>
                 </div>
               ))
             ) : (
               <div className="px-3 py-4 text-center text-sm text-gray-500">No results found for "{globalSearchQuery}"</div>
             )}
           </div>
           <div className="p-2">
             <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Quick Actions</div>
             <div 
               className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] rounded-xl cursor-pointer transition-colors text-gray-600 dark:text-gray-300"
               onClick={() => { setStaffTab('ops'); setGlobalSearchQuery(''); }}
             >
               <Plus className="w-4 h-4" />
               <span className="text-sm font-medium">Create new order</span>
             </div>
           </div>
         </motion.div>
       )}
     </AnimatePresence>
   </div>
 )}

 <div className="flex items-center gap-2 sm:gap-4 order-2 md:order-3 ml-auto">
 {/* Desktop Navigation moved to Sidebar */}

 {/* Compact Task Bar (The 3 Buttons) - Top Right */}
 <div className="pointer-events-auto bg-[#16321F] dark:bg-[#1a1a1a] border border-gray-900 dark:border-gray-800 rounded-full p-1 flex items-center gap-1 shadow-md shrink-0">
   {role === 'staff' && (
     <div className="relative">
       <button 
         type="button"
         onClick={() => { triggerHaptic('light'); setShowNotifications(true); }}
         className="w-9 h-9 rounded-full text-white hover:bg-white/10 flex items-center justify-center transition-colors relative"
         title="Notifications"
       >
         <Bell className="w-5 h-5" />
         {lowStockCount > 0 && (
           <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#16321F] dark:border-[#1a1a1a]"></span>
         )}
       </button>
     </div>
   )}
   <button 
     type="button"
     onClick={() => triggerHaptic('light')}
     className="w-9 h-9 rounded-full text-white hover:bg-white/10 flex items-center justify-center transition-colors"
   >
     <Menu className="w-5 h-5" />
   </button>

   <button
     type="button"
     onClick={() => { triggerHaptic('light'); setIsDarkMode(!isDarkMode); }}
     className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
     title="Toggle Dark Mode"
   >
     {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
   </button>

   <button
     type="button"
     onClick={handleSignOut}
     className="w-10 h-10 rounded-full bg-[#D9E96B] text-[#16321F] flex items-center justify-center font-bold text-sm cursor-pointer shadow-sm hover:scale-105 transition-transform"
     title="Sign Out / Switch Role"
   >
     {role === 'student' ? 'UP' : 'SP'}
   </button>
 </div>
 </div>
 </div>
 </header>

 {/* Main Content Area */}
 <main className="flex-1 min-h-0 overflow-y-auto pt-32 md:pt-20 pb-24 md:pb-8 px-3 md:px-6 scroll-smooth overscroll-y-contain w-full">
{/* Time & Calendar Hub */}
 <div className="shrink-0 relative z-30 mb-3 md:mb-4">
   <TimeAndCalendarHub 
     menuItems={menuItems}
     selectedDay={selectedDay}
     onDayChange={setSelectedDay}
     selectedDate={selectedDate}
     onDateChange={setSelectedDate}
     title={role === 'staff' ? (
       staffTab === 'dashboard' ? 'Operations Center' :
       staffTab === 'ops' ? 'Kitchen Ops & Trackers' :
       staffTab === 'stock' ? 'Supplier Reorders' :
       staffTab === 'reports' ? 'Audits & Analytics' :
       'Launch Hub'
     ) : undefined}
     actions={undefined}
   />
 </div>
 {role === 'student' && studentTab === 'menu' && (
 <div className="w-full bg-[#D9E96B] text-[#16321F] dark:text-[#D9E96B] px-4 py-2.5 flex items-center justify-center gap-1.5 shadow-sm border-b border-amber-600/10 shrink-0 relative z-20">
 <Clock className="w-4 h-4 fill-[#16321F] text-[#D9E96B]" />
 <span className="text-xs font-bold ">RSVP closes in 45 mins</span>
 </div>
 )}

 
 {role === 'student' ? (
 <AnimatePresence mode="wait">
 <motion.div 
 key={studentTab}
 initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
 animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
 exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
 transition={{ duration: 0.25, ease: 'easeOut' }}
 >
 <ErrorBoundary fallbackMessage="Failed to load student view.">
 {studentTab === 'menu' && (
 <StudentOptIn
 menuItems={menuItems}
 onConfirm={handleStudentConfirm}
 studentChoices={studentChoices}
 setStudentChoices={setStudentChoices}
 activeDay={selectedDay}
 onActiveDayChange={setSelectedDay}
 />
 )}
 {studentTab === 'checkin' && (
 <StudentCheckIn
 menuItems={menuItems}
 onLogPlateWaste={handleStudentPlateWasteLog}
 />
 )}
 {studentTab === 'profile' && (
 <StudentProfile
 onSignOut={handleSignOut}
 optInCount={optInCount}
 email={currentUserEmail}
 />
 )}
 </ErrorBoundary>
 </motion.div>
 </AnimatePresence>
 ) : (
 <AnimatePresence mode="wait">
 <motion.div 
 key={staffTab}
 initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
 animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
 exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
 transition={{ duration: 0.25, ease: 'easeOut' }}
 >
 <ErrorBoundary fallbackMessage="Failed to load staff view.">
 {staffTab === 'dashboard' && (
 <StaffDashboard
 activityLogs={activityLogs}
 pastOrders={pastOrders}
 onAddPastOrder={(o) => setPastOrders(p => [o, ...p])}
 onNavigate={setStaffTab}
 onDraftPO={(draftPO) => {
   setStaffTab('stock');
   setInitialDraftPO(draftPO);
 }}
 optInCount={optInCount}
 onAutoOrder={handleAutoOrderRice}
 riceOrdered={riceOrdered}
 selectedDate={selectedDate}
 activeOrders={activeOrders}
 onReceiveOrder={handleReceiveOrder}
 onAddActivityLog={(log) => setActivityLogs(prev => [log, ...prev])}
 onLogWaste={handleStaffLogWaste}
 />
 )}
 {staffTab === 'ops' && (
 <StaffOps
          initialSearchQuery={targetOpsSearch}
          prepItems={prepItems}
 setPrepItems={setPrepItems}
 optInCount={optInCount}
 onLogWaste={handleStaffLogWaste}
 onPlacePurchaseOrder={handlePlacePurchaseOrder}
 selectedDate={selectedDate}
 selectedDay={selectedDay}
 onDateChange={setSelectedDate}
 onDayChange={setSelectedDay}
 />
 )}
 {staffTab === 'stock' && (
 <StaffStock
          initialTab={targetStockTab}
          initialSearchQuery={targetStockSearch}
          suppliers={suppliers}
 onTriggerReorder={handleTriggerReorder}
 onAddSupplier={handleAddSupplier}
 onAddActivityLog={(log) => setActivityLogs(prev => [log, ...prev])}
          initialDraftPO={initialDraftPO}
          onClearInitialDraftPO={() => setInitialDraftPO(null)}
 />
 )}
 {staffTab === 'reports' && (
 <StaffReports efficiencyRecords={INITIAL_EFFICIENCY_RECORDS} optInCount={optInCount} prepItems={prepItems} suppliers={suppliers} activityLogs={activityLogs} isDarkMode={isDarkMode} />
 )}
 {staffTab === 'launch' && (
 <StaffLaunchHub />
 )}
 {staffTab === "management" && (
 <StaffManagement />
  )}
  {staffTab === "menu-builder" && (
    <ManagerMenu />
 )}

 </ErrorBoundary>
 </motion.div>
 </AnimatePresence>
 )}
 </main>

 {/* Bottom Nav Bar (Mobile Navigation) */}
 <nav className="fixed bottom-0 w-full z-40 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-sm flex justify-around items-center h-16 md:hidden">
 {role === 'student' ? (
 <>
 <button
 onClick={() => { triggerHaptic('light'); setStudentTab('menu'); }}
 className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all active:scale-90`}
 >
 <div className={`p-1.5 rounded-full transition-all ${studentTab === 'menu' ? 'bg-[#16321F]/10 dark:bg-[#D9E96B]/10 text-[#16321F] dark:text-[#D9E96B]' : 'text-gray-400 dark:text-gray-600'}`}>
 <Utensils className="w-5 h-5" />
 </div>
 <span className={`text-xs mt-0.5 ${studentTab === 'menu' ? 'font-bold text-[#16321F] dark:text-[#D9E96B]' : 'font-medium text-gray-500'}`}>Menu</span>
 </button>
 <button
 onClick={() => { triggerHaptic('light'); setStudentTab('checkin'); }}
 className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all active:scale-90`}
 >
 <div className={`p-1.5 rounded-full transition-all ${studentTab === 'checkin' ? 'bg-[#16321F]/10 dark:bg-[#D9E96B]/10 text-[#16321F] dark:text-[#D9E96B]' : 'text-gray-400 dark:text-gray-600'}`}>
 <ClipboardList className="w-5 h-5" />
 </div>
 <span className={`text-xs mt-0.5 ${studentTab === 'checkin' ? 'font-bold text-[#16321F] dark:text-[#D9E96B]' : 'font-medium text-gray-500'}`}>Check-in</span>
 </button>
 <button
 onClick={() => { triggerHaptic('light'); setStudentTab('profile'); }}
 className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all active:scale-90`}
 >
 <div className={`p-1.5 rounded-full transition-all ${studentTab === 'profile' ? 'bg-[#16321F]/10 dark:bg-[#D9E96B]/10 text-[#16321F] dark:text-[#D9E96B]' : 'text-gray-400 dark:text-gray-600'}`}>
 <User className="w-5 h-5" />
 </div>
 <span className={`text-xs mt-0.5 ${studentTab === 'profile' ? 'font-bold text-[#16321F] dark:text-[#D9E96B]' : 'font-medium text-gray-500'}`}>Profile</span>
 </button>
 </>
 ) : (
 <>
 <button
 onClick={() => { triggerHaptic('light'); setStaffTab('dashboard'); }}
 className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all active:scale-90`}
 >
 <div className={`p-1.5 rounded-full transition-all ${staffTab === 'dashboard' ? 'bg-[#16321F]/10 dark:bg-[#D9E96B]/10 text-[#16321F] dark:text-[#D9E96B]' : 'text-gray-400 dark:text-gray-600'}`}>
 <Users className="w-5 h-5" />
 </div>
 <span className={`text-xs mt-0.5 ${staffTab === 'dashboard' ? 'font-bold text-[#16321F] dark:text-[#D9E96B]' : 'font-medium text-gray-500'}`}>Ops</span>
 </button>
 <button
 onClick={() => { triggerHaptic('light'); setStaffTab('ops'); }}
 className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all active:scale-90`}
 >
 <div className={`p-1.5 rounded-full transition-all ${staffTab === 'ops' ? 'bg-[#16321F]/10 dark:bg-[#D9E96B]/10 text-[#16321F] dark:text-[#D9E96B]' : 'text-gray-400 dark:text-gray-600'}`}>
 <ChefHat className="w-5 h-5" />
 </div>
 <span className={`text-xs mt-0.5 ${staffTab === 'ops' ? 'font-bold text-[#16321F] dark:text-[#D9E96B]' : 'font-medium text-gray-500'}`}>Prep</span>
 </button>
 <button
 onClick={() => { triggerHaptic('light'); setStaffTab('stock'); }}
 className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all active:scale-90 relative`}
 >
 <div className={`p-1.5 rounded-full transition-all relative ${staffTab === 'stock' ? 'bg-[#16321F]/10 dark:bg-[#D9E96B]/10 text-[#16321F] dark:text-[#D9E96B]' : 'text-gray-400 dark:text-gray-600'}`}>
 <Package className="w-5 h-5" />
 {lowStockCount > 0 && (
  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-[#0A170E] animate-pulse"></div>
 )}
 </div>
 <span className={`text-xs mt-0.5 ${staffTab === 'stock' ? 'font-bold text-[#16321F] dark:text-[#D9E96B]' : 'font-medium text-gray-500'}`}>Stock</span>
 </button>
 <button
 onClick={() => { triggerHaptic('light'); setStaffTab('reports'); }}
 className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all active:scale-90`}
 >
 <div className={`p-1.5 rounded-full transition-all ${staffTab === 'reports' ? 'bg-[#16321F]/10 dark:bg-[#D9E96B]/10 text-[#16321F] dark:text-[#D9E96B]' : 'text-gray-400 dark:text-gray-600'}`}>
 <BarChart2 className="w-5 h-5" />
 </div>
 <span className={`text-xs mt-0.5 ${staffTab === 'reports' ? 'font-bold text-[#16321F] dark:text-[#D9E96B]' : 'font-medium text-gray-500'}`}>Reports</span>
 </button>
 <button
 onClick={() => { triggerHaptic('light'); setStaffTab('launch'); }}
 className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all active:scale-90`}
 >
 <div className={`p-1.5 rounded-full transition-all ${staffTab === 'launch' ? 'bg-amber-100 text-amber-600' : 'text-[#D9E96B]/80'}`}>
 <Rocket className={`w-5 h-5 ${staffTab === 'launch' ? 'animate-pulse' : ''}`} />
 </div>
 <span className={`text-xs mt-0.5 ${staffTab === 'launch' ? 'font-bold text-amber-600' : 'font-medium text-gray-500'}`}>Launch</span>
 </button>
 {role === "manager" && (
 <button
 onClick={() => { triggerHaptic("light"); setStaffTab("management"); }}
 className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all active:scale-90`}
 >
 <div className={`p-1.5 rounded-full transition-all ${staffTab === "management" ? "bg-[#16321F]/10 dark:bg-[#D9E96B]/10 text-[#16321F] dark:text-[#D9E96B]" : "text-gray-400 dark:text-gray-600"}`}>
 <Shield className="w-5 h-5" />
 </div>
 <span className={`text-xs mt-0.5 ${staffTab === "management" ? "font-bold text-[#16321F] dark:text-[#D9E96B]" : "font-medium text-gray-500"}`}>Manage</span>
 </button>
 )}
 </>
        )}
      </nav>
      </div>
    </div>
    </>
  );
}
