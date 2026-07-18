const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const oldEndpoint = `app.post('/api/rsvps', async (req, res) => {
  try {
    const { email, date, mealType, attending, choice, dishId } = req.body;
    if (!email || !date || !mealType) {
      return res.status(400).json({ error: 'email, date, and mealType are required' });
    }
    
    let user = await db.select().from(users).where(eq(users.email, email)).then(rows => rows[0]);
    if (!user) {
      const inserted = await db.insert(users).values({ uid: email, email, role: 'student' }).returning();
      user = inserted[0];
    }
    const studentId = user.id;

    await db.delete(rsvps).where(sql\`\${rsvps.studentId} = \${studentId} AND \${rsvps.date} = \${date} AND \${rsvps.mealType} = \${mealType}\`);
    
    if (attending) {
      const result = await db.insert(rsvps).values({
        studentId,
        date,
        mealType,
        attending,
        choice: choice || dishId
      }).returning();
      res.json({ success: true, data: result[0] });
    } else {
      res.json({ success: true, data: null });
    }
  } catch (err) {
    logEvent('ERROR', \`Failed to submit RSVP: \${err}\`);
    res.status(500).json({ error: 'Failed to submit RSVP' });
  }
});`;

const newEndpoint = `app.post('/api/rsvps', async (req, res) => {
  try {
    const { email, date, mealType, attending, choice, dishId } = req.body;
    if (!email || !date || !mealType) {
      return res.status(400).json({ error: 'email, date, and mealType are required' });
    }
    
    // Server-side cutoff check
    const orgId = 'default-org';
    const configList = await db.select().from(dashboardConfigs).where(eq(dashboardConfigs.organizationId, orgId));
    let cutoffEnforced = false;
    if (configList.length > 0 && configList[0].config?.cutoffExempted) {
      cutoffEnforced = true;
    }
    
    const now = new Date();
    // Parse target date assuming YYYY-MM-DD
    const [y, m, d] = date.split('-');
    const targetDate = new Date(parseInt(y), parseInt(m)-1, parseInt(d));
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    const currentHour = now.getHours();
    
    let locked = false;
    let reason = '';
    
    if (diffDays < 0) {
      locked = true;
      reason = 'This date is in the past.';
    } else if (diffDays === 0) {
      if (cutoffEnforced) {
        locked = true;
        reason = 'RSVP closed (cutoff is enforced today).';
      }
    } else if (diffDays === 1) {
      if (currentHour >= 21) {
        locked = true;
        reason = 'Locked: passed 9 PM cutoff night prior.';
      }
    }
    
    if (locked) {
      return res.status(403).json({ error: reason });
    }
    
    let user = await db.select().from(users).where(eq(users.email, email)).then(rows => rows[0]);
    if (!user) {
      const inserted = await db.insert(users).values({ uid: email, email, role: 'student' }).returning();
      user = inserted[0];
    }
    const studentId = user.id;

    await db.delete(rsvps).where(sql\`\${rsvps.studentId} = \${studentId} AND \${rsvps.date} = \${date} AND \${rsvps.mealType} = \${mealType}\`);
    
    if (attending) {
      const result = await db.insert(rsvps).values({
        studentId,
        date,
        mealType,
        attending,
        choice: choice || dishId
      }).returning();
      res.json({ success: true, data: result[0] });
    } else {
      res.json({ success: true, data: null });
    }
  } catch (err) {
    logEvent('ERROR', \`Failed to submit RSVP: \${err}\`);
    res.status(500).json({ error: 'Failed to submit RSVP' });
  }
});`;

content = content.replace(oldEndpoint, newEndpoint);
fs.writeFileSync('server.ts', content, 'utf8');
