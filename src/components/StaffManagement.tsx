import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { UserPlus, Shield, Users, Mail, Building, Key, Settings, UserCog, Utensils } from 'lucide-react';
import { UserAccount } from '../types';
import { useToast } from '../contexts/ToastContext';
import { motion, AnimatePresence } from 'motion/react';
import ManagerMenu from './ManagerMenu';
import ScrollAffordance from './ScrollAffordance';
import { triggerHaptic } from '../lib/haptics';

export default function StaffManagement() {
  const { users, setUsers, menuItems } = useData();
  const { addToast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'users' | 'settings' | 'menu'>('users');
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'staff',
    orgId: 'org_001',
    password: ''
  });

  const [staples, setStaples] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeTab === 'settings') {
      fetchStaples();
    }
  }, [activeTab]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.orgId) {
      addToast('Please fill all fields', 'error');
      return;
    }
    if (users.find(u => u.email === formData.email)) {
      addToast('User with this email already exists', 'error');
      return;
    }
    const newUser: UserAccount = {
      ...formData,
      role: formData.role as 'manager' | 'staff' | 'student'
    };
    setUsers(prev => [...prev, newUser]);
    addToast(`Added new ${formData.role}: ${formData.name}`, 'success');
    setShowAddForm(false);
    setFormData({
      name: '',
      email: '',
      role: 'staff',
      orgId: 'org_001',
      password: ''
    });
  };

  const lunchDishes = menuItems.filter(m => m.mealType === 'lunch');
  const dinnerDishes = menuItems.filter(m => m.mealType === 'dinner');

  const getStapleStatus = (id: string, mealType: string) => {
    const s = staples.find(s => String(s.menuItemId) === String(id) && s.mealType === mealType);
    return s ? s.alwaysIncluded : false;
  };

  return (
    <div className="flex-grow max-w-7xl mx-auto w-full px-4 md:px-8 pt-0 pb-6 space-y-6">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0A170E] dark:text-white font-display">
            Manager Hub
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Centralized management, content, and team controls.
          </p>
        </div>
        
        <ScrollAffordance className="flex gap-1.5 pb-2 border-b border-gray-100 dark:border-gray-800" fadeColorClass="from-white dark:from-[#121212]">
          <Pressable
            onClick={() => { triggerHaptic('light'); setActiveTab('users'); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'users' 
                ? 'bg-gray-100 dark:bg-[#2a2a2a] text-[#16321F] dark:text-[#D9E96B] shadow-sm' 
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <UserCog className="w-4 h-4" />
            User Access
          </Pressable>
          
          <Pressable
            onClick={() => { triggerHaptic('light'); setActiveTab('settings'); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'settings' 
                ? 'bg-gray-100 dark:bg-[#2a2a2a] text-[#16321F] dark:text-[#D9E96B] shadow-sm' 
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Settings className="w-4 h-4" />
            Global Settings
          </Pressable>

          <Pressable
            onClick={() => { triggerHaptic('light'); setActiveTab('menu'); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'menu' 
                ? 'bg-gray-100 dark:bg-[#2a2a2a] text-[#16321F] dark:text-[#D9E96B] shadow-sm' 
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Utensils className="w-4 h-4" />
            Menu Builder
          </Pressable>
        </ScrollAffordance>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'users' && (
          <motion.div
            key="users"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="flex justify-end">
              <Pressable
                onClick={() => { triggerHaptic('light'); setShowAddForm(!showAddForm); }}
                className="bg-[#16321F] dark:bg-emerald-950 text-white dark:text-[#D9E96B] px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-[#2C4134] transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                {showAddForm ? 'Cancel' : 'Add User'}
              </Pressable>
            </div>

            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <form onSubmit={handleSubmit} className="bg-white dark:bg-[#121212] rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
                  <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#16321F] dark:text-[#D9E96B]" />
                    New Team Member
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
                        className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#16321F] dark:focus:ring-[#D9E96B]"
                        placeholder="e.g. John Smith"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData(f => ({ ...f, email: e.target.value }))}
                        className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#16321F] dark:focus:ring-[#D9E96B]"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">Role</label>
                      <select
                        value={formData.role}
                        onChange={e => setFormData(f => ({ ...f, role: e.target.value }))}
                        className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#16321F] dark:focus:ring-[#D9E96B]"
                      >
                        <option value="student">Student / Diner</option>
                        <option value="staff">Kitchen Staff</option>
                        <option value="manager">Manager</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">Temporary Password</label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={e => setFormData(f => ({ ...f, password: e.target.value }))}
                        className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#16321F] dark:focus:ring-[#D9E96B]"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>
                  <div className="pt-2 flex justify-end">
                    <Pressable
                      type="submit"
                      className="bg-[#16321F] text-[#D9E96B] px-6 py-2 rounded-xl text-sm font-bold hover:bg-[#2C4134] transition-colors"
                    >
                      Create Account
                    </Pressable>
                  </div>
                </form>
              </motion.div>
            )}

            <div className="bg-white dark:bg-[#121212] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 dark:bg-[#1a1a1a] border-b border-gray-100 dark:border-gray-800 text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold">
                    <tr>
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Organization</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {users.map(user => (
                      <tr key={user.email} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#16321F]/10 dark:bg-[#D9E96B]/10 text-[#16321F] dark:text-[#D9E96B] flex items-center justify-center font-bold">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-gray-900 dark:text-white">{user.name}</div>
                              <div className="text-gray-500 dark:text-gray-400 text-xs">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                            user.role === 'manager' 
                              ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' 
                              : user.role === 'staff'
                              ? 'bg-[#16321F]/10 text-[#16321F] dark:bg-[#D9E96B]/10 dark:text-[#D9E96B]'
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-mono text-xs">
                          {user.orgId}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-[#121212] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-gray-400" />
                  Meal Staples Configuration
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Select which items are always included in every meal by default.
                </p>
              </div>
              
              <div className="p-6">
                {loading ? (
                  <div className="flex justify-center p-8">
                    <div className="w-8 h-8 border-4 border-[#16321F]/20 dark:border-[#D9E96B]/20 border-t-[#16321F] dark:border-t-[#D9E96B] rounded-full animate-spin"></div>
                  </div>
                ) : (
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
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'menu' && (
          <motion.div
            key="menu"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <ManagerMenu />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
