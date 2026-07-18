const fs = require('fs');
let content = fs.readFileSync('src/components/StaffOps.tsx', 'utf8');

const fetchRsvps = `
  const [dishRsvps, setDishRsvps] = useState<{ [key: string]: number }>({});
  React.useEffect(() => {
    const day = selectedDay || 'Thursday';
    const date = getPrepDate(day);
    fetch('/api/dish-rsvps?date=' + date)
      .then(res => res.json())
      .then(data => {
        setDishRsvps(data);
      }).catch(console.error);
  }, [selectedDay, activeWeekStartDate]);
`;

content = content.replace("  const [actualQtyCooked, setActualQtyCooked] = useState<{ [key: string]: string }>({});", "  const [actualQtyCooked, setActualQtyCooked] = useState<{ [key: string]: string }>({});" + fetchRsvps);

// Replace default 200 with dishRsvps
content = content.replace(/const portionCount = prepPortions\[dish\.id\] \|\| 200;/g, "const portionCount = dishRsvps[dish.id] || 0;");
content = content.replace(/const currentPortions = prepPortions\[portionKey\] \|\| 200;/g, "const currentPortions = dishRsvps[portionKey] || 0;");

// Update the sliders to be disabled or just remove the slider
const sliderSection = `<input \n                  type="range"`;
// We will leave the slider but make it bound to currentPortions, or make it readonly? 
// The prompt says "Replace any remaining static/hardcoded prep quantities in StaffOps with this calculated value — the prep sheet should show the live, computed requirement, not a fixed number."
// So the slider is no longer needed since the requirement is calculated!
// Let's replace the whole portion control div:
const oldPortionControl = `<div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Target Portions: <span className="font-bold text-[#16321F] dark:text-[#D9E96B]">{currentPortions}</span>
                </span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="500" 
                step="10"
                value={currentPortions}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setPrepPortions(prev => ({ ...prev, [portionKey]: val }));
                }}
                className="w-full accent-[#16321F] dark:accent-[#D9E96B] h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mb-6"
              />`;

const newPortionControl = `<div className="flex items-center justify-between mb-6">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Target Portions (from RSVPs): <span className="font-bold text-[#16321F] dark:text-[#D9E96B]">{currentPortions}</span>
                </span>
              </div>`;

content = content.replace(oldPortionControl, newPortionControl);
fs.writeFileSync('src/components/StaffOps.tsx', content);
