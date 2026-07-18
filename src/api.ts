import { InventoryItem, ActiveOrder, ActivityLog } from './types';

export const fetchInventory = async (): Promise<InventoryItem[]> => {
  const res = await fetch('/api/inventory');
  if (!res.ok) throw new Error('Failed to fetch inventory');
  return res.json();
};

export const updateInventory = async (item: InventoryItem): Promise<void> => {
  const res = await fetch(`/api/inventory/${item.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item)
  });
  if (!res.ok) throw new Error('Failed to update inventory');
};

export const fetchActiveOrders = async (): Promise<ActiveOrder[]> => {
  const res = await fetch('/api/active-orders');
  if (!res.ok) throw new Error('Failed to fetch active orders');
  return res.json();
};

export const updateActiveOrder = async (order: ActiveOrder): Promise<void> => {
  const res = await fetch(`/api/active-orders/${order.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order)
  });
  if (!res.ok) throw new Error('Failed to update active order');
};

export const fetchActivityLogs = async (): Promise<ActivityLog[]> => {
  const res = await fetch('/api/activity-logs');
  if (!res.ok) throw new Error('Failed to fetch activity logs');
  return res.json();
};

export const reportIssue = async (issueData: any): Promise<void> => {
  const res = await fetch('/api/issues', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(issueData)
  });
  if (!res.ok) throw new Error('Failed to report issue');
};

export const updateSupplier = async (supplier: any): Promise<void> => {
  const id = supplier.id;
  const res = await fetch(`/api/suppliers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(supplier)
  });
  if (!res.ok) throw new Error('Failed to update supplier');
};
