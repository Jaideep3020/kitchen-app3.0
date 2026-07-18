import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem, InventoryItem, Supplier, ActiveOrder, ActivityLog, PastOrder, WasteLog, PrepProgress, PlateWasteThreshold, ThresholdAlert } from '../types';
import { useToast } from './ToastContext';
import { 
  INITIAL_PREP_ITEMS, 
  INITIAL_ACTIVE_ORDERS, 
  INITIAL_SUPPLIERS, 
  INITIAL_ACTIVITY_LOGS 
} from '../data';

import { UserAccount } from "../types";
import { DUMMY_USERS } from "../lib/dummyUsers";

interface DataContextType {
  users: UserAccount[];
  setUsers: React.Dispatch<React.SetStateAction<UserAccount[]>>;
  menuItems: MenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  masterMenuItems: MenuItem[];
  setMasterMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  weeklyMenus: any[];
  setWeeklyMenus: React.Dispatch<React.SetStateAction<any[]>>;
  menuSlots: any[];
  setMenuSlots: React.Dispatch<React.SetStateAction<any[]>>;
  activeWeekStartDate: string;
  setActiveWeekStartDate: React.Dispatch<React.SetStateAction<string>>;
  publishWeeklyMenu: (weekStartDate: string) => Promise<boolean>;
  prepItems: InventoryItem[];
  setPrepItems: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  suppliers: Supplier[];
  setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>;
  activeOrders: ActiveOrder[];
  setActiveOrders: React.Dispatch<React.SetStateAction<ActiveOrder[]>>;
  activityLogs: ActivityLog[];
  setActivityLogs: React.Dispatch<React.SetStateAction<ActivityLog[]>>;
  pastOrders: PastOrder[];
  setPastOrders: React.Dispatch<React.SetStateAction<PastOrder[]>>;
  wasteLogs: WasteLog[];
  setWasteLogs: React.Dispatch<React.SetStateAction<WasteLog[]>>;
  prepProgress: PrepProgress[];
  setPrepProgress: React.Dispatch<React.SetStateAction<PrepProgress[]>>;
  plateWasteThresholds: PlateWasteThreshold[];
  setPlateWasteThresholds: React.Dispatch<React.SetStateAction<PlateWasteThreshold[]>>;
  thresholdAlerts: ThresholdAlert[];
  setThresholdAlerts: React.Dispatch<React.SetStateAction<ThresholdAlert[]>>;
  studentChoices: { [key: string]: any };
  setStudentChoices: (value: React.SetStateAction<{ [key: string]: any }>) => void;
  mealOptIns: { [key: string]: number };
  setMealOptIns: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
  currentUserEmail: string;
  setCurrentUserEmail: (email: string) => void;
  allStudentChoices: { [email: string]: { [key: string]: any } };
  setAllStudentChoices: React.Dispatch<React.SetStateAction<{ [email: string]: { [key: string]: any } }>>;
  sharedConfig: any;
  setSharedConfig: React.Dispatch<React.SetStateAction<any>>;
  updateSharedConfig: (newConfig: any, userRole: string) => Promise<boolean>;
  recipes: any[];
  setRecipes: React.Dispatch<React.SetStateAction<any[]>>;
  saveRecipe: (menuItemId: string, ingredients: any[]) => Promise<boolean>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { addToast } = useToast();
  const [users, setUsers] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem("sync_users");
    return saved ? JSON.parse(saved) : (DUMMY_USERS as UserAccount[]);
  });
  const [masterMenuItems, setMasterMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('sync_masterMenuItems');
    if (saved) return JSON.parse(saved);
    const savedOld = localStorage.getItem('sync_menuItems');
    return savedOld ? JSON.parse(savedOld) : [];
  });
  const [weeklyMenus, setWeeklyMenus] = useState<any[]>(() => {
    const saved = localStorage.getItem('sync_weeklyMenus');
    return saved ? JSON.parse(saved) : [];
  });
  const [menuSlots, setMenuSlots] = useState<any[]>(() => {
    const saved = localStorage.getItem('sync_menuSlots');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeWeekStartDate, setActiveWeekStartDate] = useState<string>(() => {
    const saved = localStorage.getItem('sync_activeWeekStartDate');
    if (saved) return saved;
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    return monday.toISOString().split('T')[0];
  });

  const menuItems = React.useMemo(() => {
    const activeWeeklyMenu = weeklyMenus.find(
      m => m.weekStartDate === activeWeekStartDate && m.status === 'published'
    );
    if (!activeWeeklyMenu) {
      return masterMenuItems;
    }
    const slots = menuSlots.filter(s => s.weeklyMenuId === activeWeeklyMenu.id);
    if (slots.length === 0) {
      return masterMenuItems;
    }
    return slots.map(slot => {
      const dish = masterMenuItems.find(m => String(m.id) === String(slot.menuItemId));
      if (dish) {
        return {
          ...dish,
          dayOfWeek: slot.dayOfWeek,
          mealType: slot.mealType,
        };
      }
      return null;
    }).filter(Boolean) as MenuItem[];
  }, [masterMenuItems, weeklyMenus, menuSlots, activeWeekStartDate]);

  const setMenuItems = React.useCallback((action: React.SetStateAction<MenuItem[]>) => {
    setMasterMenuItems(prev => {
      const resolved = typeof action === 'function' ? action(prev) : action;
      return resolved;
    });
  }, []);

  const [prepItems, setPrepItems] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('sync_prepItems');
    return saved ? JSON.parse(saved) : INITIAL_PREP_ITEMS;
  });
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem('sync_suppliers');
    return saved ? JSON.parse(saved) : INITIAL_SUPPLIERS;
  });
  const [activeOrders, setActiveOrders] = useState<ActiveOrder[]>(() => {
    const saved = localStorage.getItem('sync_activeOrders');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVE_ORDERS;
  });
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('sync_activityLogs');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_LOGS;
  });
  const [pastOrders, setPastOrders] = useState<PastOrder[]>(() => {
    const saved = localStorage.getItem('sync_pastOrders');
    return saved ? JSON.parse(saved) : [];
  });
  const [wasteLogs, setWasteLogs] = useState<WasteLog[]>(() => {
    const saved = localStorage.getItem('sync_wasteLogs');
    return saved ? JSON.parse(saved) : [];
  });
  const [prepProgress, setPrepProgress] = useState<PrepProgress[]>(() => {
    const saved = localStorage.getItem('sync_prepProgress');
    return saved ? JSON.parse(saved) : [];
  });
  const [plateWasteThresholds, setPlateWasteThresholds] = useState<PlateWasteThreshold[]>(() => {
    const saved = localStorage.getItem('sync_plateWasteThresholds');
    return saved ? JSON.parse(saved) : [];
  });
  const [thresholdAlerts, setThresholdAlerts] = useState<ThresholdAlert[]>(() => {
    const saved = localStorage.getItem('sync_thresholdAlerts');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentUserEmail, setCurrentUserEmail] = useState<string>(() => {
    return localStorage.getItem('sync_currentUserEmail') || 'student@kitchenops.edu';
  });

  const [allStudentChoices, setAllStudentChoices] = useState<{ [email: string]: { [key: string]: any } }>(() => {
    const saved = localStorage.getItem('sync_allStudentChoices');
    if (saved) return JSON.parse(saved);
    return {
      'student@kitchenops.edu': {
        'thu_bf': true,
        'thu_lh': true,
      }
    };
  });

  const studentChoices = allStudentChoices[currentUserEmail] || {};

  const setStudentChoices = (
    value: React.SetStateAction<{ [key: string]: any }>
  ) => {
    setAllStudentChoices(prev => {
      const currentChoices = prev[currentUserEmail] || {};
      const nextChoices = typeof value === 'function' ? value(currentChoices) : value;
      return {
        ...prev,
        [currentUserEmail]: nextChoices
      };
    });
  };

  const baselineOptIns = React.useMemo(() => {
    const initial: { [key: string]: number } = {};
    masterMenuItems.forEach(item => {
      const hash = item.id.split('_').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      initial[item.id] = 130 + (hash % 40);
    });
    return initial;
  }, [masterMenuItems]);

  const [mealOptIns, setMealOptIns] = useState<{ [key: string]: number }>(() => {
    const saved = localStorage.getItem('sync_mealOptIns');
    if (saved) return JSON.parse(saved);
    return baselineOptIns;
  });

  const [sharedConfig, setSharedConfig] = useState<any>(null);
  const [recipes, setRecipes] = useState<any[]>(() => {
    const saved = localStorage.getItem('sync_recipes');
    return saved ? JSON.parse(saved) : [];
  });

  // Synchronize dashboard_config with the backend via HTTP + SSE
  useEffect(() => {
    let active = true;

    // 1. Initial fetch with retry support
    const fetchInitialConfig = async (retries = 3, delay = 1000) => {
      try {
        const res = await fetch('/api/dashboard-config?organizationId=default-org');
        if (res.ok && active) {
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const data = await res.json();
            setSharedConfig(data);
            return;
          }
        }
        
        if (retries > 0 && active) {
          console.warn(`Dashboard config fetch failed or returned non-JSON. Retrying in ${delay}ms... (${retries} retries left)`);
          setTimeout(() => fetchInitialConfig(retries - 1, delay * 1.5), delay);
        }
      } catch (err) {
        console.error('Failed to load initial shared dashboard config', err);
        if (retries > 0 && active) {
          setTimeout(() => fetchInitialConfig(retries - 1, delay * 1.5), delay);
        }
      }
    };
    fetchInitialConfig();

    // 2. SSE subscription for real-time propagation
    const eventSource = new EventSource('/api/dashboard-config/subscribe');
    
    eventSource.onmessage = (event) => {
      if (!active) return;
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === 'config_update') {
          const newRecord = payload.data;
          
          setSharedConfig(prev => {
            // Check if there is an incoming newer version updated by a different user
            if (prev && newRecord.version > prev.version) {
              if (newRecord.updatedBy !== currentUserEmail) {
                addToast(`Dashboard config synchronized. Updated by ${newRecord.updatedBy} (v${newRecord.version})`, 'info');
              }
            }
            return newRecord;
          });
        }
      } catch (err) {
        console.error('Failed to parse SSE update payload', err);
      }
    };

    eventSource.onerror = (err) => {
      console.warn('Dashboard SSE connection dropped. Re-establishing in background...', err);
    };

    return () => {
      active = false;
      eventSource.close();
    };
  }, [currentUserEmail]);

  const updateSharedConfig = async (newConfig: any, userRole: string): Promise<boolean> => {
    if (!sharedConfig) {
      addToast('Shared configuration is not loaded yet.', 'error');
      return false;
    }

    const originalConfig = sharedConfig;

    // Optimistically update local client state
    const optimisticRecord = {
      ...originalConfig,
      config: newConfig,
      updatedBy: currentUserEmail,
      version: originalConfig.version // keep current version for PUT conflict checking
    };
    setSharedConfig(optimisticRecord);

    try {
      const res = await fetch('/api/dashboard-config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Role': userRole
        },
        body: JSON.stringify({
          organizationId: 'default-org',
          config: newConfig,
          updatedBy: currentUserEmail,
          version: originalConfig.version
        })
      });

      if (res.ok) {
        const updatedRecord = await res.json();
        setSharedConfig(updatedRecord);
        addToast('Dashboard layout saved & propagated to team!', 'success');
        return true;
      } else if (res.status === 409) {
        // Conflict! Overwritten by newer save
        const conflictData = await res.json();
        const serverRecord = conflictData.currentConfig;
        setSharedConfig(serverRecord); // Force sync to latest server state
        addToast(`Conflict! Overwritten by newer changes from ${serverRecord.updatedBy} (v${serverRecord.version}).`, 'error');
        return false;
      } else if (res.status === 403) {
        // Rollback on permission error
        setSharedConfig(originalConfig);
        addToast('Permission Denied: Only admins or managers can save layout configuration.', 'error');
        return false;
      } else {
        // General failure rollback
        setSharedConfig(originalConfig);
        addToast('Failed to sync dashboard layout config.', 'error');
        return false;
      }
    } catch (err) {
      console.error(err);
      setSharedConfig(originalConfig);
      addToast('Network error, failed to save dashboard config.', 'error');
      return false;
    }
  };

  // Bidirectional Synchronization Layer with Full-Stack Backend
  
  const performFetch = async (url: string, options: any, successMsg: string) => {
    try {
      const res = await fetch(url, options);
      if (res.ok) {
        if (successMsg) addToast(successMsg, 'success');
      } else {
        addToast(`Failed: ${res.statusText}`, 'error');
      }
    } catch (err) {
      console.error(err);
      addToast('Network error', 'error');
    }
  };

  const isInitiallyLoaded = React.useRef(false);
  const prevPrepItems = React.useRef<InventoryItem[]>([]);
  const prevSuppliers = React.useRef<Supplier[]>([]);
  const prevActiveOrders = React.useRef<ActiveOrder[]>([]);
  const prevActivityLogs = React.useRef<ActivityLog[]>([]);
  const prevPastOrders = React.useRef<PastOrder[]>([]);
  const prevWasteLogs = React.useRef<WasteLog[]>([]);

  useEffect(() => {
    const loadFromBackend = async () => {
      try {
        const [
          menuRes,
          prepRes,
          suppRes,
          activeRes,
          activityRes,
          pastRes,
          wasteRes,
          recipesRes,
          weeklyRes
        ] = await Promise.all([
          fetch('/api/menu').then(r => r.ok ? r.json() : null),
          fetch('/api/inventory').then(r => r.ok ? r.json() : null),
          fetch('/api/suppliers').then(r => r.ok ? r.json() : null),
          fetch('/api/active-orders').then(r => r.ok ? r.json() : null),
          fetch('/api/activity-logs').then(r => r.ok ? r.json() : null),
          fetch('/api/past-orders').then(r => r.ok ? r.json() : null),
          fetch('/api/waste').then(r => r.ok ? r.json() : null),
          fetch('/api/recipes').then(r => r.ok ? r.json() : null),
          fetch('/api/weekly-menus').then(r => r.ok ? r.json() : null)
        ]);

        if (menuRes && menuRes.length > 0) {
          setMasterMenuItems(menuRes);
          // Dynamically populate default thresholds if none exist
          setPlateWasteThresholds(prev => {
            if (prev && prev.length > 0) return prev;
            return menuRes.map((item: any) => ({
              menuItemId: item.id,
              itemName: item.name,
              threshold: 4.0,
            }));
          });
        }
        if (weeklyRes) {
          setWeeklyMenus(weeklyRes.menus || []);
          setMenuSlots(weeklyRes.slots || []);
        }
        if (recipesRes && recipesRes.length > 0) setRecipes(recipesRes);
        if (prepRes && prepRes.length > 0) {
          if (JSON.stringify(prepRes) !== JSON.stringify(prevPrepItems.current)) {
            prevPrepItems.current = prepRes;
            setPrepItems(prepRes);
          }
        } else if (!isInitiallyLoaded.current) {
          prevPrepItems.current = prepItems;
        }
        if (suppRes && suppRes.length > 0) {
          if (JSON.stringify(suppRes) !== JSON.stringify(prevSuppliers.current)) {
            prevSuppliers.current = suppRes;
            setSuppliers(suppRes);
          }
        } else if (!isInitiallyLoaded.current) {
          prevSuppliers.current = suppliers;
        }
        if (activeRes && activeRes.length > 0) {
          if (JSON.stringify(activeRes) !== JSON.stringify(prevActiveOrders.current)) {
            prevActiveOrders.current = activeRes;
            setActiveOrders(activeRes);
          }
        } else if (!isInitiallyLoaded.current) {
          prevActiveOrders.current = activeOrders;
        }
        if (activityRes && activityRes.length > 0) {
          if (JSON.stringify(activityRes) !== JSON.stringify(prevActivityLogs.current)) {
            prevActivityLogs.current = activityRes;
            setActivityLogs(activityRes);
          }
        } else if (!isInitiallyLoaded.current) {
          prevActivityLogs.current = activityLogs;
        }
        if (pastRes && pastRes.length > 0) {
          if (JSON.stringify(pastRes) !== JSON.stringify(prevPastOrders.current)) {
            prevPastOrders.current = pastRes;
            setPastOrders(pastRes);
          }
        } else if (!isInitiallyLoaded.current) {
          prevPastOrders.current = pastOrders;
        }
        if (wasteRes && wasteRes.length > 0) {
          if (JSON.stringify(wasteRes) !== JSON.stringify(prevWasteLogs.current)) {
            prevWasteLogs.current = wasteRes;
            setWasteLogs(wasteRes);
          }
        } else if (!isInitiallyLoaded.current) {
          prevWasteLogs.current = wasteLogs;
        }

        isInitiallyLoaded.current = true;
      } catch (err) {
        console.error("Failed to load initial data from server, using local fallback:", err);
        prevPrepItems.current = prepItems;
        prevSuppliers.current = suppliers;
        prevActiveOrders.current = activeOrders;
        prevActivityLogs.current = activityLogs;
        prevPastOrders.current = pastOrders;
        prevWasteLogs.current = wasteLogs;
        isInitiallyLoaded.current = true;
      }
    };
    loadFromBackend();
  }, []);

  // Sync state modifications back to the server
  useEffect(() => {
    if (!isInitiallyLoaded.current) return;
    const sync = async () => {
      const prev = prevPrepItems.current;
      const curr = prepItems;
      const deleted = prev.filter(p => !curr.some(c => String(c.id) === String(p.id)));
      for (const item of deleted) {
        await performFetch(`/api/inventory/${item.id}`, { method: 'DELETE' }, 'Inventory item deleted');
      }
      const added = curr.filter(c => !prev.some(p => String(p.id) === String(c.id)));
      for (const item of added) {
        await performFetch('/api/inventory', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) }, 'Inventory item added');
      }
      const updated = curr.filter(c => {
        const p = prev.find(x => String(x.id) === String(c.id));
        if (!p) return false;
        return JSON.stringify(p) !== JSON.stringify(c);
      });
      for (const item of updated) {
        await performFetch(`/api/inventory/${item.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) }, 'Inventory item updated');
      }
      prevPrepItems.current = curr;
    };
    sync();
  }, [prepItems]);

  useEffect(() => {
    if (!isInitiallyLoaded.current) return;
    const sync = async () => {
      const prev = prevSuppliers.current;
      const curr = suppliers;
      const deleted = prev.filter(p => !curr.some(c => String(c.id) === String(p.id)));
      for (const item of deleted) {
        await performFetch(`/api/suppliers/${item.id}`, { method: 'DELETE' }, 'Supplier deleted');
      }
      const added = curr.filter(c => !prev.some(p => String(p.id) === String(c.id)));
      for (const item of added) {
        await performFetch('/api/suppliers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) }, 'Supplier added');
      }
      const updated = curr.filter(c => {
        const p = prev.find(x => String(x.id) === String(c.id));
        if (!p) return false;
        return JSON.stringify(p) !== JSON.stringify(c);
      });
      for (const item of updated) {
        await performFetch(`/api/suppliers/${item.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) }, 'Supplier updated');
      }
      prevSuppliers.current = curr;
    };
    sync();
  }, [suppliers]);

  useEffect(() => {
    if (!isInitiallyLoaded.current) return;
    const sync = async () => {
      const prev = prevActiveOrders.current;
      const curr = activeOrders;
      const deleted = prev.filter(p => !curr.some(c => String(c.id) === String(p.id)));
      for (const item of deleted) {
        await performFetch(`/api/active-orders/${item.id}`, { method: 'DELETE' }, 'Order deleted');
      }
      const added = curr.filter(c => !prev.some(p => String(p.id) === String(c.id)));
      for (const item of added) {
        await performFetch('/api/active-orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) }, 'Order added');
      }
      const updated = curr.filter(c => {
        const p = prev.find(x => String(x.id) === String(c.id));
        if (!p) return false;
        return JSON.stringify(p) !== JSON.stringify(c);
      });
      for (const item of updated) {
        await performFetch(`/api/active-orders/${item.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) }, 'Order updated');
      }
      prevActiveOrders.current = curr;
    };
    sync();
  }, [activeOrders]);

  useEffect(() => {
    if (!isInitiallyLoaded.current) return;
    const sync = async () => {
      const prev = prevActivityLogs.current;
      const curr = activityLogs;
      const deleted = prev.filter(p => !curr.some(c => String(c.id) === String(p.id)));
      for (const item of deleted) {
        await performFetch(`/api/activity-logs/${item.id}`, { method: 'DELETE' }, 'Activity log deleted');
      }
      const added = curr.filter(c => !prev.some(p => String(p.id) === String(c.id)));
      for (const item of added) {
        await performFetch('/api/activity-logs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) }, 'Activity logged');
      }
      prevActivityLogs.current = curr;
    };
    sync();
  }, [activityLogs]);

  useEffect(() => {
    if (!isInitiallyLoaded.current) return;
    const sync = async () => {
      const prev = prevPastOrders.current;
      const curr = pastOrders;
      const added = curr.filter(c => !prev.some(p => String(p.id) === String(c.id)));
      for (const item of added) {
        await performFetch('/api/past-orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) }, 'Past order added');
      }
      prevPastOrders.current = curr;
    };
    sync();
  }, [pastOrders]);

  useEffect(() => {
    if (!isInitiallyLoaded.current) return;
    const sync = async () => {
      const prev = prevWasteLogs.current;
      const curr = wasteLogs;
      const deleted = prev.filter(p => !curr.some(c => String(c.id) === String(p.id)));
      for (const item of deleted) {
        await performFetch(`/api/waste/${item.id}`, { method: 'DELETE' }, 'Waste log deleted');
      }
      const added = curr.filter(c => !prev.some(p => String(p.id) === String(c.id)));
      for (const item of added) {
        await performFetch('/api/waste', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) }, 'Waste logged');
      }
      prevWasteLogs.current = curr;
    };
    sync();
  }, [wasteLogs]);

  // Local Storage Backups for Resilience
  useEffect(() => { localStorage.setItem('sync_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('sync_masterMenuItems', JSON.stringify(masterMenuItems)); }, [masterMenuItems]);
  useEffect(() => { localStorage.setItem('sync_weeklyMenus', JSON.stringify(weeklyMenus)); }, [weeklyMenus]);
  useEffect(() => { localStorage.setItem('sync_menuSlots', JSON.stringify(menuSlots)); }, [menuSlots]);
  useEffect(() => { localStorage.setItem('sync_activeWeekStartDate', activeWeekStartDate); }, [activeWeekStartDate]);
  useEffect(() => { localStorage.setItem('sync_prepItems', JSON.stringify(prepItems)); }, [prepItems]);
  useEffect(() => { localStorage.setItem('sync_suppliers', JSON.stringify(suppliers)); }, [suppliers]);
  useEffect(() => { localStorage.setItem('sync_activeOrders', JSON.stringify(activeOrders)); }, [activeOrders]);
  useEffect(() => { localStorage.setItem('sync_activityLogs', JSON.stringify(activityLogs)); }, [activityLogs]);
  useEffect(() => { localStorage.setItem('sync_pastOrders', JSON.stringify(pastOrders)); }, [pastOrders]);
  useEffect(() => { localStorage.setItem('sync_wasteLogs', JSON.stringify(wasteLogs)); }, [wasteLogs]);
  useEffect(() => { localStorage.setItem('sync_prepProgress', JSON.stringify(prepProgress)); }, [prepProgress]);
  useEffect(() => { localStorage.setItem('sync_plateWasteThresholds', JSON.stringify(plateWasteThresholds)); }, [plateWasteThresholds]);
  useEffect(() => { localStorage.setItem('sync_thresholdAlerts', JSON.stringify(thresholdAlerts)); }, [thresholdAlerts]);
  useEffect(() => { localStorage.setItem('sync_currentUserEmail', currentUserEmail); }, [currentUserEmail]);
  useEffect(() => { localStorage.setItem('sync_allStudentChoices', JSON.stringify(allStudentChoices)); }, [allStudentChoices]);
  useEffect(() => { localStorage.setItem('sync_mealOptIns', JSON.stringify(mealOptIns)); }, [mealOptIns]);
  useEffect(() => { localStorage.setItem('sync_recipes', JSON.stringify(recipes)); }, [recipes]);

  const publishWeeklyMenu = async (weekStartDate: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/weekly-menus/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ weekStartDate }),
      });
      if (res.ok) {
        // Refresh weekly menus and slots from backend
        const fresh = await fetch('/api/weekly-menus').then(r => r.ok ? r.json() : null);
        if (fresh) {
          setWeeklyMenus(fresh.menus || []);
          setMenuSlots(fresh.slots || []);
        }
        addToast('Weekly menu published successfully!', 'success');
        return true;
      } else {
        const errData = await res.json().catch(() => ({}));
        addToast(errData.error || 'Failed to publish weekly menu.', 'error');
        return false;
      }
    } catch (err) {
      console.error(err);
      addToast('Network error publishing weekly menu.', 'error');
      return false;
    }
  };

  const saveRecipe = async (menuItemId: string, ingredients: any[]): Promise<boolean> => {
    try {
      const res = await fetch('/api/recipes/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ menuItemId, ingredients }),
      });
      if (res.ok) {
        // Reload all recipes from backend to stay in sync
        const freshRecipes = await fetch('/api/recipes').then(r => r.ok ? r.json() : null);
        if (freshRecipes) {
          setRecipes(freshRecipes);
        }
        addToast('Recipe saved successfully!', 'success');
        return true;
      } else {
        addToast('Failed to save recipe.', 'error');
        return false;
      }
    } catch (err) {
      console.error(err);
      addToast('Network error saving recipe.', 'error');
      return false;
    }
  };

  // Sync mealOptIns dynamically whenever allStudentChoices changes
  useEffect(() => {
    const updatedOptIns = { ...baselineOptIns };
    
    Object.entries(allStudentChoices).forEach(([email, choices]) => {
      Object.entries(choices).forEach(([mealId, optedIn]) => {
        if (optedIn) {
          if (updatedOptIns[mealId] !== undefined) {
            updatedOptIns[mealId] += 1;
          } else {
            updatedOptIns[mealId] = 1;
          }
        }
      });
    });
    
    setMealOptIns(updatedOptIns);
  }, [allStudentChoices, baselineOptIns]);

  return (
    <DataContext.Provider value={{
      users, setUsers,
      menuItems, setMenuItems,
      masterMenuItems, setMasterMenuItems,
      weeklyMenus, setWeeklyMenus,
      menuSlots, setMenuSlots,
      activeWeekStartDate, setActiveWeekStartDate,
      publishWeeklyMenu,
      prepItems, setPrepItems,
      suppliers, setSuppliers,
      activeOrders, setActiveOrders,
      activityLogs, setActivityLogs,
      pastOrders, setPastOrders,
      wasteLogs, setWasteLogs,
      prepProgress, setPrepProgress,
      plateWasteThresholds, setPlateWasteThresholds,
      thresholdAlerts, setThresholdAlerts,
      studentChoices, setStudentChoices,
      mealOptIns, setMealOptIns,
      currentUserEmail, setCurrentUserEmail,
      allStudentChoices, setAllStudentChoices,
      sharedConfig, setSharedConfig,
      updateSharedConfig,
      recipes, setRecipes,
      saveRecipe
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
