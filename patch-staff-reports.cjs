const fs = require('fs');
let content = fs.readFileSync('src/components/StaffReports.tsx', 'utf8');

// 1. Add fetching logic for both endpoints
const fetchLogic = `
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
`;

content = content.replace(
  'const { spendAndWasteTrendData',
  fetchLogic + '\n  const { spendAndWasteTrendData'
);

// 2. Replace predictiveForecastData with realForecast
// Find where predictiveForecastData is passed to ComposedChart
content = content.replace(
  '<ComposedChart data={predictiveForecastData}',
  '<ComposedChart data={realForecast.length > 0 ? realForecast : predictiveForecastData}'
);
content = content.replace(
  'predictiveForecastData.map((row, i) =>',
  '(realForecast.length > 0 ? realForecast : predictiveForecastData).map((row, i) =>'
);

// 3. Replace Smart Suggestions UI
// Currently: 
// <div className="bg-emerald-50 dark:bg-[#16321F]/20 p-4 border-l-4 border-[#16321F] dark:border-[#D9E96B] flex gap-3">
// <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
// <div>
//   <p className="text-sm text-emerald-800 dark:text-emerald-300"><strong>AI Insight:</strong> Upcoming weekend forecasts suggest a 20% drop in overall demand; adjust bulk orders accordingly.</p>
// </div>

const oldInsight = `<div className="bg-emerald-50 dark:bg-[#16321F]/20 p-4 border-l-4 border-[#16321F] dark:border-[#D9E96B] flex gap-3">
                  <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-emerald-800 dark:text-emerald-300"><strong>AI Insight:</strong> Upcoming weekend forecasts suggest a 20% drop in overall demand; adjust bulk orders accordingly.</p>
                  </div>
                </div>`;

const newInsight = `<div className="space-y-2">
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
                  ) : (
                    <div className="bg-emerald-50 dark:bg-[#16321F]/20 p-4 border-l-4 border-[#16321F] dark:border-[#D9E96B] flex gap-3">
                      <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-emerald-800 dark:text-emerald-300"><strong>AI Insight:</strong> Sufficient data not yet available for over-production insights.</p>
                      </div>
                    </div>
                  )}
                </div>`;

content = content.replace(oldInsight, newInsight);
fs.writeFileSync('src/components/StaffReports.tsx', content);
