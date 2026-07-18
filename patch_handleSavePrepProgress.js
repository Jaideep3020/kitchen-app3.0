const fs = require('fs');

const file = 'src/components/StaffOps.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `const handleSavePrepProgress = () => {
    triggerHaptic('success');
    const day = selectedDay || 'Thursday';
    setPrepProgress(prev => [...prev.filter((p: any) => p.day !== day), { day, portions: prepPortions }]);
    setNotification('Preparation tracker progress saved and synced successfully.');
    setTimeout(() => {
      setNotification('');
    }, 4000);
 };`;

const replacement = `const handleSavePrepProgress = () => {
    triggerHaptic('success');
    const day = selectedDay || 'Thursday';
    setPrepProgress(prev => [...prev.filter((p: any) => p.day !== day), { day, portions: prepPortions }]);
    
    // Deduct stock globally
    const deductions: { [key: string]: number } = {};
    const dishesForDay = INITIAL_MENU_ITEMS.filter(item => item.dayOfWeek === day);

    dishesForDay.forEach(dish => {
        const ingredients = DISH_INGREDIENTS[dish.id] || [];
        const portionCount = prepPortions[dish.id] || 200;
        ingredients.forEach(ingName => {
            const multiplier = INGREDIENT_MULTIPLIERS[ingName] || 0.05;
            const demandVal = portionCount * multiplier;
            deductions[ingName] = (deductions[ingName] || 0) + demandVal;
        });
    });

    setPrepItems(prev => prev.map(item => {
        if (deductions[item.name]) {
            const newStock = Math.max(0, item.currentStock - deductions[item.name]);
            let newStatus = item.status;
            if (newStock === 0) newStatus = 'Out';
            else if (newStock <= item.reorderLevel) newStatus = 'Low';
            return { ...item, currentStock: newStock, status: newStatus };
        }
        return item;
    }));

    setNotification('Preparation tracker progress saved and synced successfully.');
    setTimeout(() => {
      setNotification('');
    }, 4000);
 };`;

content = content.replace(target, replacement);
fs.writeFileSync(file, content, 'utf8');
console.log("Patched");
