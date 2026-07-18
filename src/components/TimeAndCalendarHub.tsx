import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  Clock, Calendar, ChevronDown, ChevronUp, Coffee, Utensils, Moon, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { createPortal } from 'react-dom';
import { triggerHaptic } from '../lib/haptics';
import { MenuItem } from '../types';

interface TimeAndCalendarHubProps {
  menuItems?: MenuItem[];
  title?: React.ReactNode;
  actions?: React.ReactNode;
  selectedDay: string;
  onDayChange: (day: string) => void;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const getJuly2026Days = () => {
  const days = [];
  for (let i = 0; i < 3; i++) {
    days.push({ dayNum: 28 + i, isCurrentMonth: false, dateObj: new Date(2026, 5, 28 + i) });
  }
  for (let i = 1; i <= 31; i++) {
    days.push({ dayNum: i, isCurrentMonth: true, dateObj: new Date(2026, 6, i) });
  }
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push({ dayNum: i, isCurrentMonth: false, dateObj: new Date(2026, 7, i) });
  }
  return days;
};

export default function TimeAndCalendarHub({
  selectedDay,
  onDayChange,
  selectedDate,
  onDateChange,
  menuItems = [],
  title,
  actions
}: TimeAndCalendarHubProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [timeMode, setTimeMode] = useState<'live' | 'breakfast' | 'lunch' | 'dinner' | 'prep'>('live');
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [displaySeconds, setDisplaySeconds] = useState(true);
  const [popupDate, setPopupDate] = useState<Date | null>(null);

  useEffect(() => {
    if (timeMode !== 'live') return;
    setCurrentTime(new Date());
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, [timeMode]);

  useEffect(() => {
    if (timeMode === 'live') {
      const today = new Date();
      if (
        selectedDate.getFullYear() !== today.getFullYear() ||
        selectedDate.getMonth() !== today.getMonth() ||
        selectedDate.getDate() !== today.getDate()
      ) {
        onDateChange(today);
      }
      const dayName = WEEKDAYS[today.getDay()];
      if (selectedDay !== dayName) {
        onDayChange(dayName);
      }
    } else {
      const baseDate = new Date(selectedDate);
      if (timeMode === 'breakfast') {
        baseDate.setHours(8, 30, 0);
      } else if (timeMode === 'lunch') {
        baseDate.setHours(13, 15, 0);
      } else if (timeMode === 'dinner') {
        baseDate.setHours(20, 0, 0);
      } else if (timeMode === 'prep') {
        baseDate.setHours(16, 30, 0);
      }
      setCurrentTime(baseDate);
    }
  }, [timeMode, selectedDate, selectedDay, onDateChange, onDayChange]);

  const getShiftDetails = (time: Date) => {
    const hours = time.getHours();
    if (hours < 11) {
      return {
        name: 'Breakfast Shift',
        timeRange: 'Morning Service',
        icon: <Coffee className="w-5 h-5 text-[#2C4134]" />,
        color: 'from-amber-50 to-orange-50 text-amber-900 border-amber-200/50',
        progress: Math.min(100, Math.max(0, ((hours - 6) * 60 + time.getMinutes()) / 240 * 100)),
        statusText: 'Recording morning meal counts.'
      };
    } else if (hours >= 11 && hours < 16) {
      return {
        name: 'Lunch Shift',
        timeRange: 'Mid-Day Service',
        icon: <Utensils className="w-5 h-5 text-[#2C4134]" />,
        color: 'from-emerald-50 to-teal-50 text-emerald-900 border-emerald-200/50',
        progress: Math.min(100, Math.max(0, ((hours - 11) * 60 + time.getMinutes()) / 300 * 100)),
        statusText: 'Lunch rush is on. Monitoring ingredients.'
      };
    } else {
      return {
        name: 'Dinner Shift',
        timeRange: 'Evening Service',
        icon: <Moon className="w-5 h-5 text-[#2C4134]" />,
        color: 'from-indigo-50 to-purple-50 text-indigo-900 border-indigo-200/50',
        progress: Math.min(100, Math.max(0, ((hours - 16) * 60 + time.getMinutes()) / 360 * 100)),
        statusText: "Serving dinner. Preparing tomorrow's orders."
      };
    }
  };

  const shift = getShiftDetails(currentTime);

  const handleDayClick = (dayObj: any) => {
    triggerHaptic('medium');
    onDateChange(dayObj.dateObj);
    const dayName = WEEKDAYS[dayObj.dateObj.getDay()];
    onDayChange(dayName);
    setPopupDate(dayObj.dateObj);
  };

  const julyDays = getJuly2026Days();

  return (
    <div className="bg-transparent relative z-30">
      <div className="max-w-7xl mx-auto px-1 md:px-4 py-1 flex items-center gap-2 text-xs w-full overflow-x-auto hide-scrollbar">
        {/* Pulsing clock badge (Left Side) */}
        <div className="flex items-center gap-2 bg-[#D1EBD9] text-[#16321F] px-3 py-1.5 rounded-full font-bold shadow-sm shrink-0">
          <Clock className="w-4 h-4 text-[#16321F]" />
          <span className="font-mono text-sm leading-none tracking-tight">
            {currentTime.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}
          </span>
        </div>

        {/* Active Shift badge (Acts as Calendar Toggle) */}
        <button
          type="button"
          onClick={() => { triggerHaptic('light'); setIsOpen(!isOpen); }}
          className="px-3 py-1.5 rounded-full bg-[#F5F7F8] border border-gray-100/60 flex items-center gap-2 shadow-sm hover:bg-[#E8ECEA] transition-colors font-bold active:scale-95 flex-1 w-full justify-between sm:justify-start min-w-0"
        >
          <div className="flex items-center gap-2 truncate">
            {shift.icon}
            <span className="text-sm font-bold text-[#1F2C24] truncate">
              {shift.name} <span className="hidden sm:inline">({shift.timeRange})</span>
            </span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Calendar className="w-4 h-4 text-[#1F2C24]/50 hidden sm:block" />
            {isOpen ? <ChevronUp className="w-4 h-4 text-[#1F2C24]/60" /> : <ChevronDown className="w-4 h-4 text-[#1F2C24]/60" />}
          </div>
        </button>
      </div>

      {/* Expandable Calendar and Time Machine Console */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute left-0 right-0 top-full overflow-y-auto overscroll-y-contain bg-[#F5F7F8] border-b border-gray-200/40 shadow-xl max-h-[75vh] z-50 rounded-b-[24px]"
          >
            <div className="max-w-sm mx-auto px-4 md:px-8 py-6 w-full pb-8">
              
              {/* Column 1: Interactive Calendar Picker */}
              <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xs font-medium text-gray-400 font-mono">
                      Interactive Calendar
                    </h3>
                    <span className="text-xs font-extrabold text-[#16321F] bg-[#D1EBD9] px-2.5 py-0.5 rounded-xl font-display">
                      July 2026
                    </span>
                  </div>
                  
                  {/* Calendar Grid Header */}
                  <div className="grid grid-cols-7 gap-1 text-center font-mono text-xs font-medium text-gray-400 mb-1">
                    <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                  </div>
                  
                  {/* Calendar Days */}
                  <div className="grid grid-cols-7 gap-1">
                    {julyDays.map((day, idx) => {
                      const isSelected = selectedDate.getDate() === day.dayNum && selectedDate.getMonth() === day.dateObj.getMonth();
                      const isRealCurrent = day.dayNum === 9 && day.dateObj.getMonth() === 6; // July 9 2026
                      
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleDayClick(day)}
                          className={`h-7 rounded-[20px] text-xs font-bold transition-all relative flex flex-col items-center justify-center cursor-pointer ${
                            !day.isCurrentMonth
                              ? 'text-gray-300 pointer-events-none'
                              : isSelected
                              ? 'bg-[#16321F] text-white font-bold shadow-xs'
                              : 'text-gray-700 hover:bg-emerald-50'
                          }`}
                        >
                          <span>{day.dayNum}</span>
                          {isRealCurrent && (
                            <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-amber-400 animate-ping" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="text-xs text-gray-500 font-semibold border-t border-gray-100 mt-3 pt-2">
                  Selecting a date automatically recalculates the meal rotations, Student RSVPs, and ingredients weight!
                </div>
              </div>

                          </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menu Popup Modal */}
      {typeof document !== 'undefined' ? createPortal(
        <AnimatePresence>
          {popupDate && (
            <div className="fixed inset-0 z-[100] flex items-start justify-center pt-8 px-4 pb-4 pointer-events-auto">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setPopupDate(null)}
              />
              <motion.div 
                initial={{ opacity: 0, y: "100%" }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="relative bg-white dark:bg-[#121212] w-full max-w-md rounded-[24px] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] z-[101]"
              >
                <div className="sticky top-0 z-10 p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white/95 dark:bg-[#121212]/95 backdrop-blur-md">
                  <div>
                    <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">
                      {WEEKDAYS[popupDate.getDay()]}'s Menu
                    </h3>
                    <p className="text-xs font-medium text-gray-500">
                      {popupDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <button 
                    onClick={() => setPopupDate(null)}
                    className="p-2 bg-gray-100 dark:bg-[#222] rounded-full hover:bg-gray-200 dark:hover:bg-[#333] transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </button>
                </div>
                
                <div className="overflow-y-auto p-4 space-y-4">
                  {['breakfast', 'lunch', 'dinner'].map((shift) => {
                    const shiftItems = (menuItems || []).filter(item => 
                      item.dayOfWeek === WEEKDAYS[popupDate.getDay()] && item.mealType === shift
                    );
                    
                    if (shiftItems.length === 0) return null;
                    
                    return (
                      <div key={shift}>
                        <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                          {shift === 'breakfast' ? <Coffee className="w-3.5 h-3.5" /> : shift === 'lunch' ? <Utensils className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                          {shift}
                        </h4>
                        <div className="space-y-2">
                          {shiftItems.map(item => (
                            <div key={item.id} className="bg-gray-50 dark:bg-[#1a1a1a] px-3 py-2.5 rounded-[12px] border border-gray-100 dark:border-gray-800 flex items-center">
                              <h5 className="text-sm font-bold text-gray-900 dark:text-white leading-snug">{item.name}</h5>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  
                  {(menuItems || []).filter(item => item.dayOfWeek === WEEKDAYS[popupDate.getDay()]).length === 0 && (
                    <div className="py-6 text-center text-gray-500 text-sm font-medium">
                      No menu items scheduled for this day.
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
                </AnimatePresence>,
        document.body
      ) : null}
    </div>
  );
}
