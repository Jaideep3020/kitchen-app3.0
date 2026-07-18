import React from 'react';
import { User, LogOut, Flame, Sparkles, Award, ShieldAlert } from 'lucide-react';

interface StudentProfileProps {
 onSignOut: () => void;
 optInCount: number;
 email?: string;
}

export default function StudentProfile({ onSignOut, optInCount, email = 'student@kitchenops.edu' }: StudentProfileProps) {
 const initials = email.split('@')[0].slice(0, 2).toUpperCase() || 'UP';
 const displayName = email.split('@')[0] || 'University Patron';

 return (
 <div id="student_profile" className="flex-1 max-w-[600px] mx-auto w-full mt-12 md:mt-16 px-4 pb-24">
 <div className="mb-6 mt-4">
 <h2 className="text-3xl font-extrabold text-[#0A170E] mb-1 ">Your Profile</h2>
 </div>

 {/* User Details Card */}
 <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 p-6 mb-6">
 <div className="flex items-center gap-4">
 <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#16321F] flex items-center justify-center font-bold text-xl border border-emerald-100">
 {initials}
 </div>
 <div>
 <h3 className="text-lg font-bold text-[#0A170E] capitalize">{displayName}</h3>
 <p className="text-xs text-gray-400 font-semibold mt-0.5">{email}</p>
 <p className="text-sm text-gray-500 mt-1 font-medium">Banyan Hall • Room 304</p>
 </div>
 </div>
 </div>

 {/* Stats Bento Cards */}
 <div className="grid grid-cols-2 gap-4 mb-6">
 {/* Streak */}
 <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-[20px] p-4 border border-amber-200/50 flex flex-col justify-between h-32">
 <div className="flex items-center justify-between">
 <span className="text-xs font-bold text-amber-800 ">Attendance Streak</span>
 <Flame className="w-5 h-5 text-amber-600 fill-amber-500" />
 </div>
 <div>
 <div className="text-2xl font-bold text-amber-900">12 Days</div>
 </div>
 </div>

 {/* Total Booked */}
 <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-[20px] p-4 border border-emerald-200/50 flex flex-col justify-between h-32">
 <div className="flex items-center justify-between">
 <span className="text-xs font-bold text-emerald-800 ">Total RSVPs</span>
 <Sparkles className="w-5 h-5 text-emerald-600 fill-emerald-100" />
 </div>
 <div>
 <div className="text-2xl font-bold text-[#16321F]">{36 + optInCount} Meals</div>
 </div>
 </div>

 {/* Average Waste */}
 <div className="bg-gradient-to-br from-teal-50 to-teal-100/50 rounded-[20px] p-4 border border-teal-200/50 flex flex-col justify-between h-32 col-span-2">
 <div className="flex items-center justify-between">
 <span className="text-xs font-bold text-teal-800 ">Average Plate Waste</span>
 <Award className="w-5 h-5 text-teal-600" />
 </div>
 <div className="flex items-end justify-between">
 <div>
 <div className="text-3xl font-bold text-teal-900">4.8%</div>
 </div>
 <span className="bg-teal-600 text-white text-xs font-bold px-2 py-1 rounded-xl ">A+ Grade</span>
 </div>
 </div>
 </div>

 {/* Weekly Calendar Heatmap Streak */}
 <div className="bg-white rounded-[20px] border border-gray-100 p-5 shadow-sm mb-6 space-y-4">
 <div className="flex justify-between items-center">
 <div>
 <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
 <Sparkles className="w-4 h-4 text-amber-500 fill-amber-100" />
 RSVP Habit Heatmap
 </h3>
 </div>
 <span className="bg-emerald-50 text-[#16321F] text-xs font-medium px-2 py-0.5 rounded border border-emerald-100">
 12 Day Streak
 </span>
 </div>

 {/* Heatmap Grid */}
 <div className="flex flex-col items-center">
 <div className="grid grid-cols-7 gap-2">
 {/* Weekdays Labels */}
 {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
 <span key={idx} className="text-xs font-medium text-gray-400 text-center w-8 ">
 {day}
 </span>
 ))}

 {/* 4 Weeks of daily blocks (28 total) */}
 {Array.from({ length: 28 }).map((_, idx) => {
 // Create a realistic habit map
 // 0-14: completed (dark green)
 // 15-20: weekend or missed (light grey or soft green)
 // 21-25: completed (dark green)
 // 26-27: dynamic depending on optInCount
 let bgClass = "bg-gray-100 text-gray-400";
 let title = "No meal service / No RSVP";

 if (idx < 13) {
 bgClass = "bg-[#16321F] text-white";
 title = "Opted in & Attended";
 } else if (idx === 13 || idx === 14) {
 bgClass = "bg-gray-100 text-gray-400";
 title = "Missed RSVP cutoff";
 } else if (idx >= 15 && idx <= 23) {
 bgClass = "bg-[#4a7c59] text-white";
 title = "Opted in & Attended";
 } else if (idx === 24 || idx === 25) {
 bgClass = "bg-emerald-100 text-emerald-800 border border-emerald-200/50";
 title = "Excused / Weekend meal exemption";
 } else if (idx === 26) {
 bgClass = optInCount > 0 ? "bg-[#16321F] text-white animate-pulse" : "bg-amber-100 text-amber-800 border border-amber-200";
 title = optInCount > 0 ? "Opted In Today" : "Not yet opted in today";
 } else if (idx === 27) {
 bgClass = optInCount > 1 ? "bg-[#16321F] text-white animate-pulse" : "bg-gray-50 border border-gray-100 text-gray-300";
 title = optInCount > 1 ? "Opted In Tomorrow" : "Pending tomorrow's choice";
 }

 return (
 <div
 key={idx}
 title={title}
 className={`w-8 h-8 rounded-[20px] flex items-center justify-center text-xs font-bold select-none transition-all duration-300 hover:scale-110 ${bgClass}`}
 >
 {idx + 1}
 </div>
 );
 })}
 </div>

 <div className="flex gap-4 mt-4 text-xs font-medium text-gray-400 ">
 <div className="flex items-center gap-1">
 <span className="w-2.5 h-2.5 rounded bg-[#16321F]"></span>
 <span>Opted In</span>
 </div>
 <div className="flex items-center gap-1">
 <span className="w-2.5 h-2.5 rounded bg-emerald-100 border border-emerald-200"></span>
 <span>Exempt</span>
 </div>
 <div className="flex items-center gap-1">
 <span className="w-2.5 h-2.5 rounded bg-gray-100"></span>
 <span>Missed</span>
 </div>
 </div>
 </div>
 </div>

 {/* Settings Options & Sign Out */}
 <div className="space-y-3">
 <button
 onClick={onSignOut}
 className="w-full h-11 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-[20px] transition-all flex items-center justify-center gap-2 active:scale-[0.98] border border-red-100 shadow-sm"
 >
 <LogOut className="w-5 h-5" />
 Sign Out / Change User Role
 </button>
 </div>
 </div>
 );
}
