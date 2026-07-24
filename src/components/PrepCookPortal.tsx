import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Utensils, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRightLeft, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  User, 
  LogOut, 
  Moon, 
  Sun, 
  ClipboardList, 
  Flame, 
  Scale, 
  Check, 
  X,
  RefreshCw,
  Info,
  Search,
  Plus,
  Minus,
  Filter
} from 'lucide-react';
import { RoleHeader } from './RoleHeader';
import { AlertBanner } from './AlertBanner';
import { Pressable } from './Pressable';

import { UserAccount } from '../types';

interface PrepCookPortalProps {
  currentUser: UserAccount;
  onLogout: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

interface RawMaterial {
  ingredientId: string;
  name: string;
  qtyNeeded: number;
  currentStock: number;
  unit: string;
}

interface DishItem {
  id: string;
  originalId?: string;
  isSubstituted?: boolean;
  swapReason?: string;
  name: string;
  category: string;
  description: string;
  calories: number;
  isLogged: boolean;
  logEntry?: {
    id?: number;
    rawMaterialsUsed?: { ingredientId: string; quantity: number }[];
    cookedOutputQuantity?: number;
    wasteReason?: string;
    wasteQuantity?: number;
    loggedAt?: string;
  };
  requiredIngredients: RawMaterial[];
}

interface AvailabilityWarning {
  ingredientId: string;
  ingredientName: string;
  requiredQty: number;
  currentStock: number;
  unit: string;
  affectedDishes: string[];
  message: string;
}

export const PrepCookPortal: React.FC<PrepCookPortalProps> = ({
  currentUser,
  onLogout,
  darkMode,
  onToggleDarkMode,
  addToast
}) => {
  const [activeTab, setActiveTab] = useState<'today' | 'profile'>('today');
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  
  // Today's checklist state
  const [todayData, setTodayData] = useState<{
    date: string;
    mealType: string;
    totalItems: number;
    loggedCount: number;
    pendingCount: number;
    items: DishItem[];
  }>({
    date: new Date().toISOString().split('T')[0],
    mealType: 'lunch',
    totalItems: 0,
    loggedCount: 0,
    pendingCount: 0,
    items: []
  });

  // Pre-shift availability warnings
  const [warnings, setWarnings] = useState<AvailabilityWarning[]>([]);
  const [showWarningBanner, setShowWarningBanner] = useState<boolean>(true);

  // Expanded dish card state for logging
  const [expandedDishId, setExpandedDishId] = useState<string | null>(null);

  // Form input state for expanded logging
  const [rawInputs, setRawInputs] = useState<Record<string, number>>({});
  const [cookedOutputInput, setCookedOutputInput] = useState<string>('');
  const [isSubmittingLog, setIsSubmittingLog] = useState<boolean>(false);

  // Issue flag toggle & inputs
  const [issueModalOpen, setIssueModalOpen] = useState<boolean>(false);
  const [issueTargetDish, setIssueTargetDish] = useState<DishItem | null>(null);
  const [wasteReasonInput, setWasteReasonInput] = useState<string>('Burnt');
  const [wasteQtyInput, setWasteQtyInput] = useState<string>('');

  // Menu Substitution Modal
  const [swapModalOpen, setSwapModalOpen] = useState<boolean>(false);
  const [swapTargetDish, setSwapTargetDish] = useState<DishItem | null>(null);
  const [allAvailableDishes, setAllAvailableDishes] = useState<{ id: string; name: string; category: string }[]>([]);
  const [selectedSwapDishId, setSelectedSwapDishId] = useState<string>('');
  const [swapReasonInput, setSwapReasonInput] = useState<string>('Stock shortage / Ingredient unavailable');
  const [isSubmittingSwap, setIsSubmittingSwap] = useState<boolean>(false);

  // Filter state for checklist
  const [filterMode, setFilterMode] = useState<'all' | 'pending' | 'logged'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Profile activity state
  const [userActivity, setUserActivity] = useState<{
    stats: { dishesLoggedThisWeek: number; issuesFlaggedThisWeek: number };
    logs: any[];
  }>({
    stats: { dishesLoggedThisWeek: 0, issuesFlaggedThisWeek: 0 },
    logs: []
  });

  // Auto-fill expected cooked output with 1 tap
  const handleAutoFillExpected = (dish: DishItem) => {
    triggerHaptic('light');
    const expected = calculateExpectedOutput(dish);
    setCookedOutputInput(expected);
    addToast(`Auto-filled expected yield: ${expected} kg`, 'info');
  };

  // Quick adjust output quantity by increment
  const handleAdjustQuantity = (delta: number) => {
    triggerHaptic('light');
    const current = parseFloat(cookedOutputInput) || 0;
    const updated = Math.max(0, current + delta);
    setCookedOutputInput(updated > 0 ? updated.toFixed(1) : '');
  };

  // Haptic feedback helper
  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      if (type === 'light') window.navigator.vibrate(12);
      else if (type === 'medium') window.navigator.vibrate(25);
      else if (type === 'heavy') window.navigator.vibrate([30, 20, 30]);
    }
  };

  // Fetch today's checklist data
  const fetchTodayData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/prepcook/today?mealType=lunch');
      if (res.ok) {
        const data = await res.json();
        setTodayData(data);
      }

      // Fetch availability warnings
      const warnRes = await fetch('/api/prepcook/availability-check?mealType=lunch');
      if (warnRes.ok) {
        const warnData = await warnRes.json();
        setWarnings(warnData.warnings || []);
      }

      // Fetch all menu items for swap choices
      const menuRes = await fetch('/api/menu');
      if (menuRes.ok) {
        const menuList = await menuRes.json();
        setAllAvailableDishes(menuList);
      }
    } catch (err) {
      console.error('Failed to fetch prepcook data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch user activity stats for profile tab
  const fetchUserActivity = async () => {
    try {
      const res = await fetch(`/api/prepcook/activity/${encodeURIComponent(currentUser.email)}`);
      if (res.ok) {
        const data = await res.json();
        setUserActivity(data);
      }
    } catch (err) {
      console.error('Failed to fetch user activity:', err);
    }
  };

  useEffect(() => {
    fetchTodayData();
  }, []);

  useEffect(() => {
    if (activeTab === 'profile') {
      fetchUserActivity();
    }
  }, [activeTab]);

  const handleRefresh = async () => {
    triggerHaptic('light');
    setRefreshing(true);
    await fetchTodayData();
    if (activeTab === 'profile') {
      await fetchUserActivity();
    }
    addToast('Prep & cook status updated', 'info');
  };

  // Open logging panel for a dish
  const handleOpenDishLog = (dish: DishItem) => {
    triggerHaptic('light');
    if (expandedDishId === dish.id) {
      setExpandedDishId(null);
      return;
    }

    setExpandedDishId(dish.id);

    // Pre-fill raw inputs with required quantities
    const initialRaw: Record<string, number> = {};
    dish.requiredIngredients.forEach(ing => {
      if (dish.logEntry && dish.logEntry.rawMaterialsUsed) {
        const logged = dish.logEntry.rawMaterialsUsed.find(r => String(r.ingredientId) === String(ing.ingredientId));
        initialRaw[ing.ingredientId] = logged ? Number(logged.quantity) : ing.qtyNeeded;
      } else {
        initialRaw[ing.ingredientId] = ing.qtyNeeded;
      }
    });
    setRawInputs(initialRaw);

    setCookedOutputInput(dish.logEntry?.cookedOutputQuantity ? String(dish.logEntry.cookedOutputQuantity) : '');
  };

  // Open issue flagging modal
  const handleOpenIssueModal = (dish: DishItem) => {
    triggerHaptic('light');
    setIssueTargetDish(dish);
    setWasteReasonInput(dish.logEntry?.wasteReason || 'Burnt');
    setWasteQtyInput(dish.logEntry?.wasteQuantity ? String(dish.logEntry.wasteQuantity) : '');
    setIssueModalOpen(true);
  };

  // Live expected output calculation
  const calculateExpectedOutput = (dish: DishItem) => {
    let totalRaw = 0;
    Object.values(rawInputs).forEach(val => {
      totalRaw += Number(val) || 0;
    });
    // Standard yield factor (2.5x raw)
    return (totalRaw * 2.5).toFixed(1);
  };

  // Submit cooking output log
  const handleSubmitLog = async (dish: DishItem) => {
    if (!cookedOutputInput || isNaN(Number(cookedOutputInput)) || Number(cookedOutputInput) <= 0) {
      addToast('Please enter a valid cooked output quantity', 'error');
      return;
    }

    try {
      setIsSubmittingLog(true);
      triggerHaptic('medium');

      const rawMaterialsUsed = Object.entries(rawInputs).map(([ingredientId, quantity]) => ({
        ingredientId,
        quantity: Number(quantity) || 0
      }));

      const res = await fetch('/api/prepcook/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: todayData.date,
          mealType: todayData.mealType,
          menuItemId: dish.id,
          rawMaterialsUsed,
          cookedOutputQuantity: Number(cookedOutputInput),
          loggedBy: currentUser.email
        })
      });

      if (res.ok) {
        addToast(`Successfully logged ${cookedOutputInput} kg for ${dish.name}!`, 'success');
        setExpandedDishId(null);
        await fetchTodayData();
      } else {
        const err = await res.json().catch(() => ({}));
        addToast(err.error || 'Failed to submit prep log', 'error');
      }
    } catch (err) {
      console.error(err);
      addToast('Error submitting log', 'error');
    } finally {
      setIsSubmittingLog(false);
    }
  };

  // Submit issue flag (does NOT touch inventory stock)
  const handleSubmitIssueFlag = async () => {
    if (!issueTargetDish) return;
    if (!wasteQtyInput || isNaN(Number(wasteQtyInput)) || Number(wasteQtyInput) <= 0) {
      addToast('Please enter a valid waste quantity for the issue flag', 'error');
      return;
    }

    try {
      setIsSubmittingLog(true);
      triggerHaptic('heavy');

      const res = await fetch('/api/prepcook/log-issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: todayData.date,
          mealType: todayData.mealType,
          menuItemId: issueTargetDish.id,
          wasteReason: wasteReasonInput,
          wasteQuantity: Number(wasteQtyInput),
          loggedBy: currentUser.email
        })
      });

      if (res.ok) {
        addToast(`Flagged issue for ${issueTargetDish.name} (${wasteReasonInput}: ${wasteQtyInput} kg)`, 'info');
        setIssueModalOpen(false);
        setIssueTargetDish(null);
        await fetchTodayData();
      } else {
        const err = await res.json().catch(() => ({}));
        addToast(err.error || 'Failed to flag issue', 'error');
      }
    } catch (err) {
      console.error(err);
      addToast('Error flagging issue', 'error');
    } finally {
      setIsSubmittingLog(false);
    }
  };

  // Open menu swap modal
  const handleOpenSwapModal = (dish: DishItem) => {
    triggerHaptic('light');
    setSwapTargetDish(dish);
    setSelectedSwapDishId('');
    setSwapReasonInput('Stock shortage / Ingredient unavailable');
    setSwapModalOpen(true);
  };

  // Submit menu substitution (saves immediately without manager approval)
  const handleSubmitSwap = async () => {
    if (!selectedSwapDishId) {
      addToast('Please select a replacement dish', 'error');
      return;
    }

    try {
      setIsSubmittingSwap(true);
      triggerHaptic('medium');

      const res = await fetch('/api/prepcook/substitute-menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: todayData.date,
          mealType: todayData.mealType,
          originalMenuItemId: swapTargetDish?.id,
          actualMenuItemId: selectedSwapDishId,
          reason: swapReasonInput,
          changedBy: currentUser.email
        })
      });

      if (res.ok) {
        addToast('Menu dish swapped successfully!', 'success');
        setSwapModalOpen(false);
        await fetchTodayData();
      } else {
        const err = await res.json().catch(() => ({}));
        addToast(err.error || 'Failed to swap dish', 'error');
      }
    } catch (err) {
      console.error(err);
      addToast('Error swapping menu item', 'error');
    } finally {
      setIsSubmittingSwap(false);
    }
  };

  // Format date display (e.g. "Lunch — Tue, Jul 28")
  const formattedDateString = `${todayData.mealType.toUpperCase()} — ${new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}`;

  const filteredDishes = todayData.items.filter(dish => {
    const matchesSearch = searchQuery === '' || 
      dish.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      dish.category.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (filterMode === 'pending') return !dish.isLogged;
    if (filterMode === 'logged') return dish.isLogged;
    return true;
  });

  const initials = currentUser.name
    ? currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'PC';

  return (
    <div className="min-h-[100dvh] bg-[#F7F9F6] dark:bg-[#0A0A0A] text-gray-900 dark:text-gray-100 flex flex-col font-sans transition-colors duration-300">
      
      {/* Shared Unified Header */}
      <RoleHeader
        roleName="Prep & Cook Staff"
        roleIcon={<Utensils className="w-5 h-5 text-[#D9E96B] dark:text-[#16321F]" />}
        userName={currentUser.name}
        orgId={currentUser.orgId}
        avatarInitials={initials}
        onLogout={onLogout}
        darkMode={darkMode}
        onToggleDarkMode={onToggleDarkMode}
        onRefresh={handleRefresh}
      />

      {/* Main Content Area with Bottom Padding to avoid Fixed Tab Bar overlap */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-6 pt-4 pb-28">
        
        {/* TODAY TAB */}
        {activeTab === 'today' && (
          <div className="space-y-4">
            
            {/* Meal Session Sub-Header Banner */}
            <div className="bg-white/90 dark:bg-[#121212]/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-gray-200/60 dark:border-gray-800/60 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#16321F]/10 dark:bg-[#D9E96B]/20 text-[#16321F] dark:text-[#D9E96B] flex items-center justify-center shrink-0">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-black tracking-widest text-[#16321F] dark:text-[#D9E96B] uppercase block">
                    Active Prep Session
                  </span>
                  <h2 className="text-base sm:text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                    {formattedDateString}
                  </h2>
                </div>
              </div>

              {/* Progress Count & Bar */}
              <div className="w-full sm:w-60 space-y-1.5">
                <div className="flex justify-between items-center text-xs font-medium">
                  <span className="text-gray-500 dark:text-gray-400">Prep Progress</span>
                  <span className="font-bold text-[#16321F] dark:text-[#D9E96B]">
                    {todayData.loggedCount} of {todayData.totalItems} dishes logged
                  </span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${todayData.totalItems > 0 ? (todayData.loggedCount / todayData.totalItems) * 100 : 0}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="h-full bg-[#16321F] dark:bg-[#D9E96B] rounded-full"
                  />
                </div>
              </div>
            </div>

            {/* Pre-Shift Availability Warning Banner */}
            {showWarningBanner && warnings.length > 0 && (
              <AlertBanner
                type="warning"
                title="Pre-Shift Stock Availability Alert"
                message={warnings.map(w => w.message).join(' ')}
                actionLabel="Review Inventory"
                onAction={() => addToast('Reviewing inventory requirements...', 'info')}
                onClose={() => setShowWarningBanner(false)}
              />
            )}

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
              
              {/* Segmented Filter Pills */}
              <div className="flex items-center p-1 bg-gray-200/60 dark:bg-gray-800/60 rounded-xl shrink-0 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setFilterMode('all');
                  }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    filterMode === 'all'
                      ? 'bg-white dark:bg-[#1C1C1C] text-gray-900 dark:text-white shadow-2xs'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  All ({todayData.totalItems})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setFilterMode('pending');
                  }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    filterMode === 'pending'
                      ? 'bg-amber-500 text-white shadow-2xs'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Pending ({todayData.pendingCount})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('light');
                    setFilterMode('logged');
                  }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    filterMode === 'logged'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Logged ({todayData.loggedCount})
                </button>
              </div>

              {/* Search Field */}
              <div className="relative flex-1 max-w-xs">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search dishes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-1.5 text-xs bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16321F] dark:focus:ring-[#D9E96B]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

            </div>

            {/* Dish Cards List */}
            {loading ? (
              <div className="space-y-3 py-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-24 bg-gray-200/60 dark:bg-gray-800/60 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : filteredDishes.length === 0 ? (
              <div className="text-center py-12 bg-white/60 dark:bg-[#121212]/60 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-2">
                <Utensils className="w-10 h-10 text-gray-400 mx-auto opacity-50" />
                <p className="text-sm font-medium text-gray-500">
                  {searchQuery || filterMode !== 'all' 
                    ? 'No dishes match your filter criteria.'
                    : 'No dishes planned for this meal session.'}
                </p>
                {(searchQuery || filterMode !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setFilterMode('all');
                    }}
                    className="text-xs font-bold text-[#16321F] dark:text-[#D9E96B] hover:underline"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredDishes.map(dish => {
                  const isExpanded = expandedDishId === dish.id;

                  return (
                    <div
                      key={dish.id}
                      className={`bg-white dark:bg-[#121212] rounded-2xl border transition-all duration-200 overflow-hidden shadow-2xs ${
                        dish.isLogged
                          ? 'border-emerald-500/30 dark:border-emerald-500/20 bg-emerald-50/20 dark:bg-emerald-950/10'
                          : isExpanded
                          ? 'border-[#16321F] dark:border-[#D9E96B] ring-2 ring-[#16321F]/10 dark:ring-[#D9E96B]/20'
                          : 'border-gray-200/80 dark:border-gray-800/80 hover:border-gray-300 dark:hover:border-gray-700'
                      }`}
                    >
                      {/* Card Header Row */}
                      <div className="p-4 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                            dish.isLogged 
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          }`}>
                            {dish.isLogged ? <CheckCircle2 className="w-5 h-5" /> : <Flame className="w-5 h-5" />}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-base font-bold text-gray-900 dark:text-white truncate">
                                {dish.name}
                              </h4>
                              {dish.isSubstituted && (
                                <span className="bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 text-[10px] px-2 py-0.5 rounded-full font-bold">
                                  Substituted
                                </span>
                              )}
                              <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md">
                                {dish.category}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                              {dish.description || `${dish.calories} kcal per serving`}
                            </p>
                          </div>
                        </div>

                        {/* Status Badge & Action Controls */}
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          <Pressable
                            onClick={() => handleOpenIssueModal(dish)}
                            className="p-2 text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-500/10 rounded-xl transition-all"
                            title="Flag Issue or Waste"
                          >
                            <AlertTriangle className="w-4 h-4" />
                          </Pressable>

                          <Pressable
                            onClick={() => handleOpenSwapModal(dish)}
                            className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
                            title="Swap Dish"
                          >
                            <ArrowRightLeft className="w-4 h-4" />
                          </Pressable>

                          {dish.isLogged ? (
                            <div className="flex items-center gap-2">
                              <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 text-xs font-bold px-2.5 py-1 rounded-xl flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" />
                                {dish.logEntry?.cookedOutputQuantity || 0} kg
                              </span>
                              <Pressable
                                onClick={() => handleOpenDishLog(dish)}
                                className="px-3 py-1.5 text-xs font-bold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl transition-all"
                              >
                                {isExpanded ? 'Hide' : 'Edit Log'}
                              </Pressable>
                            </div>
                          ) : (
                            <Pressable
                              onClick={() => handleOpenDishLog(dish)}
                              className="px-3.5 py-1.5 text-xs font-bold bg-[#16321F] hover:bg-[#20472d] dark:bg-[#D9E96B] dark:hover:bg-[#e2f085] text-[#D9E96B] dark:text-[#16321F] rounded-xl transition-all shadow-2xs flex items-center gap-1"
                            >
                              Log Output
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </Pressable>
                          )}
                        </div>
                      </div>

                      {/* Expanded Log Section */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            className="border-t border-gray-200/60 dark:border-gray-800/60 bg-gray-50/50 dark:bg-[#161616]/50 p-4 sm:p-5 space-y-5"
                          >
                            
                            {/* Section A: Raw Material Consumption Inputs */}
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <h5 className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                                  <Scale className="w-3.5 h-3.5 text-[#16321F] dark:text-[#D9E96B]" />
                                  1. Raw Materials Used (Stock Deduction)
                                </h5>
                                <span className="text-[11px] text-gray-400">
                                  Auto-calculated from recipe
                                </span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {dish.requiredIngredients.map(ing => (
                                  <div
                                    key={ing.ingredientId}
                                    className="bg-white dark:bg-[#1C1C1C] p-3 rounded-xl border border-gray-200/80 dark:border-gray-800 flex items-center justify-between gap-3 shadow-2xs"
                                  >
                                    <div className="min-w-0 flex-1">
                                      <p className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">
                                        {ing.name}
                                      </p>
                                      <span className="text-[10px] text-gray-500 dark:text-gray-400">
                                        Stock: {ing.currentStock} {ing.unit}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                      <input
                                        type="number"
                                        step="0.1"
                                        value={rawInputs[ing.ingredientId] ?? ing.qtyNeeded}
                                        onChange={(e) => setRawInputs({
                                          ...rawInputs,
                                          [ing.ingredientId]: parseFloat(e.target.value) || 0
                                        })}
                                        className="w-20 px-2 py-1 text-xs font-bold bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-[#16321F] dark:focus:ring-[#D9E96B]"
                                      />
                                      <span className="text-xs font-semibold text-gray-500">
                                        {ing.unit}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Section B: Cooked Output Quantity Input with Quick Steppers & Auto-Fill */}
                            <div className="space-y-3 pt-2 border-t border-gray-200/60 dark:border-gray-800/60">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <h5 className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                                  2. Total Cooked Output Quantity
                                </h5>
                                
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg flex items-center gap-1 border border-amber-500/20">
                                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                    Expected: ~{calculateExpectedOutput(dish)} kg
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleAutoFillExpected(dish)}
                                    className="text-xs font-bold text-[#16321F] dark:text-[#D9E96B] hover:underline bg-[#16321F]/10 dark:bg-[#D9E96B]/20 px-2.5 py-1 rounded-lg transition-all"
                                  >
                                    Use Expected
                                  </button>
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-2">
                                {/* Quick Stepper Controls */}
                                <div className="flex items-center gap-1 bg-white dark:bg-[#1C1C1C] border border-gray-300 dark:border-gray-700 rounded-xl p-1">
                                  <button
                                    type="button"
                                    onClick={() => handleAdjustQuantity(-5)}
                                    className="px-2 py-1 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                    title="Decrease 5kg"
                                  >
                                    -5kg
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleAdjustQuantity(-1)}
                                    className="p-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                    title="Decrease 1kg"
                                  >
                                    <Minus className="w-3.5 h-3.5" />
                                  </button>
                                  
                                  <input
                                    type="number"
                                    step="0.5"
                                    placeholder="0.0"
                                    value={cookedOutputInput}
                                    onChange={(e) => setCookedOutputInput(e.target.value)}
                                    className="w-24 px-2 py-1 bg-transparent text-center text-sm font-extrabold focus:outline-none"
                                  />

                                  <button
                                    type="button"
                                    onClick={() => handleAdjustQuantity(1)}
                                    className="p-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                    title="Increase 1kg"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleAdjustQuantity(5)}
                                    className="px-2 py-1 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                    title="Increase 5kg"
                                  >
                                    +5kg
                                  </button>
                                </div>

                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                  KG Cooked
                                </span>
                              </div>
                            </div>

                            {/* Save Log Primary Action Button */}
                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-200/60 dark:border-gray-800/60">
                              <button
                                type="button"
                                onClick={() => setExpandedDishId(null)}
                                className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                              >
                                Cancel
                              </button>
                              <Pressable
                                onClick={() => handleSubmitLog(dish)}
                                disabled={isSubmittingLog}
                                className="px-5 py-2.5 text-xs font-bold bg-[#16321F] hover:bg-[#20472d] dark:bg-[#D9E96B] dark:hover:bg-[#e2f085] text-[#D9E96B] dark:text-[#16321F] rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                              >
                                {isSubmittingLog ? (
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Check className="w-3.5 h-3.5" />
                                )}
                                Confirm & Save Log
                              </Pressable>
                            </div>

                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="space-y-5">
            
            {/* User Profile Card */}
            <div className="bg-white dark:bg-[#121212] p-5 sm:p-6 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 shadow-xs flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#16321F] dark:bg-[#D9E96B] text-[#D9E96B] dark:text-[#16321F] font-black text-xl flex items-center justify-center shadow-sm">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                    {currentUser.name}
                  </h3>
                  <span className="bg-[#16321F]/10 dark:bg-[#D9E96B]/20 text-[#16321F] dark:text-[#D9E96B] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                    Prep & Cook Staff
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                  {currentUser.email} • Org ID: {currentUser.orgId}
                </p>
              </div>
            </div>

            {/* Weekly Activity Stats */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-white dark:bg-[#121212] p-4 sm:p-5 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 shadow-xs">
                <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Dishes Logged</span>
                  <Utensils className="w-4 h-4" />
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                  {userActivity.stats.dishesLoggedThisWeek}
                </p>
                <span className="text-[11px] text-gray-500 font-medium">Logged this week</span>
              </div>

              <div className="bg-white dark:bg-[#121212] p-4 sm:p-5 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 shadow-xs">
                <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Issues Flagged</span>
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                  {userActivity.stats.issuesFlaggedThisWeek}
                </p>
                <span className="text-[11px] text-gray-500 font-medium">Flagged this week</span>
              </div>
            </div>

            {/* Activity History Logs */}
            <div className="bg-white dark:bg-[#121212] rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-4 sm:p-5 shadow-xs space-y-3">
              <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#16321F] dark:text-[#D9E96B]" />
                Recent Cooking Activity History
              </h4>

              {userActivity.logs.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-xs">
                  No cooking activity recorded yet.
                </div>
              ) : (
                <div className="space-y-2.5 max-h-80 overflow-y-auto scrollbar-hide">
                  {userActivity.logs.map(log => (
                    <div
                      key={log.id}
                      className="p-3 bg-gray-50 dark:bg-[#181818] rounded-xl border border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">
                          {log.dishName}
                        </p>
                        <span className="text-[11px] text-gray-500">
                          {log.date} • {log.mealType}
                        </span>
                      </div>
                      <div className="text-right">
                        {log.cookedOutputQuantity > 0 && (
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 block">
                            +{log.cookedOutputQuantity} kg
                          </span>
                        )}
                        {log.wasteReason && (
                          <span className="text-[10px] bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 font-bold px-1.5 py-0.5 rounded">
                            {log.wasteReason}: {log.wasteQuantity} kg
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Account Preferences / Sign Out */}
            <div className="bg-white dark:bg-[#121212] rounded-2xl border border-gray-200/80 dark:border-gray-800/80 p-4 space-y-2">
              <button
                onClick={onToggleDarkMode}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-xs font-bold transition-colors"
              >
                <div className="flex items-center gap-2">
                  {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-gray-600" />}
                  <span>Appearance Theme</span>
                </div>
                <span className="text-gray-400 font-normal">
                  {darkMode ? 'Dark Mode' : 'Light Mode'}
                </span>
              </button>

              <button
                onClick={onLogout}
                className="w-full flex items-center justify-between p-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-bold transition-colors"
              >
                <div className="flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </div>
              </button>
            </div>

          </div>
        )}

      </main>

      {/* FIXED BOTTOM-PINNED TAB BAR */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-[#0A0A0A]/90 backdrop-blur-xl border-t border-gray-200/60 dark:border-gray-800/60 py-2 px-6">
        <div className="max-w-md mx-auto flex items-center justify-around">
          
          <button
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('today');
            }}
            className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all ${
              activeTab === 'today'
                ? 'text-[#16321F] dark:text-[#D9E96B] font-bold scale-105'
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            <Utensils className="w-5 h-5" />
            <span className="text-[11px]">Today</span>
          </button>

          <button
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('profile');
            }}
            className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all ${
              activeTab === 'profile'
                ? 'text-[#16321F] dark:text-[#D9E96B] font-bold scale-105'
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[11px]">Profile</span>
          </button>

        </div>
      </nav>

      {/* MENU SUBSTITUTION / SWAP DISH MODAL */}
      <AnimatePresence>
        {swapModalOpen && swapTargetDish && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                  <ArrowRightLeft className="w-5 h-5" />
                  <h3 className="font-bold text-base text-gray-900 dark:text-white">
                    Substitute Menu Dish
                  </h3>
                </div>
                <button
                  onClick={() => setSwapModalOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-xs space-y-1">
                <span className="text-gray-500">Replacing Dish:</span>
                <p className="font-bold text-sm text-gray-900 dark:text-white">
                  {swapTargetDish.name} ({swapTargetDish.category})
                </p>
              </div>

              {/* Selection for Replacement Dish */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  Select Replacement Dish
                </label>
                <select
                  value={selectedSwapDishId}
                  onChange={(e) => setSelectedSwapDishId(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#1C1C1C] border border-gray-300 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#16321F] dark:focus:ring-[#D9E96B]"
                >
                  <option value="">-- Choose Replacement Item --</option>
                  {allAvailableDishes
                    .filter(d => String(d.id) !== String(swapTargetDish.id))
                    .map(d => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.category})
                      </option>
                    ))}
                </select>
              </div>

              {/* Reason for substitution */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  Reason for Substitution
                </label>
                <input
                  type="text"
                  value={swapReasonInput}
                  onChange={(e) => setSwapReasonInput(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#1C1C1C] border border-gray-300 dark:border-gray-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#16321F] dark:focus:ring-[#D9E96B]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSwapModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
                <Pressable
                  onClick={handleSubmitSwap}
                  disabled={isSubmittingSwap}
                  className="px-4 py-2 text-xs font-bold bg-[#16321F] hover:bg-[#20472d] dark:bg-[#D9E96B] dark:hover:bg-[#e2f085] text-[#D9E96B] dark:text-[#16321F] rounded-xl transition-all"
                >
                  Confirm Substitution
                </Pressable>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FLAG ISSUE / WASTE MODAL */}
      <AnimatePresence>
        {issueModalOpen && issueTargetDish && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="w-5 h-5" />
                  <h3 className="font-bold text-base text-gray-900 dark:text-white">
                    Flag Cooking Issue / Waste
                  </h3>
                </div>
                <button
                  onClick={() => setIssueModalOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-xs space-y-1">
                <span className="text-gray-500">Dish Item:</span>
                <p className="font-bold text-sm text-gray-900 dark:text-white">
                  {issueTargetDish.name} ({issueTargetDish.category})
                </p>
              </div>

              {/* Selection Pills for Reason */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  Select Issue / Waste Reason
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Burnt', 'Bad Taste', 'Wrong Quantity', 'Equipment Defect', 'Spill / Dropped', 'Other'].map(reason => (
                    <button
                      key={reason}
                      type="button"
                      onClick={() => setWasteReasonInput(reason)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border text-center ${
                        wasteReasonInput === reason
                          ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                          : 'bg-gray-50 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Input Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  Wasted / Affected Quantity (KG)
                </label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="e.g. 2.5"
                  value={wasteQtyInput}
                  onChange={(e) => setWasteQtyInput(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#1C1C1C] border border-gray-300 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIssueModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
                <Pressable
                  onClick={handleSubmitIssueFlag}
                  disabled={isSubmittingLog}
                  className="px-4 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                >
                  {isSubmittingLog ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5" />
                  )}
                  Submit Issue Flag
                </Pressable>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
