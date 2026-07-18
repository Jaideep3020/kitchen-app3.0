const fs = require('fs');
const path = require('path');
const p = path.resolve('src/contexts/DataContext.tsx');
let content = fs.readFileSync(p, 'utf8');

const missingMethods = `
  const [mealOptIns, setMealOptIns] = useState<{ [key: string]: number }>({});
  const [sharedConfig, setSharedConfig] = useState<any>({});
  const [recipes, setRecipes] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/rsvps/stats')
      .then(r => r.ok ? r.json() : {})
      .then(stats => {
        const optIns: any = {};
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        Object.keys(stats).forEach(key => {
          const [dateStr, mealType] = key.split('_');
          const dateObj = new Date(dateStr);
          const dayOfWeek = days[dateObj.getDay()];
          const dish = masterMenuItems.find(m => m.dayOfWeek === dayOfWeek && m.mealType === mealType && m.category.includes('main'));
          if (dish) {
            optIns[dish.id] = stats[key];
          }
        });
        setMealOptIns(optIns);
      })
      .catch(console.error);
  }, [masterMenuItems]);

  useEffect(() => {
    fetch('/api/recipes').then(r => r.ok ? r.json() : []).then(setRecipes).catch(console.error);
  }, []);

  useEffect(() => {
    fetch('/api/dashboard-config').then(r => r.ok ? r.json() : {}).then(c => setSharedConfig(c)).catch(console.error);
  }, []);

  const publishWeeklyMenu = async (weekStartDate: string) => {
    try {
      const res = await fetch('/api/weekly-menus/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weekStartDate })
      });
      if (!res.ok) throw new Error('Failed to publish');
      
      const published = await res.json();
      setWeeklyMenus(prev => {
        const others = prev.filter(m => m.weekStartDate !== weekStartDate);
        return [...others, published];
      });
      return true;
    } catch (err) {
      console.error(err);
      addToast('Failed to publish menu', 'error');
      return false;
    }
  };

  const updateSharedConfig = async (newConfig: any, userRole: string) => {
    try {
      const payload = {
        organizationId: 'default-org',
        config: newConfig,
        updatedBy: currentUserEmail,
        version: sharedConfig?.version || 1
      };
      const res = await fetch('/api/dashboard-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-user-role': userRole },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to update config');
      const updated = await res.json();
      setSharedConfig(updated);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const saveRecipe = async (menuItemId: string, ingredients: any[]) => {
    try {
      const res = await fetch('/api/recipes/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ menuItemId, ingredients })
      });
      if (!res.ok) throw new Error('Failed to save recipe');
      const { data } = await res.json();
      setRecipes(prev => {
        const others = prev.filter(r => r.menuItemId !== menuItemId);
        return [...others, ...data];
      });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  return (`;

content = content.replace(/\n\s*return \(\n\s*<DataContext\.Provider/, missingMethods + '\n    <DataContext.Provider');

fs.writeFileSync(p, content, 'utf8');
