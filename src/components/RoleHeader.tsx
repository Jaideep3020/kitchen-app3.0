import React from 'react';
import { Sun, Moon, LogOut, RefreshCw, Building2, Menu } from 'lucide-react';
import { Pressable } from './Pressable';
import { triggerHaptic } from '../lib/haptics';

export interface RoleHeaderProps {
  roleName: string;
  roleBadge?: string;
  userName?: string;
  orgId?: string;
  roleIcon?: React.ReactNode;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onLogout: () => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  onMenuToggle?: () => void;
  avatarInitials?: string;
}

export const RoleHeader: React.FC<RoleHeaderProps> = ({
  roleName,
  roleBadge,
  userName,
  orgId = 'org_001',
  roleIcon,
  darkMode,
  onToggleDarkMode,
  onLogout,
  onRefresh,
  refreshing = false,
  onMenuToggle,
  avatarInitials,
}) => {
  const displayName = userName || roleName;
  const badgeText = roleBadge || roleName;
  const initials = avatarInitials || displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#121212]/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 py-2.5">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        {/* Left identity section */}
        <div className="flex items-center gap-2.5">
          {roleIcon && (
            <div className="w-9 h-9 rounded-xl bg-[#16321F] text-[#D9E96B] flex items-center justify-center font-bold shadow-xs shrink-0">
              {roleIcon}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="font-extrabold text-sm sm:text-base tracking-tight text-gray-900 dark:text-white truncate max-w-[160px] sm:max-w-none">
                {displayName}
              </h1>
              <span className="bg-[#16321F]/10 dark:bg-[#D9E96B]/20 text-[#16321F] dark:text-[#D9E96B] text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border border-[#16321F]/20 dark:border-[#D9E96B]/30 whitespace-nowrap">
                {badgeText}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400 font-mono">
              <Building2 className="w-3 h-3 text-gray-400 shrink-0" />
              <span>ORG: {orgId}</span>
            </div>
          </div>
        </div>

        {/* Right action controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {onRefresh && (
            <Pressable
              onClick={() => {
                triggerHaptic('light');
                onRefresh();
              }}
              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Pressable>
          )}

          <Pressable
            onClick={() => {
              triggerHaptic('light');
              onToggleDarkMode();
            }}
            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            title="Toggle Theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </Pressable>

          {onMenuToggle && (
            <Pressable
              onClick={() => {
                triggerHaptic('light');
                onMenuToggle();
              }}
              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              title="Menu"
            >
              <Menu className="w-4 h-4" />
            </Pressable>
          )}

          <div className="w-7 h-7 rounded-full bg-[#16321F] text-[#D9E96B] font-extrabold text-[11px] flex items-center justify-center border border-[#D9E96B]/30 shadow-xs">
            {initials}
          </div>

          <Pressable
            onClick={() => {
              triggerHaptic('light');
              onLogout();
            }}
            className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </Pressable>
        </div>
      </div>
    </header>
  );
};
