import React, { useState, useEffect } from 'react';
import { InventoryView } from './views/InventoryView';
import { RecipeBookView } from './views/RecipeBookView';
import { AiChefView } from './views/AiChefView';
import { Ingredient, Recipe, DishCategory, Chef, StorageLocation } from './types';
import { Refrigerator, BookOpen, Sparkles, ChefHat, UserCircle } from 'lucide-react';

const App = () => {
  // Navigation State
  const [currentView, setCurrentView] = useState<'inventory' | 'recipes' | 'ai'>('inventory');

  // Data State
  const [inventory, setInventory] = useState<Ingredient[]>(() => {
    const saved = localStorage.getItem('inventory');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: '土鸡蛋', location: StorageLocation.FRIDGE, category: DishCategory.MEAT, quantity: '6个' },
      { id: '2', name: '冷冻鸡翅', location: StorageLocation.FREEZER, category: DishCategory.MEAT, quantity: '500g' },
      { id: '3', name: '五常大米', location: StorageLocation.PANTRY, category: DishCategory.STAPLE, quantity: '2kg' },
      { id: '4', name: '独头蒜', location: StorageLocation.PANTRY, category: DishCategory.VEG, quantity: '3头' },
      { id: '5', name: '西红柿', location: StorageLocation.FRIDGE, category: DishCategory.VEG, quantity: '2个' }
    ];
  });

  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    const saved = localStorage.getItem('recipes');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: '扬州炒饭', category: DishCategory.STAPLE, chef: Chef.HUSBAND, rating: 5, notes: '简单快手，孩子爱吃。', timesCooked: 12 },
      { id: '2', name: '西红柿鸡蛋汤', category: DishCategory.SOUP, chef: Chef.WIFE, rating: 4, notes: '暖胃舒适。', timesCooked: 8 },
      { id: '3', name: '红烧排骨', category: DishCategory.MEAT, chef: Chef.HUSBAND, rating: 5, notes: '记得多放糖，收汁要浓。', timesCooked: 5 }
    ];
  });

  // Persistence
  useEffect(() => {
    localStorage.setItem('inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('recipes', JSON.stringify(recipes));
  }, [recipes]);

  const renderView = () => {
    switch(currentView) {
      case 'inventory': return <InventoryView inventory={inventory} setInventory={setInventory} />;
      case 'recipes': return <RecipeBookView recipes={recipes} setRecipes={setRecipes} />;
      case 'ai': return <AiChefView inventory={inventory} recipes={recipes} />;
      default: return <InventoryView inventory={inventory} setInventory={setInventory} />;
    }
  };

  const getPageTitle = () => {
    switch(currentView) {
      case 'inventory': return '我的食材库';
      case 'recipes': return '家庭食谱本';
      case 'ai': return 'AI 智能主厨';
      default: return '家庭小餐馆';
    }
  };

  return (
    <div className="flex h-screen bg-stone-50 text-stone-900 font-sans overflow-hidden">
      
      {/* --- Desktop Sidebar --- */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-stone-200 z-20 shadow-sm flex-shrink-0">
        {/* Logo / Brand Area */}
        <div className="h-20 flex items-center px-6 border-b border-stone-100">
             <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-orange-400 to-orange-600 p-2 rounded-xl text-white shadow-orange-200 shadow-md">
                    <ChefHat size={24} />
                </div>
                <div>
                    <h1 className="text-lg font-bold tracking-tight text-stone-800 leading-none">家庭小餐馆</h1>
                    <span className="text-[10px] text-stone-400 font-medium tracking-wider">FAMILY BISTRO</span>
                </div>
            </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <SidebarLink 
                active={currentView === 'inventory'} 
                onClick={() => setCurrentView('inventory')} 
                icon={<Refrigerator size={20}/>} 
                label="食材库存" 
            />
            <SidebarLink 
                active={currentView === 'recipes'} 
                onClick={() => setCurrentView('recipes')} 
                icon={<BookOpen size={20}/>} 
                label="食谱本" 
            />
            <SidebarLink 
                active={currentView === 'ai'} 
                onClick={() => setCurrentView('ai')} 
                icon={<Sparkles size={20}/>} 
                label="AI 主厨" 
            />
        </nav>

        {/* User Profile / Footer */}
        <div className="p-4 border-t border-stone-100 bg-stone-50/50">
             <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-stone-100 cursor-pointer transition-colors">
                <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-stone-500">
                    <UserCircle size={24} />
                </div>
                <div>
                    <p className="text-sm font-bold text-stone-700">我的家</p>
                    <p className="text-xs text-stone-400">设置与账户</p>
                </div>
             </div>
        </div>
      </aside>

      {/* --- Main Content Area (Right Column) --- */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
         
         {/* Desktop Header */}
         <header className="hidden md:flex h-20 bg-white/80 backdrop-blur-md border-b border-stone-200 items-center justify-between px-8 z-10 flex-shrink-0">
             <div>
                <h2 className="text-xl font-bold text-stone-800">{getPageTitle()}</h2>
                <p className="text-xs text-stone-500 mt-0.5">今天也是充满美味的一天</p>
             </div>
             <div className="flex items-center gap-4">
                 <span className="text-xs font-medium text-stone-400 bg-stone-100 px-3 py-1 rounded-full">
                    {new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' })}
                 </span>
             </div>
         </header>

         {/* Mobile Header */}
         <header className="md:hidden h-14 bg-white border-b border-stone-100 flex items-center justify-between px-4 z-10 flex-shrink-0 shadow-sm">
             <div className="flex items-center gap-2">
                <div className="bg-orange-500 p-1.5 rounded-lg text-white">
                    <ChefHat size={18} />
                </div>
                <span className="font-bold text-lg text-stone-800">{getPageTitle()}</span>
             </div>
             <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500">
                 <UserCircle size={18} />
             </div>
         </header>

         {/* View Content - Flex 1 to take remaining height */}
         <main className="flex-1 overflow-hidden relative">
            {renderView()}
         </main>

         {/* Mobile Bottom Navigation */}
         <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 flex justify-around items-center z-50 pb-safe pt-2 h-[80px] pb-5 shadow-[0_-5px_15px_rgba(0,0,0,0.02)]">
            <MobileNavButton active={currentView === 'inventory'} onClick={() => setCurrentView('inventory')} icon={<Refrigerator size={24}/>} label="库存" />
            <MobileNavButton active={currentView === 'recipes'} onClick={() => setCurrentView('recipes')} icon={<BookOpen size={24}/>} label="食谱" />
            <MobileNavButton active={currentView === 'ai'} onClick={() => setCurrentView('ai')} icon={<Sparkles size={24}/>} label="AI 主厨" />
         </div>

      </div>
    </div>
  );
};

// Sub-components for Cleaner Code

const SidebarLink = ({ active, onClick, icon, label }: any) => (
    <button 
        onClick={onClick}
        className={`w-full px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-all duration-200 group ${
            active 
            ? 'bg-orange-50 text-orange-600 shadow-sm ring-1 ring-orange-100' 
            : 'text-stone-500 hover:bg-stone-50 hover:text-stone-800'
        }`}
    >
        <span className={`transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
            {icon}
        </span>
        {label}
        {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500" />}
    </button>
);

const MobileNavButton = ({ active, onClick, icon, label }: any) => (
    <button 
        onClick={onClick}
        className={`flex flex-col items-center justify-center w-full h-full transition-all duration-300 active:scale-95 ${
            active ? 'text-orange-600' : 'text-stone-400'
        }`}
    >
        <div className={`transition-transform duration-300 ${active ? '-translate-y-1' : ''}`}>
            {icon}
        </div>
        <span className={`text-[10px] font-bold mt-1 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-70'}`}>{label}</span>
    </button>
);

export default App;