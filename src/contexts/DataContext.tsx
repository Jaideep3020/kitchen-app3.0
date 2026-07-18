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
    return localStorage.getItem('sync_currentUserEmail') || 'student1@mess.edu';
  });

  const [allStudentChoices, setAllStudentChoices] = useState<{ [email: string]: { [key: string]: any } }>({});

  const [studentChoices, setStudentChoices] = useState<{ [key: string]: any }>({});

  

  
  useEffect(() => {
    if (!currentUserEmail) return;
    fetch(`/api/rsvps/student?email=${encodeURIComponent(currentUserEmail)}`)
      .then(r => r.ok ? r.json() : [])
      .then(rsvps => {
        const choices: any = {};
        
        // We need to map date + mealType -> dishId. 
        // We have masterMenuItems. 
        // date = activeWeekStartDate + days
        // It's easier to match by mealType and dayOfWeek!
        rsvps.forEach((r: any) => {
          if (r.attending) {
            // Find the dishId for this date and mealType
            const dateObj = new Date(r.date);
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const dayOfWeek = days[dateObj.getDay()];
            
            const dish = masterMenuItems.find(m => m.dayOfWeek === dayOfWeek && m.mealType === r.mealType && m.category.includes('main'));
            if (dish) {
              choices[dish.id] = true;
              if (r.choice && r.choice !== dish.id) {
                choices[`${dish.id}_choice`] = r.choice;
              }
            }
          }
        });
        setStudentChoices(choices);
      })
      .catch(console.error);
  }, [currentUserEmail]);
  const [mealOptIns, setMealOptIns] = useState<{ [key: string]: number }>({});
  const [sharedConfig, setSharedConfig] = useState<any>({});
  const [recipes, setRecipes] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/rsvps/stats')
      .then(r => r.ok ? r.json() : {})
      .then(stats => {
        const optIns: any = {};
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        Object.keys(stats).forEach(key => {
          const [dateStr, mealType] = key.split('_');
          const dateObj = new Date(dateStr);
          const dayOfWeek = days[dateObj.getDay()];
          const dish = masterMenuItems.find(m => m.dayOfWeek === dayOfWeek && m.mealType === mealType && m.category.includes('main'));
          if (dish) {
            optIns[dish.id] = stats[key];
          }
        });
        setMealOptIns(optIns);
      })
      .catch(console.error);
  }, [masterMenuItems]);

  useEffect(() => {
    fetch('/api/recipes').then(r => r.ok ? r.json() : []).then(setRecipes).catch(console.error);
  }, []);

  useEffect(() => {
    fetch('/api/dashboard-config').then(r => r.ok ? r.json() : {}).then(c => setSharedConfig(c)).catch(console.error);
  }, []);

  const publishWeeklyMenu = async (weekStartDate: string) => {
    try {
      const res = await fetch('/api/weekly-menus/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weekStartDate })
      });
      if (!res.ok) throw new Error('Failed to publish');
      
      const published = await res.json();
      setWeeklyMenus(prev => {
        const others = prev.filter(m => m.weekStartDate !== weekStartDate);
        return [...others, published];
      });
      return true;
    } catch (err) {
      console.error(err);
      addToast('Failed to publish menu', 'error');
      return false;
    }
  };

  const updateSharedConfig = async (newConfig: any, userRole: string) => {
    try {
      const payload = {
        organizationId: 'default-org',
        config: newConfig,
        updatedBy: currentUserEmail,
        version: sharedConfig?.version || 1
      };
      const res = await fetch('/api/dashboard-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-user-role': userRole },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to update config');
      const updated = await res.json();
      setSharedConfig(updated);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const saveRecipe = async (menuItemId: string, ingredients: any[]) => {
    try {
      const res = await fetch('/api/recipes/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ menuItemId, ingredients })
      });
      if (!res.ok) throw new Error('Failed to save recipe');
      const { data } = await res.json();
      setRecipes(prev => {
        const others = prev.filter(r => r.menuItemId !== menuItemId);
        return [...others, ...data];
      });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

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
