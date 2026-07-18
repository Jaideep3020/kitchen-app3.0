import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');

const sseCode = `
// SSE mechanism
let sseClients = [];

app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  sseClients.push(res);

  req.on('close', () => {
    sseClients = sseClients.filter(client => client !== res);
  });
});

const broadcastEvent = (event, data) => {
  sseClients.forEach(client => {
    client.write(\`event: \${event}\\n\`);
    client.write(\`data: \${JSON.stringify(data)}\\n\\n\`);
  });
};
`;

code = code.replace(/app\.get\('\/api\/inventory',/g, sseCode + "\napp.get('/api/inventory',");

// Update broadcast for inventory updates
code = code.replace(/cache\.del\('inventory'\);/g, "cache.del('inventory');\n    broadcastEvent('inventory-updated', {});");

fs.writeFileSync('server.ts', code);
console.log("Successfully patched server.ts with SSE");
