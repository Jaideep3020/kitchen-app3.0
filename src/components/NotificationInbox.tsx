import React, { useState } from 'react';
import { Bell, X, AlertTriangle, AlertCircle, ShoppingCart, Truck, Wrench } from 'lucide-react';
import { InventoryItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../contexts/DataContext';

type NotificationCategory = 'All' | 'Inventory' | 'Orders' | 'Maintenance' | 'Waste';

interface NotificationItem {
  id: string;
  category: NotificationCategory;
  title: string;
  message: string;
  icon: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  colorClasses: string;
  iconClasses: string;
}

interface NotificationInboxProps {
  isOpen: boolean;
  onClose: () => void;
  prepItems: InventoryItem[];
  onNavigateToStock: (draftPO?: { item: string; supplierId: string }) => void;
  role?: string;
}

export default function NotificationInbox({ isOpen, onClose, prepItems, onNavigateToStock, role }: NotificationInboxProps) {
  const [activeCategory, setActiveCategory] = useState<NotificationCategory>('All');
  const { thresholdAlerts, setThresholdAlerts, suppliers } = useData();

  const lowStockItems = prepItems.filter(item => item.status === 'Low');
  
  
  const studentNotifications: NotificationItem[] = role === 'student' ? [
    {
      id: 'rsvp_reminder',
      category: 'All',
      title: 'RSVP Reminder',
      message: 'Do not forget to submit your meal choices for tomorrow by 10:00 PM tonight.',
      icon: <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      colorClasses: 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500',
      iconClasses: 'bg-blue-100 dark:bg-blue-900/40'
    }
  ] : [];

  const inventoryNotifications: NotificationItem[] = lowStockItems.map(item => {
    const matchedSupplier = suppliers?.find(s => 
      s.items?.some(i => i.name.toLowerCase() === item.name.toLowerCase())
    );
    const supplierId = matchedSupplier?.id || (suppliers?.[0]?.id || '');

    return {
      id: `inv-${item.id}`,
      category: 'Inventory',
      title: `Low Stock: ${item.name}`,
      message: `Current level (${item.currentStock} ${item.unit}) has dropped below the reorder threshold (${item.reorderLevel} ${item.unit}).`,
      icon: <AlertTriangle className="w-4 h-4 text-red-500" />,
      actionText: 'Order Now',
      onAction: () => {
        onClose();
        onNavigateToStock({
          item: item.name,
          supplierId
        });
      },
      colorClasses: 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30',
      iconClasses: 'bg-white dark:bg-[#1a1a1a]'
    };
  });

  const activeThresholdAlerts = thresholdAlerts.filter(a => a.status === 'active');

  const wasteNotifications: NotificationItem[] = activeThresholdAlerts.map(alert => ({
    id: `waste-${alert.id}`,
    category: 'Waste',
    title: `Plate Waste: ${alert.itemName}`,
    message: `${alert.type === 'single' ? 'Single entry' : 'Cumulative daily'} plate waste of ${alert.actualValue}kg exceeded the threshold of ${alert.thresholdValue}kg!`,
    icon: <AlertCircle className="w-4 h-4 text-red-500 animate-pulse" />,
    actionText: 'Dismiss Alert',
    onAction: () => {
      setThresholdAlerts(prev => prev.map(a => a.id === alert.id ? { ...a, status: 'dismissed' } : a));
    },
    colorClasses: 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50',
    iconClasses: 'bg-red-100 dark:bg-red-900/40 text-red-600'
  }));

  const mockNotifications: NotificationItem[] = [
    {
      id: 'ord-1',
      category: 'Orders',
      title: 'Delivery Delayed',
      message: 'Fresh Produce delivery from FarmFresh has been delayed by 2 hours.',
      icon: <Truck className="w-4 h-4 text-amber-500" />,
      colorClasses: 'bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30',
      iconClasses: 'bg-white dark:bg-[#1a1a1a]'
    },
    {
      id: 'maint-1',
      category: 'Maintenance',
      title: 'Walk-in Freezer Temp',
      message: 'Temperature fluctuation detected in Walk-in Freezer #2. Check seal.',
      icon: <Wrench className="w-4 h-4 text-blue-500" />,
      colorClasses: 'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30',
      iconClasses: 'bg-white dark:bg-[#1a1a1a]'
    }
  ];

  const allNotifications = [...inventoryNotifications, ...wasteNotifications, ...mockNotifications];

  const filteredNotifications = activeCategory === 'All' 
    ? allNotifications 
    : allNotifications.filter(n => n.category === activeCategory);

  const categories: NotificationCategory[] = role === 'student' ? ['All'] : ['All', 'Inventory', 'Waste', 'Orders', 'Maintenance'];

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        className="fixed top-20 right-4 sm:right-8 z-[70] w-[calc(100vw-32px)] sm:w-[400px] bg-white dark:bg-[#121212] rounded-[24px] border border-gray-100 dark:border-gray-800 shadow-2xl flex flex-col max-h-[80vh]"
      >
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-[#1a1a1a]/50 rounded-t-[24px] shrink-0">
          <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#16321F] dark:text-[#D9E96B]" />
            Notifications
            {allNotifications.length > 0 && (
              <span className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-[10px] px-2 py-0.5 rounded-full font-bold">
                {allNotifications.length} New
              </span>
            )}
          </h3>
          <button onClick={onClose} className="p-1.5 bg-gray-100 dark:bg-[#222] hover:bg-gray-200 dark:hover:bg-[#333] rounded-full text-gray-500 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-4 pt-3 pb-2 border-b border-gray-100 dark:border-gray-800 overflow-x-auto hide-scrollbar shrink-0">
          <div className="flex gap-2 min-w-max">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                  activeCategory === cat 
                    ? 'bg-[#16321F] text-[#D9E96B] dark:bg-[#D9E96B] dark:text-[#16321F]' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-[#222] dark:text-gray-400 dark:hover:bg-[#333]'
                }`}
              >
                {cat}
                {cat !== 'All' && (
                  <span className="ml-1.5 opacity-70">
                    ({allNotifications.filter(n => n.category === cat).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
        
        <div className="overflow-y-auto p-4 flex flex-col gap-3 min-h-0 flex-grow">
          {filteredNotifications.length === 0 ? (
            <div className="py-8 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-[#1a1a1a] flex items-center justify-center mb-3">
                <Bell className="w-6 h-6 text-gray-300 dark:text-gray-600" />
              </div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">You're all caught up</p>
              <p className="text-xs text-gray-500 mt-1">No new notifications in this category.</p>
            </div>
          ) : (
            <>
              {filteredNotifications.map(item => (
                <div key={item.id} className={`border rounded-[16px] p-3 flex gap-3 ${item.colorClasses}`}>
                  <div className={`p-2 rounded-full shrink-0 h-fit ${item.iconClasses}`}>
                    {item.icon}
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-0.5">
                      <h5 className="text-sm font-bold text-gray-900 dark:text-white">{item.title}</h5>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 bg-black/5 dark:bg-white/5 px-1.5 py-0.5 rounded">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      {item.message}
                    </p>
                    {item.actionText && item.onAction && (
                      <button 
                        onClick={item.onAction}
                        className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 hover:border-[#16321F] dark:hover:border-[#D9E96B] text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors"
                      >
                        {item.category === 'Inventory' ? <ShoppingCart className="w-3.5 h-3.5" /> : null}
                        {item.actionText}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </motion.div>
    </>
  );
}
