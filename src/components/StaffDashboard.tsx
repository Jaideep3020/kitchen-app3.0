import React, { useState, useEffect, useMemo } from 'react';
import { useToast } from '../contexts/ToastContext';
import { useData } from '../contexts/DataContext';
import { useDashboardMetrics } from '../hooks/useDashboardMetrics';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChevronUp, ChevronDown, Clock, 
 AlertTriangle, ShoppingCart, Users, ChefHat, Trash2, 
 Truck, Utensils, Printer, Sparkles, TrendingDown, ClipboardList, AlertCircle, CheckCircle2, 
 RefreshCw, X, ShieldCheck, ArrowRight, Star, Coins, Delete
, Check, Camera , BarChart2 } from 'lucide-react';
import { ActivityLog, ActiveOrder } from '../types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reportIssue } from '../api';

import { triggerHaptic } from '../lib/haptics';
import { ErrorBoundary } from './ErrorBoundary';

interface StaffDashboardProps {
 activityLogs: ActivityLog[];
 pastOrders?: any[];
 onAddPastOrder?: (order: any) => void;
 optInCount: number;
 onAutoOrder: () => void;
 riceOrdered: boolean;
 selectedDate?: Date;
 selectedDay?: string;
 onNavigate?: (tab: any) => void;
 activeOrders?: ActiveOrder[];
 onReceiveOrder?: (orderId: string) => void;
 onAddActivityLog?: (log: any) => void;
 onDraftPO?: (draftPO: { item: string; supplierId: string }) => void;
 onLogWaste?: (itemName: string, kitchenQty: number, plateQty: number) => void;
}

export default function StaffDashboard({
  activeOrders = [],
  onReceiveOrder,
  onAddActivityLog,
  activityLogs,
  optInCount,
  onAutoOrder,
  riceOrdered,
  selectedDate,
  selectedDay,
  onNavigate,
  pastOrders,
  onAddPastOrder,
  onDraftPO,
  onLogWaste
}: StaffDashboardProps) {
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const reportIssueMutation = useMutation({
    mutationFn: reportIssue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activityLogs'] });
      triggerHaptic('success');
      addToast('Issue reported successfully.', 'success');
      setShowModal(null);
    },
    onError: () => {
      addToast('Failed to report issue.', 'error');
    }
  });

  const [showModal, setShowModal] = useState<string | null>(null);

  const [receivingOrder, setReceivingOrder] = useState<ActiveOrder | null>(null);
  const [checklistStatus, setChecklistStatus] = useState<string | null>(null); // 'full' | 'short' | 'damaged'
  const [checklistNotes, setChecklistNotes] = useState<string>('');

  const [showWasteInsight, setShowWasteInsight] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [amountInput, setAmountInput] = useState("");
  const [showKeypad, setShowKeypad] = useState<'amount' | 'invoice' | null>(null);
  const { 
    menuItems,
    wasteLogs, setWasteLogs, 
    prepProgress, prepItems,
    plateWasteThresholds, setPlateWasteThresholds,
    thresholdAlerts, setThresholdAlerts,
    studentChoices, mealOptIns,
    suppliers,
    sharedConfig,
    updateSharedConfig,

    currentUserEmail
  } = useData();
  const [isLoading, setIsLoading] = useState(true);



  const {
    dateStr,
    day,
    totalWaste,
    totalKitchenWaste,
    totalPlateWaste,
    totalPrepKgs,
    wastePercentage,
    efficiencyScore,
    todayWaste,
    chartData,
    dashboardChartData
  } = useDashboardMetrics(selectedDate,
  selectedDay);

 const [scrolled, setScrolled] = useState(false); 
 
 
 
  const [activeOpsTab, setActiveOpsTab] = useState<'prep' | 'inventory' | 'waste'>('prep');


 // Inventory Database
 const inventoryItems = [
   { id: 1, name: 'Sona Masuri Rice', current: 12, threshold: 50, unit: 'kg', urgency: 'critical', ordered: riceOrdered, expiryDays: 120 },
   { id: 2, name: 'Toor Dal', current: 4, threshold: 10, unit: 'kg', urgency: 'high', ordered: false, expiryDays: 90 },
   { id: 3, name: 'Sunflower Oil', current: 8, threshold: 15, unit: 'L', urgency: 'medium', ordered: false, expiryDays: 180 },
   { id: 4, name: 'Tomatoes', current: 15, threshold: 10, unit: 'kg', urgency: 'normal', ordered: false, expiryDays: 1 },
   { id: 5, name: 'Fresh Coriander', current: 2, threshold: 5, unit: 'kg', urgency: 'normal', ordered: false, expiryDays: 2 },
 ];

 const oldLowStockItems = inventoryItems.filter(item => item.current <= item.threshold || item.urgency === 'critical');
 const expiringItems = inventoryItems.filter(item => item.expiryDays <= 3).sort((a, b) => a.expiryDays - b.expiryDays);
 const hasExpiringWarning = expiringItems.length > 0;


 // Simulate skeleton loaders for high-performance feel
 useEffect(() => {
 const timer = setTimeout(() => {
 setIsLoading(false);
 }, 1100);
 
return () => clearTimeout(timer);
 }, []);

 // Monitor scroll for Parallax / shrinking sticky elements
 useEffect(() => {
 const handleScroll = () => {
 if (window.scrollY > 40) {
 setScrolled(true);
 } else {
 setScrolled(false);
 }
 };
 window.addEventListener('scroll', handleScroll);
 return () => window.removeEventListener('scroll', handleScroll);
 }, []);



  const getFormattedDate = () => {
    if (!selectedDate) return 'Oct 24';
    return selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getActiveShiftName = () => {
    if (!selectedDate) return 'Morning Shift';
    const hours = selectedDate.getHours();
    if (hours >= 7 && hours < 10) return 'Breakfast Shift';
    if (hours >= 12 && hours < 15) return 'Lunch Shift';
    if (hours >= 19 && hours < 22) return 'Dinner Shift';
    return 'Prep & Downtime';
  };

  const triageData = useMemo(() => {
    const lowStockItems = prepItems.filter(item => item.currentStock <= item.reorderLevel);
    const topLowStock = lowStockItems.length > 0 ? lowStockItems[0] : null;

    const wasteStats: { [key: string]: number } = {};
    wasteLogs.forEach(w => {
      wasteStats[w.itemName] = (wasteStats[w.itemName] || 0) + (w.plateQty || 0);
    });
    let topWastedItem = '';
    let maxWaste = 0;
    Object.entries(wasteStats).forEach(([item, waste]) => {
      if (waste > maxWaste) { maxWaste = waste; topWastedItem = item; }
    });

    const nextDelivery = activeOrders.find(o => o.status === 'Placed' || o.status === 'In Transit');

    return { topLowStock, topWastedItem, maxWaste, nextDelivery };
  }, [prepItems, wasteLogs, activeOrders]);

  const { topLowStock, topWastedItem, maxWaste, nextDelivery } = triageData;

  const activeShiftMeal = useMemo(() => {
    const shift = getActiveShiftName();
    if (shift.includes('Breakfast')) return 'breakfast';
    if (shift.includes('Lunch')) return 'lunch';
    if (shift.includes('Dinner')) return 'dinner';
    return 'lunch'; // fallback
  }, [selectedDate]);

  const activeShiftDish = useMemo(() => {
    return menuItems.find(item => item.dayOfWeek === day && item.mealType === activeShiftMeal);
  }, [day, activeShiftMeal, menuItems]);

  const activeShiftOptIns = useMemo(() => {
    if (!activeShiftDish) return 142 + optInCount;
    return mealOptIns[activeShiftDish.id] || 150;
  }, [activeShiftDish, mealOptIns, optInCount]);

  const dayMealIds = useMemo(() => {
    return menuItems.filter(item => item.dayOfWeek === day).map(item => item.id);
  }, [day, menuItems]);

  const studentDayRSVPs = useMemo(() => {
    return dayMealIds.filter(id => studentChoices[id]).length;
  }, [dayMealIds, studentChoices]);

  const studentActiveShiftRSVP = useMemo(() => {
    if (!activeShiftDish) return false;
    return !!studentChoices[activeShiftDish.id];
  }, [activeShiftDish, studentChoices]);

  const todayPrep = useMemo(() => {
    return prepProgress.find((p: any) => p.day === day);
  }, [prepProgress, day]);

  const mealsBreakdown = useMemo(() => {
    return (['breakfast', 'lunch', 'dinner'] as const).map(mealType => {
      const dish = menuItems.find(item => item.dayOfWeek === day && item.mealType === mealType);
      if (!dish) return null;
      const optIns = mealOptIns[dish.id] || 150;
      const prepped = todayPrep?.portions?.[dish.id] || 0;
      const userRSVP = !!studentChoices[dish.id];
      return {
        id: dish.id,
        mealType,
        name: dish.name,
        optIns,
        prepped,
        userRSVP
      };
    }).filter((x): x is NonNullable<typeof x> => x !== null);
  }, [day, mealOptIns, todayPrep, studentChoices]);


 if (isLoading) {
  return (
    <div id="staff_dashboard_skeleton" className="flex-grow max-w-7xl mx-auto w-full px-4 md:px-8 pt-0 pb-6 space-y-4">
      {/* Skeleton Mini Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white dark:bg-[#121212] rounded-2xl p-2 sm:p-2.5 border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center h-24 sm:h-28 animate-skeleton-pulse">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-200 dark:bg-[#222] mb-2"></div>
            <div className="h-2 w-16 bg-gray-200 dark:bg-[#222] rounded mb-2"></div>
            <div className="h-4 sm:h-5 w-12 bg-gray-300 dark:bg-[#333] rounded"></div>
          </div>
        ))}
      </div>

      {/* Skeleton Triage Center */}
      <div className="bg-white dark:bg-[#121212] rounded-2xl p-4 border border-gray-100 dark:border-gray-700 flex flex-col animate-skeleton-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 w-32 bg-gray-200 dark:bg-[#222] rounded"></div>
          <div className="h-4 w-16 bg-gray-200 dark:bg-[#222] rounded"></div>
        </div>
        <div className="space-y-2">
          <div className="h-14 w-full bg-gray-50 dark:bg-[#1a1a1a] rounded-lg border border-gray-100 dark:border-gray-700"></div>
          <div className="h-14 w-full bg-gray-50 dark:bg-[#1a1a1a] rounded-lg border border-gray-100 dark:border-gray-700"></div>
        </div>
      </div>

      {/* Skeleton Analysis Card */}
      <div className="bg-white dark:bg-[#121212] rounded-2xl p-5 border border-gray-100 dark:border-gray-700 col-span-full animate-skeleton-pulse">
        <div className="flex items-center justify-between mb-6">
          <div className="h-4 w-32 bg-gray-200 dark:bg-[#222] rounded"></div>
          <div className="h-4 w-16 bg-gray-200 dark:bg-[#222] rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col items-center justify-center py-4">
             <div className="h-28 w-28 rounded-full border-[12px] border-gray-100 dark:border-[#222] mb-4 relative flex items-center justify-center">
               <div className="h-6 w-12 bg-gray-200 dark:bg-[#333] rounded"></div>
             </div>
             <div className="h-3 w-32 bg-gray-200 dark:bg-[#222] rounded"></div>
          </div>
          <div className="flex flex-col justify-center space-y-6">
             <div className="space-y-2">
               <div className="flex justify-between"><div className="h-3 w-24 bg-gray-200 dark:bg-[#222] rounded"></div><div className="h-3 w-12 bg-gray-200 dark:bg-[#222] rounded"></div></div>
               <div className="h-3 w-full bg-gray-100 dark:bg-[#1a1a1a] rounded-full"></div>
             </div>
             <div className="space-y-2">
               <div className="flex justify-between"><div className="h-3 w-24 bg-gray-200 dark:bg-[#222] rounded"></div><div className="h-3 w-12 bg-gray-200 dark:bg-[#222] rounded"></div></div>
               <div className="h-3 w-full bg-gray-100 dark:bg-[#1a1a1a] rounded-full"></div>
             </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
          <div className="h-3 w-40 bg-gray-200 dark:bg-[#222] rounded mb-6"></div>
          <div className="w-full h-48 bg-gray-50 dark:bg-[#1a1a1a] rounded-lg border border-gray-100 dark:border-gray-700 flex items-end justify-around px-4 pb-4 pt-8 gap-2">
            {[40, 70, 45, 90, 60].map((h, i) => (
              <div key={i} className="w-12 bg-gray-200 dark:bg-[#222] rounded-t-sm" style={{height: h + '%'}}></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
 }





  const handleKeypadPress = (key: string | number) => {
    triggerHaptic('light');
    if (showKeypad === 'amount') {
      if (key === 'del') {
        setAmountInput(prev => prev.slice(0, -1));
      } else if (key === '.') {
        if (!amountInput.includes('.')) setAmountInput(prev => prev + key);
      } else {
        setAmountInput(prev => prev === '0' ? String(key) : prev + key);
      }
    } else if (showKeypad === 'invoice') {
      if (key === 'del') {
        setInvoiceNo(prev => prev.slice(0, -1));
      } else if (key === 'space') {
        setInvoiceNo(prev => prev + ' ');
      } else {
        setInvoiceNo(prev => prev + key);
      }
    }
  };



  return (
 <div id="staff_dashboard" className="flex-grow max-w-7xl mx-auto w-full px-4 md:px-8 pt-0 pb-6 space-y-4">


  {/* Compact Horizontal Row of Mini Stats/KPIs - Perfect Alignment & Minimal Space */}
  
  <div className={`grid grid-cols-3 transition-all duration-300 gap-2 sm:gap-3`}>
  {/* Patrons Card */}
  <ErrorBoundary fallbackMessage="Failed to load diners metric.">
  <div 
    onClick={() => { triggerHaptic('medium'); setShowModal('diners'); }}
    className="bg-white dark:bg-[#121212] rounded-2xl p-2 sm:p-2.5 border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center text-center group hover:border-[#16321F]/20 hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all shadow-sm h-full cursor-pointer"
    title="Click to view breakdown for all meals today"
  >
    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[#16321F] dark:text-[#D9E96B] flex items-center justify-center border border-emerald-100 dark:border-emerald-900/40 mb-1 group-hover:scale-105 transition-all">
     <Users className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
    </div>
    <span className="text-[9px] sm:text-[10px] font-semibold text-gray-400 dark:text-gray-300 block font-mono uppercase tracking-wider mb-0.5">Expected Diners ({activeShiftMeal})</span>
    <div className="text-sm sm:text-lg font-black text-gray-900 dark:text-white font-display leading-none mb-1.5">{activeShiftOptIns}</div>
    <div className="text-[8px] sm:text-[9px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100/50 dark:border-emerald-900/40 rounded-full px-1.5 py-0.5 font-bold whitespace-nowrap">
      {studentActiveShiftRSVP ? `+1 Yours Active` : `+12 RSVP'd`}
    </div>
  </div>
  </ErrorBoundary>

  {/* Target Prep Card */}
  <ErrorBoundary fallbackMessage="Failed to load prep metric.">
  <div className="bg-white dark:bg-[#121212] rounded-2xl p-2 sm:p-3 border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center text-center group hover:border-[#16321F]/20 transition-all shadow-sm h-full">
    <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 flex items-center justify-center border border-teal-100 dark:border-teal-900/40 mb-1 sm:mb-2 group-hover:scale-105 transition-all">
     <ChefHat className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
    </div>
    <span className="text-[9px] sm:text-[10px] font-semibold text-gray-400 dark:text-gray-300 block font-mono uppercase tracking-wider mb-0.5">Portions Prepared</span>
    <div className="text-base sm:text-xl font-black text-gray-900 dark:text-white font-display leading-none mb-1.5">120 / {activeShiftOptIns}</div>
    <span className="text-[8px] sm:text-[9px] text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/30 rounded-full px-1.5 py-0.5 font-bold whitespace-nowrap">
      Cooked
    </span>
  </div>
  </ErrorBoundary>

  {/* Live Waste Tracker */}
  <ErrorBoundary fallbackMessage="Failed to load waste metric.">
  <div className="bg-[#D9E96B] dark:bg-[#1b2b11] rounded-2xl p-2 sm:p-3 border border-[#D9E96B]/40 dark:border-emerald-900/40 flex flex-col items-center justify-center text-center group hover:border-[#16321F]/20 transition-all shadow-sm h-full">
    <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-white/60 dark:bg-black/30 text-[#16321F] dark:text-[#D9E96B] flex items-center justify-center border border-white/40 dark:border-gray-700 mb-1 sm:mb-2 group-hover:scale-105 transition-all">
     <Utensils className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
    </div>
    <span className="text-[9px] sm:text-[10px] font-semibold text-emerald-800 dark:text-emerald-400 block font-mono uppercase tracking-wider mb-0.5">Food Waste Status</span>
    <div className="text-base sm:text-xl font-black text-[#0A170E] dark:text-white font-display leading-none mb-1.5">
      {wastePercentage || 0}%
    </div>
    <div className="text-[8px] sm:text-[9px] text-emerald-700 dark:text-emerald-400 bg-white/50 dark:bg-black/40 px-1.5 py-0.5 rounded-full font-bold whitespace-nowrap flex items-center justify-center gap-1">
      <TrendingDown className="w-2.5 h-2.5" /> Healthy Trend
    </div>
  </div>
  </ErrorBoundary>
 </div>

  {/* Quick Actions Bar */}
  <div className="grid grid-cols-4 gap-2 mb-3">
  <button
    type="button"
    onClick={() => { triggerHaptic('light'); setShowModal('delivery'); }}
    className="bg-[#16321F] dark:bg-emerald-900 text-white rounded-xl p-2 flex flex-col items-center justify-center gap-1 font-bold text-[9px] shadow-sm hover:bg-[#2C4134] transition-colors text-center leading-tight"
  >
    <Truck className="w-4 h-4" />
    Receive<br/>Delivery
  </button>
  <button
    type="button"
    onClick={() => { triggerHaptic('light'); setShowModal('leftovers'); }}
    className="bg-white dark:bg-[#222222] text-[#16321F] dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl p-2 flex flex-col items-center justify-center gap-1 font-bold text-[9px] shadow-sm hover:bg-gray-50 transition-colors text-center leading-tight"
  >
    <Trash2 className="w-4 h-4 text-rose-500" />
    Log<br/>Leftovers
  </button>
  <button
    type="button"
    onClick={() => { triggerHaptic('light'); if (onNavigate) onNavigate('ops'); }}
    className="bg-white dark:bg-[#222222] text-[#16321F] dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl p-2 flex flex-col items-center justify-center gap-1 font-bold text-[9px] shadow-sm hover:bg-gray-50 transition-colors text-center leading-tight"
  >
    <ClipboardList className="w-4 h-4 text-amber-500" />
    Check<br/>Pantry
  </button>
  <button
    type="button"
    onClick={() => { triggerHaptic('light'); setShowModal('issue'); }}
    className="bg-white dark:bg-[#222222] text-[#16321F] dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl p-2 flex flex-col items-center justify-center gap-1 font-bold text-[9px] shadow-sm hover:bg-gray-50 transition-colors text-center leading-tight"
  >
    <AlertCircle className="w-4 h-4 text-gray-500 dark:text-gray-400 dark:text-gray-300" />
    Report<br/>Issue
  </button>
 </div>

 
  {/* Daily Analysis Card */}
 <div className="bg-white dark:bg-[#121212] rounded-2xl p-5 shadow-xs border border-gray-100 dark:border-gray-700 col-span-full">
   <div className="flex items-center justify-between mb-4">
     <h3 className="text-sm font-extrabold text-[#0A170E] dark:text-white font-display flex items-center gap-2">
       <BarChart2 className="w-4 h-4 text-emerald-500"/> Today's Analysis
     </h3>
     <div className="flex gap-1.5 items-center">
        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{dateStr}</span>
      </div>
   </div>
   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
     <div>
       <div className="flex justify-between text-xs mb-1 font-bold text-gray-600 dark:text-gray-300">
         <span>Total Prep Goal (kg)</span>
         <span>{totalPrepKgs.toFixed(1)} kg</span>
       </div>
       <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
         <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }}></div>
       </div>
     </div>
     <div>
       <div className="flex justify-between text-xs mb-1 font-bold text-gray-600 dark:text-gray-300">
         <span>Total Waste Logged (kg)</span>
         <span className="text-rose-500">{totalWaste.toFixed(1)} kg</span>
       </div>
       <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
         <div className="h-full bg-rose-500 rounded-full" style={{ width: `${Math.min(100, wastePercentage)}%` }}></div>
       </div>
     </div>
   </div>
   {dashboardChartData.length > 0 && (
     <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
       <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 dark:text-gray-300 mb-4">Waste Breakdown by Item (Top 5)</h4>
       <ErrorBoundary fallbackMessage="Failed to load waste chart.">
         <div className="w-full h-48">
           <ResponsiveContainer width="100%" height="100%">
             <BarChart data={dashboardChartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
               <XAxis dataKey="name" tick={{fontSize: 10, fill: '#888'}} axisLine={false} tickLine={false} />
               <YAxis tick={{fontSize: 10, fill: '#888'}} axisLine={false} tickLine={false} />
               <Tooltip 
                 cursor={{fill: 'rgba(0,0,0,0.05)'}} 
                 contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', fontSize: '12px'}}
               />
               <Legend wrapperStyle={{fontSize: '10px'}} />
               <Bar dataKey="consumed" name="Consumed (kg)" stackId="a" fill="#10B981" radius={[0, 0, 0, 0]} />
               <Bar dataKey="overPrep" name="Over-Prep (kg)" stackId="a" fill="#D9E96B" radius={[0, 0, 0, 0]} />
               <Bar dataKey="plateWaste" name="Plate Waste (kg)" stackId="a" fill="#F43F5E" radius={[4, 4, 0, 0]} />
             </BarChart>
           </ResponsiveContainer>
         </div>
       </ErrorBoundary>
     </div>
   )}
 </div>

  {/* Live Student Opt-ins Breakdown Card */}
  <div className="bg-white dark:bg-[#121212] rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 col-span-full animate-tab-transition">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-extrabold text-[#0A170E] dark:text-white font-display flex items-center gap-2">
        <Users className="w-4 h-4 text-emerald-500 animate-pulse" />
        Live Student Opt-ins Breakdown ({day})
      </h3>
      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-full border border-emerald-100/50">
        Live Synced
      </span>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {['breakfast', 'lunch', 'dinner'].map((mealType) => {
        const dish = menuItems.find(item => item.dayOfWeek === day && item.mealType === mealType);
        if (!dish) return null;
        
        const count = mealOptIns[dish.id] || 150;
        const studentBooked = !!studentChoices[dish.id];
        
        return (
          <div key={dish.id} className="p-3.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-black/20 flex flex-col justify-between h-full hover:border-[#16321F]/20 transition-all">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-300 uppercase tracking-wider font-mono">
                  {mealType}
                </span>
                {studentBooked && (
                  <span className="text-[8px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                    Selected
                  </span>
                )}
              </div>
              <h4 className="text-xs font-bold text-gray-800 dark:text-white line-clamp-1 mb-2">
                {dish.name}
              </h4>
            </div>
            
            <div className="space-y-1.5 mt-2">
              <div className="flex justify-between text-[11px] font-bold text-gray-600 dark:text-gray-300">
                <span>Opt-ins</span>
                <span className="text-[#16321F] dark:text-[#D9E96B]">{count} students</span>
              </div>
              <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, (count / 200) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>

  {/* Ops Navigation Tabs */}
 <div className="bg-white dark:bg-[#121212] rounded-2xl p-4 shadow-xs border border-gray-100 dark:border-gray-700 flex flex-col group transition-all duration-300">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-extrabold text-[#0A170E] dark:text-white font-display flex items-center gap-2"><Sparkles className="w-4 h-4 text-amber-500"/> Action Triage Center</h3>
          <div className="text-[10px] text-gray-500 dark:text-gray-400 dark:text-gray-300 font-mono bg-gray-100 dark:bg-[#222] px-2 py-1 rounded-md">Zero-Inbox Ops</div>
        </div>
        
        <div className="space-y-2 mt-2">
          
          {topLowStock ? (
          <div 
            className="flex items-center justify-between p-3 rounded-lg border border-rose-200 bg-rose-50/50 dark:border-rose-900/50 dark:bg-rose-950/20 cursor-pointer hover:bg-rose-100/50 transition-colors" 
            onClick={() => { 
              triggerHaptic('light'); 
              const matchedSupplier = suppliers?.find(s => 
                s.items?.some(i => i.name.toLowerCase() === topLowStock.name.toLowerCase())
              );
              const supplierId = matchedSupplier?.id || (suppliers?.[0]?.id || '');
              if (onDraftPO) {
                onDraftPO({ item: topLowStock.name, supplierId });
              } else if (onNavigate) {
                onNavigate('stock');
              }
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-600 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-900 dark:text-white">Critically Low Stock</div>
                <div className="text-[10px] text-gray-500 dark:text-gray-400 dark:text-gray-300 font-medium">{topLowStock.name} ({topLowStock.currentStock}{topLowStock.unit} remaining, Min: {topLowStock.reorderLevel}{topLowStock.unit})</div>
              </div>
            </div>
            <button 
              className="text-[10px] font-bold bg-[#16321F] hover:bg-[#2C4134] text-white px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors" 
              onClick={(e) => { 
                e.stopPropagation(); 
                triggerHaptic('success'); 
                const matchedSupplier = suppliers?.find(s => 
                  s.items?.some(i => i.name.toLowerCase() === topLowStock.name.toLowerCase())
                );
                const supplierId = matchedSupplier?.id || (suppliers?.[0]?.id || '');
                if (onDraftPO) {
                  onDraftPO({ item: topLowStock.name, supplierId });
                } else if (onNavigate) {
                  onNavigate('stock');
                }
              }}
            >
              Draft PO
            </button>
          </div>
          ) : (
          <div className="flex items-center justify-between p-3 rounded-lg border border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/50 dark:bg-emerald-950/20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-900 dark:text-white">Stock Levels Healthy</div>
                <div className="text-[10px] text-gray-500 dark:text-gray-400 dark:text-gray-300 font-medium">All items are above reorder minimums.</div>
              </div>
            </div>
          </div>
          )}

          
          
          {topWastedItem && maxWaste > 5 ? (
          <div className="flex items-center justify-between p-3 rounded-lg border border-amber-200 bg-amber-50/50 dark:border-amber-900/50 dark:bg-amber-950/20 cursor-pointer hover:bg-amber-100/50 transition-colors" onClick={() => { triggerHaptic('light'); setShowWasteInsight(true); }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-600 flex items-center justify-center">
                <Trash2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-900 dark:text-white">High Plate Waste Detected</div>
                <div className="text-[10px] text-gray-500 dark:text-gray-400 dark:text-gray-300 font-medium">{topWastedItem} shows high waste consistently.</div>
              </div>
            </div>
            <button className="text-[10px] font-bold bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors" onClick={(e) => { e.stopPropagation(); triggerHaptic('light'); setShowWasteInsight(true); }}>
              Review
            </button>
          </div>
          ) : null}

          
          
          {nextDelivery ? (
          <div className="flex items-center justify-between p-3 rounded-lg border border-blue-200 bg-blue-50/50 dark:border-blue-900/50 dark:bg-blue-950/20 cursor-pointer hover:bg-blue-100/50 transition-colors" onClick={() => { triggerHaptic('light'); setShowModal('delivery'); }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-900 dark:text-white">Expected Delivery</div>
                <div className="text-[10px] text-gray-500 dark:text-gray-400 dark:text-gray-300 font-medium">{nextDelivery.supplierName} ({nextDelivery.id})</div>
              </div>
            </div>
            <button className="text-[10px] font-bold bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors" onClick={(e) => { e.stopPropagation(); triggerHaptic('light'); setShowModal('delivery'); }}>
              Receive
            </button>
          </div>
          ) : null}

        </div>

        {/* Plate Waste Alerts & Thresholds Settings */}
        <div className="bg-white dark:bg-[#121212] rounded-2xl p-5 shadow-xs border border-gray-100 dark:border-gray-700 flex flex-col gap-4 mt-4">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
            <h3 className="text-sm font-extrabold text-[#0A170E] dark:text-white font-display flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 animate-pulse" />
              Plate Waste Automated Alerts
            </h3>
            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/30 px-2 py-1 rounded">
              Active Threshold Monitor
            </span>
          </div>

          {/* Section 1: Active Plate Waste Alerts */}
          <div>
            <h4 className="text-xs font-bold text-gray-500 dark:text-gray-300 mb-3 flex items-center justify-between">
              <span>Active Alerts ({thresholdAlerts.filter(a => a.status === 'active').length})</span>
              {thresholdAlerts.filter(a => a.status === 'active').length > 0 && (
                <button 
                  onClick={() => {
                    triggerHaptic('light');
                    setThresholdAlerts(prev => prev.map(a => ({ ...a, status: 'dismissed' })));
                    addToast('All alerts dismissed.', 'success');
                  }}
                  className="text-[10px] text-gray-500 dark:text-gray-400 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 underline font-semibold"
                >
                  Dismiss All
                </button>
              )}
            </h4>
            {thresholdAlerts.filter(a => a.status === 'active').length === 0 ? (
              <div className="p-4 text-center bg-gray-50 dark:bg-[#1a1a1a]/40 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1.5" />
                <p className="text-xs font-bold text-gray-700 dark:text-gray-300">All Waste Within Safety Margins</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 dark:text-gray-300 mt-0.5">No plate waste threshold violations detected today.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {thresholdAlerts.filter(a => a.status === 'active').map(alert => (
                  <div key={alert.id} className="p-3 bg-rose-50/50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/30 rounded-xl flex items-center justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-900 dark:text-white">{alert.itemName}</div>
                        <div className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold">
                          Exceeded threshold! {alert.actualValue}kg / {alert.thresholdValue}kg ({alert.type === 'single' ? 'Single entry' : 'Daily sum'})
                        </div>
                        <div className="text-[9px] text-gray-400 dark:text-gray-300 mt-0.5">{alert.date} at {alert.time}</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        triggerHaptic('light');
                        setThresholdAlerts(prev => prev.map(a => a.id === alert.id ? { ...a, status: 'dismissed' } : a));
                        addToast(`Alert for ${alert.itemName} dismissed.`, 'info');
                      }}
                      className="text-[10px] font-bold text-gray-600 dark:text-gray-300 hover:text-red-500 bg-white dark:bg-[#1a1a1a] px-2 py-1 rounded-md border border-gray-200 dark:border-gray-700 shadow-2xs shrink-0 transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Threshold Rules Configuration */}
          <div className="border-t border-gray-100 dark:border-gray-700 pt-3 mt-1">
            <h4 className="text-xs font-bold text-gray-500 dark:text-gray-300 mb-3 flex items-center justify-between">
              <span>Define Item Waste Thresholds</span>
              <span className="text-[9px] text-gray-400 dark:text-gray-300">Rules apply dynamically on log entries</span>
            </h4>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {plateWasteThresholds.map(rule => (
                <div key={rule.menuItemId} className="p-2.5 bg-gray-50 dark:bg-[#1a1a1a]/30 border border-gray-100 dark:border-gray-700 rounded-xl flex items-center justify-between gap-4">
                  <div className="flex-grow min-w-0">
                    <div className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">{rule.itemName}</div>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400 dark:text-gray-300 font-medium">Alert if plate waste exceeds {rule.threshold.toFixed(1)} kg</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        triggerHaptic('light');
                        setPlateWasteThresholds(prev => prev.map(t => t.menuItemId === rule.menuItemId ? { ...t, threshold: Math.max(0.5, t.threshold - 0.5) } : t));
                        addToast(`Threshold for ${rule.itemName} decreased to ${(rule.threshold - 0.5).toFixed(1)}kg`, 'info');
                      }}
                      className="w-7 h-7 bg-white dark:bg-[#222] border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-extrabold font-mono w-12 text-center text-gray-900 dark:text-white">
                      {rule.threshold.toFixed(1)} kg
                    </span>
                    <button
                      onClick={() => {
                        triggerHaptic('light');
                        setPlateWasteThresholds(prev => prev.map(t => t.menuItemId === rule.menuItemId ? { ...t, threshold: Math.min(20.0, t.threshold + 0.5) } : t));
                        addToast(`Threshold for ${rule.itemName} increased to ${(rule.threshold + 0.5).toFixed(1)}kg`, 'info');
                      }}
                      className="w-7 h-7 bg-white dark:bg-[#222] border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#333] transition-colors"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Global Kitchen & RSVP Settings */}
        <div className="bg-white dark:bg-[#121212] rounded-2xl p-5 shadow-xs border border-gray-100 dark:border-gray-700 flex flex-col gap-4 mt-4">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
            <h3 className="text-sm font-extrabold text-[#0A170E] dark:text-white font-display flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              Global RSVP & Booking Settings
            </h3>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-1 rounded">
              Synced Real-Time
            </span>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-[#1a1a1a]/30 border border-gray-100 dark:border-gray-700 rounded-xl">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200 block">Enforce Today's Cutoff (Block Opt-In)</span>
              <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium text-left">
                When active, blocks students from opting in for the present day (Today). When inactive, today's meals remain open.
              </span>
            </div>
            <button
              onClick={async () => {
                triggerHaptic('medium');
                const nextExempted = !sharedConfig?.config?.cutoffExempted;
                const nextConfig = {
                  ...sharedConfig?.config,
                  cutoffExempted: nextExempted
                };
                const success = await updateSharedConfig(nextConfig, 'admin');
                if (success) {
                  addToast(nextExempted ? "Today's cutoff enforced! Opt-in for present day is blocked." : "Today's cutoff exempted! Present day opt-in is now open.", 'success');
                } else {
                  addToast("Failed to update RSVP cutoff setting.", 'error');
                }
              }}
              className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-300 focus:outline-none shrink-0 ${
                sharedConfig?.config?.cutoffExempted ? 'bg-[#16321F]' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                  sharedConfig?.config?.cutoffExempted ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

      {/* Modals and other stuff */}
      </div>

      {showModal === 'delivery' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
           <div className="bg-white dark:bg-[#121212] rounded-2xl w-full max-w-md p-6 shadow-2xl relative my-8">
             <button onClick={() => setShowModal(null)} className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-[#222] rounded-full hover:bg-gray-200 transition-colors">
               <X className="w-4 h-4" />
             </button>
             <h3 className="text-lg font-bold mb-1 flex items-center gap-2"><Truck className="w-5 h-5 text-blue-500"/> Receive Delivery</h3>
             <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-300 mb-4">Mark active orders as received or make a custom entry.</p>
             
             <div className="space-y-3 mb-6">
               <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-300">Active Orders</h4>
               {activeOrders.filter(o => o.status === 'Placed' || o.status === 'In Transit').length === 0 && (
                 <div className="flex flex-col items-center justify-center p-6 text-center bg-gray-50 dark:bg-[#1a1a1a] rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
     <ShoppingCart className="w-8 h-8 text-gray-300 dark:text-gray-700 mb-2" />
     <span className="text-xs font-bold text-gray-500 dark:text-gray-300">No pending orders</span>
   </div>
               )}
               {activeOrders.filter(o => o.status === 'Placed' || o.status === 'In Transit').map(order => (
                 <div key={order.id} className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl border border-blue-100 dark:border-blue-900/50 flex justify-between items-center">
                   <div>
                     <div className="font-bold text-sm">{order.id}: {order.supplierName}</div>
                     <div className="mt-2">
                       <div className="flex justify-between items-center mb-1">
                         <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                           {order.eta.toLowerCase().includes('today') ? 'Arriving Today' : 
                            order.eta.toLowerCase().includes('tomorrow') ? 'Arriving Tomorrow' : 
                            order.eta}
                         </span>
                         <span className="text-[10px] font-bold text-gray-900 dark:text-white">
                           {order.eta.toLowerCase().includes('today') ? '80%' : 
                            order.eta.toLowerCase().includes('tomorrow') ? '40%' : '10%'}
                         </span>
                       </div>
                       <div className="w-full bg-blue-100 dark:bg-blue-900/50 h-1.5 rounded-full overflow-hidden">
                         <div 
                           className="bg-blue-500 h-full rounded-full transition-all duration-500"
                           style={{ width: order.eta.toLowerCase().includes('today') ? '80%' : order.eta.toLowerCase().includes('tomorrow') ? '40%' : '10%' }}
                         ></div>
                       </div>
                     </div>
                   </div>
                   <button className="bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-600 transition-colors" onClick={() => {
                     triggerHaptic('success');
                     if (onReceiveOrder) onReceiveOrder(order.id);
                     if (onAddActivityLog) {
                       onAddActivityLog({
                         id: Date.now().toString(),
                         action: 'Order Received: ' + order.id,
                         user: 'Staff',
                         time: 'Just now',
                         icon: 'Truck'
                       });
                     }
                     addToast('Marked as received!', 'success');
                     setShowModal(null);
                   }}>Receive</button>
                 </div>
               ))}
             </div>

             <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-300 mb-3 mt-4">Custom Delivery Entry</h4>
             <form onSubmit={(e) => {
               e.preventDefault();
               if (onAddActivityLog) {
                 onAddActivityLog({
                   id: Date.now().toString(),
                   action: 'Custom Delivery Logged: ' + (selectedVendor || 'Unknown Vendor'),
                   user: 'Staff',
                   time: 'Just now',
                   icon: 'Truck'
                 });
               }
               addToast('Custom delivery saved!', 'success');
               setShowModal(null);
               setSelectedVendor('');
               setInvoiceNo('');
               setAmountInput('');
             }} className="bg-gray-50 dark:bg-[#1a1a1a] p-4 rounded-xl border border-gray-100 dark:border-gray-700 space-y-3">
               <div>
                 <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 dark:text-gray-300 mb-1">Supplier Name</label>
                 <input type="text" value={selectedVendor} onChange={(e) => setSelectedVendor(e.target.value)} required placeholder="Enter supplier name" className="w-full bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
               </div>
               <div className="grid grid-cols-2 gap-3">
                 <div>
                   <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 dark:text-gray-300 mb-1">Invoice Number</label>
                   <input type="text" value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} required placeholder="e.g. INV-1234" className="w-full bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 dark:text-gray-300 mb-1">Total Amount ($)</label>
                   <input type="number" step="0.01" value={amountInput} onChange={(e) => setAmountInput(e.target.value)} required placeholder="0.00" className="w-full bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                 </div>
               </div>
               <div>
                 <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 dark:text-gray-300 mb-1">Scan Invoice (Auto-fill via OCR)</label>
                 <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer bg-white dark:bg-[#121212] hover:bg-gray-50 dark:hover:bg-[#1a1a1a]">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Camera className="w-5 h-5 text-gray-400 dark:text-gray-300 mb-1" />
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 dark:text-gray-300">Tap to scan invoice</p>
                        </div>
                        <input type="file" onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          try {
                             triggerHaptic('medium');
                             const formData = new FormData();
                             formData.append("image", file);
                             const res = await fetch("/api/ocr/invoice", { method: "POST", body: formData });
                             const data = await res.json();
                             if (data.invoiceNumber) setInvoiceNo(data.invoiceNumber);
                             if (data.totalAmount) setAmountInput(data.totalAmount.toString());
                             if (data.vendorName) setSelectedVendor(data.vendorName);
                             if (res.ok) {
                               addToast('Invoice parsed successfully.', 'success');
                             } else {
                               addToast('Failed to parse invoice', 'error');
                             }
                          } catch (err) {
                             console.error(err);
                             addToast('Network error while parsing invoice', 'error');
                          }
                        }} className="hidden" accept="image/*" />
                    </label>
                 </div>
               </div>
               <button type="submit" className="w-full bg-[#16321F] dark:bg-emerald-800 text-white py-2 rounded-lg font-bold text-sm mt-2">Save Custom Entry</button>
             </form>
           </div>
        </div>
      )}

      {showModal === 'leftovers' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
           <div className="bg-white dark:bg-[#121212] rounded-2xl w-full max-w-md p-6 shadow-2xl relative my-8">
             <button onClick={() => setShowModal(null)} className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-[#222] rounded-full hover:bg-gray-200 transition-colors">
               <X className="w-4 h-4" />
             </button>
             <h3 className="text-lg font-bold mb-1 flex items-center gap-2"><Trash2 className="w-5 h-5 text-rose-500"/> Dynamic Waste Logger</h3>
             <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-300 mb-4">Log leftover food from the previous shift to update inventory and insights.</p>
             
             <form onSubmit={async (e) => {
               e.preventDefault();
               const formData = new FormData(e.target as HTMLFormElement);
               const wType = formData.get('wasteType') as string;
               const weight = Number(formData.get('weight'));
               
               const itemName = formData.get('item') as string;
               const kitchenQty = wType === 'Preparation Waste' || wType === 'Spoilage' ? weight : 0;
               const plateQty = wType === 'Plate Waste' ? weight : 0;
               
               if (onLogWaste) {
                 onLogWaste(itemName, kitchenQty, plateQty);
               } else {
                 const newLog = {
                   id: Date.now().toString(),
                   date: selectedDate ? selectedDate.toLocaleDateString('en-CA') : new Date().toLocaleDateString('en-CA'),
                   day: selectedDay || 'Thursday',
                   itemName,
                   category: formData.get('category') as string,
                   kitchenQty,
                   plateQty,
                   unit: 'kg'
                 };
                 setWasteLogs(prev => [...prev, newLog]);
               }
               
               addToast(`Logged ${weight}kg of ${wType} for ${itemName}`, 'success');
               
               triggerHaptic('success');
               setShowModal(null);
               setShowWasteInsight(true);
             }} className="space-y-3">
               <div>
                 <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 dark:text-gray-300 mb-1">Shift</label>
                 <select name="shift" className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500">
                   <option value="Breakfast">Breakfast</option>
                   <option value="Lunch">Lunch</option>
                   <option value="Dinner">Dinner</option>
                 </select>
               </div>
               <div>
                 <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 dark:text-gray-300 mb-1">Waste Type</label>
                 <select name="wasteType" className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500">
                   <option value="Plate Waste">Plate Waste</option>
                   <option value="Preparation Waste">Preparation Waste</option>
                   <option value="Spoilage">Spoilage</option>
                 </select>
               </div>
               <div className="grid grid-cols-2 gap-3">
                 <div>
                   <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 dark:text-gray-300 mb-1">Category</label>
                   <select required name="category" className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500">
                     <option value="main">Main Course</option>
                     <option value="side">Side Dish</option>
                     <option value="dessert">Dessert</option>
                     <option value="beverage">Beverage</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 dark:text-gray-300 mb-1">Item</label>
                   <select required name="item" className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500">
                     <option value="">Select Item</option>
                     {menuItems.filter(m => m.dayOfWeek === (selectedDay || 'Thursday')).map(m => (
                       <option key={m.id} value={m.name}>{m.name}</option>
                     ))}
                   </select>
                 </div>
               </div>
               <div>
                 <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 dark:text-gray-300 mb-1">Estimated Weight (kg)</label>
                 <input required type="number" step="0.1" name="weight" placeholder="0.0" className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
               </div>
               <button type="submit" className="w-full bg-rose-500 text-white py-2 rounded-xl font-bold text-sm hover:bg-rose-600 transition-colors mt-2">Log Waste</button>
             </form>
           </div>
        </div>
      )}

      {showModal === 'issue' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
           <div className="bg-white dark:bg-[#121212] rounded-2xl w-full max-w-md p-6 shadow-2xl relative my-8">
             <button onClick={() => setShowModal(null)} className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-[#222] rounded-full hover:bg-gray-200 transition-colors">
               <X className="w-4 h-4" />
             </button>
             <h3 className="text-lg font-bold mb-1 flex items-center gap-2"><AlertCircle className="w-5 h-5 text-amber-500"/> Report Issue</h3>
             <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-300 mb-4">Log an equipment failure, hygiene issue, or supply problem.</p>
             
             <form onSubmit={(e) => {
               e.preventDefault();
               const formData = new FormData(e.target as HTMLFormElement);
               const data = Object.fromEntries(formData);
               data.itemName = data.type + ' Issue'; // simple placeholder since no itemName in this form
               reportIssueMutation.mutate(data);
             }} className="space-y-3">
               <div>
                 <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 dark:text-gray-300 mb-1">Issue Type</label>
                 <select name="type" className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500">
                   <option value="Equipment">Equipment Failure</option>
                   <option value="Hygiene">Hygiene / Cleanliness</option>
                   <option value="Supply">Supply Discrepancy</option>
                   <option value="Other">Other</option>
                 </select>
               </div>
               <div>
                 <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 dark:text-gray-300 mb-1">Description</label>
                 <textarea required name="description" rows={3} placeholder="Describe the issue in detail..." className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"></textarea>
               </div>
               <div>
                 <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 dark:text-gray-300 mb-1">Photo Evidence (Optional)</label>
                 <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl cursor-pointer bg-gray-50 dark:bg-[#1a1a1a] hover:bg-gray-100 dark:hover:bg-[#222]">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Camera className="w-6 h-6 text-gray-400 dark:text-gray-300 mb-2" />
                            <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-300">Tap to upload a photo</p>
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                             const reader = new FileReader();
                             reader.onload = (e) => {
                               // in a real app, store this in hidden input or state
                             };
                             reader.readAsDataURL(file);
                          }
                        }} />
                    </label>
                 </div>
               </div>
               <button type="submit" className="w-full bg-amber-500 text-white py-2 rounded-xl font-bold text-sm hover:bg-amber-600 transition-colors mt-2">Submit Issue</button>
             </form>
           </div>
        </div>
      )}

      {showModal === 'diners' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto animate-fade-in">
           <div className="bg-white dark:bg-[#121212] rounded-2xl w-full max-w-lg p-6 shadow-2xl relative my-8 border border-gray-100 dark:border-gray-800">
             <button onClick={() => setShowModal(null)} className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-[#222] rounded-full hover:bg-gray-200 transition-colors">
               <X className="w-4 h-4" />
             </button>
             <h3 className="text-xl font-bold mb-1 flex items-center gap-2"><Utensils className="w-5 h-5 text-emerald-600"/> Expected Diners & Portions</h3>
             <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">Breakdown for all shifts on <strong>{day} ({getFormattedDate()})</strong></p>
             
             <div className="space-y-4">
               {mealsBreakdown.map((meal) => {
                 const isActive = meal.mealType === activeShiftMeal;
                 return (
                   <div key={meal.id} className={`p-4 rounded-xl border transition-all ${
                     isActive 
                       ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50 ring-1 ring-emerald-500/20' 
                       : 'bg-gray-50 dark:bg-[#1a1a1a] border-gray-100 dark:border-gray-800'
                   }`}>
                     <div className="flex justify-between items-start mb-2">
                       <div>
                         <span className={`text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full font-bold ${
                           meal.mealType === 'breakfast' 
                             ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400' 
                             : meal.mealType === 'lunch'
                               ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400'
                               : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-400'
                         }`}>
                           {meal.mealType}
                         </span>
                         {isActive && (
                           <span className="ml-2 text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                             Active Shift
                           </span>
                         )}
                       </div>
                       {meal.userRSVP && (
                         <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-900/40 px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                           <CheckCircle2 className="w-3 h-3" /> Yours Active
                         </span>
                       )}
                     </div>

                     <h4 className="font-bold text-base text-gray-900 dark:text-white mb-2">{meal.name}</h4>

                     <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-gray-200/50 dark:border-gray-800/50">
                       <div>
                         <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-400 uppercase tracking-wider block mb-0.5">Opted In / RSVP'd</span>
                         <span className="text-lg font-extrabold text-gray-900 dark:text-white font-mono">{meal.optIns}</span>
                         <span className="text-xs text-gray-500 block">students</span>
                       </div>
                       <div>
                         <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-400 uppercase tracking-wider block mb-0.5">Portions Prepared</span>
                         <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                           {meal.prepped > 0 ? meal.prepped : '—'}
                         </span>
                         <span className="text-xs text-gray-500 block">
                           {meal.prepped > 0 ? 'portions cooked' : 'Pending prep'}
                         </span>
                       </div>
                     </div>

                     {meal.prepped > 0 && (
                       <div className="mt-3">
                         <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-400 mb-1">
                           <span>Preparation Match</span>
                           <span className="font-bold">{Math.round((meal.prepped / meal.optIns) * 100)}%</span>
                         </div>
                         <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden">
                           <div 
                             className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                             style={{ width: `${Math.min(100, (meal.prepped / meal.optIns) * 100)}%` }}
                           />
                         </div>
                       </div>
                     )}
                   </div>
                 );
               })}
             </div>

             <button onClick={() => setShowModal(null)} className="w-full bg-gray-900 dark:bg-gray-800 text-white py-2.5 rounded-xl font-bold text-sm mt-6 hover:bg-gray-800 transition-colors">
               Close Breakdown
             </button>
           </div>
        </div>
      )}

      {showWasteInsight && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
           <div className="bg-white dark:bg-[#121212] rounded-2xl w-full max-w-md p-6 shadow-2xl relative my-8">
             <h3 className="text-xl font-bold mb-4 text-amber-600">Waste AI Insight</h3>
             <p className="text-sm mb-4">Machine Learning Insight: Based on recent logs, {topWastedItem} has shown unusually high plate waste.</p>
             <button onClick={() => setShowWasteInsight(false)} className="w-full bg-[#16321F] text-white py-2 rounded-lg mb-2">Apply 20% Reduction to Next Order</button>
             <button onClick={() => setShowWasteInsight(false)} className="w-full bg-gray-200 text-gray-900 py-2 rounded-lg">Dismiss</button>
           </div>
        </div>
      )}
    </div>
  );
}
