const fs = require('fs');
let code = fs.readFileSync('src/components/StaffOps.tsx', 'utf8');

code = code.replace(
  "const percentage = Math.min(100, Math.round((item.currentStock / item.targetStock) * 100));",
  `const percentage = Math.min(100, Math.round((item.currentStock / item.targetStock) * 100));
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
       const match = eta.match(/\\d+/);
       if (match) days = parseInt(match[0], 10);
    }
    if (days < nextDeliveryDays) {
       nextDeliveryDays = days;
       nextDeliveryEtaText = o.eta;
    }
 });
 const runsOutBeforeDelivery = daysRemaining < nextDeliveryDays && nextDeliveryDays !== Infinity;`
);

fs.writeFileSync('src/components/StaffOps.tsx', code);
