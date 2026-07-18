import { useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { WasteLog, PrepProgress } from '../types';

export function useDashboardMetrics(selectedDate?: Date, selectedDay?: string) {
  const { wasteLogs, prepProgress } = useData();

  return useMemo(() => {
    // Use local timezone format (YYYY-MM-DD)
    const dateStr = selectedDate ? selectedDate.toLocaleDateString('en-CA') : new Date().toLocaleDateString('en-CA');
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const day = selectedDay || (selectedDate ? dayNames[selectedDate.getDay()] : 'Thursday');
    
    const todayWaste = wasteLogs.filter((w: WasteLog) => w.date === dateStr);
    const totalKitchenWaste = todayWaste.reduce((sum: number, w: WasteLog) => sum + (w.kitchenQty || 0), 0);
    const totalPlateWaste = todayWaste.reduce((sum: number, w: WasteLog) => sum + (w.plateQty || 0), 0);
    const totalWaste = totalKitchenWaste + totalPlateWaste;
    
    const todayPrep = prepProgress.find((p: PrepProgress) => p.day === day);
    let totalPrepKgs = 160; // fallback baseline
    const preppedItems: Record<string, number> = {};
    
    if (todayPrep && todayPrep.portions) {
      // Assuming approx 0.15 kg (150g) average ingredient weight per portion
      Object.entries(todayPrep.portions).forEach(([item, portions]) => {
         const kgs = portions * 0.15;
         preppedItems[item] = kgs;
      });
      totalPrepKgs = Object.values(preppedItems).reduce((sum, val) => sum + val, 0);
    }
    
    const wastePercentage = totalPrepKgs > 0 ? Math.round((totalWaste / totalPrepKgs) * 100) : 0;
    const efficiencyScore = Math.max(0, 100 - wastePercentage);

    const aggregated: Record<string, any> = {};
    
    Object.entries(preppedItems).forEach(([name, prepQty]) => {
      aggregated[name] = { name, prepQty, overPrep: 0, plateWaste: 0, totalWaste: 0, consumed: 0 };
    });

    todayWaste.forEach(w => {
      const name = w.itemName || 'Unknown';
      if (!aggregated[name]) {
        aggregated[name] = { name, prepQty: 0, overPrep: 0, plateWaste: 0, totalWaste: 0, consumed: 0 };
      }
      aggregated[name].overPrep += (w.kitchenQty || 0);
      aggregated[name].plateWaste += (w.plateQty || 0);
      aggregated[name].totalWaste += (w.kitchenQty || 0) + (w.plateQty || 0);
    });

    // Calculate consumed amount to make a meaningful stacked chart
    Object.values(aggregated).forEach((item: any) => {
      if (item.prepQty > 0) {
        item.consumed = Math.max(0, item.prepQty - item.overPrep - item.plateWaste);
      } else {
        item.consumed = 0;
      }
    });

    const chartData = Object.values(aggregated).sort((a: any, b: any) => b.totalWaste - a.totalWaste).slice(0, 5);

    return {
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
      dashboardChartData: chartData
    };
  }, [wasteLogs, prepProgress, selectedDate, selectedDay]);
}
