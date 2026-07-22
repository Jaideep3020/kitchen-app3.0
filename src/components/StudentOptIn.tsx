import { Pressable } from './Pressable';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import FocusTrap from 'focus-trap-react';
import ScrollAffordance from './ScrollAffordance';
import { 
  Calendar, Flame, AlertCircle, CheckCircle2, 
  ChevronRight, ListCollapse, Utensils, Sparkles, 
  Scale, Clock, Star, Heart, Check, Trash2, ArrowUpRight,
  X, Camera, Lock
} from 'lucide-react';
import { MenuItem } from '../types';
import { triggerHaptic } from '../lib/haptics';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';

interface StudentOptInProps {
 menuItems: MenuItem[];
 onConfirm: (choices: { [key: string]: any }) => void;
 studentChoices: { [key: string]: any };
 setStudentChoices: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
 activeDay?: string;
 onActiveDayChange?: (day: string) => void;
}

type DayType = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export default function StudentOptIn({ 
 menuItems, 
 onConfirm, 
 studentChoices, 
 setStudentChoices,
 activeDay,
 onActiveDayChange
}: StudentOptInProps) {
 const { setMealOptIns, sharedConfig, prepItems, recipes, activeWeekStartDate, currentUserEmail } = useData();
 const getDishIngredients = (dishId: string): string[] => {
   if (!recipes || !prepItems) return [];
   return recipes
     .filter((r: any) => String(r.menuItemId) === String(dishId))
     .map((r: any) => {
       const item = prepItems.find((p: any) => String(p.id) === String(r.ingredientId));
       return item ? item.name : '';
     })
     .filter(Boolean);
 };
 const { addToast } = useToast();
 const [isLoading, setIsLoading] = React.useState(true);

 // States for Student-Facing Quality Complaints
 const [issueDish, setIssueDish] = useState<MenuItem | null>(null);
 const [photoBase64, setPhotoBase64] = useState<string>('');
 const [isSubmittingIssue, setIsSubmittingIssue] = useState(false);
 const [showIssueDetails, setShowIssueDetails] = useState(false);

 const DAY_MAP: { [key: string]: number } = {
 'Sunday': 0,
 'Monday': 1,
 'Tuesday': 2,
 'Wednesday': 3,
 'Thursday': 4,
 'Friday': 5,
 'Saturday': 6
 };

 // Simulate skeleton loaders for high-performance feel
 React.useEffect(() => {
 const timer = setTimeout(() => {
 setIsLoading(false);
 }, 400);
 return () => clearTimeout(timer);
 }, []);

 const [localSelectedDay, setLocalSelectedDay] = useState<DayType>('Thursday');
 const selectedDay = (activeDay as DayType) || localSelectedDay;
 const setSelectedDay = (day: DayType) => {
 if (onActiveDayChange) {
 onActiveDayChange(day);
 } else {
 setLocalSelectedDay(day);
 }
 };

 const [confirmed, setConfirmed] = useState(false);
 const [isDayLoading, setIsDayLoading] = useState(false);

 const days: DayType[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

 // RSVP 9 PM cutoff night prior checking
 const checkIsMealLocked = (targetDay: string): { locked: boolean; reason?: string } => {
 const now = new Date();
 const currentDayIndex = now.getDay(); // 0-6
 const targetDayIndex = DAY_MAP[targetDay];
 
 if (targetDayIndex === undefined) return { locked: false };

 // Normalize indexes to Monday (0) to Sunday (6)
 const currentDayNorm = currentDayIndex === 0 ? 6 : currentDayIndex - 1;
 const targetDayNorm = targetDayIndex === 0 ? 6 : targetDayIndex - 1;

 const currentHour = now.getHours();

 if (targetDayNorm < currentDayNorm) {
   return { locked: true, reason: 'This day is in the past' };
 } else if (targetDayNorm === currentDayNorm) {
   // FOR THE PRESENT DAY (TODAY):
   // Show the optin option for the present day by default (unlocked).
   // Block the optin option if the cutoff is exempted/enforced.
   if (sharedConfig?.config?.cutoffExempted) {
     return { locked: true, reason: 'RSVP closed (cutoff is exempted/enforced today)' };
   }
   return { locked: false };
 } else if (targetDayNorm === currentDayNorm + 1) {
   if (currentHour >= 21) {
     return { locked: true, reason: 'Locked: passed 9 PM cutoff night prior' };
   }
 }
 return { locked: false };
 };

 const lockStatus = checkIsMealLocked(selectedDay);

 // Meal Choice Options Definition
 const getDishOptions = (dish: MenuItem): string[] | null => {
 if (dish.id === 'tue_dn' || dish.name.toLowerCase().includes('egg / paneer')) {
 return ['Boiled Egg', 'Paneer'];
 }
 if (dish.id === 'fri_bf' || dish.name.toLowerCase().includes('egg / fruit')) {
 return ['Boiled Egg', 'Fruit'];
 }
 if (dish.id === 'sun_lh' || dish.name.toLowerCase().includes('chicken curry / paneer masala')) {
 return ['Chicken Curry', 'Paneer Masala'];
 }
 return null;
 };

      const handleToggle = async (dishId: string) => {
    const isCurrentlyOptedIn = !!studentChoices[dishId];
    const dish = menuItems.find(d => d.id === dishId);
    if (!dish) return;

    // Get default choice if dish has options
    const options = getDishOptions(dish);
    const choiceValue = options ? options[0] : null;

    // Optimistic update
    const nextChoices = { ...studentChoices, [dishId]: !isCurrentlyOptedIn };
    if (!isCurrentlyOptedIn && options) {
      nextChoices[`${dishId}_choice`] = options[0];
    }
    setStudentChoices(nextChoices);
    onConfirm(nextChoices);
    
    setMealOptIns(prev => ({
      ...prev,
      [dishId]: Math.max(0, (prev[dishId] || 0) + (isCurrentlyOptedIn ? -1 : 1))
    }));

    triggerHaptic('success');
    addToast(isCurrentlyOptedIn ? `Opted out of ${dish.name}` : `Opted into ${dish.name}`, isCurrentlyOptedIn ? 'info' : 'success');

    // Calculate actual date based on activeWeekStartDate and dish.dayOfWeek
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const dateObj = new Date(activeWeekStartDate);
    dateObj.setDate(dateObj.getDate() + Math.max(0, days.indexOf(dish.dayOfWeek || 'Monday')));
    const dateStr = dateObj.toISOString().split('T')[0];

    try {
      const res = await fetch('/api/rsvps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: currentUserEmail,
          date: dateStr,
          mealType: dish.mealType,
          attending: !isCurrentlyOptedIn,
          choice: choiceValue,
          dishId: dish.id
        })
      });
      if (!res.ok) throw new Error('Network response was not ok');
    } catch (err) {
      console.error(err);
      addToast('Failed to save RSVP to server', 'error');
      // Rollback on error
      setStudentChoices(studentChoices);
      setMealOptIns(prev => ({
        ...prev,
        [dishId]: Math.max(0, (prev[dishId] || 0) + (isCurrentlyOptedIn ? 1 : -1))
      }));
    }
  };

 const handleConfirmClick = () => {
 triggerHaptic('success');
 onConfirm(studentChoices);
 setConfirmed(true);
 setTimeout(() => {
 setConfirmed(false);
 }, 4000);
 };

 const handleDaySwitch = (day: DayType) => {
 triggerHaptic('medium');
 setSelectedDay(day);
 setIsDayLoading(true);
 setConfirmed(false);
 };

 // Automatically trigger transition fade-in whenever the selectedDay is changed from external sources (e.g., Calendar)
 useEffect(() => {
 setIsDayLoading(true);
 setConfirmed(false);
 }, [selectedDay]);

 useEffect(() => {
 if (!isDayLoading) return;
 const timer = setTimeout(() => {
 setIsDayLoading(false);
 }, 400);
 return () => clearTimeout(timer);
 }, [isDayLoading]);

 // Filter menu items for selected day
 const filteredDishes = menuItems.filter(dish => dish.dayOfWeek === selectedDay);

 // Group by mealType
 const breakfastDish = filteredDishes.find(d => d.mealType === 'breakfast');
 const lunchDish = filteredDishes.find(d => d.mealType === 'lunch');
 const dinnerDish = filteredDishes.find(d => d.mealType === 'dinner');

 // Calculate footprint of opted-in items for selected day
 const selectedDayDishes = filteredDishes.filter(d => studentChoices[d.id]);
 const totalCalories = selectedDayDishes.reduce((sum, d) => sum + d.calories, 0);
 const materialsUtilized = Array.from(
 new Set(selectedDayDishes.flatMap(d => getDishIngredients(d.id)))
 );

 if (isLoading) {
 return (
 <div className="flex-grow max-w-7xl mx-auto w-full px-4 md:px-8 py-6 space-y-6">
 <div className="flex justify-between items-end pb-4 border-b border-gray-100">
 <div className="space-y-2">
 <div className="h-4 w-32 bg-gray-200 rounded-xl animate-skeleton-pulse"></div>
 <div className="h-8 w-48 bg-gray-300 rounded-[20px] animate-skeleton-pulse"></div>
 </div>
 </div>
 <div className="h-16 bg-gray-100 rounded-[20px] animate-skeleton-pulse mt-6"></div>
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
 {[...Array(3)].map((_, i) => (
 <div key={i} className="h-56 bg-gray-100 rounded-[24px] animate-skeleton-pulse"></div>
 ))}
 </div>
 </div>
 );
 }

 return (
 <div id="student_opt_in" className="flex-1 max-w-[1200px] mx-auto w-full px-4 pb-24 space-y-6">
 
 {/* Premium Success Modal Banner */}
 {confirmed && (
 <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#16321F]/95 backdrop-blur-md text-white px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-3 animate-bounce border border-emerald-400/20">
 <Check className="w-5 h-5 text-emerald-400 bg-white/10 rounded-full p-0.5" />
 <span className="text-xs font-extrabold ">Your 7-Day booking choices have been locked!</span>
 </div>
 )}

 {/* Hero Welcome Banner */}
 <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pt-2">
 <div>
 <span className="text-xs font-bold text-[#16321F] font-mono bg-emerald-50 px-2 py-1 rounded-xl">
 Wasteless Dining System
 </span>
 <h2 className="text-3xl font-extrabold text-[#0A170E] mt-1.5 font-display leading-tight">
 South Indian Mess Planner
 </h2>
 
 </div>

 {/* Dynamic footprint glass badge */}
 {selectedDayDishes.length > 0 && (
 <div className="bg-[#16321F]/10 border border-[#16321F]/15 rounded-[24px] px-5 py-3 text-right flex items-center gap-3">
 <div className="w-9 h-9 rounded-full bg-[#16321F] text-[#D9E96B] flex items-center justify-center">
 <Sparkles className="w-4 h-4 fill-current" />
 </div>
 <div>
 <span className="text-xs font-medium text-[#16321F] block font-mono">
 Daily Allotment Footprint
 </span>
 <span className="text-xs font-bold text-gray-800">
 {selectedDayDishes.length} Selected • {totalCalories} Calories
 </span>
 </div>
 </div>
 )}
 </div>

 {/* 7-Day Smooth Horizon Slider */}
 <ScrollAffordance className="bg-white/80 backdrop-blur-md p-2 rounded-[24px] border border-gray-100 flex gap-2" fadeColorClass="from-white dark:from-[#121212]">
 {days.map((day) => {
 const isActive = selectedDay === day;
 const dayDishIds = menuItems.filter(d => d.dayOfWeek === day).map(d => d.id);
 const activeCountOnDay = dayDishIds.filter(id => studentChoices[id]).length;

 return (
 <Pressable
 key={day}
 type="button"
 onClick={() => handleDaySwitch(day)}
 className={`w-16 h-16 rounded-full font-bold transition-all flex flex-col items-center justify-center shrink-0 snap-center ${
                isActive
                  ? 'bg-[#16321F] text-white shadow-sm scale-105'
                  : 'bg-transparent text-gray-500 hover:bg-gray-100'
              }`}
 >
 <span className="font-display text-xs">{day.substring(0, 3)}</span>
 <span className="text-xs font-bold opacity-50">{day.substring(3)}</span>
 {activeCountOnDay > 0 ? (
 <span className={`text-xs font-bold mt-1.5 px-1.5 py-0.5 rounded-xl ${
 isActive ? 'bg-white/20 text-white' : 'bg-emerald-50 text-[#16321F] border border-emerald-100'
 }`}>
 {activeCountOnDay} {activeCountOnDay === 1 ? 'Meal' : 'Meals'}
 </span>
 ) : (
 <span className="text-xs font-medium text-gray-400 mt-1.5">No meal</span>
 )}
 </Pressable>
 );
 })}
 </ScrollAffordance>

 {/* Staples Alert Strip */}
 <div className="bg-gradient-to-r from-emerald-50/60 to-teal-50/60 rounded-[24px] border border-emerald-100/60 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
 <div className="flex items-start gap-2.5">
 <Utensils className="w-4 h-4 text-[#16321F] shrink-0 mt-0.5" />
 <div>
 <span className="font-extrabold text-[#0A170E] block">Unlimited Access Staples Included</span>
 <p className="text-gray-500 font-semibold mt-0.5">
 White rice, spiced sambar, local pickles, and papads are permanently stocked and served on-demand.
 </p>
 </div>
 </div>
 <span className="bg-[#16321F]/10 text-[#16321F] font-bold px-3 py-1 rounded-[20px] text-xs w-fit font-mono shrink-0">
 STAPLES ASSURED
 </span>
 </div>

 {/* Cutoff / Locked Info Banner */}
 {lockStatus.locked && (
 <div className="bg-amber-50 border border-amber-200/80 rounded-[24px] p-4 flex items-center gap-3 text-amber-800 text-xs font-semibold animate-fadeIn mb-2">
 <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
 <div>
 <span className="font-extrabold block">Booking Locked for {selectedDay}</span>
 <p className="text-amber-700 font-medium mt-0.5">
 {lockStatus.reason || 'RSVP for this day is closed because the 9 PM prior night cutoff has passed.'}
 </p>
 </div>
 </div>
 )}

 {/* Main Grid: Card layout or skeleton loader */}
 {isDayLoading ? (
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 {[1, 2, 3].map((idx) => (
 <div key={idx} className="bg-white rounded-[24px] p-5 border border-gray-100 space-y-4 animate-skeleton-pulse">
 <div className="h-40 w-full bg-gray-200 rounded-[20px]"></div>
 <div className="h-6 w-2/3 bg-gray-200 rounded-[20px]"></div>
 <div className="h-4 w-full bg-gray-100 rounded-[20px]"></div>
 <div className="h-10 w-full bg-gray-200 rounded-[20px]"></div>
 </div>
 ))}
 </div>
 ) : (
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 
 {/* Breakfast Card */}
 {breakfastDish && (
 <div
   className={`bg-white rounded-[24px] shadow-xs border flex flex-col overflow-hidden transition-all duration-300 relative group hover:shadow-sm ${
     studentChoices[breakfastDish.id] ? 'border-[#16321F] ring-1 ring-[#16321F]/10' : 'border-gray-100'
   }`}
 >
   <div className="h-44 w-full relative overflow-hidden">
     <img 
       src={breakfastDish.image} 
       alt={breakfastDish.name} 
       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
       referrerPolicy="no-referrer"
     />
     <div className="absolute top-3 left-3 bg-white/95 text-[#0A170E] px-3 py-1 rounded-full text-xs font-medium shadow-2xs backdrop-blur-md font-mono">
       Breakfast • Morning
     </div>
   </div>

   <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
     <div className="space-y-1.5">
       <h3 className="text-lg font-extrabold text-[#0A170E] leading-snug font-display line-clamp-1">
         {breakfastDish.name}
       </h3>
       <p className="text-xs text-gray-500 leading-relaxed font-semibold line-clamp-2">{breakfastDish.description}</p>
     </div>

     {/* Allocated raw material list */}
     <div className="bg-gray-50 rounded-[20px] p-3 border border-gray-100/40 space-y-1.5">
       <span className="text-xs font-medium text-gray-500">Inventory Demand</span>
       <div className="flex flex-wrap gap-1">
         {getDishIngredients(breakfastDish.id).map(ing => (
           <span key={ing} className="bg-white border border-gray-200/50 rounded-[20px] px-2 py-0.5 text-xs font-medium text-gray-600">
             {ing}
           </span>
         ))}
       </div>
     </div>

     {getDishOptions(breakfastDish) && studentChoices[breakfastDish.id] && (
       <div className="mt-1 p-2 bg-gray-50 border border-gray-100 rounded-xl space-y-1 animate-tab-transition">
         <span className="text-[10px] font-bold text-gray-400 uppercase font-mono block">Choose Option</span>
         <div className="flex gap-1.5">
           {getDishOptions(breakfastDish)!.map(opt => {
             const choiceKey = `${breakfastDish.id}_choice`;
             const selectedOption = studentChoices[choiceKey] || getDishOptions(breakfastDish)![0];
             const isSelected = selectedOption === opt;
             return (
               <Pressable
                 key={opt}
                 type="button"
                 onClick={async () => {
                   const isCurrentlyOptedIn = !!studentChoices[breakfastDish.id];
                   const nextChoices = { ...studentChoices, [choiceKey]: opt };
                   setStudentChoices(nextChoices);
                   onConfirm(nextChoices);
                   addToast(`Selected ${opt} for ${breakfastDish.name}! 🍳`, 'success');
                   
                   
                   const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                   const dateObj = new Date(activeWeekStartDate);
                   dateObj.setDate(dateObj.getDate() + Math.max(0, days.indexOf(breakfastDish.dayOfWeek || 'Monday')));
                   const dateStr = dateObj.toISOString().split('T')[0];

                   try {
                     await fetch('/api/rsvps', {
                       method: 'POST',
                       headers: { 'Content-Type': 'application/json' },
                       body: JSON.stringify({
                         email: currentUserEmail,
                         date: dateStr,
                         mealType: breakfastDish.mealType,
                         attending: isCurrentlyOptedIn,
                         choice: opt,
                         dishId: breakfastDish.id
                       })
                     });
                   } catch (e) { console.error(e); }
                 }}
                 className="flex-1 py-1 px-1.5 min-h-[44px] rounded-lg text-xs font-bold transition-all text-center border cursor-pointer active:scale-95"
                 style={{
                   backgroundColor: isSelected ? '#16321F' : '#ffffff',
                   color: isSelected ? '#ffffff' : '#4b5563',
                   borderColor: isSelected ? '#16321F' : '#e5e7eb'
                 }}
               >
                 {opt === 'Boiled Egg' ? '🥚 Egg' : opt === 'Paneer' ? '🧀 Paneer' : opt === 'Fruit' ? '🍎 Fruit' : opt}
               </Pressable>
             );
           })}
         </div>
       </div>
     )}

     <div className="pt-3 border-t border-gray-100/60 flex items-center justify-between">
       <div className="flex flex-col">
         <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2.5 py-1 rounded-xl text-xs font-medium font-mono">
           <Flame className="w-3 h-3 text-[#16321F]" />
           {breakfastDish.calories} kcal
         </span>
         <Pressable
           type="button"
           onClick={() => {
             setIssueDish(breakfastDish);
             setPhotoBase64('');
             setShowIssueDetails(false);
           }}
           className="mt-2 text-[11px] font-extrabold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer w-fit transition-colors"
         >
           <AlertCircle className="w-3.5 h-3.5" />
           Report Quality
         </Pressable>
       </div>

       <Pressable
         disabled={lockStatus.locked}
         onClick={() => handleToggle(breakfastDish.id)}
         className={`px-4 h-10 rounded-[20px] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
           lockStatus.locked
             ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
             : studentChoices[breakfastDish.id]
             ? 'bg-[#D9E96B] text-[#16321F]'
             : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
         }`}
       >
         {lockStatus.locked ? (
           <>
             <Lock className="w-3.5 h-3.5 text-gray-400" />
             Locked
           </>
         ) : (
           <>
             <CheckCircle2 className={`w-4 h-4 ${studentChoices[breakfastDish.id] ? 'text-emerald-400 fill-[#16321F]' : 'text-current'}`} />
             {studentChoices[breakfastDish.id] ? 'Booked' : 'Opt In'}
           </>
         )}
       </Pressable>
     </div>
   </div>
 </div>
 )}

 {/* Lunch Card */}
 {lunchDish && (
 <div
   className={`bg-white rounded-[24px] shadow-xs border flex flex-col overflow-hidden transition-all duration-300 relative group hover:shadow-sm ${
     studentChoices[lunchDish.id] ? 'border-[#16321F] ring-1 ring-[#16321F]/10' : 'border-gray-100'
   }`}
 >
   <div className="h-44 w-full relative overflow-hidden">
     <img 
       src={lunchDish.image} 
       alt={lunchDish.name} 
       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
       referrerPolicy="no-referrer"
     />
     <div className="absolute top-3 left-3 bg-white/95 text-[#0A170E] px-3 py-1 rounded-full text-xs font-medium shadow-2xs backdrop-blur-md font-mono">
       Lunch • Afternoon
     </div>
   </div>

   <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
     <div className="space-y-1.5">
       <h3 className="text-lg font-extrabold text-[#0A170E] leading-snug font-display line-clamp-1">
         {lunchDish.name}
       </h3>
       <p className="text-xs text-gray-500 leading-relaxed font-semibold line-clamp-2">{lunchDish.description}</p>
     </div>

     {/* Allocated raw material list */}
     <div className="bg-gray-50 rounded-[20px] p-3 border border-gray-100/40 space-y-1.5">
       <span className="text-xs font-medium text-gray-500">Inventory Demand</span>
       <div className="flex flex-wrap gap-1">
         {getDishIngredients(lunchDish.id).map(ing => (
           <span key={ing} className="bg-white border border-gray-200/50 rounded-[20px] px-2 py-0.5 text-xs font-medium text-gray-600">
             {ing}
           </span>
         ))}
       </div>
     </div>

     {getDishOptions(lunchDish) && studentChoices[lunchDish.id] && (
       <div className="mt-1 p-2 bg-gray-50 border border-gray-100 rounded-xl space-y-1 animate-tab-transition">
         <span className="text-[10px] font-bold text-gray-400 uppercase font-mono block">Choose Option</span>
         <div className="flex gap-1.5">
           {getDishOptions(lunchDish)!.map(opt => {
             const choiceKey = `${lunchDish.id}_choice`;
             const selectedOption = studentChoices[choiceKey] || getDishOptions(lunchDish)![0];
             const isSelected = selectedOption === opt;
             return (
               <Pressable
                 key={opt}
                 type="button"
                 onClick={async () => {
                   const isCurrentlyOptedIn = !!studentChoices[lunchDish.id];
                   const nextChoices = { ...studentChoices, [choiceKey]: opt };
                   setStudentChoices(nextChoices);
                   onConfirm(nextChoices);
                   addToast(`Selected ${opt} for ${lunchDish.name}! 🍳`, 'success');
                   
                   
                   const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                   const dateObj = new Date(activeWeekStartDate);
                   dateObj.setDate(dateObj.getDate() + Math.max(0, days.indexOf(lunchDish.dayOfWeek || 'Monday')));
                   const dateStr = dateObj.toISOString().split('T')[0];

                   try {
                     await fetch('/api/rsvps', {
                       method: 'POST',
                       headers: { 'Content-Type': 'application/json' },
                       body: JSON.stringify({
                         email: currentUserEmail,
                         date: dateStr,
                         mealType: lunchDish.mealType,
                         attending: isCurrentlyOptedIn,
                         choice: opt,
                         dishId: lunchDish.id
                       })
                     });
                   } catch (e) { console.error(e); }
                 }}
                 className="flex-1 py-1 px-1.5 min-h-[44px] rounded-lg text-xs font-bold transition-all text-center border cursor-pointer active:scale-95"
                 style={{
                   backgroundColor: isSelected ? '#16321F' : '#ffffff',
                   color: isSelected ? '#ffffff' : '#4b5563',
                   borderColor: isSelected ? '#16321F' : '#e5e7eb'
                 }}
               >
                 {opt === 'Chicken Curry' ? '🍗 Chicken' : opt === 'Paneer Masala' ? '🧀 Paneer' : opt}
               </Pressable>
             );
           })}
         </div>
       </div>
     )}

     <div className="pt-3 border-t border-gray-100/60 flex items-center justify-between">
       <div className="flex flex-col">
         <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2.5 py-1 rounded-xl text-xs font-medium font-mono">
           <Flame className="w-3 h-3 text-[#16321F]" />
           {lunchDish.calories} kcal
         </span>
         <Pressable
           type="button"
           onClick={() => {
             setIssueDish(lunchDish);
             setPhotoBase64('');
             setShowIssueDetails(false);
           }}
           className="mt-2 text-[11px] font-extrabold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer w-fit transition-colors"
         >
           <AlertCircle className="w-3.5 h-3.5" />
           Report Quality
         </Pressable>
       </div>

       <Pressable
         disabled={lockStatus.locked}
         onClick={() => handleToggle(lunchDish.id)}
         className={`px-4 h-10 rounded-[20px] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
           lockStatus.locked
             ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
             : studentChoices[lunchDish.id]
             ? 'bg-[#D9E96B] text-[#16321F]'
             : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
         }`}
       >
         {lockStatus.locked ? (
           <>
             <Lock className="w-3.5 h-3.5 text-gray-400" />
             Locked
           </>
         ) : (
           <>
             <CheckCircle2 className={`w-4 h-4 ${studentChoices[lunchDish.id] ? 'text-emerald-400 fill-[#16321F]' : 'text-current'}`} />
             {studentChoices[lunchDish.id] ? 'Booked' : 'Opt In'}
           </>
         )}
       </Pressable>
     </div>
   </div>
 </div>
 )}

 {/* Dinner Card */}
 {dinnerDish && (
 <div
   className={`bg-white rounded-[24px] shadow-xs border flex flex-col overflow-hidden transition-all duration-300 relative group hover:shadow-sm ${
     studentChoices[dinnerDish.id] ? 'border-[#16321F] ring-1 ring-[#16321F]/10' : 'border-gray-100'
   }`}
 >
   <div className="h-44 w-full relative overflow-hidden">
     <img 
       src={dinnerDish.image} 
       alt={dinnerDish.name} 
       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
       referrerPolicy="no-referrer"
     />
     <div className="absolute top-3 left-3 bg-white/95 text-[#0A170E] px-3 py-1 rounded-full text-xs font-medium shadow-2xs backdrop-blur-md font-mono">
       Dinner • Evening
     </div>
   </div>

   <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
     <div className="space-y-1.5">
       <h3 className="text-lg font-extrabold text-[#0A170E] leading-snug font-display line-clamp-1">
         {dinnerDish.name}
       </h3>
       <p className="text-xs text-gray-500 leading-relaxed font-semibold line-clamp-2">{dinnerDish.description}</p>
     </div>

     {/* Allocated raw material list */}
     <div className="bg-gray-50 rounded-[20px] p-3 border border-gray-100/40 space-y-1.5">
       <span className="text-xs font-medium text-gray-500">Inventory Demand</span>
       <div className="flex flex-wrap gap-1">
         {getDishIngredients(dinnerDish.id).map(ing => (
           <span key={ing} className="bg-white border border-gray-200/50 rounded-[20px] px-2 py-0.5 text-xs font-medium text-gray-600">
             {ing}
           </span>
         ))}
       </div>
     </div>

     {getDishOptions(dinnerDish) && studentChoices[dinnerDish.id] && (
       <div className="mt-1 p-2 bg-gray-50 border border-gray-100 rounded-xl space-y-1.5 animate-tab-transition">
         <span className="text-[10px] font-bold text-gray-400 uppercase font-mono block">Choose Option</span>
         <div className="flex gap-1.5">
           {getDishOptions(dinnerDish)!.map(opt => {
             const choiceKey = `${dinnerDish.id}_choice`;
             const selectedOption = studentChoices[choiceKey] || getDishOptions(dinnerDish)![0];
             const isSelected = selectedOption === opt;
             return (
               <Pressable
                 key={opt}
                 type="button"
                 onClick={async () => {
                   const isCurrentlyOptedIn = !!studentChoices[dinnerDish.id];
                   const nextChoices = { ...studentChoices, [choiceKey]: opt };
                   setStudentChoices(nextChoices);
                   onConfirm(nextChoices);
                   addToast(`Selected ${opt} for ${dinnerDish.name}! 🍳`, 'success');
                   
                   
                   const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                   const dateObj = new Date(activeWeekStartDate);
                   dateObj.setDate(dateObj.getDate() + Math.max(0, days.indexOf(dinnerDish.dayOfWeek || 'Monday')));
                   const dateStr = dateObj.toISOString().split('T')[0];

                   try {
                     await fetch('/api/rsvps', {
                       method: 'POST',
                       headers: { 'Content-Type': 'application/json' },
                       body: JSON.stringify({
                         email: currentUserEmail,
                         date: dateStr,
                         mealType: dinnerDish.mealType,
                         attending: isCurrentlyOptedIn,
                         choice: opt,
                         dishId: dinnerDish.id
                       })
                     });
                   } catch (e) { console.error(e); }
                 }}
                 className="flex-1 py-1 px-1.5 min-h-[44px] rounded-lg text-xs font-bold transition-all text-center border cursor-pointer active:scale-95"
                 style={{
                   backgroundColor: isSelected ? '#16321F' : '#ffffff',
                   color: isSelected ? '#ffffff' : '#4b5563',
                   borderColor: isSelected ? '#16321F' : '#e5e7eb'
                 }}
               >
                 {opt === 'Boiled Egg' ? '🥚 Egg' : opt === 'Paneer' ? '🧀 Paneer' : opt}
               </Pressable>
             );
           })}
         </div>
       </div>
     )}

     <div className="pt-3 border-t border-gray-100/60 flex items-center justify-between">
       <div className="flex flex-col">
         <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2.5 py-1 rounded-xl text-xs font-medium font-mono">
           <Flame className="w-3 h-3 text-[#16321F]" />
           {dinnerDish.calories} kcal
         </span>
         <Pressable
           type="button"
           onClick={() => {
             setIssueDish(dinnerDish);
             setPhotoBase64('');
             setShowIssueDetails(false);
           }}
           className="mt-2 text-[11px] font-extrabold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer w-fit transition-colors"
         >
           <AlertCircle className="w-3.5 h-3.5" />
           Report Quality
         </Pressable>
       </div>

       <Pressable
         disabled={lockStatus.locked}
         onClick={() => handleToggle(dinnerDish.id)}
         className={`px-4 h-10 rounded-[20px] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
           lockStatus.locked
             ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
             : studentChoices[dinnerDish.id]
             ? 'bg-[#D9E96B] text-[#16321F]'
             : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
         }`}
       >
         {lockStatus.locked ? (
           <>
             <Lock className="w-3.5 h-3.5 text-gray-400" />
             Locked
           </>
         ) : (
           <>
             <CheckCircle2 className={`w-4 h-4 ${studentChoices[dinnerDish.id] ? 'text-emerald-400 fill-[#16321F]' : 'text-current'}`} />
             {studentChoices[dinnerDish.id] ? 'Booked' : 'Opt In'}
           </>
         )}
       </Pressable>
     </div>
   </div>
 </div>
 )}

 </div>
 )}

 {/* Ingredient Footprint breakdown */}
 {selectedDayDishes.length > 0 && (
 <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-xs space-y-4 animate-tab-transition">
 <div className="flex items-center gap-2.5">
 <Scale className="w-5 h-5 text-[#16321F]" />
 <div>
 <h3 className="text-base font-bold text-[#0A170E] font-display">Your Ingredient Contribution</h3>
 </div>
 </div>

 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
 {materialsUtilized.map((mat, idx) => (
 <div key={idx} className="bg-gray-50 rounded-[20px] p-3 border border-gray-100/30 text-center">
 <span className="text-xs font-medium text-gray-500 block mb-1 font-mono">Target weight</span>
 <span className="text-xs font-bold text-gray-800 block truncate" title={mat}>{mat}</span>
 <span className="text-xs font-bold text-[#16321F] bg-emerald-50 border border-emerald-100/50 rounded-[20px] px-2 py-0.5 inline-block mt-2">
 {mat.includes('Rice') || mat.includes('Wheat') ? '150g Draft' : mat.includes('Dal') ? '50g Draft' : 'Portion standard'}
 </span>
 </div>
 ))}
 </div>
 </div>
 )}

  {/* Quality Complaint Modal */}
  <AnimatePresence>
    {issueDish && (
      <FocusTrap>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="bg-white dark:bg-[#121212] rounded-t-[32px] md:rounded-b-[32px] md:rounded-[24px] w-full max-w-md p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:pb-6 shadow-2xl relative mt-auto md:my-8 border border-gray-100 dark:border-gray-800 text-left"
        >
          {/* Mobile Drag Handle */}
          <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-6 md:hidden"></div>
          <Pressable 
            onClick={() => { setIssueDish(null); setShowIssueDetails(false); }} 
            className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-[#222] rounded-full hover:bg-gray-200 dark:hover:bg-[#333] transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Cancel complaint"
          >
            <X className="w-4 h-4 text-gray-500" />
          </Pressable>
          <h3 className="text-lg font-bold mb-1 flex items-center gap-2 text-amber-600">
            <AlertCircle className="w-5 h-5" />
            Food Quality Complaint
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Submit quality feedback directly to the mess managers for <strong className="text-gray-800 dark:text-gray-200">{issueDish.name}</strong>.
          </p>
          
          <form onSubmit={async (e) => {
            e.preventDefault();
            setIsSubmittingIssue(true);
            try {
              const formData = new FormData(e.currentTarget);
              const category = formData.get('category') as string || 'Other';
              const description = formData.get('description') as string;
              
              const payload = {
                type: 'Food Quality',
                itemName: issueDish.name,
                category: category,
                description: description,
                photoBase64: photoBase64 || null,
                status: 'Open'
              };

              const res = await fetch('/api/issues', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
              });

              if (res.ok) {
                triggerHaptic('success');
                addToast('Complaint submitted', 'success');
                setIssueDish(null);
                setPhotoBase64('');
                setShowIssueDetails(false);
              } else {
                triggerHaptic('error');
                addToast('Failed to submit quality report.', 'error');
              }
            } catch (err) {
              console.error(err);
              triggerHaptic('error');
              addToast('Error submitting feedback.', 'error');
            } finally {
              setIsSubmittingIssue(false);
            }
          }} className="space-y-4 text-left">
            <div>
              <label htmlFor="description" className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Issue Description</label>
              <textarea 
                required 
                id="description"
                name="description" 
                rows={3} 
                className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
              ></textarea>
            </div>

            {!showIssueDetails ? (
              <Pressable
                type="button"
                onClick={() => setShowIssueDetails(true)}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 flex items-center gap-1 transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5" />
                Add optional details (photo, category)
              </Pressable>
            ) : (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                <div>
                  <label htmlFor="category" className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Feedback Category (Optional)</label>
                  <select id="category" name="category" className="touch-manipulation min-h-[44px] w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500">
                    <option value="Taste / Quality">Taste / Cooking Quality</option>
                    <option value="Under-cooked / Raw">Under-cooked / Raw</option>
                    <option value="Cold Temperature">Cold Temperature / Stale</option>
                    <option value="Hygiene Concern">Hygiene Concern</option>
                    <option value="Foreign Object">Foreign Object Found</option>
                    <option value="Other">Other Feedback</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Photo Evidence (Optional)</label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl cursor-pointer bg-gray-50 dark:bg-[#1a1a1a] hover:bg-gray-100 dark:hover:bg-[#222] transition-colors">
                      <div className="flex flex-col items-center justify-center pt-3 pb-3">
                        <Camera className="w-5 h-5 text-gray-400 mb-1" />
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">
                          {photoBase64 ? '✓ Image uploaded' : 'Click to upload photo evidence'}
                        </p>
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setPhotoBase64(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }} 
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}

            <Pressable 
              type="submit" 
              disabled={isSubmittingIssue}
              className="w-full bg-[#16321F] dark:bg-[#D9E96B] text-white dark:text-[#16321F] py-3 rounded-[16px] font-bold text-sm hover:bg-[#22442C] dark:hover:bg-[#c8d85b] transition-colors disabled:opacity-50 cursor-pointer shadow-sm mt-2"
            >
              {isSubmittingIssue ? 'Submitting...' : 'Submit complaint'}
            </Pressable>
          </form>
        </motion.div>
      </motion.div>
      </FocusTrap>
    )}
  </AnimatePresence>

  {/* Confirm Button */}
<div className="fixed bottom-20 left-0 w-full px-4 md:relative md:bottom-auto md:mt-8 z-30 flex justify-center md:justify-end">
 <Pressable
 style={{ cursor: 'default' }}
 className="bg-[#16321F] text-[#D9E96B] font-bold px-8 rounded-[20px] h-[56px] shadow-sm flex items-center justify-center gap-2 w-full md:w-auto text-base border border-emerald-400/20"
 >
 <Check className="w-5 h-5 text-emerald-400 bg-white/10 rounded-full p-0.5 animate-pulse" />
 All choices are instantly saved & synced!
 </Pressable>
 </div>

 </div>
 );
}
