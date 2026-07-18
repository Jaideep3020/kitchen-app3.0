import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { motion } from 'motion/react';
import { Save, Plus, Trash2 } from 'lucide-react';
import { triggerHaptic } from '../lib/haptics';

export default function ManagerSettings() {
  const { menuItems } = useData();
  const { addToast } = useToast();
  const [staples, setStaples] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStaples = async () => {
    try {
      const res = await fetch('/api/staples');
      if (res.ok) {
        const data = await res.json();
        setStaples(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaples();
  }, []);

  const handleToggleStaple = async (menuItemId: string, mealType: string, currentStatus: boolean) => {
    triggerHaptic('light');
    try {
      const res = await fetch('/api/staples', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          menuItemId,
          mealType,
          alwaysIncluded: !currentStatus
        })
      });
      if (res.ok) {
        addToast(`Staple status updated`, 'success');
        fetchStaples();
      }
    } catch (err) {
      addToast('Failed to update staple', 'error');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading settings...</div>;

  const lunchDishes = menuItems.filter(m => m.mealType === 'lunch');
  const dinnerDishes = menuItems.filter(m => m.mealType === 'dinner');

  const getStapleStatus = (id: string, mealType: string) => {
    const s = staples.find(s => String(s.menuItemId) === String(id) && s.mealType === mealType);
    return s ? s.alwaysIncluded : false;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4 pb-24 space-y-6"
    >
      <div className="bg-white dark:bg-[#121212] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Menu Staples</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Items marked as staples will be automatically injected into every daily slot for their respective meal type when a weekly menu is published.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-lg mb-4 text-[#16321F] dark:text-[#D9E96B] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#16321F] dark:bg-[#D9E96B]"></span>
              Lunch Staples
            </h3>
            <div className="space-y-2">
              {lunchDishes.map(dish => {
                const isStaple = getStapleStatus(dish.id, 'lunch');
                return (
                  <label key={dish.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors">
                    <span className="text-sm font-medium">{dish.name}</span>
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 accent-[#16321F] dark:accent-[#D9E96B]"
                      checked={isStaple}
                      onChange={() => handleToggleStaple(dish.id, 'lunch', isStaple)}
                    />
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-[#16321F] dark:text-[#D9E96B] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#16321F] dark:bg-[#D9E96B]"></span>
              Dinner Staples
            </h3>
            <div className="space-y-2">
              {dinnerDishes.map(dish => {
                const isStaple = getStapleStatus(dish.id, 'dinner');
                return (
                  <label key={dish.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors">
                    <span className="text-sm font-medium">{dish.name}</span>
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 accent-[#16321F] dark:accent-[#D9E96B]"
                      checked={isStaple}
                      onChange={() => handleToggleStaple(dish.id, 'dinner', isStaple)}
                    />
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
