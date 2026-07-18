import React, { useState } from 'react';
import { 
 Rocket, Users, HelpCircle, CheckSquare, Square, 
 Play, Download, Share2, TrendingDown, ClipboardList, 
 MessageSquare, Flame, Check, Sparkles, Send, Mail, RefreshCw
} from 'lucide-react';

export default function StaffLaunchHub() {
 // Checklist states
 const [checklist, setChecklist] = useState([
 { id: 1, text: 'Brief College Admin / Mess Committee privately (Verification Support, not Surveillance)', category: 'admin', completed: true },
 { id: 2, text: 'In-person kitchen staff walkthrough & Daily Ops quick-start sheet', category: 'staff', completed: true },
 { id: 3, text: 'Roll out QR code posters at Block C Mess entrance and student tables', category: 'student', completed: false },
 { id: 4, text: 'Announce in Block C student WhatsApp groups and notice boards', category: 'student', completed: false },
 { id: 5, text: 'Send campus-wide email announcement once Block C settles in', category: 'admin', completed: false },
 ]);

 // Feedback simulation states
 const [feedbackAnswers, setFeedbackAnswers] = useState([
 {
 id: 1,
 user: "Rahul S. (Block C Student)",
 timestamp: "Today, 11:42 AM",
 sentiment: "positive"
 },
 {
 id: 2,
 user: "Chef Sarah M. (Kitchen Lead)",
 timestamp: "Yesterday, 4:15 PM",
 sentiment: "positive"
 },
 {
 id: 3,
 user: "David L. (Shift Manager)",
 timestamp: "2 days ago",
 sentiment: "neutral"
 }
 ]);

 const [newQuestion, setNewQuestion] = useState("");
 const [newFeedbackText, setNewFeedbackText] = useState("");
 const [submittingFeedback, setSubmittingFeedback] = useState(false);

 // Stats / Results Simulator
 const [pilotAccuracy, setPilotAccuracy] = useState(94);
 const [plateWasteReduced, setPlateWasteReduced] = useState(24);
 const [activeParticipants, setActiveParticipants] = useState(48);

 const toggleChecklist = (id: number) => {
 setChecklist(prev => prev.map(item => 
 item.id === id ? { ...item, completed: !item.completed } : item
 ));
 };

 const handleAddFeedback = (e: React.FormEvent) => {
 e.preventDefault();
 if (!newFeedbackText.trim()) return;

 setSubmittingFeedback(true);
 setTimeout(() => {
 const entry = {
 id: Date.now(),
 user: "Campus Admin (Reviewer)",
 timestamp: "Just now",
 sentiment: "positive"
 };
 setFeedbackAnswers(prev => [entry, ...prev]);
 setNewFeedbackText("");
 setSubmittingFeedback(false);
 
 // Slightly boost simulation metrics upon logging real user feedback!
 setActiveParticipants(prev => prev + 1);
 setPilotAccuracy(prev => Math.min(98, prev + 1));
 }, 600);
 };

 return (
 <div id="staff_launch_hub" className="flex-grow max-w-7xl mx-auto w-full px-4 md:px-8 pt-0 pb-6 space-y-6">
 
 {/* Page Header */}
 <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 pb-2 border-b border-gray-100 dark:border-gray-800">
 <div>
 <span className="bg-[#D9E96B]/20 text-amber-900 border border-[#D9E96B]/40 px-2.5 py-1 rounded-xl text-xs font-medium flex items-center gap-1 w-fit mb-2">
 <Rocket className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
 Soft Launch Mode Active
 </span>
 <h2 className="text-3xl font-extrabold text-[#0A170E] dark:text-white ">Launch & Announcement Hub</h2>
 Phase 1 Pilot: Block C Hostel • 5-10 Mess Staff • 30-50 Active Student Testers
 </div>
 </div>

 {/* Main Grid split */}
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
 
 {/* LEFT COLUMN: Launch Strategy & Checklist (Col Span 7) */}
 <div className="lg:col-span-7 space-y-6">
 
 {/* Phase Roadmap Progress Card */}
 <div className="bg-white dark:bg-[#121212] rounded-[20px] p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
 <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
 <ClipboardList className="w-5 h-5 text-[#16321F] dark:text-[#D9E96B]" />
 Campaign Announcement Checklist
 </h3>
 

 <div className="space-y-4">
 {checklist.map((item) => (
 <button
 key={item.id}
 onClick={() => toggleChecklist(item.id)}
 className={`w-full text-left p-4 rounded-[20px] border transition-all flex items-start gap-3 select-none hover:bg-gray-50/50 dark:bg-[#1a1a1a]/80 ${
 item.completed 
 ? 'border-[#16321F]/20 bg-emerald-50/10 text-gray-500 dark:text-gray-400 dark:text-gray-400' 
 : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-[#121212] text-gray-900 dark:text-white shadow-xs'
 }`}
 >
 <div className="mt-0.5 shrink-0 text-[#16321F] dark:text-[#D9E96B]">
 {item.completed ? (
 <Check className="w-5 h-5 bg-[#16321F] text-white rounded-xl p-0.5" />
 ) : (
 <div className="w-5 h-5 border-2 border-gray-300 rounded-xl"></div>
 )}
 </div>
 <div className="flex-1">
 <p className={`text-sm font-bold leading-snug ${item.completed ? 'line-through text-gray-400 dark:text-gray-400' : 'text-gray-800 dark:text-gray-100'}`}>
 {item.text}
 </p>
 <span className="inline-block mt-1.5 text-xs font-medium bg-gray-100 dark:bg-[#222222] px-2 py-0.5 rounded text-gray-500 dark:text-gray-400 dark:text-gray-400">
 Target Audience: {item.category}
 </span>
 </div>
 </button>
 ))}
 </div>
 </div>

 {/* Interactive Screen recording & Pitch Container */}
 <div className="bg-[#0A170E] rounded-[24px] p-6 text-white overflow-hidden relative shadow-sm">
 <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-800/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
 
 <div className="relative z-10 space-y-6">
 <div>
 <span className="text-xs bg-emerald-800 text-emerald-200 border border-emerald-700 px-2.5 py-1 rounded-xl font-bold inline-block mb-3">
 Promo Asset Kit
 </span>
 <h3 className="text-xl font-bold ">Our Plain-Language Pitch</h3>
 "Kitchen Ops is a sustainable food planning application that matches real student appetite with kitchen prep targets. By logging meal preferences 12 hours in advance, we cut plate waste by 24% while protecting staff from supply discrepancies."
 </div>

 {/* Fake Interactive Video Player Container */}
 <div className="aspect-video bg-neutral-900/90 rounded-[20px] border border-neutral-800 overflow-hidden flex flex-col justify-between p-4 relative group">
 {/* Background Food Aesthetic Layer */}
 <div 
 className="absolute inset-0 bg-cover bg-center opacity-35 filter grayscale group-hover:grayscale-0 transition-all duration-700" 
 style={{ backgroundImage: `url('https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80')` }}
 />
 <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10"></div>

 <div className="relative z-10 flex justify-between items-start">
 <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
 <span className="w-1.5 h-1.5 rounded-full bg-white dark:bg-[#121212] animate-ping"></span>
 DEMO SCREENCAST
 </span>
 <span className="text-xs text-gray-400 dark:text-gray-400 font-mono">0:45 Duration</span>
 </div>

 {/* Central Play Button */}
 <button className="relative z-10 self-center w-14 h-14 rounded-full bg-amber-500 hover:bg-amber-400 text-[#16321F] dark:text-[#D9E96B] flex items-center justify-center shadow-sm transition-transform hover:scale-115 active:scale-95 cursor-pointer">
 <Play className="w-6 h-6 fill-current ml-0.5" />
 </button>

 <div className="relative z-10 text-left">
 </div>
 </div>

 <div className="flex flex-col sm:flex-row gap-3 pt-2">
 <button className="flex-1 h-11 bg-white dark:bg-[#121212] hover:bg-gray-50 dark:bg-[#1a1a1a] text-[#0A170E] dark:text-white font-bold rounded-[20px] text-xs flex items-center justify-center gap-2 transition-all cursor-pointer">
 <Download className="w-4 h-4 text-emerald-800" />
 Download Promo Video
 </button>
 <button className="flex-1 h-11 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-[20px] text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-emerald-700">
 <Share2 className="w-4 h-4" />
 Share Screenshots Kit
 </button>
 </div>
 </div>
 </div>

 </div>

 {/* RIGHT COLUMN: Feedback collectors, Results, and QR Poster (Col Span 5) */}
 <div className="lg:col-span-5 space-y-6">

 {/* Live Pilot Stats Card */}
 <div className="bg-[#D9E96B]/15 rounded-[20px] p-6 border border-[#D9E96B]/35 shadow-sm space-y-6">
 <div className="flex justify-between items-center">
 <h3 className="text-sm font-bold text-[#0A170E] dark:text-white ">Pilot Analytics (Week 1)</h3>
 <span className="text-xs font-bold text-emerald-800 bg-[#D9E96B]/40 px-2 py-0.5 rounded">Live Metrics</span>
 </div>

 <div className="grid grid-cols-3 gap-3">
 <div className="bg-white dark:bg-[#121212] rounded-[20px] p-3 border border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center text-center">
 <span className="text-2xl font-bold text-[#16321F] dark:text-[#D9E96B]">{pilotAccuracy}%</span>
 <span className="text-xs font-medium text-gray-400 dark:text-gray-400 mt-1 ">RSVP Rate</span>
 </div>
 <div className="bg-white dark:bg-[#121212] rounded-[20px] p-3 border border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center text-center">
 <span className="text-2xl font-bold text-[#16321F] dark:text-[#D9E96B]">{plateWasteReduced}%</span>
 <span className="text-xs font-medium text-gray-400 dark:text-gray-400 mt-1 ">Waste Cut</span>
 </div>
 <div className="bg-white dark:bg-[#121212] rounded-[20px] p-3 border border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center text-center">
 <span className="text-2xl font-bold text-[#16321F] dark:text-[#D9E96B]">{activeParticipants}</span>
 <span className="text-xs font-medium text-gray-400 dark:text-gray-400 mt-1 ">Students</span>
 </div>
 </div>

 {/* Quick interactive simulation trigger */}
 <div className="bg-white/50 dark:bg-black/50 border border-gray-100 dark:border-gray-800 rounded-[20px] p-3 flex justify-between items-center text-xs">
 <span className="text-gray-500 dark:text-gray-400 dark:text-gray-400 font-semibold leading-tight">Got mock survey responses?</span>
 <button 
 onClick={() => {
 setPilotAccuracy(Math.min(99, pilotAccuracy + 1));
 setPlateWasteReduced(Math.min(35, plateWasteReduced + 2));
 setActiveParticipants(prev => prev + 5);
 }}
 className="bg-[#16321F] hover:bg-[#4a7c59] text-white text-xs font-medium px-2.5 py-1.5 rounded-[20px] flex items-center gap-1 transition-all"
 >
 <RefreshCw className="w-3 h-3" />
 Ingest
 </button>
 </div>
 </div>

 {/* QR Code Poster Mockup Card */}
 <div className="bg-white dark:bg-[#121212] rounded-[20px] p-6 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col items-center text-center">
 <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Entrance Sign-Up QR Poster</h4>
 
 {/* Visual Representation of QR Code Card */}
 <div className="w-full max-w-[180px] bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 rounded-[20px] p-4 flex flex-col items-center shadow-xs">
 <div className="w-32 h-32 bg-white dark:bg-[#121212] rounded-[20px] border border-emerald-100 p-2 flex items-center justify-center relative">
 {/* Simulated QR Code patterns */}
 <div className="grid grid-cols-6 grid-rows-6 gap-1 w-full h-full opacity-80">
 <div className="bg-[#16321F] rounded-xs col-span-2 row-span-2"></div>
 <div className="bg-transparent"></div>
 <div className="bg-[#16321F]"></div>
 <div className="bg-[#16321F] rounded-xs col-span-2 row-span-2"></div>
 <div className="bg-[#16321F]"></div>
 <div className="bg-[#16321F]"></div>
 <div className="bg-[#16321F]"></div>
 <div className="bg-transparent"></div>
 <div className="bg-[#16321F]"></div>
 <div className="bg-[#16321F]"></div>
 <div className="bg-transparent"></div>
 <div className="bg-[#16321F]"></div>
 <div className="bg-[#16321F]"></div>
 <div className="bg-transparent"></div>
 <div className="bg-[#16321F]"></div>
 <div className="bg-[#16321F] rounded-xs col-span-2 row-span-2"></div>
 <div className="bg-[#16321F]"></div>
 <div className="bg-transparent"></div>
 <div className="bg-[#16321F]"></div>
 <div className="bg-transparent"></div>
 <div className="bg-[#16321F]"></div>
 </div>
 {/* Center logo overlay */}
 <div className="absolute w-8 h-8 rounded-full bg-white dark:bg-[#121212] shadow-sm border border-emerald-100 flex items-center justify-center text-[#16321F] dark:text-[#D9E96B]">
 <Flame className="w-4 h-4 fill-current text-[#16321F] dark:text-[#D9E96B]" />
 </div>
 </div>
 <span className="text-xs font-bold text-emerald-800 mt-3">Scan to RSVP</span>
 </div>

 <button className="mt-4 w-full h-10 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-200 text-xs font-bold rounded-[20px] hover:bg-gray-100 dark:bg-[#222222] flex items-center justify-center gap-1.5 transition-colors">
 <Download className="w-4 h-4 text-emerald-800" />
 Download PDF Poster
 </button>
 </div>

 {/* Feedback Collector / Logger */}
 <div className="bg-white dark:bg-[#121212] rounded-[20px] p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
 <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
 <MessageSquare className="w-5 h-5 text-[#16321F] dark:text-[#D9E96B]" />
 Feedback Logs
 </h3>
 

 <form onSubmit={handleAddFeedback} className="space-y-3">
 <textarea
 rows={2}
 value={newFeedbackText}
 onChange={(e) => setNewFeedbackText(e.target.value)}
 placeholder="Log a verbal quote or observation from student/staff..."
 className="w-full px-3 py-2 text-xs border border-gray-200 dark:border-gray-700 rounded-[20px] focus:outline-none focus:ring-2 focus:ring-[#16321F]/25 focus:border-[#16321F] text-gray-900 dark:text-white placeholder:text-gray-400 dark:text-gray-400 bg-gray-50/20"
 />
 <div className="flex justify-end">
 <button
 type="submit"
 disabled={submittingFeedback || !newFeedbackText.trim()}
 className="h-9 px-4 bg-[#16321F] text-white text-xs font-bold rounded-[20px] hover:opacity-95 flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
 >
 <Send className="w-3.5 h-3.5" />
 Log Feedback
 </button>
 </div>
 </form>

 <div className="space-y-3 pt-2">
 {feedbackAnswers.map((item) => (
 <div key={item.id} className="p-3 bg-gray-50 dark:bg-[#1a1a1a] rounded-[20px] border border-gray-100/80 text-xs space-y-1.5 leading-relaxed">
 <div className="flex justify-between items-start text-gray-400 dark:text-gray-400 font-semibold text-xs ">
 <span>{item.user}</span>
 <span>{item.timestamp}</span>
 </div>
 </div>
 ))}
 </div>
 </div>

 </div>

 </div>

 </div>
 );
}
