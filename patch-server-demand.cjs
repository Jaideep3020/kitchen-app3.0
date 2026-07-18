const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const endpoints = `
app.get('/api/demand-prediction', async (req, res) => {
  try {
    const allHeadcounts = await db.select().from(mealHeadcounts);
    const allRsvps = await db.select().from(rsvps);
    
    // We will generate predictions for the next 7 days
    const today = new Date('2026-07-28'); // using our test current date
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    const results = [];
    
    for (let i = 0; i < 7; i++) {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + i);
      const targetDateStr = targetDate.toISOString().split('T')[0];
      const targetDayName = days[targetDate.getDay()];
      
      // Historical average for this day-of-week over last 4 weeks
      let sum = 0;
      let count = 0;
      for (let j = 1; j <= 4; j++) {
        const pastDate = new Date(targetDate);
        pastDate.setDate(targetDate.getDate() - (j * 7));
        const pastDateStr = pastDate.toISOString().split('T')[0];
        
        const hcs = allHeadcounts.filter(h => String(h.date) === pastDateStr);
        for (const hc of hcs) {
          sum += Number(hc.servedCount);
          count++;
        }
      }
      
      const historicalAverage = count > 0 ? sum / count : 100; // fallback to 100 if no data
      
      // RSVP count for target date
      const upcomingRsvps = allRsvps.filter(r => String(r.date) === targetDateStr && r.attending === true).length;
      
      // Blend: 40% historical + 60% RSVP
      const predicted = Math.round((historicalAverage * 0.4) + (upcomingRsvps * 0.6));
      
      results.push({
        day: targetDayName,
        date: targetDateStr,
        historicalAverage,
        upcomingRsvps,
        predicted
      });
    }
    
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Failed' });
  }
});
`;

content = content.replace('// Recipes', endpoints + '\n// Recipes');
fs.writeFileSync('server.ts', content);
