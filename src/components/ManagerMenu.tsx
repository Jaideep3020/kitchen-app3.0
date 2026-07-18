import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { triggerHaptic } from '../lib/haptics';
import { 
  Calendar, Clock, Edit3, Save, Sparkles, Plus, Trash2, 
  CheckCircle, FileText, Utensils, Zap, HelpCircle 
} from 'lucide-react';
import { MenuItem } from '../types';

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
type DayType = typeof WEEKDAYS[number];

export default function ManagerMenu() {
  const { menuItems, setMenuItems, prepItems, recipes, saveRecipe } = useData();
  const { addToast } = useToast();
  
  const [selectedDay, setSelectedDay] = useState<DayType>('Friday');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTag, setNewTag] = useState('');
  
  // Recipe ingredients editor state
  const [recipeRows, setRecipeRows] = useState<{ ingredientId: string, qtyPerServing: number, unit: string }[]>([]);
  
  // Custom meal options state for the editing item
  const [mealOptions, setMealOptions] = useState<string[]>([]);
  const [newOption, setNewOption] = useState('');

  // Find items for the currently selected day
  const dailyDishes = menuItems.filter(item => item.dayOfWeek === selectedDay);

  const startEditing = (item: MenuItem) => {
    triggerHaptic('light');
    setEditingItem({ ...item });
    
    // Load current recipe rows for this dish from the global recipes state
    const existingRows = recipes.filter((r: any) => String(r.menuItemId) === String(item.id));
    setRecipeRows(existingRows.map((r: any) => ({
      ingredientId: r.ingredientId,
      qtyPerServing: Number(r.qtyPerServing),
      unit: r.unit
    })));
    
    // Parse tags out of item description if we have special format, or check custom tags
    // Let's look for custom choice options which we prefix with "Options: " in description
    // or keep a clean list. Let's look for "Options: Egg, Paneer" pattern in descriptions
    const desc = item.description || '';
    const match = desc.match(/Options:\s*([^\n]+)/i);
    if (match) {
      setMealOptions(match[1].split(',').map(s => s.trim()));
    } else {
      // Default options based on Friday/Sunday logic
      if (item.id.includes('fri') || item.name.toLowerCase().includes('paneer') || item.name.toLowerCase().includes('egg')) {
        setMealOptions(['Boiled Egg', 'Paneer Bhurji']);
      } else if (item.id.includes('sun') || item.name.toLowerCase().includes('chicken')) {
        setMealOptions(['Chicken Curry', 'Paneer Butter Masala']);
      } else {
        setMealOptions([]);
      }
    }
  };

  const handleAddOption = () => {
    if (!newOption.trim()) return;
    if (mealOptions.includes(newOption.trim())) {
      addToast('Option already exists', 'error');
      return;
    }
    setMealOptions([...mealOptions, newOption.trim()]);
    setNewOption('');
    triggerHaptic('light');
  };

  const handleRemoveOption = (opt: string) => {
    setMealOptions(mealOptions.filter(o => o !== opt));
    triggerHaptic('light');
  };

  const handleAddTag = () => {
    if (!newTag.trim() || !editingItem) return;
    if (editingItem.tags.includes(newTag.trim())) {
      addToast('Tag already exists', 'error');
      return;
    }
    setEditingItem({
      ...editingItem,
      tags: [...editingItem.tags, newTag.trim()]
    });
    setNewTag('');
    triggerHaptic('light');
  };

  const handleRemoveTag = (tag: string) => {
    if (!editingItem) return;
    setEditingItem({
      ...editingItem,
      tags: editingItem.tags.filter(t => t !== tag)
    });
    triggerHaptic('light');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setIsSubmitting(true);
    triggerHaptic('medium');

    try {
      // Format final description, appending options if present
      let cleanDesc = editingItem.description;
      // Strip old Options text from description if it exists
      cleanDesc = cleanDesc.replace(/\s*Options:\s*[^\n]+/gi, '').trim();
      
      if (mealOptions.length > 0) {
        cleanDesc = `${cleanDesc}\nOptions: ${mealOptions.join(', ')}`;
      }

      const updatedItem: MenuItem = {
        ...editingItem,
        description: cleanDesc
      };

      // Put to backend endpoint for real database write
      const response = await fetch(`/api/menu/${updatedItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedItem)
      });

      if (!response.ok) {
        throw new Error('Failed to save menu item to relational database');
      }

      const savedItem = await response.json();

      // Save recipe batch
      const recipeSuccess = await saveRecipe(updatedItem.id, recipeRows);
      if (!recipeSuccess) {
        throw new Error('Failed to save recipe ingredients to database');
      }

      // Update state locally
      setMenuItems(prev => prev.map(item => item.id === savedItem.id ? savedItem : item));
      
      addToast(`Successfully published ${savedItem.name} to ${selectedDay} menu!`, 'success');
      setEditingItem(null);
    } catch (error: any) {
      console.error(error);
      addToast(error.message || 'Failed to save menu changes', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-grow max-w-7xl mx-auto w-full px-4 md:px-8 pt-0 pb-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0A170E] dark:text-white font-display flex items-center gap-2">
            <Utensils className="w-6 h-6 text-[#16321F] dark:text-[#D9E96B]" />
            Weekly Menu Builder
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Design daily meal schedules, configure customizable choice options, and publish directly to the live student app.
          </p>
        </div>
      </div>

      {/* Weekday Selector */}
      <div className="bg-white dark:bg-[#121212] p-1.5 rounded-2xl border border-gray-100 dark:border-gray-800 flex overflow-x-auto gap-1 shadow-xs no-scrollbar">
        {WEEKDAYS.map(day => (
          <button
            key={day}
            onClick={() => { triggerHaptic('light'); setSelectedDay(day); setEditingItem(null); }}
            className={`flex-1 min-w-[90px] text-center py-2.5 rounded-xl text-xs font-bold transition-all ${
              selectedDay === day
                ? 'bg-[#16321F] text-[#D9E96B] dark:bg-[#D9E96B] dark:text-[#16321F] shadow-sm'
                : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Schedule Display & Editor Container */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
              <Calendar className="w-4.5 h-4.5 text-gray-500" />
              {selectedDay}'s Menu Schedule
            </h3>
            <span className="text-xs font-mono text-gray-400">{dailyDishes.length} Meals Configured</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['breakfast', 'lunch', 'dinner'] as const).map(mealType => {
              const dish = dailyDishes.find(item => item.mealType === mealType);
              
              return (
                <div 
                  key={mealType}
                  className={`bg-white dark:bg-[#121212] rounded-2xl border p-5 flex flex-col justify-between min-h-[220px] transition-all hover:shadow-md ${
                    editingItem?.id === dish?.id 
                      ? 'border-[#16321F] dark:border-[#D9E96B] ring-2 ring-[#16321F]/10 dark:ring-[#D9E96B]/10' 
                      : 'border-gray-100 dark:border-gray-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-gray-500 dark:text-gray-400">
                        {mealType}
                      </span>
                      {dish && (
                        <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                          <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                          {dish.calories} kcal
                        </span>
                      )}
                    </div>

                    {dish ? (
                      <>
                        <h4 className="text-sm font-extrabold text-gray-900 dark:text-white tracking-tight line-clamp-1">
                          {dish.name}
                        </h4>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
                          {dish.description.replace(/\s*Options:\s*[^\n]+/gi, '')}
                        </p>

                        {/* Visual Pill for Choice options */}
                        {dish.description.toLowerCase().includes('options:') && (
                          <div className="mt-3 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-[#16321F] dark:bg-[#D9E96B] rounded-full"></span>
                            <span className="text-[10px] font-bold text-[#16321F] dark:text-[#D9E96B]">Has Customizable Choices</span>
                          </div>
                        )}

                        {/* List of tags */}
                        {dish.tags && dish.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1">
                            {dish.tags.slice(0, 3).map(tag => (
                              <span key={tag} className="text-[9px] font-semibold bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-6 text-center text-gray-400">
                        <HelpCircle className="w-8 h-8 mb-1 opacity-50" />
                        <span className="text-xs font-semibold">Not scheduled</span>
                      </div>
                    )}
                  </div>

                  {dish && (
                    <button
                      onClick={() => startEditing(dish)}
                      className="mt-4 w-full bg-gray-50 hover:bg-[#16321F] hover:text-white dark:bg-gray-800/40 dark:hover:bg-[#D9E96B]/10 dark:hover:text-[#D9E96B] text-gray-600 dark:text-gray-300 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Configure Meal
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Interactive Editor Sidebar */}
        <div>
          {editingItem ? (
            <div className="bg-white dark:bg-[#121212] rounded-2xl border border-[#16321F]/20 dark:border-[#D9E96B]/20 p-6 space-y-5 shadow-sm sticky top-24">
              <div className="flex items-center justify-between border-b border-gray-50 dark:border-gray-800/50 pb-4">
                <div>
                  <h4 className="text-sm font-extrabold text-gray-900 dark:text-white">Configure Meal Settings</h4>
                  <p className="text-[10px] text-gray-400 uppercase font-bold mt-0.5 tracking-wider">
                    {editingItem.mealType} • {editingItem.dayOfWeek}
                  </p>
                </div>
                <button 
                  onClick={() => { triggerHaptic('light'); setEditingItem(null); }}
                  className="p-1.5 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full text-gray-400 hover:text-gray-600"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Dish Name</label>
                  <input
                    type="text"
                    required
                    value={editingItem.name}
                    onChange={e => setEditingItem({ ...editingItem, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 focus:border-[#16321F] dark:focus:border-[#D9E96B] focus:ring-1 focus:ring-[#16321F] dark:focus:ring-[#D9E96B] rounded-xl text-sm font-bold text-gray-900 dark:text-white"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Description</label>
                  <textarea
                    rows={3}
                    required
                    value={editingItem.description.replace(/\s*Options:\s*[^\n]+/gi, '')}
                    onChange={e => setEditingItem({ ...editingItem, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 focus:border-[#16321F] dark:focus:border-[#D9E96B] focus:ring-1 focus:ring-[#16321F] dark:focus:ring-[#D9E96B] rounded-xl text-xs text-gray-700 dark:text-gray-300 leading-relaxed"
                  />
                </div>

                {/* Calories */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Calories (kcal)</label>
                  <input
                    type="number"
                    required
                    min={50}
                    max={2000}
                    value={editingItem.calories}
                    onChange={e => setEditingItem({ ...editingItem, calories: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 focus:border-[#16321F] dark:focus:border-[#D9E96B] focus:ring-1 focus:ring-[#16321F] dark:focus:ring-[#D9E96B] rounded-xl text-sm font-bold text-gray-900 dark:text-white font-mono"
                  />
                </div>

                {/* Customizable Meal choice options Section */}
                <div className="border-t border-gray-50 dark:border-gray-800/50 pt-4">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Customizable Options</span>
                    <span className="text-[9px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-500 px-1.5 py-0.5 rounded">
                      Paneer vs Egg Friday
                    </span>
                  </label>
                  
                  {/* Current options tag row */}
                  {mealOptions.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 mb-3 bg-gray-50 dark:bg-gray-900/40 p-2.5 rounded-xl border border-dashed border-gray-100 dark:border-gray-800">
                      {mealOptions.map(opt => (
                        <span 
                          key={opt} 
                          className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-[#16321F]/10 dark:bg-[#D9E96B]/10 text-[#16321F] dark:text-[#D9E96B] px-2 py-1 rounded-lg"
                        >
                          {opt}
                          <button
                            type="button"
                            onClick={() => handleRemoveOption(opt)}
                            className="hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] text-gray-400 mb-2 italic">No customizable choices configured. This meal has a single option.</p>
                  )}

                  {/* Add option tag input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Scrambled Egg"
                      value={newOption}
                      onChange={e => setNewOption(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddOption(); } }}
                      className="flex-1 px-3 py-2 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 focus:border-[#16321F] dark:focus:border-[#D9E96B] rounded-lg text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddOption}
                      className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-700 dark:text-gray-300 p-2 rounded-lg"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Tag list */}
                <div className="border-t border-gray-50 dark:border-gray-800/50 pt-4">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Dietary Tags</label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {editingItem.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="inline-flex items-center gap-1 text-[10px] font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-md"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-red-500 transition-colors"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. High Protein"
                      value={newTag}
                      onChange={e => setNewTag(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                      className="flex-1 px-3 py-2 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 focus:border-[#16321F] dark:focus:border-[#D9E96B] rounded-lg text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-700 dark:text-gray-300 p-2 rounded-lg"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Recipe Ingredients */}
                <div className="border-t border-gray-50 dark:border-gray-800/50 pt-4 space-y-3">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Recipe Ingredients</span>
                    <span className="text-[9px] font-mono text-gray-500">Per Serving</span>
                  </label>
                  
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 no-scrollbar">
                    {recipeRows.length > 0 ? (
                      recipeRows.map((row, index) => {
                        const invItem = prepItems.find(p => p.id === row.ingredientId);
                        return (
                          <div key={index} className="flex gap-2 items-center">
                            {/* Select Ingredient */}
                            <select
                              value={row.ingredientId}
                              onChange={e => {
                                const selectedId = e.target.value;
                                const selectedInv = prepItems.find(p => p.id === selectedId);
                                const updated = [...recipeRows];
                                updated[index] = {
                                  ...updated[index],
                                  ingredientId: selectedId,
                                  unit: selectedInv ? selectedInv.unit : 'kg'
                                };
                                setRecipeRows(updated);
                              }}
                              className="flex-1 px-2 py-2 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 rounded-lg text-xs font-bold text-gray-900 dark:text-white"
                            >
                              <option value="">-- Ingredient --</option>
                              {prepItems.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                              ))}
                            </select>
                            
                            {/* Qty */}
                            <div className="w-20 flex items-center bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 rounded-lg px-2">
                              <input
                                type="number"
                                step="0.001"
                                min="0.001"
                                value={row.qtyPerServing}
                                onChange={e => {
                                  const updated = [...recipeRows];
                                  updated[index].qtyPerServing = parseFloat(e.target.value) || 0;
                                  setRecipeRows(updated);
                                }}
                                className="w-full py-1.5 bg-transparent text-xs font-bold text-gray-900 dark:text-white outline-none"
                                placeholder="0.0"
                              />
                              <span className="text-[9px] text-gray-400 font-bold ml-1">{row.unit}</span>
                            </div>
                            
                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => {
                                triggerHaptic('light');
                                setRecipeRows(recipeRows.filter((_, i) => i !== index));
                              }}
                              className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-[10px] text-gray-400 italic">No ingredients configured. Add some below.</p>
                    )}
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic('light');
                      const firstItem = prepItems[0];
                      setRecipeRows([...recipeRows, {
                        ingredientId: firstItem ? firstItem.id : '',
                        qtyPerServing: 0.05,
                        unit: firstItem ? firstItem.unit : 'kg'
                      }]);
                    }}
                    className="w-full border border-dashed border-gray-200 dark:border-gray-800 hover:border-[#16321F] dark:hover:border-[#D9E96B] text-gray-500 hover:text-[#16321F] dark:hover:text-[#D9E96B] py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Ingredient
                  </button>
                </div>

                {/* Publish changes */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-6 bg-[#16321F] dark:bg-[#D9E96B] text-[#D9E96B] dark:text-[#16321F] hover:bg-[#2C4134] dark:hover:bg-[#EAF5E4] py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isSubmitting ? 'Publishing to DB...' : 'Publish & Sync Menu'}
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-gray-50/50 dark:bg-gray-900/10 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl p-8 text-center flex flex-col items-center justify-center h-[350px]">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5 text-gray-400" />
              </div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">Interactive Configurator</h4>
              <p className="text-xs text-gray-400 max-w-[200px] mt-1 leading-relaxed">
                Click "Configure Meal" on any daily schedule card to edit dish details and choose customization options.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
