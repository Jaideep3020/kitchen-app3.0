import React, { useState } from 'react';
import { LogOut, Flame } from 'lucide-react';
import { Pressable } from './Pressable';

interface StudentProfileProps {
  onSignOut: () => void;
  email?: string;
}

type MealType = 'breakfast' | 'lunch' | 'dinner';

const MEAL_DATA: Record<MealType, { streak: number; days: number[] }> = {
  breakfast: { streak: 4, days: [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0] },
  lunch:     { streak: 12, days: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1] },
  dinner:    { streak: 9, days: [1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0] }
};

export default function StudentProfile({ onSignOut, email = 'student@kitchenops.edu' }: StudentProfileProps) {
  const initials = email.split('@')[0].slice(0, 2).toUpperCase() || 'ST';
  const displayName = email.split('@')[0] || 'Student';

  const [selectedMeal, setSelectedMeal] = useState<MealType>('dinner');
  const [selectedDayTooltip, setSelectedDayTooltip] = useState<string>('Tap a day to see details');

  const currentData = MEAL_DATA[selectedMeal];
  const mealTitle = selectedMeal.charAt(0).toUpperCase() + selectedMeal.slice(1);

  const handleDayClick = (dayNum: number, attended: boolean) => {
    setSelectedDayTooltip(`Day ${dayNum}: ${attended ? 'attended' : 'not attended'}`);
  };

  return (
    <div id="student_profile" className="flex-1 max-w-[480px] mx-auto w-full font-sans pb-24">
      {/* Compact Sticky Identity Header Bar (avatar, name, room info) */}
      <div className="sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-4 py-2.5 border-b border-gray-100 dark:border-gray-800 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-[#185fa5] dark:text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-200/50 dark:border-emerald-800/40">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white capitalize leading-tight truncate">{displayName}</h3>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium truncate">Banyan Hall • Room 304</p>
          </div>
        </div>

        {/* Meal Type Toggle directly inside sticky container */}
        <div className="flex gap-1.5 mt-2 bg-gray-100 dark:bg-gray-800/80 p-1 rounded-xl">
          {(['breakfast', 'lunch', 'dinner'] as MealType[]).map((meal) => {
            const isSelected = selectedMeal === meal;
            return (
              <button
                key={meal}
                type="button"
                onClick={() => {
                  setSelectedMeal(meal);
                  setSelectedDayTooltip('Tap a day to see details');
                }}
                className={`flex-1 text-xs font-semibold py-1.5 px-3 rounded-lg transition-all capitalize cursor-pointer ${
                  isSelected
                    ? 'bg-[#16321F] dark:bg-[#D9E96B] text-white dark:text-[#16321F] shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {meal}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-4 pt-4">
        {/* Meal Streak Card (scrolls normally) */}
        <div className="bg-white dark:bg-gray-800/80 rounded-[16px] border border-gray-100 dark:border-gray-700/60 p-4 mb-4 shadow-xs">
          <div className="flex justify-between items-center mb-1">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{mealTitle} streak</p>
            <Flame className="w-5 h-5 text-amber-600 fill-amber-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{currentData.streak} days</p>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">Based on confirmed attendance, updates automatically</p>
        </div>

        {/* Monthly Attendance Heatmap (scrolls normally) */}
        <div className="bg-white dark:bg-gray-800/80 rounded-[16px] border border-gray-100 dark:border-gray-700/60 p-4 mb-6 shadow-xs">
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3">{mealTitle} attendance this month</p>
          
          {/* Days of week headers */}
          <div className="grid grid-cols-7 gap-2 mb-2 text-center text-[10px] font-bold text-gray-400 dark:text-gray-500">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
              <div key={idx}>{day}</div>
            ))}
          </div>

          {/* Heatmap Grid */}
          <div className="grid grid-cols-7 gap-2">
            {currentData.days.map((attended, idx) => {
              const dayNum = idx + 1;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleDayClick(dayNum, !!attended)}
                  className={`aspect-square rounded-md transition-all cursor-pointer flex items-center justify-center text-[10px] font-bold ${
                    attended
                      ? 'bg-[#16321F] dark:bg-[#D9E96B] text-white dark:text-[#16321F] hover:opacity-90'
                      : 'bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-400 dark:text-gray-500 hover:bg-gray-200'
                  }`}
                  title={`Day ${dayNum}: ${attended ? 'attended' : 'not attended'}`}
                >
                  {dayNum}
                </button>
              );
            })}
          </div>

          {/* Tooltip / Hint */}
          <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-3 min-h-[18px]">
            {selectedDayTooltip}
          </p>
        </div>

        {/* Sign Out Action */}
        <Pressable
          onClick={onSignOut}
          className="w-full h-11 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 font-bold rounded-[16px] transition-all flex items-center justify-center gap-2 border border-red-100 dark:border-red-900/40 shadow-xs"
        >
          <LogOut className="w-4 h-4" />
          Sign Out / Change User Role
        </Pressable>
      </div>
    </div>
  );
}
