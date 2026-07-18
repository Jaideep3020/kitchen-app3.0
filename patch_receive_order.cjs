const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldHandle = `  const handleReceiveOrder = (orderId: string) => {
    setActiveOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: 'Received' } : order
    ));
    
    // Attempt backend sync
    fetch('/api/deliveries/receive', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: orderId, receivedItems: [] })
    })
    .then(res => {
      if (res.ok) addToast('Order received successfully', 'success');
      else addToast('Failed to receive order', 'error');
    })
    .catch(err => {
      console.error(err);
      addToast('Network error', 'error');
    });
  };`;

const newHandle = `  const handleReceiveOrder = (orderId: string) => {
    setActiveOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: 'Received' } : order
    ));
    addToast('Order received successfully', 'success');
  };`;

code = code.replace(oldHandle, newHandle);

fs.writeFileSync('src/App.tsx', code);
