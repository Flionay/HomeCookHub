import React, { useState } from 'react';
import { Recipe, DishCategory, Chef } from '../types';
import { Button, Card, Modal, StarRating, Badge } from '../components/Common';
import { Plus, Search, ChefHat, Edit2, Trash2, Clock, Utensils } from 'lucide-react';

interface Props {
  recipes: Recipe[];
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
}

// Placeholder images for different categories to beautify the UI
const CATEGORY_IMAGES: Record<string, string> = {
    [DishCategory.MEAT]: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80',
    [DishCategory.VEG]: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    [DishCategory.SEAFOOD]: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=800&q=80',
    [DishCategory.SOUP]: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80',
    [DishCategory.STAPLE]: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80',
    [DishCategory.DRINK]: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80'
};

export const RecipeBookView: React.FC<Props> = ({ recipes, setRecipes }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterChef, setFilterChef] = useState<string>('全部大厨');
  const [filterCategory, setFilterCategory] = useState<string>('全部分类');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state
  const emptyRecipe: Partial<Recipe> = { 
    name: '', category: DishCategory.MEAT, chef: Chef.BOTH, rating: 3, notes: '', timesCooked: 0 
  };
  const [formData, setFormData] = useState<Partial<Recipe>>(emptyRecipe);

  const filteredRecipes = recipes.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesChef = filterChef === '全部大厨' || r.chef === filterChef;
    const matchesCat = filterCategory === '全部分类' || r.category === filterCategory;
    return matchesSearch && matchesChef && matchesCat;
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

  const handleDelete = (id: string) => {
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
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-stone-800">家庭食谱本</h2>
          <p className="text-stone-500 text-sm">记录下咱们家的拿手好菜</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={20} /> 记录新菜谱
        </Button>
      </header>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white p-4 rounded-xl shadow-sm border border-stone-100">
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input 
                type="text" 
                placeholder="搜索菜名..." 
                className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
        </div>
        <select 
            className="p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none cursor-pointer hover:bg-stone-100 transition-colors"
            value={filterChef}
            onChange={e => setFilterChef(e.target.value)}
        >
            <option value="全部大厨">全部大厨</option>
            {Object.values(Chef).map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select 
            className="p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none cursor-pointer hover:bg-stone-100 transition-colors"
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
        >
            <option value="全部分类">全部分类</option>
            {Object.values(DishCategory).map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.length === 0 ? (
           <div className="col-span-full py-16 text-center text-stone-400 flex flex-col items-center gap-4">
             <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center">
                 <Utensils size={32} className="opacity-30" />
             </div>
             <div>
                <p className="text-lg font-medium">还没有相关菜谱</p>
                <p className="text-sm">快去添加第一道拿手菜吧！</p>
             </div>
          </div>
        ) : (
          filteredRecipes.map(recipe => (
            <Card key={recipe.id} className="flex flex-col h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group border-0 overflow-hidden ring-1 ring-stone-100">
              {/* Image Banner */}
              <div className="h-32 w-full bg-stone-200 relative overflow-hidden">
                <img 
                    src={CATEGORY_IMAGES[recipe.category] || CATEGORY_IMAGES[DishCategory.MEAT]} 
                    alt={recipe.category} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2">
                    <Badge color="bg-white/90 text-stone-800 backdrop-blur-sm shadow-sm font-bold">
                        {recipe.category}
                    </Badge>
                </div>
              </div>

              <div className="p-5 flex-1 space-y-3">
                <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-stone-800 leading-tight">{recipe.name}</h3>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-stone-600">
                    <div className={`p-1.5 rounded-full ${recipe.chef === Chef.WIFE ? 'bg-pink-100 text-pink-600' : recipe.chef === Chef.HUSBAND ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                        <ChefHat size={14} />
                    </div>
                    <span className="font-medium">{recipe.chef}</span>
                </div>

                <div className="flex items-center gap-1">
                    <StarRating rating={recipe.rating} readonly />
                </div>

                {recipe.notes && (
                    <div className="bg-stone-50 p-3 rounded-lg border border-stone-100 mt-2">
                        <p className="text-sm text-stone-600 italic">"{recipe.notes}"</p>
                    </div>
                )}
              </div>
              
              <div className="p-4 bg-white border-t border-stone-100 flex justify-between items-center text-sm text-stone-500">
                 <span className="flex items-center gap-1.5 bg-stone-50 px-2 py-1 rounded-md">
                    <Clock size={14} /> 做过 {recipe.timesCooked} 次
                 </span>
                 <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(recipe)} className="p-2 text-stone-500 hover:bg-stone-100 hover:text-blue-600 rounded-lg transition-colors"><Edit2 size={16}/></button>
                    <button onClick={() => handleDelete(recipe.id)} className="p-2 text-stone-500 hover:bg-stone-100 hover:text-red-600 rounded-lg transition-colors"><Trash2 size={16}/></button>
                 </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingId ? "编辑菜谱" : "新增拿手菜"}>
        <div className="space-y-5">
            <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">菜品名称</label>
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
                    <label className="block text-sm font-bold text-stone-700 mb-2">分类</label>
                    <select 
                        className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value as DishCategory})}
                    >
                         {Object.values(DishCategory).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">掌勺大厨</label>
                    <select 
                        className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                        value={formData.chef}
                        onChange={e => setFormData({...formData, chef: e.target.value as Chef})}
                    >
                         {Object.values(Chef).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>
             <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">美味评分</label>
                <div className="p-3 border border-stone-200 rounded-xl flex items-center bg-stone-50 justify-center">
                    <StarRating rating={formData.rating || 0} setRating={(r) => setFormData({...formData, rating: r})} />
                </div>
            </div>
             <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">烹饪笔记 / 评价</label>
                <textarea 
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl h-24 resize-none focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="例如: 少放点盐，孩子爱吃甜口的。"
                    value={formData.notes}
                    onChange={e => setFormData({...formData, notes: e.target.value})}
                />
            </div>
            <div className="pt-6 flex justify-end gap-3">
                <Button variant="ghost" onClick={closeModal}>取消</Button>
                <Button onClick={handleSave} disabled={!formData.name}>保存菜谱</Button>
            </div>
        </div>
      </Modal>
    </div>
  );
};