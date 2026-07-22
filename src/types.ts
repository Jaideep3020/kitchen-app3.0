export type Role = 'student' | 'staff' | 'manager' | null;

export type StudentTab = 'menu' | 'checkin' | 'profile';
export type StaffTab = 'dashboard' | 'ops' | 'stock' | 'reports' | 'launch' | 'management' | 'settings';

export interface MenuItem {
  id: string;
  name: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  category: 'main' | 'vegetarian_main' | 'side' | 'staple' | 'sweet';
  description: string;
  calories: number;
  tags: string[];
  image: string;
  inStock: boolean;
  dayOfWeek?: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'grains_lentils' | 'proteins_dairy' | 'vegetables' | 'spices_condiments';
  unit: string;
  currentStock: number;
  targetStock: number; // e.g. 35kg target
  reorderLevel: number;
  status: 'In Stock' | 'Low' | 'Out';
  supplierId?: string;
}

export interface WasteLogEntry {
  id: string;
  itemName: string;
  kitchenQty: number; // in kg or L
  plateQty: number; // in kg or L
}

export interface Supplier {
  id: string;
  name: string;
  category?: string;
  email?: string;
  phone?: string;
  distance?: string;
  leadTime?: string;
  items: { name: string; status: 'In Stock' | 'Low Stock' | 'Out' }[];
  correspondence?: { id: string, date: string, type: 'Call' | 'Email', notes: string }[];
  attentionNeeded: string | null;
  criticalMessage: string | null;
  statusText: string;
}

export interface ActiveOrder {
  id: string;
  supplierName: string;
  eta: string;
  status: 'Draft' | 'Placed' | 'In Transit' | 'Received';
  routeMap?: string;
  supplierId?: string;
  item?: string;
  quantity?: number;
  receivedQuantity?: number;
  price?: number;
  date?: string;
}

export interface ActivityLog {
  id: string;
  title: string;
  timeAgo: string;
  description: string;
  type: 'waste' | 'delivery' | 'prep' | 'order';
}


export interface PastOrder {
  id: string;
  invoiceNo: string;
  supplierName: string;
  amount: number;
  date: string;
}

export interface EfficiencyRecord {
  shift: string;
  manager: string;
  accuracy: number;
  trend: number; // e.g. +1.2, 0.0, -2.4
  badge: string;
}
export interface WasteLog extends WasteLogEntry {
  date: string;
  day: string;
}

export interface PrepProgress {
  day: string;
  portions: { [key: string]: number };
}

export interface PlateWasteThreshold {
  menuItemId: string;
  itemName: string;
  threshold: number; // in kg
}

export interface ThresholdAlert {
  id: string;
  menuItemId: string;
  itemName: string;
  thresholdValue: number; // in kg
  actualValue: number; // in kg
  type: 'single' | 'cumulative';
  date: string;
  time: string;
  status: 'active' | 'dismissed' | 'resolved';
}
export interface UserAccount {
  id?: string;
  name: string;
  email: string;
  role: 'manager' | 'staff' | 'student';
  orgId: string;
  password?: string;
}
