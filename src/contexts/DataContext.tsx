import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem, InventoryItem, Supplier, ActiveOrder, ActivityLog, PastOrder, WasteLog, PrepProgress, PlateWasteThreshold, ThresholdAlert } from '../types';
import { useToast } from './ToastContext';
import { 
  INITIAL_MENU_ITEMS, 
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
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('sync_menuItems');
    return saved ? JSON.parse(saved) : INITIAL_MENU_ITEMS;
  });
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
    if (saved) return JSON.parse(saved);
    // Initialize default thresholds (e.g. 4.0 kg as default) for all menu items
    return INITIAL_MENU_ITEMS.map(item => ({
      menuItemId: item.id,
      itemName: item.name,
      threshold: 4.0,
    }));
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
    INITIAL_MENU_ITEMS.forEach(item => {
      const hash = item.id.split('_').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      initial[item.id] = 130 + (hash % 40);
    });
    return initial;
  }, []);

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
          recipesRes
        ] = await Promise.all([
          fetch('/api/menu').then(r => r.ok ? r.json() : null),
          fetch('/api/inventory').then(r => r.ok ? r.json() : null),
          fetch('/api/suppliers').then(r => r.ok ? r.json() : null),
          fetch('/api/active-orders').then(r => r.ok ? r.json() : null),
          fetch('/api/activity-logs').then(r => r.ok ? r.json() : null),
          fetch('/api/past-orders').then(r => r.ok ? r.json() : null),
          fetch('/api/waste').then(r => r.ok ? r.json() : null),
          fetch('/api/recipes').then(r => r.ok ? r.json() : null)
        ]);

        if (menuRes && menuRes.length > 0) setMenuItems(menuRes);
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
  useEffect(() => { localStorage.setItem('sync_menuItems', JSON.stringify(menuItems)); }, [menuItems]);
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
