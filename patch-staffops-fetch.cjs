const fs = require('fs');
const content = fs.readFileSync('src/components/StaffOps.tsx', 'utf8');

const injection = `
  const [actualQtyCooked, setActualQtyCooked] = useState<{ [key: string]: string }>({});
  
  const getPrepDate = (dayName: string) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const base = new Date(activeWeekStartDate);
    const targetIdx = days.indexOf(dayName);
    const baseIdx = base.getDay();
    const diff = targetIdx - baseIdx;
    base.setDate(base.getDate() + diff);
    return base.toISOString().split('T')[0];
  };

  React.useEffect(() => {
    const day = selectedDay || 'Thursday';
    const date = getPrepDate(day);
    fetch('/api/prep-logs?date=' + date)
      .then(res => res.json())
      .then(data => {
        const qtys: any = {};
        if (Array.isArray(data)) {
          data.forEach(log => {
            qtys[log.menuItemId] = log.actualQtyCooked;
          });
        }
        setActualQtyCooked(qtys);
      }).catch(console.error);
  }, [selectedDay, activeWeekStartDate]);
`;

fs.writeFileSync('src/components/StaffOps.tsx', content.replace(
  /const categoryLabels: Record<CategoryType, string> = {/,
  injection + '\n  const categoryLabels: Record<CategoryType, string> = {'
), 'utf8');
