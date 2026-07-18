const fs = require('fs');
let content = fs.readFileSync('src/components/StaffReports.tsx', 'utf8');

const fetchLogic = `
  const [realForecast, setRealForecast] = useState([]);
  const [realInsights, setRealInsights] = useState([]);
  const [expiryInsights, setExpiryInsights] = useState(null);
  
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
      
    fetch('/api/expiry-insights')
      .then(res => res.json())
      .then(data => setExpiryInsights(data))
      .catch(console.error);
  }, []);
`;

content = content.replace(
  /const \[realForecast, setRealForecast\] = useState\(\[\]\);\n  const \[realInsights, setRealInsights\] = useState\(\[\]\);\n  \n  React\.useEffect\(\(\) => \{[\s\S]*?\}, \[\]\);/,
  fetchLogic
);

const oldInsightUi = `{realInsights.length > 0 ? (
                    realInsights.map((insight, idx) => (
                      <div key={idx} className="bg-emerald-50 dark:bg-[#16321F]/20 p-4 border-l-4 border-[#16321F] dark:border-[#D9E96B] flex gap-3">
                        <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-emerald-800 dark:text-emerald-300"><strong>{insight.dishName}:</strong> {insight.insight}</p>
                          <p className="text-xs text-emerald-700/70 dark:text-emerald-400/70 mt-1">{insight.reason}</p>
                        </div>
                      </div>
                    ))
                  ) : (`;

const newInsightUi = `{expiryInsights && expiryInsights.unused.map((item, idx) => (
                    <div key={'exp-'+idx} className="bg-amber-50 dark:bg-amber-900/20 p-4 border-l-4 border-amber-500 flex gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-amber-800 dark:text-amber-300"><strong>Stock Readiness Flag:</strong> {item.name} expires on {new Date(item.expiryDate).toLocaleDateString()}, but is not used in any published menu over the next 7 days.</p>
                        <p className="text-xs text-amber-700/70 dark:text-amber-400/70 mt-1">Consider swapping an upcoming menu item or reducing order volumes.</p>
                      </div>
                    </div>
                  ))}
                  {realInsights.length > 0 ? (
                    realInsights.map((insight, idx) => (
                      <div key={idx} className="bg-emerald-50 dark:bg-[#16321F]/20 p-4 border-l-4 border-[#16321F] dark:border-[#D9E96B] flex gap-3">
                        <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-emerald-800 dark:text-emerald-300"><strong>{insight.dishName}:</strong> {insight.insight}</p>
                          <p className="text-xs text-emerald-700/70 dark:text-emerald-400/70 mt-1">{insight.reason}</p>
                        </div>
                      </div>
                    ))
                  ) : (`;

content = content.replace(oldInsightUi, newInsightUi);

fs.writeFileSync('src/components/StaffReports.tsx', content);
