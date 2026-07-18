const http = require('http');

function request(method, path, body, headers = {}) {
  return new Promise(resolve => {
    const data = JSON.stringify(body);
    const req = http.request('http://localhost:3000' + path, {
      method,
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data), ...headers }
    }, res => {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => resolve({ status: res.statusCode, body: b }));
    });
    if (body) req.write(data);
    req.end();
  });
}

function get(path) {
  return new Promise(resolve => {
    http.get('http://localhost:3000' + path, res => {
      let b = ''; res.on('data', c => b += c);
      res.on('end', () => resolve(JSON.parse(b)));
    });
  });
}

async function run() {
  console.log("=== STEP 13.4: Receiving Checklist Walkthrough ===");
  
  // 1. Create a test PO
  console.log("\\n1. Creating test PO (ID: po_walkthrough_1, Qty: 100 kg Tomatoes)...");
  await request('POST', '/api/active-orders', {
    id: 'po_walkthrough_1',
    supplierName: 'Krishna Fresh Vegetable Suppliers',
    eta: 'Today',
    status: 'In Transit',
    item: 'Tomatoes',
    quantity: 100,
    price: 2500,
    date: '2026-07-18'
  });
  
  // 2. Simulate User clicking "Short Delivery" and "Confirm" with a note
  console.log("\\n2. Simulating User opening modal, selecting 'Short Delivery', adding note 'Only received 80kg', and confirming...");
  const orderObj = (await get('/api/active-orders')).find(o => o.id === 'po_walkthrough_1');
  
  // 2a. PUT to /api/active-orders/id (frontend logic for short delivery: receivedQty = 80)
  await request('PUT', `/api/active-orders/${orderObj.id}`, {
    ...orderObj,
    status: 'Received',
    receivedQuantity: 80
  });
  
  // 2b. POST to /api/issues (frontend logic for reportIssueMutation)
  await request('POST', '/api/issues', {
    itemName: orderObj.item || orderObj.id,
    type: 'Quantity',
    description: 'Only received 80kg',
    category: 'Ingredient'
  });
  
  // 3. Query the database directly for the PO status/received-quantity fields
  console.log("\\n3. Querying database directly for the PO...");
  const updatedOrders = await get('/api/active-orders');
  const targetOrder = updatedOrders.find(o => o.id === 'po_walkthrough_1');
  console.log(`PO ID: ${targetOrder.id}`);
  console.log(`Original Quantity: ${targetOrder.quantity}`);
  console.log(`Status: ${targetOrder.status}`);
  console.log(`Received Quantity: ${targetOrder.receivedQuantity}`);
  
  // 4. Query the database directly for the Issue Tracker table
  console.log("\\n4. Querying database directly for the linked Issue Record...");
  const issues = await get('/api/issues');
  const targetIssue = issues.find(i => i.itemName === 'Tomatoes' && i.description === 'Only received 80kg');
  console.log(`Issue Item Name: ${targetIssue.itemName}`);
  console.log(`Issue Type: ${targetIssue.type}`);
  console.log(`Issue Description: ${targetIssue.description}`);
  console.log(`Issue Category: ${targetIssue.category}`);
  console.log(`Issue Status: ${targetIssue.status}`);
  
}
run();
