import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { UserPlus, Shield, Users, Mail, Building, Key } from 'lucide-react';
import { UserAccount } from '../types';
import { useToast } from '../contexts/ToastContext';

export default function StaffManagement() {
  const { users, setUsers } = useData();
  const { addToast } = useToast();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'staff',
    orgId: 'org_001',
    password: ''
  });

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

  return (
    <div className="flex-grow max-w-7xl mx-auto w-full px-4 md:px-8 pt-0 pb-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0A170E] dark:text-white font-display">
            Staff & User Management
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage organization access and role permissions.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-[#16321F] dark:bg-emerald-950 text-white dark:text-[#D9E96B] px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-[#2C4134] transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          {showAddForm ? 'Cancel' : 'Add User'}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white dark:bg-[#121212] rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Create New Account</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Full Name</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Email Address</label>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Role</label>
              <select
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value})}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
              >
                <option value="manager">Manager (Admin)</option>
                <option value="staff">Staff (Operations)</option>
                <option value="student">Student</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Organization ID</label>
              <input 
                type="text" 
                required
                value={formData.orgId}
                onChange={e => setFormData({...formData, orgId: e.target.value})}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Temporary Password</label>
              <input 
                type="password" 
                required
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
              />
            </div>
            <div className="md:col-span-2 flex justify-end mt-2">
              <button 
                type="submit"
                className="bg-[#16321F] dark:bg-emerald-900 text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-[#2C4134] transition-colors"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
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
              {users.map((user, i) => (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-[#1a1a1a]/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                      ${user.role === 'manager' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 
                        user.role === 'staff' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 
                        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}
                    >
                      {user.role === 'manager' && <Shield className="w-3 h-3" />}
                      {user.role === 'staff' && <Users className="w-3 h-3" />}
                      {user.role === 'student' && <UserPlus className="w-3 h-3" />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-600 dark:text-gray-300 font-mono text-xs">{user.orgId}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
