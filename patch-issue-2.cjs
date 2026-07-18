const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

// Replace: const predicted = Math.round((historicalAverage * 0.4) + (upcomingRsvps * 0.6));
// With:    const predicted = Math.round((historicalAverage * 0.4) + (upcomingRsvps * 0.6));
//          const rawPredicted = (historicalAverage * 0.4) + (upcomingRsvps * 0.6);
// And add rawPredicted to the result object

content = content.replace(
  'const predicted = Math.round((historicalAverage * 0.4) + (upcomingRsvps * 0.6));',
  'const rawPredicted = (historicalAverage * 0.4) + (upcomingRsvps * 0.6);\n      const predicted = Math.round(rawPredicted);'
);

content = content.replace(
  'upcomingRsvps,\n        predicted',
  'upcomingRsvps,\n        predicted,\n        rawPredicted'
);

fs.writeFileSync('server.ts', content);
