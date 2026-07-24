import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import FocusTrap from 'focus-trap-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import {
  Boxes,
  PackageSearch,
  TrendingUp,
  Plus,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Search,
  Filter,
  User,
  LogOut,
  Moon,
  Sun,
  Clock,
  Building2,
  X,
  SlidersHorizontal,
  ArrowDownUp,
  ShieldAlert,
  Calendar,
  Check,
  FileText
} from 'lucide-react';
import { Pressable } from './Pressable';
import { RoleHeader } from './RoleHeader';
import { triggerHaptic } from '../lib/haptics';
import { InventoryItem, InventoryAdjustment, RestockFlag, InventoryStaffTab, UserAccount } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler
);

interface ItemUsageChartProps {
  ingredientId: string | number;
}

const ItemUsageChart: React.FC<ItemUsageChartProps> = ({ ingredientId }) => {
  const [history, setHistory] = useState<{ date: string; dayLabel: string; usage: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    if (!ingredientId) return;

    const fetchUsage = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/inventory/usage-history/${ingredientId}`);
        if (res.ok) {
          const data = await res.json();
          if (active && data.history) {
            setHistory(data.history);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchUsage();
    return () => { active = false; };
  }, [ingredientId]);

  if (loading) {
    return (
      <div className="h-16 w-full flex items-center justify-center bg-gray-50/50 dark:bg-gray-800/20 rounded-xl my-2">
        <span className="text-[10px] text-gray-400 font-medium animate-pulse">Loading 7-day usage chart...</span>
      </div>
    );
  }

  const chartData = {
    labels: history.map(h => h.dayLabel),
    datasets: [
      {
        data: history.map(h => h.usage),
        borderColor: '#16321F',
        backgroundColor: 'rgba(22, 50, 31, 0.08)',
        fill: true,
        tension: 0.35,
        pointRadius: 2,
        pointBackgroundColor: '#16321F',
        borderWidth: 2
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => `Usage: ${context.parsed.y}`
        }
      }
    },
    scales: {
      x: {
        display: true,
        grid: { display: false },
        ticks: { font: { size: 9 }, color: '#888' }
      },
      y: {
        display: false,
        grid: { display: false },
        beginAtZero: true
      }
    }
  };

  const totalUsage = history.reduce((a, b) => a + Number(b.usage), 0);

  return (
    <div className="my-2.5 p-2 bg-gray-50/80 dark:bg-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-1 px-1">
        <span>7-Day Consumption Trend (Chart.js)</span>
        <span className="font-mono text-gray-700 dark:text-gray-300">
          7d Total: {totalUsage.toFixed(1)}
        </span>
      </div>
      <div className="h-20 w-full relative">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

interface InventoryStaffPortalProps {
  currentUser: UserAccount | null;
  onLogout: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  addToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const InventoryStaffPortal: React.FC<InventoryStaffPortalProps> = ({
  currentUser,
  onLogout,
  darkMode,
  onToggleDarkMode,
  addToast
}) => {
  const [activeTab, setActiveTab] = useState<InventoryStaffTab>('dashboard');
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [adjustments, setAdjustments] = useState<InventoryAdjustment[]>([]);
  const [restockFlags, setRestockFlags] = useState<RestockFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'low_stock' | 'expiring'>('all');
  const [filtersExpanded, setFiltersExpanded] = useState<boolean>(false);

  // Modal states
  const [activeModal, setActiveModal] = useState<'stock_in' | 'correct' | 'flag' | null>(null);
  const [selectedItemForModal, setSelectedItemForModal] = useState<InventoryItem | null>(null);

  // Form states for modals
  const [stockInForm, setStockInForm] = useState({
    ingredientId: '',
    qty: '',
    vendor: '',
    unitCost: '',
    reason: 'Restock Arrival'
  });

  const [correctionForm, setCorrectionForm] = useState({
    ingredientId: '',
    actualQty: '',
    reason: ''
  });

  const [flagForm, setFlagForm] = useState({
    ingredientId: '',
    notes: 'Low stock visual verification'
  });

  const [submitting, setSubmitting] = useState(false);

  // Fetch data
  const fetchData = async () => {
    try {
      setRefreshing(true);
      const [itemsRes, historyRes, flagsRes] = await Promise.all([
        fetch('/api/inventory'),
        fetch('/api/inventory/activity-history'),
        fetch('/api/inventory/restock-flags')
      ]);

      if (itemsRes.ok) {
        const data = await itemsRes.json();
        setItems(data);
      }
      if (historyRes.ok) {
        const historyData = await historyRes.json();
        setAdjustments(historyData);
      }
      if (flagsRes.ok) {
        const flagsData = await flagsRes.json();
        setRestockFlags(flagsData);
      }
    } catch (err) {
      console.error('Failed to load inventory portal data', err);
      addToast('Error syncing inventory data', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      let matchesStatus = true;
      if (statusFilter === 'low_stock') {
        const stock = Number(item.currentStock);
        const reorder = Number(item.reorderLevel);
        matchesStatus = stock <= reorder || item.status === 'Low' || item.status === 'Out';
      } else if (statusFilter === 'expiring') {
        matchesStatus = item.status === 'Out' || item.status === 'Low' || Number(item.currentStock) === 0;
      }
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [items, searchQuery, selectedCategory, statusFilter]);

  // KPIs
  const totalSKUs = items.length;
  const needingRestock = useMemo(() => {
    return items.filter(i => {
      const stock = Number(i.currentStock);
      const reorder = Number(i.reorderLevel);
      return stock <= reorder || i.status === 'Low' || i.status === 'Out';
    }).length;
  }, [items]);

  const activeFlagsCount = useMemo(() => {
    return restockFlags.filter(f => !f.resolved).length;
  }, [restockFlags]);

  const recentStockInCount = useMemo(() => {
    return adjustments.filter(a => a.type === 'stock_in').length;
  }, [adjustments]);

  // Modal Handlers
  const handleOpenStockIn = (item?: InventoryItem) => {
    triggerHaptic('light');
    if (item) {
      setSelectedItemForModal(item);
      setStockInForm({
        ingredientId: String(item.id),
        qty: '',
        vendor: '',
        unitCost: '',
        reason: 'Regular Supplier Delivery'
      });
    } else if (items.length > 0) {
      setSelectedItemForModal(items[0]);
      setStockInForm({
        ingredientId: String(items[0].id),
        qty: '',
        vendor: '',
        unitCost: '',
        reason: 'Regular Supplier Delivery'
      });
    }
    setActiveModal('stock_in');
  };

  const handleOpenCorrection = (item?: InventoryItem) => {
    triggerHaptic('light');
    if (item) {
      setSelectedItemForModal(item);
      setCorrectionForm({
        ingredientId: String(item.id),
        actualQty: String(item.currentStock),
        reason: ''
      });
    } else if (items.length > 0) {
      setSelectedItemForModal(items[0]);
      setCorrectionForm({
        ingredientId: String(items[0].id),
        actualQty: String(items[0].currentStock),
        reason: ''
      });
    }
    setActiveModal('correct');
  };

  const handleOpenFlag = (item?: InventoryItem) => {
    triggerHaptic('light');
    if (item) {
      setSelectedItemForModal(item);
      setFlagForm({
        ingredientId: String(item.id),
        notes: 'Low stock / Urgent restock required'
      });
    } else if (items.length > 0) {
      setSelectedItemForModal(items[0]);
      setFlagForm({
        ingredientId: String(items[0].id),
        notes: 'Low stock / Urgent restock required'
      });
    }
    setActiveModal('flag');
  };

  const handleStockInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockInForm.ingredientId || !stockInForm.qty || Number(stockInForm.qty) <= 0) {
      addToast('Please enter a valid quantity', 'error');
      return;
    }
    try {
      setSubmitting(true);
      const res = await fetch('/api/inventory/stock-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredientId: stockInForm.ingredientId,
          qty: Number(stockInForm.qty),
          vendor: stockInForm.vendor,
          unitCost: stockInForm.unitCost ? Number(stockInForm.unitCost) : undefined,
          reason: stockInForm.reason,
          createdBy: currentUser?.email || 'inventory.staff@kitchenops.edu'
        })
      });

      if (res.ok) {
        addToast('Stock-in logged successfully!', 'success');
        setActiveModal(null);
        fetchData();
      } else {
        const errData = await res.json();
        addToast(errData.error || 'Failed to log stock-in', 'error');
      }
    } catch (err) {
      addToast('Error submitting stock-in', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCorrectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctionForm.ingredientId || correctionForm.actualQty === '') {
      addToast('Please enter actual physical count', 'error');
      return;
    }
    if (!correctionForm.reason.trim()) {
      addToast('Reason is required for physical count correction', 'error');
      return;
    }
    try {
      setSubmitting(true);
      const res = await fetch('/api/inventory/correct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredientId: correctionForm.ingredientId,
          actualQty: Number(correctionForm.actualQty),
          reason: correctionForm.reason.trim(),
          createdBy: currentUser?.email || 'inventory.staff@kitchenops.edu'
        })
      });

      if (res.ok) {
        addToast('Physical count updated successfully!', 'success');
        setActiveModal(null);
        fetchData();
      } else {
        const errData = await res.json();
        addToast(errData.error || 'Failed to correct physical count', 'error');
      }
    } catch (err) {
      addToast('Error submitting correction', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFlagSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flagForm.ingredientId) {
      addToast('Please select an item', 'error');
      return;
    }
    try {
      setSubmitting(true);
      const res = await fetch('/api/inventory/flag-restock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredientId: flagForm.ingredientId,
          notes: flagForm.notes,
          flaggedBy: currentUser?.email || 'inventory.staff@kitchenops.edu'
        })
      });

      if (res.ok) {
        addToast('Restock flag created!', 'success');
        setActiveModal(null);
        fetchData();
      } else {
        const errData = await res.json();
        addToast(errData.error || 'Failed to flag item', 'error');
      }
    } catch (err) {
      addToast('Error creating flag', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResolveFlag = async (flagId: string | number) => {
    triggerHaptic('light');
    try {
      const res = await fetch(`/api/inventory/flag-restock/${flagId}/resolve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resolvedBy: currentUser?.email || 'inventory.staff@kitchenops.edu'
        })
      });

      if (res.ok) {
        addToast('Restock flag resolved', 'success');
        fetchData();
      }
    } catch (err) {
      addToast('Failed to resolve flag', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0d0d0d] text-gray-900 dark:text-gray-100 pb-24">
      {/* Unified Top Identity Header Bar */}
      <RoleHeader
        roleName="Inventory Staff"
        userName={currentUser?.name}
        orgId={currentUser?.orgId}
        roleIcon={<Boxes className="w-5 h-5" />}
        darkMode={darkMode}
        onToggleDarkMode={onToggleDarkMode}
        onLogout={onLogout}
        onRefresh={fetchData}
        refreshing={refreshing}
      />

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 pt-4 pb-28">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <RefreshCw className="w-8 h-8 animate-spin mb-3 text-[#16321F] dark:text-[#D9E96B]" />
            <p className="text-sm font-medium">Loading inventory metrics...</p>
          </div>
        ) : (
          <>
            {/* --- DASHBOARD TAB --- */}
            {activeTab === 'dashboard' && (
              <div className="space-y-3">
                {/* Compact Ultra-Sleek KPI Summary Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {/* Total SKUs - Passive Context (muted neutral) */}
                  <div className="bg-gray-50/70 dark:bg-gray-800/30 p-2.5 rounded-xl border border-gray-200/80 dark:border-gray-800 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider truncate">Total SKUs</span>
                      <Boxes className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 shrink-0" />
                    </div>
                    <div className="my-0.5">
                      <span className="text-base font-black text-gray-800 dark:text-gray-200 leading-tight">{totalSKUs}</span>
                    </div>
                    <div className="text-[9px] font-medium text-gray-400 dark:text-gray-500 truncate leading-none">Managed stock items</div>
                  </div>

                  {/* Needs Restock - Actionable (warning state if > 0, calm if 0) */}
                  <div className={`p-2.5 rounded-xl border transition-all flex flex-col justify-between ${
                    needingRestock > 0
                      ? 'bg-amber-500/10 dark:bg-amber-500/15 border-amber-500/30 text-amber-900 dark:text-amber-200'
                      : 'bg-white dark:bg-[#121212] border-gray-200 dark:border-gray-800'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider truncate">Needs Restock</span>
                      <AlertTriangle className={`w-3.5 h-3.5 shrink-0 ${needingRestock > 0 ? 'text-amber-500' : 'text-gray-400'}`} />
                    </div>
                    <div className="my-0.5">
                      <span className={`text-base font-black leading-tight ${needingRestock > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-gray-900 dark:text-white'}`}>
                        {needingRestock}
                      </span>
                    </div>
                    <div className="text-[9px] font-medium text-gray-400 truncate leading-none">
                      {needingRestock > 0 ? 'At or below reorder level' : 'Stock levels optimal'}
                    </div>
                  </div>

                  {/* Recent Stock-Ins - Recent activity */}
                  <div className="bg-white dark:bg-[#121212] p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider truncate">Stock-Ins</span>
                      <TrendingUp className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    </div>
                    <div className="my-0.5">
                      <span className="text-base font-black text-gray-900 dark:text-white leading-tight">{recentStockInCount}</span>
                    </div>
                    <div className="text-[9px] font-medium text-gray-400 truncate leading-none">Receipts recorded</div>
                  </div>

                  {/* Active Flags - Urgent if > 0, Calm/Resolved if 0 */}
                  <div className={`p-2.5 rounded-xl border transition-all flex flex-col justify-between ${
                    activeFlagsCount > 0
                      ? 'bg-rose-500/10 dark:bg-rose-500/15 border-rose-500/30'
                      : 'bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500/20'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider truncate">Active Flags</span>
                      {activeFlagsCount > 0 ? (
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      )}
                    </div>
                    <div className="my-0.5">
                      <span className={`text-base font-black leading-tight ${
                        activeFlagsCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                      }`}>
                        {activeFlagsCount}
                      </span>
                    </div>
                    <div className="text-[9px] font-medium text-gray-400 truncate leading-none">
                      {activeFlagsCount > 0 ? 'Restock alerts pending' : 'All flags resolved'}
                    </div>
                  </div>
                </div>

                {/* Quick Action Buttons Row - Rebalanced Visual Hierarchy */}
                <div className="bg-white dark:bg-[#121212] p-3 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs">
                  <h2 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">
                    Quick Actions
                  </h2>
                  <div className="space-y-2">
                    {/* Primary Action - Stock In Arrival */}
                    <Pressable
                      onClick={() => handleOpenStockIn()}
                      className="w-full bg-[#16321F] text-[#D9E96B] p-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs hover:opacity-95 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Stock In Arrival</span>
                    </Pressable>

                    {/* Secondary Actions - Side by side pair */}
                    <div className="grid grid-cols-2 gap-2">
                      <Pressable
                        onClick={() => handleOpenCorrection()}
                        className="bg-amber-500/10 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-500/20 p-2 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-amber-500/20 transition-all text-center"
                      >
                        <ArrowDownUp className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">Count Correction</span>
                      </Pressable>

                      <Pressable
                        onClick={() => handleOpenFlag()}
                        className="bg-rose-500/10 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300 border border-rose-500/20 p-2 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-rose-500/20 transition-all text-center"
                      >
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">Flag Item</span>
                      </Pressable>
                    </div>
                  </div>
                </div>

                {/* Active Restock Flags Alert Section */}
                {restockFlags.filter(f => !f.resolved).length > 0 && (
                  <div className="bg-rose-500/5 dark:bg-rose-950/20 border border-rose-500/20 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-sm">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Active Restock Flags ({restockFlags.filter(f => !f.resolved).length})</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {restockFlags.filter(f => !f.resolved).map(flag => {
                        const targetItem = items.find(i => String(i.id) === String(flag.ingredientId));
                        return (
                          <div
                            key={flag.id}
                            className="bg-white dark:bg-[#181818] p-3 rounded-xl border border-rose-200 dark:border-rose-900/40 flex items-center justify-between gap-3"
                          >
                            <div>
                              <div className="font-bold text-sm text-gray-900 dark:text-white">
                                {targetItem ? targetItem.name : `Item #${flag.ingredientId}`}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-0.5">
                                <span>Note: {flag.notes || 'Restock required'}</span>
                                <span>•</span>
                                <span>Flagged by {flag.flaggedBy}</span>
                              </div>
                            </div>

                            <Pressable
                              onClick={() => handleResolveFlag(flag.id)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 hover:bg-emerald-700"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Resolve</span>
                            </Pressable>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Stock Level Warning Cards & Activity Log Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Low / Critical Items List */}
                  <div className="bg-white dark:bg-[#121212] p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                    <h2 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      <span>Items Needing Attention</span>
                    </h2>

                    <div className="space-y-2 max-h-80 overflow-y-auto no-scrollbar scrollbar-hide pr-1">
                      {items
                        .filter(i => Number(i.currentStock) <= Number(i.reorderLevel))
                        .map(item => {
                          const percent = Math.min(100, Math.round((Number(item.currentStock) / Number(item.targetStock)) * 100));
                          return (
                            <div key={item.id} className="p-3 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="font-bold text-sm truncate text-gray-900 dark:text-white">{item.name}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                  Current: <span className="font-bold text-amber-600 dark:text-amber-400">{item.currentStock} {item.unit}</span> / Target: {item.targetStock} {item.unit}
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full mt-2 overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${percent < 20 ? 'bg-rose-500' : 'bg-amber-500'}`}
                                    style={{ width: `${percent}%` }}
                                  />
                                </div>
                              </div>

                              <Pressable
                                onClick={() => handleOpenStockIn(item)}
                                className="px-3 py-1.5 bg-[#16321F] text-[#D9E96B] rounded-lg text-xs font-bold hover:bg-[#23432d]"
                              >
                                Stock In
                              </Pressable>
                            </div>
                          );
                        })}
                      {items.filter(i => Number(i.currentStock) <= Number(i.reorderLevel)).length === 0 && (
                        <div className="p-6 text-center text-xs text-gray-400">
                          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                          All inventory levels are currently above reorder thresholds!
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Recent Activity Log */}
                  <div className="bg-white dark:bg-[#121212] p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                    <h2 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-500" />
                      <span>Recent Inventory Adjustments</span>
                    </h2>

                    <div className="space-y-2 max-h-80 overflow-y-auto no-scrollbar scrollbar-hide pr-1">
                      {adjustments.map(adj => {
                        const targetItem = items.find(i => String(i.id) === String(adj.ingredientId));
                        return (
                          <div key={adj.id} className="p-3 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
                            <div>
                              <div className="font-bold text-gray-900 dark:text-white">
                                {targetItem ? targetItem.name : `Item #${adj.ingredientId}`}
                              </div>
                              <div className="text-gray-500 dark:text-gray-400 text-[11px] mt-0.5">
                                {adj.reason || adj.type} • {adj.createdBy}
                              </div>
                            </div>

                            <div className={`font-mono font-bold text-sm ${adj.type === 'stock_in' ? 'text-emerald-600 dark:text-emerald-400' : Number(adj.qty) >= 0 ? 'text-blue-600' : 'text-rose-500'}`}>
                              {Number(adj.qty) > 0 ? `+${adj.qty}` : adj.qty}
                            </div>
                          </div>
                        );
                      })}
                      {adjustments.length === 0 && (
                        <div className="p-6 text-center text-xs text-gray-400">
                          No recent inventory adjustments logged yet.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- CATALOGUE TAB --- */}
            {activeTab === 'catalogue' && (
              <div className="space-y-4">
                {/* Search & Category Filter Sticky Container */}
                <div className="sticky top-[57px] z-20 bg-gray-50/95 dark:bg-[#0d0d0d]/95 backdrop-blur-md pt-1 pb-3 -mx-4 px-4 border-b border-gray-200/60 dark:border-gray-800/60 shadow-xs mb-3">
                  <div className="bg-white dark:bg-[#121212] p-3 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs">
                    {/* Search Bar & Filter Toggle Row */}
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400 pointer-events-none" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                          placeholder="Search inventory SKUs, ingredients, categories..."
                          className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl pl-10 pr-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#16321F] dark:focus:ring-[#D9E96B]"
                        />
                        {searchQuery && (
                          <button
                            type="button"
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <Pressable
                        onClick={() => {
                          triggerHaptic('light');
                          setFiltersExpanded(!filtersExpanded);
                        }}
                        className={`p-2.5 rounded-xl border flex items-center justify-center transition-all relative shrink-0 ${
                          filtersExpanded || selectedCategory !== 'all' || statusFilter !== 'all'
                            ? 'bg-[#16321F] text-[#D9E96B] border-[#16321F]'
                            : 'bg-gray-50 dark:bg-[#1a1a1a] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                        title="Toggle Filters"
                      >
                        <SlidersHorizontal className="w-4 h-4" />
                        {(selectedCategory !== 'all' || statusFilter !== 'all') && (
                          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#D9E96B] rounded-full border-2 border-white dark:border-[#121212]" />
                        )}
                      </Pressable>
                    </div>

                    {/* Expandable Filter Panel */}
                    <AnimatePresence>
                      {filtersExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="pt-3 mt-3 border-t border-gray-100 dark:border-gray-800/80 space-y-3">
                            {/* Category Filter Row */}
                            <div>
                              <div className="flex items-center justify-between mb-1.5 px-0.5">
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Category Filter</span>
                                {(selectedCategory !== 'all' || statusFilter !== 'all') && (
                                  <button
                                    onClick={() => {
                                      setSelectedCategory('all');
                                      setStatusFilter('all');
                                      triggerHaptic('light');
                                    }}
                                    className="text-[11px] font-bold text-rose-500 hover:underline"
                                  >
                                    Reset
                                  </button>
                                )}
                              </div>
                              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar scrollbar-hide">
                                {[
                                  { id: 'all', label: 'All Items' },
                                  { id: 'grains_lentils', label: 'Grains & Lentils' },
                                  { id: 'proteins_dairy', label: 'Proteins & Dairy' },
                                  { id: 'vegetables', label: 'Vegetables' },
                                  { id: 'spices_condiments', label: 'Spices & Condiments' }
                                ].map(cat => (
                                  <Pressable
                                    key={cat.id}
                                    onClick={() => {
                                      triggerHaptic('light');
                                      setSelectedCategory(cat.id);
                                    }}
                                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-bold transition-all shrink-0 ${
                                      selectedCategory === cat.id
                                        ? 'bg-[#16321F] text-[#D9E96B]'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                                    }`}
                                  >
                                    {cat.label}
                                  </Pressable>
                                ))}
                              </div>
                            </div>

                            {/* Status Filter Row */}
                            <div>
                              <span className="block text-[10px] font-extrabold uppercase tracking-wider text-gray-400 mb-1.5 px-0.5">
                                Stock Status
                              </span>
                              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar scrollbar-hide">
                                {[
                                  { id: 'all', label: 'All Statuses' },
                                  { id: 'low_stock', label: 'Low Stock' },
                                  { id: 'expiring', label: 'Critical / Out' }
                                ].map(sf => (
                                  <Pressable
                                    key={sf.id}
                                    onClick={() => {
                                      triggerHaptic('light');
                                      setStatusFilter(sf.id as any);
                                    }}
                                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-bold transition-all shrink-0 ${
                                      statusFilter === sf.id
                                        ? 'bg-[#16321F] text-[#D9E96B]'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                                    }`}
                                  >
                                    {sf.label}
                                  </Pressable>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* SKU List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredItems.map(item => {
                    const current = Number(item.currentStock);
                    const target = Number(item.targetStock);
                    const reorder = Number(item.reorderLevel);
                    const percent = Math.min(100, Math.round((current / target) * 100));

                    const isLow = current <= reorder;
                    const isOut = current === 0;

                    return (
                      <div
                        key={item.id}
                        className="bg-white dark:bg-[#121212] p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <h3 className="font-extrabold text-base text-gray-900 dark:text-white">
                                {item.name}
                              </h3>
                              <span className="inline-block mt-0.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                                {item.category.replace('_', ' ')}
                              </span>
                            </div>

                            <span
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                                isOut
                                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400'
                                  : isLow
                                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400'
                                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                              }`}
                            >
                              {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
                            </span>
                          </div>

                          {/* Progress Bar */}
                          <div className="my-2">
                            <div className="flex justify-between text-xs font-medium mb-1">
                              <span className="text-gray-500">Current Stock:</span>
                              <span className="font-mono font-bold text-gray-900 dark:text-white">
                                {item.currentStock} / {item.targetStock} {item.unit}
                              </span>
                            </div>
                            <div className="w-full bg-gray-100 dark:bg-gray-800 h-2.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${
                                  isOut ? 'bg-rose-500' : isLow ? 'bg-amber-500' : 'bg-emerald-600'
                                }`}
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                              <span>Reorder Level: {item.reorderLevel} {item.unit}</span>
                              <span>{percent}% of Target</span>
                            </div>
                          </div>

                          {/* 7-Day Usage Chart */}
                          <ItemUsageChart ingredientId={item.id} />
                        </div>

                        {/* Card Actions */}
                        <div className="pt-2 border-t border-gray-100 dark:border-gray-800/80 flex items-center gap-2">
                          <Pressable
                            onClick={() => handleOpenStockIn(item)}
                            className="flex-1 bg-[#16321F] text-[#D9E96B] py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 hover:bg-[#22442b]"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Stock In</span>
                          </Pressable>

                          <Pressable
                            onClick={() => handleOpenCorrection(item)}
                            className="px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold hover:bg-gray-200"
                          >
                            Correct
                          </Pressable>

                          <Pressable
                            onClick={() => handleOpenFlag(item)}
                            className="p-2 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-xl hover:bg-rose-100"
                            title="Flag for Restock"
                          >
                            <AlertTriangle className="w-4 h-4" />
                          </Pressable>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* --- PROFILE TAB --- */}
            {activeTab === 'profile' && (
              <div className="space-y-6 max-w-xl mx-auto">
                <div className="bg-white dark:bg-[#121212] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm text-center">
                  <div className="w-16 h-16 rounded-2xl bg-[#16321F] text-[#D9E96B] flex items-center justify-center font-bold text-2xl mx-auto mb-3 shadow-md">
                    {currentUser?.name?.charAt(0) || 'I'}
                  </div>
                  <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">
                    {currentUser?.name || 'Inventory Officer'}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-0.5">
                    {currentUser?.email || 'inventory@kitchenops.edu'}
                  </p>
                  <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16321F]/10 dark:bg-[#D9E96B]/20 text-[#16321F] dark:text-[#D9E96B] text-xs font-bold">
                    <span>Role: Inventory Staff</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-[#121212] p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-3">
                  <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Organization Info
                  </h3>
                  <div className="flex justify-between items-center text-sm py-2 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-gray-500">Organization ID</span>
                    <span className="font-mono font-bold text-gray-900 dark:text-white">{currentUser?.orgId || 'org_001'}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm py-2 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-gray-500">Assigned Module</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">Inventory & Receiving</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-[#121212] p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-3">
                  <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    System Controls
                  </h3>

                  <Pressable
                    onClick={() => {
                      triggerHaptic('light');
                      onToggleDarkMode();
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 font-bold text-sm"
                  >
                    <span className="flex items-center gap-2">
                      {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
                      <span>Theme Mode</span>
                    </span>
                    <span className="text-xs text-gray-400">{darkMode ? 'Dark' : 'Light'}</span>
                  </Pressable>

                  <Pressable
                    onClick={() => {
                      triggerHaptic('light');
                      onLogout();
                    }}
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 font-bold text-sm hover:bg-rose-100"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </Pressable>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* --- MODALS --- */}
      <AnimatePresence>
        {activeModal && (
          <FocusTrap>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="bg-white dark:bg-[#181818] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl max-w-md w-full max-h-[85vh] overflow-y-auto no-scrollbar scrollbar-hide p-6"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100 dark:border-gray-800">
                  <h3 className="text-base font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                    {activeModal === 'stock_in' && <Plus className="w-5 h-5 text-emerald-600" />}
                    {activeModal === 'correct' && <ArrowDownUp className="w-5 h-5 text-amber-500" />}
                    {activeModal === 'flag' && <AlertTriangle className="w-5 h-5 text-rose-500" />}

                    <span>
                      {activeModal === 'stock_in' && 'Record Stock In'}
                      {activeModal === 'correct' && 'Physical Count Correction'}
                      {activeModal === 'flag' && 'Flag Item for Restock'}
                    </span>
                  </h3>

                  <Pressable
                    onClick={() => setActiveModal(null)}
                    className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <X className="w-5 h-5" />
                  </Pressable>
                </div>

                {/* Modal Forms */}
                {activeModal === 'stock_in' && (
                  <form onSubmit={handleStockInSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Select SKU / Ingredient
                      </label>
                      <select
                        value={stockInForm.ingredientId}
                        onChange={e => setStockInForm(f => ({ ...f, ingredientId: e.target.value }))}
                        className="w-full bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-xl p-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#16321F] dark:focus:ring-[#D9E96B]"
                        required
                      >
                        {items.map(i => (
                          <option key={i.id} value={i.id}>
                            {i.name} (Current: {i.currentStock} {i.unit})
                          </option>
                        ))}
                      </select>

                      {stockInForm.ingredientId && (
                        <ItemUsageChart ingredientId={stockInForm.ingredientId} />
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Quantity Received
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={stockInForm.qty}
                        onChange={e => setStockInForm(f => ({ ...f, qty: e.target.value }))}
                        placeholder="e.g. 50"
                        className="w-full bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-xl p-2.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#16321F] dark:focus:ring-[#D9E96B]"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                          Vendor (Optional)
                        </label>
                        <input
                          type="text"
                          value={stockInForm.vendor}
                          onChange={e => setStockInForm(f => ({ ...f, vendor: e.target.value }))}
                          placeholder="e.g. Greenfields"
                          className="w-full bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#16321F] dark:focus:ring-[#D9E96B]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                          Unit Cost ($)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={stockInForm.unitCost}
                          onChange={e => setStockInForm(f => ({ ...f, unitCost: e.target.value }))}
                          placeholder="0.00"
                          className="w-full bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#16321F] dark:focus:ring-[#D9E96B]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Notes / Reason
                      </label>
                      <input
                        type="text"
                        value={stockInForm.reason}
                        onChange={e => setStockInForm(f => ({ ...f, reason: e.target.value }))}
                        className="w-full bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#16321F] dark:focus:ring-[#D9E96B]"
                      />
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <Pressable
                        type="button"
                        onClick={() => setActiveModal(null)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        Cancel
                      </Pressable>
                      <Pressable
                        type="submit"
                        disabled={submitting}
                        className="px-5 py-2 rounded-xl text-xs font-bold bg-[#16321F] text-[#D9E96B] hover:bg-[#23432d] shadow-sm"
                      >
                        {submitting ? 'Saving...' : 'Confirm Stock In'}
                      </Pressable>
                    </div>
                  </form>
                )}

                {activeModal === 'correct' && (
                  <form onSubmit={handleCorrectionSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Select SKU / Ingredient
                      </label>
                      <select
                        value={correctionForm.ingredientId}
                        onChange={e => setCorrectionForm(f => ({ ...f, ingredientId: e.target.value }))}
                        className="w-full bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-xl p-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#16321F] dark:focus:ring-[#D9E96B]"
                        required
                      >
                        {items.map(i => (
                          <option key={i.id} value={i.id}>
                            {i.name} (System Count: {i.currentStock} {i.unit})
                          </option>
                        ))}
                      </select>

                      {correctionForm.ingredientId && (
                        <ItemUsageChart ingredientId={correctionForm.ingredientId} />
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Actual Physical Count
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={correctionForm.actualQty}
                        onChange={e => setCorrectionForm(f => ({ ...f, actualQty: e.target.value }))}
                        placeholder="Enter verified count"
                        className="w-full bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-xl p-2.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#16321F] dark:focus:ring-[#D9E96B]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Correction Reason (Required)
                      </label>
                      <textarea
                        value={correctionForm.reason}
                        onChange={e => setCorrectionForm(f => ({ ...f, reason: e.target.value }))}
                        placeholder="e.g. Weekly physical count audit discrepancy, spoiled stock discarded..."
                        rows={3}
                        className="w-full bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#16321F] dark:focus:ring-[#D9E96B]"
                        required
                      />
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <Pressable
                        type="button"
                        onClick={() => setActiveModal(null)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        Cancel
                      </Pressable>
                      <Pressable
                        type="submit"
                        disabled={submitting}
                        className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-600 text-white hover:bg-amber-700 shadow-sm"
                      >
                        {submitting ? 'Saving...' : 'Apply Correction'}
                      </Pressable>
                    </div>
                  </form>
                )}

                {activeModal === 'flag' && (
                  <form onSubmit={handleFlagSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Select Item to Flag
                      </label>
                      <select
                        value={flagForm.ingredientId}
                        onChange={e => setFlagForm(f => ({ ...f, ingredientId: e.target.value }))}
                        className="w-full bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-xl p-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#16321F] dark:focus:ring-[#D9E96B]"
                        required
                      >
                        {items.map(i => (
                          <option key={i.id} value={i.id}>
                            {i.name} (Stock: {i.currentStock} {i.unit})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Notes / Urgency Details
                      </label>
                      <textarea
                        value={flagForm.notes}
                        onChange={e => setFlagForm(f => ({ ...f, notes: e.target.value }))}
                        placeholder="e.g. Visual check shows only 2 bags remaining..."
                        rows={3}
                        className="w-full bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#16321F] dark:focus:ring-[#D9E96B]"
                      />
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <Pressable
                        type="button"
                        onClick={() => setActiveModal(null)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        Cancel
                      </Pressable>
                      <Pressable
                        type="submit"
                        disabled={submitting}
                        className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 shadow-sm"
                      >
                        {submitting ? 'Flagging...' : 'Create Restock Flag'}
                      </Pressable>
                    </div>
                  </form>
                )}
              </motion.div>
            </div>
          </FocusTrap>
        )}
      </AnimatePresence>

      {/* Fixed Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#121212] border-t border-gray-200 dark:border-gray-800 z-30 shadow-lg px-4 py-1.5">
        <div className="max-w-md mx-auto flex items-center justify-around">
          <Pressable
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('dashboard');
            }}
            className={`flex flex-col items-center justify-center gap-1 py-1.5 px-4 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'dashboard'
                ? 'text-[#16321F] dark:text-[#D9E96B]'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <TrendingUp className={`w-5 h-5 ${activeTab === 'dashboard' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            <span className="text-[11px]">Dashboard</span>
          </Pressable>

          <Pressable
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('catalogue');
            }}
            className={`flex flex-col items-center justify-center gap-1 py-1.5 px-4 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'catalogue'
                ? 'text-[#16321F] dark:text-[#D9E96B]'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <PackageSearch className={`w-5 h-5 ${activeTab === 'catalogue' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            <span className="text-[11px]">Catalogue</span>
          </Pressable>

          <Pressable
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('profile');
            }}
            className={`flex flex-col items-center justify-center gap-1 py-1.5 px-4 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'profile'
                ? 'text-[#16321F] dark:text-[#D9E96B]'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <User className={`w-5 h-5 ${activeTab === 'profile' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            <span className="text-[11px]">Profile</span>
          </Pressable>
        </div>
      </nav>
    </div>
  );
};
