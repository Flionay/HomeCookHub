import React, { useState } from 'react';
import { Ingredient, StorageLocation, DishCategory } from '../types';
import { Button, Card, Modal, Badge } from '../components/Common';
import { Plus, Trash2, Snowflake, Thermometer, Package, Archive, ShoppingBasket, Tag } from 'lucide-react';

interface Props {
  inventory: Ingredient[];
  setInventory: React.Dispatch<React.SetStateAction<Ingredient[]>>;
}

export const InventoryView: React.FC<Props> = ({ inventory, setInventory }) => {
  const [activeTab, setActiveTab] = useState<StorageLocation>(StorageLocation.FRIDGE);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const defaultNewItem: Partial<Ingredient> = { 
    location: StorageLocation.FRIDGE, 
    quantity: '1', 
    category: DishCategory.VEG 
  };
  const [newItem, setNewItem] = useState<Partial<Ingredient>>(defaultNewItem);

  const filteredItems = inventory.filter(item => item.location === activeTab);

  const handleAdd = () => {
    if (!newItem.name) return;
    const item: Ingredient = {
      id: Date.now().toString(),
      name: newItem.name,
      location: newItem.location || StorageLocation.FRIDGE,
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
      case StorageLocation.FRIDGE: return <Thermometer size={18} />;
      case StorageLocation.FREEZER: return <Snowflake size={18} />;
      case StorageLocation.PANTRY: return <Package size={18} />;
      default: return <Archive size={18} />;
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl shadow-sm border border-stone-100 relative overflow-hidden gap-4">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-stone-800">家庭食材库</h2>
          <p className="text-stone-500 text-sm mt-1">管理冰箱和储物柜，不要浪费哦</p>
        </div>
        
        {/* Decorative background icon */}
        <ShoppingBasket className="absolute right-[-20px] bottom-[-20px] text-orange-50 opacity-50" size={120} />
        
        <div className="relative z-10 w-full sm:w-auto">
            <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">
            <Plus size={20} /> 添加食材
            </Button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
        {Object.values(StorageLocation).map(loc => (
          <button
            key={loc}
            onClick={() => setActiveTab(loc)}
            className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
              activeTab === loc 
                ? 'bg-orange-500 text-white shadow-orange-200 shadow-lg scale-105' 
                : 'bg-white text-stone-500 hover:bg-stone-50 border border-stone-100'
            }`}
          >
            {getLocationIcon(loc)}
            {loc}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.length === 0 ? (
          <div className="col-span-full py-16 text-center text-stone-400 bg-white rounded-2xl border-2 border-dashed border-stone-100">
            <ShoppingBasket className="mx-auto mb-3 opacity-20" size={48} />
            <p className="text-lg font-medium">{activeTab} 空空如也</p>
            <p className="text-sm">该去超市进货啦！</p>
          </div>
        ) : (
          filteredItems.map(item => (
            <Card key={item.id} className="p-4 flex justify-between items-center group hover:border-orange-200 hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 ${
                    item.category === DishCategory.MEAT ? 'bg-red-50 text-red-500' :
                    item.category === DishCategory.VEG ? 'bg-green-50 text-green-500' :
                    item.category === DishCategory.SEAFOOD ? 'bg-blue-50 text-blue-500' :
                    'bg-orange-50 text-orange-500'
                }`}>
                    {item.name.charAt(0)}
                </div>
                <div>
                    <h3 className="font-bold text-stone-800 text-lg leading-tight">{item.name}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        <Badge color="bg-stone-100 text-stone-600 border border-stone-200">数量: {item.quantity}</Badge>
                        <Badge color="bg-stone-50 text-stone-400 text-[10px]">{item.category}</Badge>
                    </div>
                </div>
              </div>
              <button 
                onClick={() => handleDelete(item.id)}
                className="p-2 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors flex-shrink-0"
                title="删除"
              >
                <Trash2 size={18} />
              </button>
            </Card>
          ))
        )}
      </div>

      {/* Add Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="添置新食材">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2">食材名称</label>
            <input 
              autoFocus
              type="text" 
              placeholder="例如: 鸡蛋, 牛排, 西兰花"
              className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              value={newItem.name || ''}
              onChange={e => setNewItem(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">分类</label>
              <select 
                className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                value={newItem.category}
                onChange={e => setNewItem(prev => ({ ...prev, category: e.target.value as DishCategory }))}
              >
                {Object.values(DishCategory).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
             <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">数量/重量</label>
              <input 
                type="text" 
                placeholder="例如: 1盒, 500g"
                className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                value={newItem.quantity || ''}
                onChange={e => setNewItem(prev => ({ ...prev, quantity: e.target.value }))}
              />
            </div>
          </div>
          
          <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">存放位置</label>
              <div className="grid grid-cols-2 gap-2">
                 {Object.values(StorageLocation).map(l => (
                    <button
                        key={l}
                        onClick={() => setNewItem(prev => ({ ...prev, location: l }))}
                        className={`p-3 rounded-xl text-sm font-medium border transition-all ${
                            newItem.location === l 
                            ? 'bg-orange-50 border-orange-500 text-orange-700' 
                            : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                        }`}
                    >
                        {l}
                    </button>
                 ))}
              </div>
          </div>
          
          <div className="pt-6 flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>取消</Button>
            <Button onClick={handleAdd} disabled={!newItem.name}>保存食材</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};