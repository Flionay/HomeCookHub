import React, { useState } from 'react';
import { Recipe, DishCategory, Chef } from '../types';
import { Button, Modal, StarRating, Badge } from '../components/Common';
import { Plus, Search, ChefHat, Edit2, Trash2, Clock, Utensils } from 'lucide-react';

interface Props {
  recipes: Recipe[];
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
}

const CATEGORY_IMAGES: Record<string, string> = {
    [DishCategory.MEAT]: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=200&q=60',
    [DishCategory.VEG]: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=200&q=60',
    [DishCategory.SEAFOOD]: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=200&q=60',
    [DishCategory.SOUP]: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=200&q=60',
    [DishCategory.STAPLE]: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=200&q=60',
    [DishCategory.DRINK]: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=200&q=60',
    [DishCategory.OTHER]: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=60'
};

export const RecipeBookView: React.FC<Props> = ({ recipes, setRecipes }) => {
  const [activeCategory, setActiveCategory] = useState<string>('全部');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const emptyRecipe: Partial<Recipe> = { 
    name: '', category: DishCategory.MEAT, chef: Chef.BOTH, rating: 3, notes: '', timesCooked: 0 
  };
  const [formData, setFormData] = useState<Partial<Recipe>>(emptyRecipe);

  const categories = ['全部', ...Object.values(DishCategory)];

  const filteredRecipes = recipes.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === '全部' || r.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSave = () => {
    if (!formData.name) return;

    if (editingId) {
      setRecipes(prev => prev.map(r => r.id === editingId ? { ...r, ...formData } as Recipe : r));
    } else {
      const newRecipe: Recipe = {
        ...formData,
        id: Date.now().toString(),
        timesCooked: formData.timesCooked || 0,
      } as Recipe;
      setRecipes(prev => [...prev, newRecipe]);
    }
    closeModal();
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("确定要删除这道菜吗？")) {
      setRecipes(prev => prev.filter(r => r.id !== id));
    }
  };

  const openEdit = (recipe: Recipe) => {
    setFormData(recipe);
    setEditingId(recipe.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(emptyRecipe);
  };

  return (
    <div className="flex h-full bg-stone-100">
      
      {/* Left Sidebar - Categories */}
      <aside className="w-24 md:w-64 bg-stone-200/50 h-full overflow-y-auto pb-24 flex-shrink-0">
        <div className="p-2 space-y-2">
            {categories.map(cat => {
                const isActive = activeCategory === cat;
                return (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`w-full p-3 md:px-5 md:py-4 rounded-xl md:rounded-r-none md:rounded-l-2xl text-left text-xs md:text-sm font-bold flex flex-col md:flex-row md:items-center gap-2 transition-all relative ${
                            isActive 
                            ? 'bg-white text-stone-800 shadow-sm' 
                            : 'text-stone-500 hover:bg-stone-200/50'
                        }`}
                    >
                         <span className={`p-1.5 rounded-full ${isActive ? 'bg-orange-100 text-orange-600' : 'bg-stone-300/50 text-stone-500'}`}>
                             {cat === '全部' ? <Utensils size={16}/> : <span className="text-xs">●</span>}
                        </span>
                        <span className="text-center md:text-left leading-tight">{cat}</span>
                        {isActive && <div className="absolute left-0 top-3 bottom-3 w-1 bg-orange-500 rounded-r-full md:hidden"></div>}
                        {isActive && <div className="hidden md:block absolute right-0 top-0 bottom-0 w-1 bg-orange-500"></div>}
                    </button>
                );
            })}
        </div>
      </aside>

      {/* Right Content */}
      <div className="flex-1 h-full bg-white relative flex flex-col">
          {/* Header */}
          <div className="p-4 bg-white sticky top-0 z-10 border-b border-stone-100 flex items-center gap-3">
              <div className="relative flex-1">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                 <input 
                    type="text" 
                    placeholder="搜索拿手菜..." 
                    className="w-full pl-9 pr-4 py-2 bg-stone-100 border-none rounded-full text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                 />
              </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 pb-28 space-y-4">
             <div className="flex justify-between items-center mb-1">
                 <h3 className="font-bold text-stone-700">{activeCategory}</h3>
                 <span className="text-xs text-stone-400">{filteredRecipes.length} 道菜</span>
             </div>

             {filteredRecipes.length === 0 ? (
                <div className="py-16 text-center text-stone-400 flex flex-col items-center">
                    <Utensils size={40} className="opacity-20 mb-3" />
                    <p>暂无菜谱</p>
                    <Button variant="ghost" className="mt-2 text-sm text-orange-600" onClick={() => setIsModalOpen(true)}>去记录一道</Button>
                </div>
             ) : (
                filteredRecipes.map(recipe => (
                    <div key={recipe.id} onClick={() => openEdit(recipe)} className="flex bg-white rounded-xl border border-stone-100 shadow-sm hover:shadow-md transition-all overflow-hidden cursor-pointer h-28">
                         {/* Thumbnail */}
                         <div className="w-24 md:w-32 bg-stone-200 flex-shrink-0">
                            <img 
                                src={CATEGORY_IMAGES[recipe.category] || CATEGORY_IMAGES[DishCategory.MEAT]} 
                                alt={recipe.name}
                                className="w-full h-full object-cover"
                            />
                         </div>
                         {/* Details */}
                         <div className="flex-1 p-3 flex flex-col justify-between">
                             <div className="flex justify-between items-start">
                                 <div>
                                    <h3 className="font-bold text-stone-800 leading-tight">{recipe.name}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${recipe.chef === Chef.WIFE ? 'bg-pink-50 text-pink-600' : recipe.chef === Chef.HUSBAND ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                            {recipe.chef}
                                        </span>
                                        <div className="flex"><StarRating rating={recipe.rating} readonly /></div>
                                    </div>
                                 </div>
                                 <button onClick={(e) => handleDelete(recipe.id, e)} className="text-stone-300 hover:text-red-500 p-1">
                                    <Trash2 size={16} />
                                 </button>
                             </div>
                             <div className="flex justify-between items-end text-xs text-stone-400">
                                 <span className="flex items-center gap-1"><Clock size={12}/> 做过 {recipe.timesCooked} 次</span>
                                 <span className="bg-stone-50 px-2 py-0.5 rounded">{recipe.category}</span>
                             </div>
                         </div>
                    </div>
                ))
             )}
          </div>

          {/* Floating Add Button */}
          <button 
             onClick={() => setIsModalOpen(true)}
             className="absolute bottom-24 right-4 md:bottom-8 md:right-8 w-14 h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg shadow-orange-500/30 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 z-20"
          >
              <Plus size={28} />
          </button>
      </div>

       {/* Modal */}
       <Modal isOpen={isModalOpen} onClose={closeModal} title={editingId ? "编辑菜谱" : "新增拿手菜"}>
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-bold text-stone-700 mb-1">菜品名称</label>
                <input 
                    type="text" 
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" 
                    placeholder="例如: 红烧肉"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold text-stone-700 mb-1">分类</label>
                    <select 
                        className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl outline-none"
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value as DishCategory})}
                    >
                         {Object.values(DishCategory).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-bold text-stone-700 mb-1">大厨</label>
                    <select 
                        className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl outline-none"
                        value={formData.chef}
                        onChange={e => setFormData({...formData, chef: e.target.value as Chef})}
                    >
                         {Object.values(Chef).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>
             <div>
                <label className="block text-sm font-bold text-stone-700 mb-1">评分</label>
                <div className="p-2 border border-stone-200 rounded-xl flex items-center bg-stone-50">
                    <StarRating rating={formData.rating || 0} setRating={(r) => setFormData({...formData, rating: r})} />
                </div>
            </div>
             <div>
                <label className="block text-sm font-bold text-stone-700 mb-1">笔记</label>
                <textarea 
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl h-20 resize-none outline-none"
                    placeholder="例如: 孩子爱吃..."
                    value={formData.notes}
                    onChange={e => setFormData({...formData, notes: e.target.value})}
                />
            </div>
            <div className="pt-4 flex justify-end gap-3">
                <Button variant="ghost" onClick={closeModal}>取消</Button>
                <Button onClick={handleSave} disabled={!formData.name}>保存</Button>
            </div>
        </div>
      </Modal>
    </div>
  );
};