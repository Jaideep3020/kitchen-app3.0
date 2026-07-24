import React, { useState, useEffect } from 'react';
import { Utensils, User, Lock, Eye, EyeOff, ArrowRight, Mail, Boxes } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { Pressable } from './Pressable';
import { DUMMY_USERS } from '../lib/dummyUsers';

interface SignInProps {
  onSignIn: (role: 'student' | 'staff' | 'manager', email: string, staffSubRole?: string | null) => void;
}

export default function SignIn({ onSignIn }: SignInProps) {
  const { users } = useData();
  const { addToast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'student' | 'staff' | 'inventory' | 'prep_cook' | 'manager'>('student');
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Auto-fill demo info when role changes
  useEffect(() => {
    if (selectedRole === 'student') {
      setEmail('student1@mess.edu');
      setPassword('Test1234!');
    } else if (selectedRole === 'staff') {
      setEmail('staff1@mess.edu');
      setPassword('Test1234!');
    } else if (selectedRole === 'inventory') {
      setEmail('staff1@mess.edu');
      setPassword('Test1234!');
    } else if (selectedRole === 'prep_cook') {
      setEmail('rohan.das.stf@gmail.com');
      setPassword('TestPass123!');
    } else if (selectedRole === 'manager') {
      setEmail('manager@mess.edu');
      setPassword('Test1234!');
    }
  }, [selectedRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please fill all required fields');
      return;
    }
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: password.trim() })
      });

      if (!res.ok) {
        // Fallback check against DUMMY_USERS
        const dummy = DUMMY_USERS.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
        if (dummy && dummy.password === password.trim()) {
          const roleMatches = selectedRole === 'inventory' 
            ? (dummy.role === 'staff' && (dummy.staffSubRole === 'inventory' || !dummy.staffSubRole))
            : selectedRole === 'prep_cook'
            ? (dummy.role === 'staff' && dummy.staffSubRole === 'prep_cook')
            : dummy.role === selectedRole;

          if (!roleMatches) {
            setError(`This account does not have ${selectedRole === 'inventory' ? 'Inventory Staff' : selectedRole === 'prep_cook' ? 'Prep & Cook Staff' : selectedRole} access.`);
            return;
          }

          const effectiveSubRole = dummy.staffSubRole || (selectedRole === 'inventory' ? 'inventory' : selectedRole === 'prep_cook' ? 'prep_cook' : null);
          onSignIn(dummy.role as 'student' | 'staff' | 'manager', dummy.email, effectiveSubRole);
          return;
        }

        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Invalid email or password');
        return;
      }

      const data = await res.json();
      const user = data.user;

      const roleMatches = selectedRole === 'inventory'
        ? (user.role === 'staff' && (user.staffSubRole === 'inventory' || !user.staffSubRole))
        : selectedRole === 'prep_cook'
        ? (user.role === 'staff' && user.staffSubRole === 'prep_cook')
        : user.role === selectedRole;

      if (!roleMatches) {
        setError(`This account does not have ${selectedRole === 'inventory' ? 'Inventory Staff' : selectedRole === 'prep_cook' ? 'Prep & Cook Staff' : selectedRole} access.`);
        return;
      }

      const effectiveSubRole = user.staffSubRole || (selectedRole === 'inventory' ? 'inventory' : selectedRole === 'prep_cook' ? 'prep_cook' : null);

      onSignIn(user.role as 'student' | 'staff' | 'manager', user.email, effectiveSubRole);
    } catch (err) {
      console.error(err);
      setError('An error occurred during sign in');
    }
  };

  return (
    <div id="signin_screen" className="flex-grow flex items-center justify-center p-4 bg-[#eff5f0]">
      <div className="w-full max-w-md">
        {/* Logo & Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#1c3422] text-white mb-4 shadow-sm">
            <Utensils className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-[#1c3422] tracking-tight">Kitchen Ops</h1>
          <p className="text-[#4e6a57] font-medium mt-2">Sign in to your account</p>
        </div>

        {/* Login Form Container */}
        <div className="bg-white rounded-[24px] p-8 shadow-[0_8px_30px_rgba(28,52,34,0.04)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 text-xs bg-red-50 text-red-600 rounded-xl border border-red-100 font-medium">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-xs font-bold tracking-widest text-[#4e6a57] uppercase" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-5 h-5" />
                </span>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-[#1c3422]/10 focus:border-[#1c3422] transition-all placeholder:text-gray-400 text-gray-900"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-xs font-bold tracking-widest text-[#4e6a57] uppercase" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-[#1c3422]/10 focus:border-[#1c3422] transition-all placeholder:text-gray-400 text-gray-900"
                />
                <Pressable
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </Pressable>
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold tracking-widest text-[#4e6a57] uppercase">
                Select Role
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                <Pressable
                  type="button"
                  onClick={() => setSelectedRole('student')}
                  className={`flex flex-col items-center justify-center py-3 px-1 rounded-2xl border transition-all ${
                    selectedRole === 'student' 
                      ? 'bg-[#eff5f0] border-[#1c3422] text-[#1c3422] shadow-sm' 
                      : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <User className="w-4 h-4 mb-1" />
                  <span className={`text-[11px] ${selectedRole === 'student' ? 'font-bold' : 'font-medium'}`}>Student</span>
                </Pressable>

                <Pressable
                  type="button"
                  onClick={() => setSelectedRole('staff')}
                  className={`flex flex-col items-center justify-center py-3 px-1 rounded-2xl border transition-all ${
                    selectedRole === 'staff' 
                      ? 'bg-[#eff5f0] border-[#1c3422] text-[#1c3422] shadow-sm' 
                      : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <Utensils className="w-4 h-4 mb-1" />
                  <span className={`text-[11px] ${selectedRole === 'staff' ? 'font-bold' : 'font-medium'}`}>Staff</span>
                </Pressable>

                <Pressable
                  type="button"
                  onClick={() => setSelectedRole('inventory')}
                  className={`flex flex-col items-center justify-center py-3 px-1 rounded-2xl border transition-all ${
                    selectedRole === 'inventory' 
                      ? 'bg-[#eff5f0] border-[#1c3422] text-[#1c3422] shadow-sm' 
                      : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <Boxes className="w-4 h-4 mb-1" />
                  <span className={`text-[11px] text-center ${selectedRole === 'inventory' ? 'font-bold' : 'font-medium'}`}>Inventory</span>
                </Pressable>

                <Pressable
                  type="button"
                  onClick={() => setSelectedRole('prep_cook')}
                  className={`flex flex-col items-center justify-center py-3 px-1 rounded-2xl border transition-all ${
                    selectedRole === 'prep_cook' 
                      ? 'bg-[#eff5f0] border-[#1c3422] text-[#1c3422] shadow-sm' 
                      : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <Utensils className="w-4 h-4 mb-1" />
                  <span className={`text-[11px] text-center ${selectedRole === 'prep_cook' ? 'font-bold' : 'font-medium'}`}>Prep & Cook</span>
                </Pressable>

                <Pressable
                  type="button"
                  onClick={() => setSelectedRole('manager')}
                  className={`flex flex-col items-center justify-center py-3 px-1 rounded-2xl border transition-all col-span-2 sm:col-span-1 ${
                    selectedRole === 'manager' 
                      ? 'bg-[#eff5f0] border-[#1c3422] text-[#1c3422] shadow-sm' 
                      : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <Lock className="w-4 h-4 mb-1" />
                  <span className={`text-[11px] ${selectedRole === 'manager' ? 'font-bold' : 'font-medium'}`}>Manager</span>
                </Pressable>
              </div>
            </div>

            {/* Submit Button */}
            <Pressable
              type="submit"
              className="w-full bg-[#1c3422] hover:bg-[#2a4d33] text-white font-bold py-4 rounded-2xl transition-all flex justify-center items-center gap-2 mt-4 active:scale-[0.98] shadow-md"
            >
              Sign In
              <ArrowRight className="w-5 h-5" />
            </Pressable>
          </form>
        </div>
      </div>
    </div>
  );
}
