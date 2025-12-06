import React, { useState, useEffect } from 'react';
import { InventoryView } from './views/InventoryView';
import { RecipeBookView } from './views/RecipeBookView';
import { AiChefView } from './views/AiChefView';
import { Ingredient, Recipe, DishCategory, Chef, StorageLocation } from './types';
import { Refrigerator, BookOpen, Sparkles, ChefHat } from 'lucide-react';

const App = () => {
  // Navigation State
  const [currentView, setCurrentView] = useState<'inventory' | 'recipes' | 'ai'>('inventory');

  // Data State (Simulated Database - Updated to Chinese)
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

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-stone-900 font-sans pb-32 md:pb-0">
      {/* Top Navbar for Desktop */}
      <nav className="hidden md:flex items-center justify-between px-8 py-5 bg-white border-b border-stone-100 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-orange-400 to-orange-600 p-2.5 rounded-xl text-white shadow-orange-200 shadow-md">
                <ChefHat size={26} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-stone-800 leading-none">家庭小餐馆</h1>
              <span className="text-xs text-stone-400 font-medium tracking-wider">FAMILY BISTRO</span>
            </div>
        </div>
        <div className="flex gap-2 bg-stone-100/50 p-1.5 rounded-xl border border-stone-100">
            <NavButton active={currentView === 'inventory'} onClick={() => setCurrentView('inventory')} icon={<Refrigerator size={18}/>}>食材库存</NavButton>
            <NavButton active={currentView === 'recipes'} onClick={() => setCurrentView('recipes')} icon={<BookOpen size={18}/>}>食谱本</NavButton>
            <NavButton active={currentView === 'ai'} onClick={() => setCurrentView('ai')} icon={<Sparkles size={18}/>}>AI 主厨</NavButton>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4 md:p-8">
        {renderView()}
      </main>

      {/* Mobile Bottom Bar */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 bg-white/95 backdrop-blur-lg border border-stone-200/50 p-2 flex justify-around z-50 rounded-2xl shadow-xl shadow-stone-200/50 ring-1 ring-stone-100">
        <MobileNavButton active={currentView === 'inventory'} onClick={() => setCurrentView('inventory')} icon={<Refrigerator size={24}/>} label="库存" />
        <MobileNavButton active={currentView === 'recipes'} onClick={() => setCurrentView('recipes')} icon={<BookOpen size={24}/>} label="食谱" />
        <MobileNavButton active={currentView === 'ai'} onClick={() => setCurrentView('ai')} icon={<Sparkles size={24}/>} label="AI 主厨" />
      </div>
    </div>
  );
};

const NavButton = ({ active, onClick, children, icon }: any) => (
    <button 
        onClick={onClick}
        className={`px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${
            active ? 'bg-white text-orange-600 shadow-sm ring-1 ring-stone-100' : 'text-stone-500 hover:text-stone-800 hover:bg-stone-200/50'
        }`}
    >
        {icon} {children}
    </button>
);

const MobileNavButton = ({ active, onClick, icon, label }: any) => (
    <button 
        onClick={onClick}
        className={`flex flex-col items-center justify-center p-3 rounded-xl w-full transition-all duration-300 ${
            active ? 'text-orange-600 bg-orange-50 scale-105' : 'text-stone-400'
        }`}
    >
        {icon}
        <span className="text-[10px] font-bold mt-1">{label}</span>
    </button>
);

export default App;