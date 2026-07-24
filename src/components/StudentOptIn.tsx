import React, { useState, useEffect } from 'react';
import { 
  Flame, Check, Utensils, Star, X, Sparkles
} from 'lucide-react';
import { MenuItem } from '../types';
import { triggerHaptic } from '../lib/haptics';
import { useData } from '../contexts/DataContext';

interface StudentOptInProps {
  menuItems: MenuItem[];
  onConfirm: (choices: { [key: string]: any }) => void;
  studentChoices: { [key: string]: any };
  setStudentChoices: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
  activeDay?: string;
  onActiveDayChange?: (day: string) => void;
}

type DayType = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

const SHIFT_STREAKS: Record<'breakfast' | 'lunch' | 'dinner', number> = {
  breakfast: 4,
  lunch: 12,
  dinner: 9
};

const DAY_NAMES: DayType[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function StudentOptIn({ 
  menuItems, 
  onConfirm, 
  studentChoices, 
  setStudentChoices,
  activeDay,
  onActiveDayChange
}: StudentOptInProps) {
  const { prepItems, recipes, activeWeekStartDate, currentUserEmail } = useData();

  // Determine current day of week dynamically using local time
  const now = new Date();
  const todayName = now.toLocaleDateString('en-US', { weekday: 'long' }) as DayType;

  const selectedDay = (activeDay as DayType) || todayName;

  // Format current time e.g. 9:42 AM
  const [currentTimeStr, setCurrentTimeStr] = useState(() => 
    new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTimeStr(new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }));
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  // State for quality report modal
  const [rateDishModal, setRateDishModal] = useState<{ dishName: string; mealType: string } | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [reportCategory, setReportCategory] = useState<string>('Taste / Temp');
  const [reportText, setReportText] = useState<string>('');
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  // State for quiet inline confirmation per dish
  const [inlineStatus, setInlineStatus] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState<Record<string, boolean>>({});

  const initials = currentUserEmail ? currentUserEmail.split('@')[0].slice(0, 2).toUpperCase() : 'UP';

  // Helper to extract ingredients for a dish
  const getDishIngredients = (dishId: string): string[] => {
    if (!recipes || !prepItems) return [];
    const ingNames = recipes
      .filter((r: any) => String(r.menuItemId) === String(dishId))
      .map((r: any) => {
        const item = prepItems.find((p: any) => String(p.id) === String(r.ingredientId));
        return item ? item.name : '';
      })
      .filter(Boolean);

    if (ingNames.length > 0) return ingNames;

    const fallbackMap: Record<string, string[]> = {
      mon_bf: ['Rice flour', 'Toor dal', 'Coconut'],
      mon_lh: ['Sona Masuri rice', 'Tomatoes', 'Cabbage'],
      mon_dn: ['Whole wheat flour', 'Mixed veg', 'Cashew gravy'],
      tue_bf: ['Semolina (Rava)', 'Peanuts', 'Green chilies'],
      tue_lh: ['Lemon', 'Sona Masuri rice', 'Potatoes'],
      tue_dn: ['Egg / Paneer', 'Lentils', 'Basmati rice'],
      wed_bf: ['Rice batter', 'Black gram', 'Mint'],
      wed_lh: ['Curd', 'Mustard seeds', 'Curry leaves'],
      wed_dn: ['Parotta', 'Salna', 'Onions'],
      thu_bf: ['Poha', 'Peanuts', 'Onions'],
      thu_lh: ['Raw rice', 'Toor dal', 'Spices'],
      thu_dn: ['Tomatoes', 'Raw rice', 'Toor and moong dal'],
      fri_bf: ['Rice', 'Lentils', 'Pepper'],
      fri_lh: ['Biryani rice', 'Mixed vegetables', 'Spices'],
      fri_dn: ['Wheat flour', 'Paneer', 'Tomatoes'],
      sat_bf: ['Rava', 'Coconut', 'Ghee'],
      sat_lh: ['Rice', 'Sambar', 'Papad'],
      sat_dn: ['Dosa batter', 'Potato masala', 'Chutney'],
      sun_bf: ['Poori', 'Potato sagu', 'Oil'],
      sun_lh: ['Chicken / Paneer', 'Basmati rice', 'Curd'],
      sun_dn: ['Rice', 'Rasam', 'Buttermilk']
    };

    return fallbackMap[dishId] || ['Fresh ingredients', 'Traditional spices'];
  };

  // Helper for Dish Image source
  const getDishImage = (dish: MenuItem | undefined, type: 'breakfast' | 'lunch' | 'dinner'): string => {
    if (dish && dish.image && dish.image.trim() !== '') {
      return dish.image;
    }
    const fallbacks = {
      breakfast: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
      lunch: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
      dinner: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&auto=format&fit=crop&q=80'
    };
    return fallbacks[type];
  };

  // Helper to format minutes remaining into human readable label
  const formatMinsLeft = (mins: number) => {
    if (mins >= 60) {
      const hrs = Math.floor(mins / 60);
      const m = mins % 60;
      return m > 0 ? `${hrs}h ${m}m left` : `${hrs}h left`;
    }
    return `${mins} min left`;
  };

  const formatCountdownLabel = (mins: number) => {
    if (mins >= 60) {
      const hrs = Math.floor(mins / 60);
      const m = mins % 60;
      return m > 0 ? `closes in ${hrs}h ${m}m` : `closes in ${hrs}h`;
    }
    return `closes in ${mins} min`;
  };

  // Helper to compute shift status
  const getShiftStatus = (
    type: 'breakfast' | 'lunch' | 'dinner',
    selDay: DayType
  ): { status: 'closed' | 'open' | 'upcoming'; label: string; countdownLabel: string } => {
    const nowObj = new Date();
    const localTodayName = nowObj.toLocaleDateString('en-US', { weekday: 'long' }) as DayType;
    
    const currWeekIdx = DAY_NAMES.indexOf(localTodayName);
    const selectedWeekIdx = DAY_NAMES.indexOf(selDay);

    if (selectedWeekIdx < currWeekIdx) {
      return { status: 'closed', label: 'opt-in closed', countdownLabel: 'closed' };
    }

    if (selectedWeekIdx > currWeekIdx) {
      const openTimes = { breakfast: 'opens 6:00 AM', lunch: 'opens 9:30 AM', dinner: 'opens 2:00 PM' };
      return { status: 'upcoming', label: openTimes[type], countdownLabel: openTimes[type] };
    }

    const currentDecimalHour = nowObj.getHours() + nowObj.getMinutes() / 60;

    const shiftWindows = {
      breakfast: { open: 6.0, close: 9.5, openTimeLabel: 'opens 6:00 AM' },
      lunch: { open: 9.5, close: 14.0, openTimeLabel: 'opens 9:30 AM' },
      dinner: { open: 14.0, close: 21.0, openTimeLabel: 'opens 2:00 PM' }
    };

    const window = shiftWindows[type];

    if (currentDecimalHour >= window.close) {
      return { status: 'closed', label: 'opt-in closed', countdownLabel: 'closed' };
    } else if (currentDecimalHour >= window.open) {
      const minsLeft = Math.max(1, Math.round((window.close - currentDecimalHour) * 60));
      return { status: 'open', label: formatMinsLeft(minsLeft), countdownLabel: formatCountdownLabel(minsLeft) };
    } else {
      return { status: 'upcoming', label: window.openTimeLabel, countdownLabel: window.openTimeLabel };
    }
  };

  // Filter menu items for selected day
  const dayDishes = menuItems.filter(d => d.dayOfWeek === selectedDay);
  const breakfastDish = dayDishes.find(d => d.mealType === 'breakfast');
  const lunchDish = dayDishes.find(d => d.mealType === 'lunch');
  const dinnerDish = dayDishes.find(d => d.mealType === 'dinner');

  const shifts: Array<{ type: 'breakfast' | 'lunch' | 'dinner'; title: string; dish: MenuItem | undefined }> = [
    { type: 'breakfast', title: 'Breakfast', dish: breakfastDish },
    { type: 'lunch', title: 'Lunch', dish: lunchDish },
    { type: 'dinner', title: 'Dinner', dish: dinnerDish }
  ];

  const shiftsWithStatus = shifts.map(s => ({
    ...s,
    statusInfo: getShiftStatus(s.type, selectedDay)
  }));

  // Active top shift: open shift, or fallback to upcoming, or last shift if all closed
  const openShift = shiftsWithStatus.find(s => s.statusInfo.status === 'open');
  const upcomingShift = shiftsWithStatus.find(s => s.statusInfo.status === 'upcoming');
  const topShift = openShift || upcomingShift || shiftsWithStatus[shiftsWithStatus.length - 1];

  const closedShifts = shiftsWithStatus.filter(s => s.type !== topShift.type && s.statusInfo.status === 'closed');
  const otherUpcomingShifts = shiftsWithStatus.filter(s => s.type !== topShift.type && s.statusInfo.status === 'upcoming');

  // Today's special dish check
  const specialDish = dayDishes.find(d => d.isSpecial) || dayDishes.find(d => d.mealType === topShift.type) || dayDishes[0];
  const specialDishName = specialDish ? (specialDish.isSpecial ? specialDish.name : `Mango dal fry`) : `Mango dal fry`;

  // Streak count for the top active shift
  const activeShiftStreak = SHIFT_STREAKS[topShift.type];

  // Toggle Opt In
  const handleToggle = async (dishId: string) => {
    const isCurrentlyOptedIn = !!studentChoices[dishId];
    const dish = menuItems.find(d => d.id === dishId);
    if (!dish) return;

    triggerHaptic('success');

    setIsSaving(prev => ({ ...prev, [dishId]: true }));
    setInlineStatus(prev => ({ ...prev, [dishId]: 'Saving...' }));

    const nextChoices = { ...studentChoices, [dishId]: !isCurrentlyOptedIn };
    setStudentChoices(nextChoices);
    onConfirm(nextChoices);

    const dayIndex = DAY_NAMES.indexOf(dish.dayOfWeek as DayType || 'Thursday');
    const dateObj = new Date(activeWeekStartDate || Date.now());
    dateObj.setDate(dateObj.getDate() + Math.max(0, dayIndex));
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
          dishId: dish.id
        })
      });

      if (!res.ok) throw new Error('Failed to save RSVP');

      setIsSaving(prev => ({ ...prev, [dishId]: false }));
      setInlineStatus(prev => ({
        ...prev,
        [dishId]: !isCurrentlyOptedIn ? 'Opted in ✓' : 'Opted out ✓'
      }));

      setTimeout(() => {
        setInlineStatus(prev => {
          const updated = { ...prev };
          delete updated[dishId];
          return updated;
        });
      }, 3500);

    } catch (err) {
      console.error(err);
      setIsSaving(prev => ({ ...prev, [dishId]: false }));
      setInlineStatus(prev => ({ ...prev, [dishId]: 'Failed to save' }));
      setStudentChoices(studentChoices);
    }
  };

  // Submit Rate Meal Quality Report
  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rateDishModal) return;

    setIsSubmittingReport(true);
    try {
      await fetch('/api/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'Quality Report',
          itemName: rateDishModal.dishName,
          category: reportCategory,
          description: `Rating: ${rating}/5 stars. ${reportText}`,
          status: 'Open'
        })
      });
      setReportSubmitted(true);
      setTimeout(() => {
        setRateDishModal(null);
        setReportSubmitted(false);
        setReportText('');
      }, 1500);
    } catch (err) {
      console.error('Failed to submit quality report', err);
    } finally {
      setIsSubmittingReport(false);
    }
  };

  // Render function for a full expanded shift card
  const renderExpandedShiftCard = (s: typeof shiftsWithStatus[0]) => {
    const dishName = s.dish?.name || (s.type === 'breakfast' ? 'Rava upma and peanut chutney' : s.type === 'lunch' ? 'Rice, tomato dal and cabbage poriyal' : 'Tomato rice and dal fry');
    const ingredients = s.dish ? getDishIngredients(s.dish.id) : ['Semolina', 'Peanuts'];
    const calories = s.dish?.calories || (s.type === 'breakfast' ? 320 : s.type === 'lunch' ? 510 : 470);
    const dishId = s.dish?.id || `${s.type}_default`;
    const isOptedIn = !!studentChoices[dishId];
    const dishImage = getDishImage(s.dish, s.type);

    return (
      <div
        key={s.type}
        className="bg-white dark:bg-gray-800/90 border-2 border-[#16321F] dark:border-[#D9E96B] rounded-[16px] overflow-hidden shadow-xs transition-all mb-4"
      >
        {/* Dish Image at Top */}
        <div className="relative w-full h-28 bg-gray-100 dark:bg-gray-700 overflow-hidden">
          <img
            src={dishImage}
            alt={dishName}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2.5 left-2.5">
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[#16321F]/90 text-[#D9E96B] backdrop-blur-xs shadow-xs">
              {s.title} · {s.statusInfo.label}
            </span>
          </div>
        </div>

        <div className="p-4">
          <p className="text-base font-bold text-gray-900 dark:text-white mb-2">{dishName}</p>

          {/* Ingredient Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {ingredients.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-gray-50 dark:bg-gray-700/60 text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-700"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Bottom Row: Calories & Opt in Action */}
          <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-700/50">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400">
              <Flame className="w-4 h-4 text-amber-500" />
              <span>{calories} kcal</span>
            </div>

            <div className="flex flex-col items-end gap-1">
              <button
                type="button"
                disabled={isSaving[dishId] || s.statusInfo.status === 'closed'}
                onClick={() => handleToggle(dishId)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 ${
                  isOptedIn
                    ? 'bg-[#16321F] dark:bg-[#D9E96B] text-white dark:text-[#16321F]'
                    : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90'
                }`}
              >
                {isSaving[dishId] ? 'Saving...' : isOptedIn ? 'Opted in ✓' : 'Opt in'}
              </button>

              {/* Quiet Inline Confirmation Text */}
              {inlineStatus[dishId] && (
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 animate-fadeIn">
                  {inlineStatus[dishId]}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div id="student_today" className="flex-1 max-w-[480px] mx-auto w-full font-sans pb-24">
      {/* 1. SINGLE COMPACT STICKY HEADER BAR (time, active shift, RSVP countdown, streak, avatar) */}
      <div className="sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-4 py-2.5 border-b border-gray-100 dark:border-gray-800 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500 leading-none mb-0.5">
              {currentTimeStr}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-extrabold text-gray-900 dark:text-white leading-tight">
                {topShift.title}
              </span>
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                {topShift.statusInfo.countdownLabel}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Streak count for active shift type */}
            <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 text-xs font-bold px-2 py-1 rounded-full border border-amber-200/60 dark:border-amber-800/40">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{activeShiftStreak}d</span>
            </div>

            <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-[#185fa5] dark:text-emerald-400 font-bold text-[11px] flex items-center justify-center border border-emerald-200/50 dark:border-emerald-800/40 shrink-0">
              {initials}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pt-3">
        {/* a. TODAY'S SPECIAL BANNER */}
        <div className="bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 dark:border-amber-500/30 rounded-xl px-3.5 py-2.5 mb-3 flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-300">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
          <span>Today's special: {specialDishName}</span>
        </div>

        {/* b. CURRENTLY OPEN SHIFT CARD */}
        {renderExpandedShiftCard(topShift)}

        {/* c. UPCOMING SHIFTS (if any) */}
        {otherUpcomingShifts.length > 0 && (
          <div className="space-y-2 mb-4">
            {otherUpcomingShifts.map((s) => {
              const dishName = s.dish?.name || (s.type === 'breakfast' ? 'Rava upma & peanut chutney' : s.type === 'lunch' ? 'Rice, tomato dal & cabbage poriyal' : 'Tomato rice & dal fry');
              return (
                <div 
                  key={s.type}
                  className="bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/60 dark:border-gray-700/40 rounded-[16px] px-3.5 py-3 shadow-xs flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <div className="w-2 h-2 rounded-full bg-amber-400 dark:bg-amber-500 shrink-0" />
                    <div className="truncate">
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 mr-2">
                        {s.title} · {s.statusInfo.label}
                      </span>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                        {dishName}
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500 bg-gray-200/60 dark:bg-gray-700/60 px-2 py-0.5 rounded-md shrink-0">
                    Not open yet
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* d. EARLIER TODAY (CLOSED SHIFTS) */}
        <div className="mb-4">
          <p className="text-xs font-bold text-gray-400 dark:text-gray-500 tracking-wider mb-2 px-1">
            Earlier today
          </p>
          {closedShifts.length > 0 ? (
            <div className="space-y-2">
              {closedShifts.map((s) => {
                const dishName = s.dish?.name || (s.type === 'breakfast' ? 'Rava upma and peanut chutney' : s.type === 'lunch' ? 'Rice, tomato dal and cabbage poriyal' : 'Tomato rice and dal fry');
                return (
                  <div 
                    key={s.type}
                    className="bg-white/80 dark:bg-gray-800/60 border border-gray-200/80 dark:border-gray-700/50 rounded-[16px] px-3.5 py-2.5 shadow-xs flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 shrink-0" />
                      <div className="truncate">
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 mr-2">
                          {s.title} · closed
                        </span>
                        <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">
                          {dishName}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setRateDishModal({ dishName, mealType: s.title })}
                      className="text-xs font-semibold text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg px-2.5 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer shrink-0"
                    >
                      Rate ↗
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-3 text-xs text-gray-400 dark:text-gray-500">
              Nothing yet
            </div>
          )}
        </div>

        {/* Staples Section */}
        <div className="mt-2 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 rounded-[16px] p-3.5 flex items-start gap-2.5">
          <Utensils className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-xs font-medium text-emerald-900 dark:text-emerald-300 leading-snug">
            Staples always available — no opt-in needed (white rice, spiced sambar, local pickles, and papads are permanently stocked).
          </p>
        </div>
      </div>

      {/* Post-Meal Quality Report Modal */}
      {rateDishModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-[20px] max-w-sm w-full p-5 shadow-xl border border-gray-100 dark:border-gray-700 relative animate-scaleIn">
            <button
              type="button"
              onClick={() => setRateDishModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-0.5">Rate Meal</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{rateDishModal.dishName}</p>

            {reportSubmitted ? (
              <div className="py-6 text-center space-y-2">
                <Check className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <p className="text-sm font-bold text-gray-900 dark:text-white">Feedback received!</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Thank you for helping improve meal quality.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReport} className="space-y-4">
                {/* Rating Stars */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="cursor-pointer"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category Chips */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">Category</label>
                  <div className="flex flex-wrap gap-1.5">
                    {['Taste / Temp', 'Portion Size', 'Hygiene', 'Other'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setReportCategory(cat)}
                        className={`text-xs font-medium px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                          reportCategory === cat
                            ? 'bg-[#16321F] dark:bg-[#D9E96B] text-white dark:text-[#16321F]'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description input */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">Notes (Optional)</label>
                  <textarea
                    rows={2}
                    value={reportText}
                    onChange={(e) => setReportText(e.target.value)}
                    placeholder="Any specific comments..."
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#16321F]"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setRateDishModal(null)}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingReport}
                    className="flex-1 py-2 rounded-xl text-xs font-bold bg-[#16321F] dark:bg-[#D9E96B] text-white dark:text-[#16321F] hover:opacity-90 cursor-pointer"
                  >
                    {isSubmittingReport ? 'Submitting...' : 'Submit Feedback'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
