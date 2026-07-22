import { Pressable } from './Pressable';
import React, { useState } from 'react';
import { Clipboard, Check, Scale, Camera, QrCode } from 'lucide-react';
import { MenuItem } from '../types';
import { triggerHaptic } from '../lib/haptics';

interface StudentCheckInProps {
 menuItems: MenuItem[];
 onLogPlateWaste: (dishId: string, level: 'none' | 'a_little' | 'half' | 'most') => void;
}

export default function StudentCheckIn({ menuItems, onLogPlateWaste }: StudentCheckInProps) {
 const [isLoading, setIsLoading] = React.useState(true);

 // Simulate skeleton loaders for high-performance feel
 React.useEffect(() => {
 const timer = setTimeout(() => {
 setIsLoading(false);
 }, 400);
 return () => clearTimeout(timer);
 }, []);

 const [isScanning, setIsScanning] = useState(false);
 const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  
  const startScanner = async () => {
    setIsScanning(true);
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access denied or unavailable", err);
      setCameraError("Camera access denied or unavailable. Please grant permissions.");
    }
  };
  
  const stopScanner = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsScanning(false);
    setCameraError(null);
  };

 const [selectedDish, setSelectedDish] = useState(menuItems[0]?.id || '');
 const [wasteLevel, setWasteLevel] = useState<'none' | 'a_little' | 'half' | 'most'>('none');
 const [logged, setLogged] = useState(false);

 const levels = [
 { value: 'none', label: 'Clean Plate (0%)', desc: 'No food wasted! Awesome job!', color: 'border-emerald-500 bg-emerald-50 text-emerald-800' },
 { value: 'a_little', label: 'A Little (15%)', desc: 'Just some crumbs or garnishes left.', color: 'border-blue-500 bg-blue-50 text-blue-800' },
 { value: 'half', label: 'Half Wasted (50%)', desc: 'A major portion was left behind.', color: 'border-amber-500 bg-amber-50 text-amber-800' },
 { value: 'most', label: 'Most Wasted (80%)', desc: 'Almost the entire dish was discarded.', color: 'border-red-500 bg-red-50 text-red-800' },
 ];

 const handleSubmit = (e: React.FormEvent) => {
 e.preventDefault();
 onLogPlateWaste(selectedDish, wasteLevel);
 setLogged(true);
 setTimeout(() => {
 setLogged(false);
 }, 3000);
 };

 const currentDishName = menuItems.find(d => d.id === selectedDish)?.name || '';

 if (isLoading) {
 return (
 <div className="flex-grow max-w-7xl mx-auto w-full px-4 md:px-8 py-6 space-y-6">
 <div className="flex justify-between items-end pb-4 border-b border-gray-100">
 <div className="space-y-2">
 <div className="h-4 w-32 bg-gray-200 rounded-xl animate-skeleton-pulse"></div>
 <div className="h-8 w-48 bg-gray-300 rounded-[20px] animate-skeleton-pulse"></div>
 </div>
 </div>
 <div className="h-64 bg-gray-100 rounded-[24px] animate-skeleton-pulse mt-6 mx-auto max-w-sm"></div>
 </div>
 );
 }

 return (
 <div id="student_check_in" className="flex-1 max-w-[600px] mx-auto w-full mt-12 md:mt-16 px-4 pb-24">
 <div className="mb-6 mt-4">
 <h2 className="text-3xl font-extrabold text-[#0A170E] mb-1 ">Plate Waste Check-in</h2>
 </div>

 <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 p-6">
 {logged ? (
 <div className="text-center py-8">
 <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mb-4 border border-emerald-100">
 <Check className="w-8 h-8" />
 </div>
 <h3 className="text-xl font-bold text-gray-900 mb-1">Thank you!</h3>
 Your feedback for <span className="font-semibold text-gray-800">{currentDishName}</span> has been logged.
 
 </div>
 ) : (
 <form onSubmit={handleSubmit} className="space-y-6">
    {isScanning ? (
      <div className="bg-black rounded-[20px] overflow-hidden relative h-64 mb-6 shadow-sm">
        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover opacity-80" />
        {cameraError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 bg-black/80 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center mb-3">
              <Camera className="w-6 h-6" />
            </div>
            <p className="text-white font-medium text-sm mb-1">Camera Unavailable</p>
            <p className="text-gray-400 text-xs mb-4">{cameraError}</p>
            <Pressable type="button" onClick={() => { stopScanner(); triggerHaptic('success'); setSelectedDish(menuItems[0]?.id || ''); }} className="bg-[#D9E96B] text-[#16321F] px-4 py-2 rounded-full text-xs font-bold shadow-md">Simulate Scan Instead</Pressable>
          </div>
        ) : (
          <>
            <div className="absolute inset-0 border-2 border-[#D9E96B]/50 rounded-[20px] pointer-events-none"></div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-48 border-2 border-[#D9E96B] rounded-xl"></div>
            </div>
            <div className="absolute bottom-4 left-0 right-0 flex justify-center z-10">
               <Pressable type="button" onClick={() => { stopScanner(); triggerHaptic('success'); setSelectedDish(menuItems[0]?.id || ''); }} className="bg-[#D9E96B] text-[#16321F] px-4 py-2 rounded-full text-xs font-bold shadow-md">Simulate Scan Success</Pressable>
            </div>
          </>
        )}
        <Pressable type="button" onClick={stopScanner} className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-full p-2 text-white z-20"><Check className="w-4 h-4 opacity-0" />Close</Pressable>
      </div>
    ) : (
      <div className="mb-6 flex justify-center">
         <Pressable type="button" onClick={startScanner} className="w-full bg-[#16321F]/5 border border-[#16321F]/10 text-[#16321F] font-bold py-4 rounded-[20px] flex items-center justify-center gap-2 hover:bg-[#16321F]/10 transition-colors">
            <QrCode className="w-5 h-5" />
            Tap to Scan Meal Ticket / ID
         </Pressable>
      </div>
    )}

 {/* Dish Selection */}
 <div>
 <label className="block text-xs font-semibold text-gray-500 mb-2">
 Which dish did you eat?
 </label>
 <div className="grid grid-cols-1 gap-2">
 {menuItems.map((dish) => (
 <Pressable
 key={dish.id}
 type="button"
 onClick={() => setSelectedDish(dish.id)}
 className={`flex items-center justify-between p-3.5 rounded-[20px] border text-left transition-all ${
 selectedDish === dish.id
 ? 'border-[#16321F] bg-emerald-50/20 text-[#16321F] font-semibold'
 : 'border-gray-100 bg-gray-50/50 text-gray-700 hover:bg-gray-50'
 }`}
 >
 <span className="text-sm">{dish.name}</span>
 <span className="text-xs text-gray-400 capitalize">{dish.category.replace('_', ' ')}</span>
 </Pressable>
 ))}
 </div>
 </div>

 {/* Waste Selector */}
 <div>
 <label className="block text-xs font-semibold text-gray-500 mb-2">
 How much food went to waste?
 </label>
 <div className="grid grid-cols-1 gap-2.5">
 {levels.map((level) => {
 const isSelected = wasteLevel === level.value;
 return (
 <Pressable
 key={level.value}
 type="button"
 onClick={() => setWasteLevel(level.value as any)}
 className={`p-4 rounded-[20px] border text-left transition-all flex flex-col justify-center ${
 isSelected
 ? `border-2 ${level.color} shadow-sm font-semibold`
 : 'border-gray-100 bg-white hover:border-gray-200'
 }`}
 >
 <div className="flex items-center justify-between">
 <span className="text-sm font-bold text-gray-900">{level.label}</span>
 {isSelected && <Check className="w-4 h-4 text-current" />}
 </div>
 <span className="text-xs text-gray-500 mt-1 font-normal">{level.desc}</span>
 </Pressable>
 );
 })}
 </div>
 </div>

 {/* Submit Button */}
 <Pressable
 type="submit"
 className="w-full h-11 bg-[#16321F] hover:bg-[#4a7c59] text-white font-semibold rounded-[20px] transition-all flex items-center justify-center gap-2 active:scale-[0.98] mt-6 shadow-sm"
 >
 <Scale className="w-5 h-5" />
 Log Plate Waste
 </Pressable>
 </form>
 )}
 </div>
 </div>
 );
}
