import { useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { WasteLog } from '../types';

export function useReportMetrics(optInCount: number) {
  const { wasteLogs, prepProgress, pastOrders } = useData();

  return useMemo(() => {
    // 1. Generate 30 days of data based on actual waste logs
    const today = new Date();
    
    // Group waste logs by date
    const wasteByDate: { [key: string]: { kitchen: number, plate: number, total: number } } = {};
    wasteLogs.forEach((w: WasteLog) => {
      if (!wasteByDate[w.date]) wasteByDate[w.date] = { kitchen: 0, plate: 0, total: 0 };
      wasteByDate[w.date].kitchen += w.kitchenQty || 0;
      wasteByDate[w.date].plate += w.plateQty || 0;
      wasteByDate[w.date].total += (w.kitchenQty || 0) + (w.plateQty || 0);
    });

    const spendAndWasteTrendData = Array.from({ length: 30 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (29 - i));
      const dateStr = d.toLocaleDateString('en-CA');
      
      const actualWaste = wasteByDate[dateStr]?.total;
      const baseSpend = 300 + Math.sin(i / 3) * 50 + (i * 5); 
      let wasteCost = 0;
      
      if (actualWaste !== undefined) {
          wasteCost = actualWaste * 2;
      } else {
          const wastePercent = 0.08 + Math.cos(i / 4) * 0.02 - (i * 0.001);
          wasteCost = Math.round(baseSpend * wastePercent);
      }
      
      return {
        date: `Day ${i + 1}`,
        spend: Math.round(baseSpend),
        wasteCost: Math.round(wasteCost),
      };
    });

    const categoryTotals: { [key: string]: { prep: number, waste: number } } = {
      'Produce': { prep: 100, waste: 20 },
      'Meat': { prep: 100, waste: 8 },
      'Dairy': { prep: 100, waste: 5 },
      'Dry Goods': { prep: 100, waste: 2 },
    };
    
    wasteLogs.forEach((w: WasteLog) => {
        const cat = w.itemName.toLowerCase().includes('chicken') ? 'Meat' :
                    w.itemName.toLowerCase().includes('milk') ? 'Dairy' :
                    w.itemName.toLowerCase().includes('rice') ? 'Dry Goods' : 'Produce';
        
        categoryTotals[cat].waste += (w.kitchenQty || 0) + (w.plateQty || 0);
    });

    const yieldWasteData = Object.keys(categoryTotals).map(category => {
      const wastePercent = Math.min(100, Math.round((categoryTotals[category].waste / categoryTotals[category].prep) * 100));
      return {
        category,
        yield: 100 - wastePercent,
        waste: wastePercent
      };
    });

    const totalKitchen = wasteLogs.reduce((sum: number, w: WasteLog) => sum + (w.kitchenQty || 0), 0);
    const totalPlate = wasteLogs.reduce((sum: number, w: WasteLog) => sum + (w.plateQty || 0), 0);
    const overallWaste = totalKitchen + totalPlate || 1; 
    
    const trimming = Math.round((totalKitchen * 0.6 / overallWaste) * 100);
    const overPrep = Math.round((totalKitchen * 0.4 / overallWaste) * 100);
    const plateWasteReason = Math.round((totalPlate / overallWaste) * 100);

    const wasteReasons = overallWaste > 1 ? [
      { reason: 'Trimming / Prep', percentage: trimming },
      { reason: 'Over-preparation', percentage: overPrep },
      { reason: 'Plate Waste (Spoilage/Unused)', percentage: plateWasteReason },
    ] : [
      { reason: 'Trimming / Prep', percentage: 45 },
      { reason: 'Over-preparation', percentage: 35 },
      { reason: 'Spoilage', percentage: 20 },
    ];

    const sparklineSpend = spendAndWasteTrendData.slice(-14).map((d, i) => ({ day: i, value: d.spend }));
    const sparklineWasteCost = spendAndWasteTrendData.slice(-14).map((d, i) => ({ day: i, value: d.wasteCost }));
    const sparklineWaste = spendAndWasteTrendData.slice(-14).map((d, i) => ({ day: i, value: d.wasteCost / 2 })); 
    const sparklineAccuracy = spendAndWasteTrendData.slice(-14).map((d, i) => ({ day: i, value: 85 + (d.spend % 10) }));
    
    const currentMonthSpend = spendAndWasteTrendData.slice(-30).reduce((sum, d) => sum + d.spend, 0);
    const currentMonthWasteCost = spendAndWasteTrendData.slice(-30).reduce((sum, d) => sum + d.wasteCost, 0);
    
    const supplierDeliveryData = [
      { week: 'W1', turnover: 4.2, onTime: 95 },
      { week: 'W2', turnover: 4.5, onTime: 92 },
      { week: 'W3', turnover: 4.8, onTime: 96 },
      { week: 'W4', turnover: 5.1, onTime: 98 },
    ];

    const consumptionSpikesData = [
      { day: 'Mon', breakfast: 120, lunch: 340, dinner: 280 },
      { day: 'Tue', breakfast: 130, lunch: 320, dinner: 290 },
      { day: 'Wed', breakfast: 110, lunch: 350, dinner: 310 },
      { day: 'Thu', breakfast: 140, lunch: 380, dinner: 330 },
      { day: 'Fri', breakfast: 100, lunch: 310, dinner: 250 },
      { day: 'Sat', breakfast: 90, lunch: 200, dinner: 180 },
      { day: 'Sun', breakfast: 85, lunch: 210, dinner: 190 },
    ];

    const predictiveForecastData = [
      { day: 'Mon', actual: 42 + Math.floor(optInCount * 0.2), predicted: 40 + Math.floor(optInCount * 0.2) },
      { day: 'Tue', actual: 38 + Math.floor(optInCount * 0.2), predicted: 42 + Math.floor(optInCount * 0.2) },
      { day: 'Wed', actual: 45 + Math.floor(optInCount * 0.2), predicted: 44 + Math.floor(optInCount * 0.2) },
      { day: 'Thu', actual: 50 + Math.floor(optInCount * 0.2), predicted: 52 + Math.floor(optInCount * 0.2) },
      { day: 'Fri', actual: 0, predicted: 48 + Math.floor(optInCount * 0.3) },
      { day: 'Sat', actual: 0, predicted: 30 + Math.floor(optInCount * 0.1) },
      { day: 'Sun', actual: 0, predicted: 32 + Math.floor(optInCount * 0.1) },
    ];

    const adjustments = [
      { item: 'Basmati Rice', action: 'Increase', amount: '10 kg', impact: '-$15/wk' },
      { item: 'Whole Milk', action: 'Cut', amount: '15 L', impact: '+$18/wk' },
      { item: 'Chicken Breast', action: 'Cut', amount: '8 kg', impact: '+$45/wk' },
      { item: 'Tomatoes', action: 'Increase', amount: '5 kg', impact: '-$12/wk' },
    ];

    return {
      spendAndWasteTrendData,
      yieldWasteData,
      wasteReasons,
      sparklineSpend,
      sparklineWasteCost,
      sparklineWaste,
      sparklineAccuracy,
      currentMonthSpend,
      currentMonthWasteCost,
      supplierDeliveryData,
      consumptionSpikesData,
      predictiveForecastData,
      adjustments
    };
  }, [wasteLogs, prepProgress, pastOrders, optInCount]);
}
