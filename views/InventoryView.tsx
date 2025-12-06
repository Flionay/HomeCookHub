import React, { useState } from 'react';
import { Ingredient, StorageLocation, DishCategory } from '../types';
import { Button, Modal, Badge } from '../components/Common';
import { Plus, Trash2, Snowflake, Thermometer, Package, Archive, Search, ShoppingBag } from 'lucide-react';

interface Props {
  inventory: Ingredient[];
  setInventory: React.Dispatch<React.SetStateAction<Ingredient[]>>;
}

export const InventoryView: React.FC<Props> = ({ inventory, setInventory }) => {
  const [activeTab, setActiveTab] = useState<StorageLocation>(StorageLocation.FRIDGE);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const defaultNewItem: Partial<Ingredient> = { 
    location: activeTab, // Default to current tab
    quantity: '1', 
    category: DishCategory.VEG 
  };
  const [newItem, setNewItem] = useState<Partial<Ingredient>>(defaultNewItem);

  const filteredItems = inventory.filter(item => {
      const matchLoc = item.location === activeTab;
      const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchLoc && matchSearch;
  });

  const handleAdd = () => {
    if (!newItem.name) return;
    const item: Ingredient = {
      id: Date.now().toString(),
      name: newItem.name,
      location: newItem.location || activeTab,
      category: newItem.category || DishCategory.OTHER,
      quantity: newItem.quantity || '1'
    };
    setInventory(prev => [...prev, item]);
    setNewItem({ ...defaultNewItem, location: activeTab, name: '' });
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setInventory(prev => prev.filter(i => i.id !== id));
  };

  const getLocationIcon = (loc: StorageLocation) => {
    switch (loc) {
      case StorageLocation.FRIDGE: return <Thermometer size={16} />;
      case StorageLocation.FREEZER: return <Snowflake size={16} />;
      case StorageLocation.PANTRY: return <Package size={16} />;
      default: return <Archive size={16} />;
    }
  };

  return (
    <div className="flex h-full bg-stone-100">
      
      {/* Left Sidebar - Storage Locations (Like Category Menu) */}
      <aside className="w-24 md:w-64 bg-stone-200/50 h-full overflow-y-auto pb-24 flex-shrink-0">
        <div className="p-2 space-y-2">
            {Object.values(StorageLocation).map(loc => {
                const isActive = activeTab === loc;
                return (
                    <button
                        key={loc}
                        onClick={() => setActiveTab(loc)}
                        className={`w-full p-3 md:px-5 md:py-4 rounded-xl md:rounded-r-none md:rounded-l-2xl text-left text-xs md:text-sm font-bold flex flex-col md:flex-row md:items-center gap-2 transition-all relative ${
                            isActive 
                            ? 'bg-white text-stone-800 shadow-sm' 
                            : 'text-stone-500 hover:bg-stone-200/50'
                        }`}
                    >
                        <span className={`p-1.5 rounded-full ${isActive ? 'bg-orange-100 text-orange-600' : 'bg-stone-300/50 text-stone-500'}`}>
                             {getLocationIcon(loc)}
                        </span>
                        <span className="text-center md:text-left leading-tight">{loc}</span>
                        {isActive && <div className="absolute left-0 top-3 bottom-3 w-1 bg-orange-500 rounded-r-full md:hidden"></div>}
                        {isActive && <div className="hidden md:block absolute right-0 top-0 bottom-0 w-1 bg-orange-500"></div>}
                    </button>
                );
            })}
        </div>
      </aside>

      {/* Right Content - Items List */}
      <div className="flex-1 h-full bg-white relative flex flex-col">
          {/* Right Header (Search) */}
          <div className="p-4 bg-white sticky top-0 z-10 border-b border-stone-100 flex items-center gap-3">
              <div className="relative flex-1">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                 <input 
                    type="text" 
                    placeholder={`搜索${activeTab}里的食材...`}
                    className="w-full pl-9 pr-4 py-2 bg-stone-100 border-none rounded-full text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                 />
              </div>
          </div>

          {/* Scrollable List */}
          <div className="flex-1 overflow-y-auto p-4 pb-28 space-y-3">
             <div className="flex justify-between items-center mb-2">
                 <h3 className="font-bold text-stone-700">{activeTab}</h3>
                 <span className="text-xs text-stone-400">共 {filteredItems.length} 件物品</span>
             </div>

             {filteredItems.length === 0 ? (
                <div className="py-12 text-center text-stone-400 flex flex-col items-center">
                    <ShoppingBag size={48} className="opacity-20 mb-3" />
                    <p>这里还没有食材哦</p>
                    <Button variant="ghost" className="mt-2 text-sm text-orange-600" onClick={() => setIsModalOpen(true)}>去添加一个?</Button>
                </div>
             ) : (
                 filteredItems.map(item => (
                    <div key={item.id} className="flex justify-between items-center p-3 bg-white border border-stone-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                         <div className="flex items-center gap-3">
                             <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                                item.category === DishCategory.MEAT ? 'bg-red-50 text-red-500' :
                                item.category === DishCategory.VEG ? 'bg-green-50 text-green-500' :
                                item.category === DishCategory.SEAFOOD ? 'bg-blue-50 text-blue-500' :
                                'bg-orange-50 text-orange-500'
                            }`}>
                                {item.name.charAt(0)}
                            </div>
                            <div>
                                <h4 className="font-bold text-stone-800">{item.name}</h4>
                                <div className="flex gap-2 text-xs text-stone-500 mt-0.5">
                                    <span className="bg-stone-100 px-1.5 rounded">{item.quantity}</span>
                                    <span>{item.category}</span>
                                </div>
                            </div>
                         </div>
                         <button 
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-stone-300 hover:text-red-500 transition-colors"
                         >
                            <Trash2 size={18} />
                         </button>
                    </div>
                 ))
             )}
          </div>

          {/* Floating Action Button */}
          <button 
             onClick={() => setIsModalOpen(true)}
             className="absolute bottom-24 right-4 md:bottom-8 md:right-8 w-14 h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg shadow-orange-500/30 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 z-20"
          >
              <Plus size={28} />
          </button>
      </div>

      {/* Add Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="添置新食材">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2">食材名称</label>
            <input 
              autoFocus
              type="text" 
              placeholder="例如: 鸡蛋, 牛排"
              className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
              value={newItem.name || ''}
              onChange={e => setNewItem(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">分类</label>
              <select 
                className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl outline-none"
                value={newItem.category}
                onChange={e => setNewItem(prev => ({ ...prev, category: e.target.value as DishCategory }))}
              >
                {Object.values(DishCategory).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
             <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">数量</label>
              <input 
                type="text" 
                placeholder="例如: 1盒"
                className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl outline-none"
                value={newItem.quantity || ''}
                onChange={e => setNewItem(prev => ({ ...prev, quantity: e.target.value }))}
              />
            </div>
          </div>
          
          <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">存放位置</label>
              <div className="flex flex-wrap gap-2">
                 {Object.values(StorageLocation).map(l => (
                    <button
                        key={l}
                        onClick={() => setNewItem(prev => ({ ...prev, location: l }))}
                        className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                            newItem.location === l 
                            ? 'bg-orange-50 border-orange-500 text-orange-700' 
                            : 'bg-stone-50 border-stone-200 text-stone-600'
                        }`}
                    >
                        {l}
                    </button>
                 ))}
              </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>取消</Button>
            <Button onClick={handleAdd} disabled={!newItem.name}>保存</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};