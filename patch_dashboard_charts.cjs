const fs = require('fs');
let content = fs.readFileSync('src/components/StaffDashboard.tsx', 'utf8');

// 1. Remove the old dashboardChartData useMemo block
const oldChartDataStart = "  const dashboardChartData = useMemo(() => {";
const oldChartDataEnd = "  }, [prepProgress, wasteLogs, selectedDate, selectedDay]);\n";

if (content.includes(oldChartDataStart)) {
  const startIndex = content.indexOf(oldChartDataStart);
  const endIndex = content.indexOf(oldChartDataEnd) + oldChartDataEnd.length;
  content = content.substring(0, startIndex) + content.substring(endIndex);
}

// 2. Destructure dashboardChartData from useDashboardMetrics
content = content.replace(
  "chartData\n  } = useDashboardMetrics(selectedDate,",
  "chartData,\n    dashboardChartData\n  } = useDashboardMetrics(selectedDate,"
);

fs.writeFileSync('src/components/StaffDashboard.tsx', content, 'utf8');
