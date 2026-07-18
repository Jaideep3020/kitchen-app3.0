import React, { useState, useEffect } from 'react';
import { Utensils, User, Lock, Eye, EyeOff, ArrowRight, Mail } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';

interface SignInProps {
  onSignIn: (role: 'student' | 'staff' | 'manager', email: string) => void;
}

export default function SignIn({ onSignIn }: SignInProps) {
  const { users } = useData();
  const { addToast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'student' | 'staff' | 'manager'>('student');
  
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
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Invalid email or password');
        return;
      }

      const data = await res.json();
      const user = data.user;

      if (user.role !== selectedRole) {
        setError(`This account does not have ${selectedRole} access.`);
        return;
      }

      onSignIn(user.role as 'student' | 'staff' | 'manager', user.email);
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
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold tracking-widest text-[#4e6a57] uppercase">
                Select Role
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRole('student')}
                  className={`flex flex-col items-center justify-center py-4 rounded-2xl border transition-all ${
                    selectedRole === 'student' 
                      ? 'bg-[#eff5f0] border-[#1c3422] text-[#1c3422] shadow-sm' 
                      : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <User className="w-6 h-6 mb-2" />
                  <span className={`text-sm ${selectedRole === 'student' ? 'font-bold' : 'font-medium'}`}>Student</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('staff')}
                  className={`flex flex-col items-center justify-center py-4 rounded-2xl border transition-all ${
                    selectedRole === 'staff' 
                      ? 'bg-[#eff5f0] border-[#1c3422] text-[#1c3422] shadow-sm' 
                      : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <Utensils className="w-6 h-6 mb-2" />
                  <span className={`text-sm ${selectedRole === 'staff' ? 'font-bold' : 'font-medium'}`}>Staff</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('manager')}
                  className={`flex flex-col items-center justify-center py-4 rounded-2xl border transition-all ${
                    selectedRole === 'manager' 
                      ? 'bg-[#eff5f0] border-[#1c3422] text-[#1c3422] shadow-sm' 
                      : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <Lock className="w-6 h-6 mb-2" />
                  <span className={`text-sm ${selectedRole === 'manager' ? 'font-bold' : 'font-medium'}`}>Manager</span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#1c3422] hover:bg-[#2a4d33] text-white font-bold py-4 rounded-2xl transition-all flex justify-center items-center gap-2 mt-4 active:scale-[0.98] shadow-md"
            >
              Sign In
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
