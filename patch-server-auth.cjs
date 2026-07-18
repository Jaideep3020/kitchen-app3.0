const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

// Add bcrypt import
if (!content.includes("import bcrypt")) {
  content = content.replace("import express", "import express\nimport bcrypt from 'bcrypt';");
}

const authEndpoints = `
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Check if user exists
    const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    
    const passwordHash = await bcrypt.hash(password, 10);
    const uid = 'usr_' + Date.now().toString() + Math.random().toString(36).substring(2, 7);
    
    const result = await db.insert(users).values({
      uid,
      name,
      email,
      role,
      passwordHash
    }).returning();
    
    logEvent('AUTH', \`Signed up new \${role}: \${email}\`);
    // Omit password hash in response
    const { passwordHash: _, ...userWithoutPassword } = result[0];
    res.json(userWithoutPassword);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }
    
    const userResult = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (userResult.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = userResult[0];
    if (!user.passwordHash) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    logEvent('AUTH', \`Logged in \${user.role}: \${email}\`);
    const { passwordHash: _, ...userWithoutPassword } = user;
    res.json({ token: 'mock-jwt-token', user: userWithoutPassword });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
`;

if (!content.includes('/api/auth/signup')) {
  // insert before the health route or some other api
  content = content.replace("app.get('/api/health'", authEndpoints + "\napp.get('/api/health'");
}

fs.writeFileSync('server.ts', content);
