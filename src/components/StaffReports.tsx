import React, { useState } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { useReportMetrics } from '../hooks/useReportMetrics';
import { 
  TrendingDown, ArrowUp, ArrowDown, Minus, ArrowRight, Sparkles, 
  DollarSign, Percent, AlertTriangle, TrendingUp, Package, Box, BarChart2
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, LineChart, Line, ComposedChart
} from 'recharts';
import { EfficiencyRecord, InventoryItem, Supplier, ActivityLog } from '../types';

interface StaffReportsProps {
  isDarkMode?: boolean;
  efficiencyRecords: EfficiencyRecord[];
  optInCount: number;
  prepItems?: InventoryItem[];
  suppliers?: Supplier[];
  activityLogs?: ActivityLog[];
}

export default function StaffReports({ 
  efficiencyRecords, 
  optInCount, 
  prepItems = [], 
  suppliers = [],
  activityLogs = [],
  isDarkMode = false
}: StaffReportsProps) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [viewMode, setViewMode] = React.useState<'chart' | 'table'>('chart');
  
  const [realForecast, setRealForecast] = useState([]);
  const [realInsights, setRealInsights] = useState([]);
  
  React.useEffect(() => {
    fetch('/api/demand-prediction')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setRealForecast(data);
      }).catch(console.error);
      
    fetch('/api/recipe-insights')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setRealInsights(data);
      }).catch(console.error);
  }, []);

  const { spendAndWasteTrendData, yieldWasteData, wasteReasons, sparklineSpend, sparklineWasteCost, sparklineWaste, sparklineAccuracy, currentMonthSpend, currentMonthWasteCost, supplierDeliveryData, consumptionSpikesData, predictiveForecastData, adjustments } = useReportMetrics(optInCount);

  const themeColors = {
    grid: isDarkMode ? '#475569' : '#eee', // Lighter grid lines
    tooltipBg: isDarkMode ? '#1e293b' : '#ffffff', // Slightly lighter tooltip background
    tooltipColor: isDarkMode ? '#f8fafc' : '#000000', // Whiter text
    tooltipBorder: isDarkMode ? '#475569' : '#f3f4f6', // More visible border
    primary: isDarkMode ? '#D9E96B' : '#16321F',
    areaFill: isDarkMode ? '#334155' : '#f3f4f6', // More visible area fill
    areaStroke: isDarkMode ? '#94a3b8' : '#d1d5db', // Brighter stroke
    barMuted: isDarkMode ? '#475569' : '#e5e7eb' // Lighter muted bar
  };
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex-grow max-w-7xl mx-auto w-full px-4 md:px-8 pt-0 pb-6 space-y-4">
        <div className="h-4 w-32 bg-gray-200 dark:bg-[#333333] rounded-xl animate-skeleton-pulse"></div>
        <div className="h-8 w-48 bg-gray-300 rounded-[20px] animate-skeleton-pulse"></div>
        <div className="h-48 bg-gray-100 dark:bg-[#222222] rounded-[24px] animate-skeleton-pulse mt-6"></div>
      </div>
    );
  }

  // Derived or mocked data based on the provided inputs (or just intelligent placeholders for the analytics)
  const totalSpend = currentMonthSpend || 14500 + (optInCount * 12);
  const prevSpend = 15200;
  const spendDiff = ((totalSpend - prevSpend) / prevSpend) * 100;
  
  const wastePercentage = Math.max(2, 12 - (optInCount * 0.1));
  const wasteCost = currentMonthWasteCost || Math.round(totalSpend * (wastePercentage / 100));
  const forecastAccuracy = Math.min(98, 85 + (optInCount * 0.2));

  // 2. Waste Management & Yield Analytics (Stacked Bar)
  

  

  // 3. Purchase Prep & Inventory Tracking
  

  

  
  // 4. Predictive Engine & Forecasting
  

  // Trend Line Data (30 days)
  


  // Sparkline data
        
  // Map real prep items to adjustments if available
  

  return (
    <div id="staff_reports" className="flex-grow max-w-7xl mx-auto w-full px-4 md:px-8 py-6 space-y-6">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-[#0A170E] dark:text-white mb-1">Analytical Engine</h2>
          <p className="text-sm text-gray-500 dark:text-gray-300">KPI Dashboard & Supply Chain Forecasting</p>
        </div>
        <div className="flex bg-gray-100 dark:bg-[#222] rounded-lg p-1 w-fit">
          <button 
            onClick={() => setViewMode('chart')}
            className={`px-4 py-1.5 text-sm font-bold rounded-md transition-colors ${viewMode === 'chart' ? 'bg-white dark:bg-[#333] text-[#16321F] dark:text-[#D9E96B] shadow-sm' : 'text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'}`}
          >
            Visual
          </button>
          <button 
            onClick={() => setViewMode('table')}
            className={`px-4 py-1.5 text-sm font-bold rounded-md transition-colors ${viewMode === 'table' ? 'bg-white dark:bg-[#333] text-[#16321F] dark:text-[#D9E96B] shadow-sm' : 'text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'}`}
          >
            Raw Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* 1. Executive KPI Scorecard (2x2 Grid) */}
                <div className="grid grid-cols-2 gap-3 lg:gap-4 lg:col-span-1">
          {/* Total Spend */}
          <div className="bg-white dark:bg-[#121212] p-4 rounded-[16px] border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between overflow-hidden relative">
            <div className="relative z-10 flex items-center justify-between mb-2">
              <h3 className="text-[10px] md:text-xs font-bold text-gray-500 dark:text-gray-400 dark:text-gray-300 uppercase tracking-wider">Total Spend</h3>
              <div className={`p-1 rounded-full ${spendDiff < 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                <DollarSign className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="relative z-10">
              <div className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">${totalSpend.toLocaleString()}</div>
              <div className="flex flex-wrap items-center gap-1 mt-0.5">
                <span className={`text-[10px] md:text-xs font-bold flex items-center ${spendDiff < 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {spendDiff < 0 ? <TrendingDown className="w-3 h-3 mr-0.5" /> : <TrendingUp className="w-3 h-3 mr-0.5" />}
                  {Math.abs(spendDiff).toFixed(1)}%
                </span>
                <span className="text-[10px] md:text-xs text-gray-400 dark:text-gray-300 hidden md:inline">vs prev</span>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-16 opacity-30 pointer-events-none">
              <ErrorBoundary fallbackMessage="Failed to load chart"><ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineSpend} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                  <Area type="monotone" dataKey="value" stroke={spendDiff < 0 ? '#10b981' : '#ef4444'} fill={spendDiff < 0 ? '#d1fae5' : '#fee2e2'} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer></ErrorBoundary>
            </div>
          </div>

          {/* Overall Waste */}
          <div className="bg-white dark:bg-[#121212] p-4 rounded-[16px] border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between overflow-hidden relative">
            <div className="relative z-10 flex items-center justify-between mb-2">
              <h3 className="text-[10px] md:text-xs font-bold text-gray-500 dark:text-gray-400 dark:text-gray-300 uppercase tracking-wider">Waste</h3>
              <div className="p-1 rounded-full bg-amber-50 text-amber-600">
                <Percent className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="relative z-10">
              <div className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">{wastePercentage.toFixed(1)}%</div>
              <div className="flex flex-wrap items-center gap-1 mt-0.5">
                <span className="text-[10px] md:text-xs font-bold flex items-center text-emerald-600">
                  <TrendingDown className="w-3 h-3 mr-0.5" />
                  -1.2%
                </span>
                <span className="text-[10px] md:text-xs text-gray-400 dark:text-gray-300 hidden md:inline">yield</span>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-16 opacity-30 pointer-events-none">
              <ErrorBoundary fallbackMessage="Failed to load chart"><ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineWaste} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                  <Area type="monotone" dataKey="value" stroke="#f59e0b" fill="#fef3c7" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer></ErrorBoundary>
            </div>
          </div>

          {/* Cost of Waste */}
          <div className="bg-white dark:bg-[#121212] p-4 rounded-[16px] border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between overflow-hidden relative">
            <div className="relative z-10 flex items-center justify-between mb-2">
              <h3 className="text-[10px] md:text-xs font-bold text-gray-500 dark:text-gray-400 dark:text-gray-300 uppercase tracking-wider">Waste Cost</h3>
              <div className="p-1 rounded-full bg-red-50 text-red-600">
                <AlertTriangle className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="relative z-10">
              <div className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">${wasteCost.toLocaleString()}</div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[10px] md:text-xs font-bold flex items-center text-gray-500 dark:text-gray-400 dark:text-gray-300">
                  Value lost
                </span>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-16 opacity-30 pointer-events-none">
              <ErrorBoundary fallbackMessage="Failed to load chart"><ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineWasteCost} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                  <Area type="monotone" dataKey="value" stroke="#ef4444" fill="#fee2e2" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer></ErrorBoundary>
            </div>
          </div>

          {/* Forecast Accuracy */}
          <div className="bg-white dark:bg-[#121212] p-4 rounded-[16px] border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between overflow-hidden relative">
            <div className="relative z-10 flex items-center justify-between mb-2">
              <h3 className="text-[10px] md:text-xs font-bold text-gray-500 dark:text-gray-400 dark:text-gray-300 uppercase tracking-wider">Accuracy</h3>
              <div className="p-1 rounded-full bg-[#16321F]/10 text-[#16321F] dark:bg-[#D9E96B]/20 dark:text-[#D9E96B]">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="relative z-10">
              <div className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">{forecastAccuracy.toFixed(1)}%</div>
              <div className="flex flex-wrap items-center gap-1 mt-0.5">
                <span className="text-[10px] md:text-xs font-bold flex items-center text-emerald-600">
                  <ArrowUp className="w-3 h-3 mr-0.5" />
                  +2.4%
                </span>
                <span className="text-[10px] md:text-xs text-gray-400 dark:text-gray-300 hidden md:inline">vs actual</span>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-16 opacity-30 pointer-events-none">
              <ErrorBoundary fallbackMessage="Failed to load chart"><ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineAccuracy} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                  <Area type="monotone" dataKey="value" stroke="#16321F" fill="#d1fae5" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer></ErrorBoundary>
            </div>
          </div>
        </div>

      {/* 30-Day Trend Chart */}
      <div className="bg-white dark:bg-[#121212] p-6 rounded-[20px] border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col lg:col-span-2">
        <div className="mb-6 flex justify-between items-start">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#16321F] dark:text-[#D9E96B]" />
              30-Day Spend & Waste Trend
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-300 mt-1">Total spend vs cost of waste over the last 30 days.</p>
          </div>
        </div>
        <div className="h-72 w-full mt-2">
          {viewMode === 'chart' ? (
            <>
              <div className="mb-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 p-3 rounded-xl flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                <p className="text-sm text-blue-800 dark:text-blue-300"><strong>AI Insight:</strong> Waste costs have steadily decreased over the last 30 days due to better portion control and student opt-ins.</p>
              </div>
              <ErrorBoundary fallbackMessage="Failed to load chart"><ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={spendAndWasteTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={themeColors.grid} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dy={10} minTickGap={20} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} tickFormatter={(val) => `${val}`} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} tickFormatter={(val) => `${val}`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid ' + themeColors.tooltipBorder, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', backgroundColor: themeColors.tooltipBg, color: themeColors.tooltipColor }}
                    formatter={(value) => [`${value}`]}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Area yAxisId="left" type="monotone" dataKey="spend" name="Total Spend" fill={themeColors.areaFill} stroke={themeColors.areaStroke} strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="wasteCost" name="Cost of Waste" stroke="#ef4444" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                </ComposedChart>
              </ResponsiveContainer></ErrorBoundary>
            </>
          ) : (
            <div className="h-full overflow-y-auto border border-gray-100 dark:border-gray-700 rounded-xl">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-300 bg-gray-50 dark:bg-[#1a1a1a] sticky top-0">
                  <tr>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Total Spend</th>
                    <th className="px-4 py-3">Waste Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {spendAndWasteTrendData.slice(-10).map((row, i) => (
                    <tr key={i} className="border-b border-gray-100 dark:border-gray-700">
                      <td className="px-4 py-2 font-medium text-gray-900 dark:text-gray-100">{row.date}</td>
                      <td className="px-4 py-2">${row.spend}</td>
                      <td className="px-4 py-2 text-red-500">${row.wasteCost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      </div>
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 2. Waste Management & Yield Analytics */}
        <div className="bg-white dark:bg-[#121212] p-6 rounded-[20px] border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col">
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Box className="w-4 h-4 text-amber-500" />
              Yield vs Preparation Waste
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-300 mt-1">Usable yield versus waste by ingredient category.</p>
          </div>
          <div className="h-72 w-full flex flex-col">
            {viewMode === 'chart' ? (
              <>
                <div className="mb-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 p-3 rounded-xl flex items-start gap-2 shrink-0">
                  <Sparkles className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-amber-800 dark:text-amber-300"><strong>AI Insight:</strong> Produce accounts for the highest waste ratio (20%), recommend pre-cut supplier alternatives.</p>
                </div>
                <div className="flex-grow min-h-0">
                  <ErrorBoundary fallbackMessage="Failed to load chart"><ResponsiveContainer width="100%" height="100%">
                    <BarChart data={yieldWasteData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={themeColors.grid} />
                      <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                      <Tooltip 
                        cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                        contentStyle={{ borderRadius: '12px', border: '1px solid ' + themeColors.tooltipBorder, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', backgroundColor: themeColors.tooltipBg, color: themeColors.tooltipColor }}
                      />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                      <Bar dataKey="yield" name="Usable Yield %" stackId="a" fill={themeColors.primary} radius={[0, 0, 4, 4]} />
                      <Bar dataKey="waste" name="Waste %" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer></ErrorBoundary>
                </div>
              </>
            ) : (
              <div className="h-full overflow-y-auto border border-gray-100 dark:border-gray-700 rounded-xl">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-300 bg-gray-50 dark:bg-[#1a1a1a] sticky top-0">
                    <tr>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Usable Yield %</th>
                      <th className="px-4 py-3">Waste %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {yieldWasteData.map((row, i) => (
                      <tr key={i} className="border-b border-gray-100 dark:border-gray-700">
                        <td className="px-4 py-2 font-medium text-gray-900 dark:text-gray-100">{row.category}</td>
                        <td className="px-4 py-2 text-emerald-600 dark:text-emerald-400">{row.yield}%</td>
                        <td className="px-4 py-2 text-red-500">{row.waste}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>


          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
            <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 dark:text-gray-300 uppercase tracking-wider mb-3">Primary Waste Drivers</h4>
            <div className="space-y-3">
              {wasteReasons.map((reason, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{reason.reason}</span>
                  <div className="flex items-center gap-3 w-1/2">
                    <div className="flex-grow h-2 bg-gray-100 dark:bg-[#222] rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${reason.percentage}%` }}></div>
                    </div>
                    <span className="text-xs font-bold text-gray-900 dark:text-white w-8 text-right">{reason.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Purchase Preparation & Inventory Tracking */}
        <div className="bg-white dark:bg-[#121212] p-6 rounded-[20px] border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col">
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-blue-500" />
              Consumption Volume Spikes
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-300 mt-1">Consumption trends tracking volume spikes over the week.</p>
          </div>
          <div className="h-72 w-full flex flex-col">
            {viewMode === 'chart' ? (
              <>
                <div className="mb-4 bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30 p-3 rounded-xl flex items-start gap-2 shrink-0">
                  <Sparkles className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-purple-800 dark:text-purple-300"><strong>AI Insight:</strong> Tuesday dinners see a 15% spike in consumption; recommend increasing prep by 5kg.</p>
                </div>
                <div className="flex-grow min-h-0">
                  <ErrorBoundary fallbackMessage="Failed to load chart"><ResponsiveContainer width="100%" height="100%">
                    <LineChart data={consumptionSpikesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={themeColors.grid} />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: '1px solid ' + themeColors.tooltipBorder, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', backgroundColor: themeColors.tooltipBg, color: themeColors.tooltipColor }}
                      />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                      <Line type="monotone" dataKey="breakfast" name="Breakfast" stroke="#3b82f6" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="lunch" name="Lunch" stroke={themeColors.primary} strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="dinner" name="Dinner" stroke="#8b5cf6" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer></ErrorBoundary>
                </div>
              </>
            ) : (
              <div className="h-full overflow-y-auto border border-gray-100 dark:border-gray-700 rounded-xl">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-300 bg-gray-50 dark:bg-[#1a1a1a] sticky top-0">
                    <tr>
                      <th className="px-4 py-3">Day</th>
                      <th className="px-4 py-3">Breakfast (vol)</th>
                      <th className="px-4 py-3">Lunch (vol)</th>
                      <th className="px-4 py-3">Dinner (vol)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {consumptionSpikesData.map((row, i) => (
                      <tr key={i} className="border-b border-gray-100 dark:border-gray-700">
                        <td className="px-4 py-2 font-medium text-gray-900 dark:text-gray-100">{row.day}</td>
                        <td className="px-4 py-2 text-blue-600 dark:text-blue-400">{row.breakfast}</td>
                        <td className="px-4 py-2 text-emerald-600 dark:text-emerald-400">{row.lunch}</td>
                        <td className="px-4 py-2 text-purple-600 dark:text-purple-400">{row.dinner}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>


          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
            <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 dark:text-gray-300 uppercase tracking-wider mb-3">Supplier Delivery & Turnover</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-[#1a1a1a] p-3 rounded-[12px] border border-gray-100 dark:border-gray-700">
                <div className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-300 mb-1">Avg Inventory Turnover</div>
                <div className="text-xl font-black text-gray-900 dark:text-white">4.8 <span className="text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-300">turns/mo</span></div>
              </div>
              <div className="bg-gray-50 dark:bg-[#1a1a1a] p-3 rounded-[12px] border border-gray-100 dark:border-gray-700">
                <div className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-300 mb-1">On-Time Deliveries</div>
                <div className="text-xl font-black text-emerald-600">96.5%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Predictive Engine & Forecasting */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-[#121212] p-6 rounded-[20px] border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col">
          <div className="mb-6 flex justify-between items-start">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-[#16321F] dark:text-[#D9E96B]" />
                Predictive Order Quantities
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-300 mt-1">Projecting ingredient needs based on historical usage and waste trends.</p>
            </div>
            <div className="px-3 py-1 bg-[#16321F]/10 text-[#16321F] dark:bg-[#D9E96B]/20 dark:text-[#D9E96B] rounded-full text-xs font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              AI Powered
            </div>
          </div>
          
          <div className="h-72 w-full mt-2 flex flex-col">
            {viewMode === 'chart' ? (
              <>
                <div className="mb-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 p-3 rounded-xl flex items-start gap-2 shrink-0">
                  <Sparkles className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-emerald-800 dark:text-emerald-300"><strong>AI Insight:</strong> Upcoming weekend forecasts suggest a 20% drop in overall demand; adjust bulk orders accordingly.</p>
                </div>
                <div className="flex-grow min-h-0">
                  <ErrorBoundary fallbackMessage="Failed to load chart"><ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={realForecast.length > 0 ? realForecast : predictiveForecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={themeColors.grid} />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: '1px solid ' + themeColors.tooltipBorder, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', backgroundColor: themeColors.tooltipBg, color: themeColors.tooltipColor }}
                      />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                      <Bar dataKey="actual" name="Actual Consumption" fill={themeColors.barMuted} radius={[4, 4, 0, 0]} barSize={30} />
                      <Line type="monotone" dataKey="predicted" name="Predicted Forecast" stroke={themeColors.primary} strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} strokeDasharray="5 5" />
                    </ComposedChart>
                  </ResponsiveContainer></ErrorBoundary>
                </div>
              </>
            ) : (
              <div className="h-full overflow-y-auto border border-gray-100 dark:border-gray-700 rounded-xl">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-300 bg-gray-50 dark:bg-[#1a1a1a] sticky top-0">
                    <tr>
                      <th className="px-4 py-3">Day</th>
                      <th className="px-4 py-3">Actual Consumption</th>
                      <th className="px-4 py-3">Predicted Forecast</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(realForecast.length > 0 ? realForecast : predictiveForecastData).map((row, i) => (
                      <tr key={i} className="border-b border-gray-100 dark:border-gray-700">
                        <td className="px-4 py-2 font-medium text-gray-900 dark:text-gray-100">{row.day}</td>
                        <td className="px-4 py-2 text-gray-600 dark:text-gray-300">{row.actual || '-'}</td>
                        <td className="px-4 py-2 text-emerald-600 dark:text-emerald-400">{row.predicted}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#16321F] text-white p-6 rounded-[20px] shadow-sm flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles className="w-24 h-24" />
          </div>
          <div className="relative z-10 mb-6">
            <h3 className="text-sm font-bold text-[#D9E96B] flex items-center gap-2 mb-1">
              Suggested Order Adjustments
            </h3>
            <p className="text-xs text-white/70">Optimized to balance waste vs consumption</p>
          </div>

          <div className="relative z-10 space-y-4 flex-grow">
            {adjustments.map((adj, idx) => (
              <div key={idx} className="bg-white/10 p-3.5 rounded-xl border border-white/10 backdrop-blur-sm">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-bold text-sm">{adj.item}</div>
                  <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${adj.action === 'Cut' ? 'bg-red-500/20 text-red-200' : 'bg-emerald-500/20 text-emerald-200'}`}>
                    {adj.action} Order
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div className="text-xs text-white/60 font-medium">
                    {adj.impact}
                  </div>
                  <div className="text-xl font-black text-[#D9E96B]">
                    {adj.action === 'Cut' ? '-' : '+'}{adj.amount}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="relative z-10 mt-6 w-full py-3 bg-[#D9E96B] hover:bg-white text-[#16321F] rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2">
            Apply All Adjustments <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
