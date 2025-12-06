import React, { useState } from 'react';
import { Ingredient, Recipe, Chef, GeneratedMenu } from '../types';
import { generateMenuRecommendation } from '../services/geminiService';
import { Button, Card, Badge } from '../components/Common';
import { Sparkles, Users, Utensils, AlertCircle, Loader2, ChefHat, ScrollText, KeyRound } from 'lucide-react';

interface Props {
  inventory: Ingredient[];
  recipes: Recipe[];
}

export const AiChefView: React.FC<Props> = ({ inventory, recipes }) => {
  const [peopleCount, setPeopleCount] = useState(2);
  const [selectedChef, setSelectedChef] = useState<Chef>(Chef.BOTH);
  const [userNotes, setUserNotes] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [menu, setMenu] = useState<GeneratedMenu | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setMenu(null);
    try {
      const result = await generateMenuRecommendation({
        inventory,
        recipes,
        preferences: {
          peopleCount,
          chef: selectedChef,
          notes: userNotes
        }
      });
      setMenu(result);
    } catch (err: any) {
      console.error(err);
      if (err.toString().includes("API key")) {
         setError("未检测到 API Key。请确保在环境配置中设置了正确的 Google AI API Key。");
      } else {
         setError("AI 大厨遇到了一点技术问题，请稍后再试。");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-stone-50">
        <div className="max-w-5xl mx-auto space-y-8 p-4 md:p-8 pb-32">
        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden shadow-xl text-white h-56 md:h-72 flex items-end group">
                <img 
                    src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80" 
                    alt="Kitchen" 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/40 to-transparent"></div>
                <div className="relative p-6 md:p-10 z-10 w-full">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="bg-yellow-400 text-stone-900 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
                            <Sparkles size={12} /> POWERED BY GEMINI
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold mb-2 text-white">
                        AI 智能主厨
                    </h1>
                    <p className="text-stone-300 text-sm md:text-lg max-w-lg">
                        为您盘点冰箱库存，结合拿手好菜，一键生成今天的完美菜单。
                    </p>
                </div>
        </div>

        {/* Configuration Panel */}
        <div className="relative z-20 -mt-12 mx-2 md:mx-0">
            <Card className="p-6 md:p-8 bg-white/95 backdrop-blur-sm shadow-xl border border-orange-100 rounded-2xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    <div>
                        <label className="block text-sm font-bold text-stone-700 mb-3 flex items-center gap-2">
                            <Users size={18} className="text-orange-500" /> 用餐人数
                        </label>
                        <div className="flex items-center gap-4 bg-stone-50 p-2 rounded-xl border border-stone-200">
                            <button onClick={() => setPeopleCount(Math.max(1, peopleCount - 1))} className="w-10 h-10 rounded-lg bg-white shadow-sm hover:text-orange-600 font-bold border border-stone-100 transition-colors text-xl">-</button>
                            <span className="font-bold text-xl w-8 text-center">{peopleCount}</span>
                            <button onClick={() => setPeopleCount(peopleCount + 1)} className="w-10 h-10 rounded-lg bg-white shadow-sm hover:text-orange-600 font-bold border border-stone-100 transition-colors text-xl">+</button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-stone-700 mb-3 flex items-center gap-2">
                            <ChefHat size={18} className="text-orange-500" /> 掌勺大厨
                        </label>
                        <div className="relative">
                            <select 
                                className="w-full p-4 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 appearance-none font-medium"
                                value={selectedChef}
                                onChange={(e) => setSelectedChef(e.target.value as Chef)}
                            >
                                {Object.values(Chef).map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <Utensils className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" size={16} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-stone-700 mb-3 flex items-center gap-2">
                            <ScrollText size={18} className="text-orange-500" /> 特殊备注
                        </label>
                        <input 
                            type="text" 
                            placeholder="例如: 想喝汤, 微辣..."
                            className="w-full p-4 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 font-medium placeholder:font-normal"
                            value={userNotes}
                            onChange={(e) => setUserNotes(e.target.value)}
                        />
                    </div>
                </div>

                <div className="mt-8 flex justify-center">
                    <Button 
                        onClick={handleGenerate} 
                        disabled={loading} 
                        className="w-full md:w-auto min-w-[280px] shadow-orange-300 shadow-xl text-lg py-4 rounded-xl font-bold hover:scale-105 transition-transform bg-gradient-to-r from-orange-500 to-red-500 border-0"
                    >
                        {loading ? <><Loader2 className="animate-spin" /> 正在思考美味搭配...</> : <><Sparkles size={20} /> 生成今日菜单</>}
                    </Button>
                </div>
            </Card>
        </div>

        {/* Error */}
        {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-start gap-3 border border-red-100 mx-2 md:mx-0 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="font-bold">生成失败</p>
                        <p className="text-sm mt-1">{error}</p>
                    </div>
                </div>
        )}

        {/* Results */}
        {menu && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="bg-orange-50 p-8 rounded-3xl border-2 border-orange-100 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-300 via-yellow-300 to-orange-300"></div>
                        <h2 className="text-3xl font-bold text-stone-800 mb-3">"{menu.title}"</h2>
                        <p className="text-orange-700 text-lg italic max-w-2xl mx-auto leading-relaxed">{menu.reasoning}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {menu.dishes.map((dish, idx) => (
                            <Card key={idx} className="flex flex-col h-full border-0 shadow-lg ring-1 ring-stone-100 overflow-hidden group">
                                <div className="bg-stone-800 p-6 text-white relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4">
                                        <Utensils size={100} />
                                    </div>
                                    <h3 className="text-2xl font-bold relative z-10">{dish.name}</h3>
                                    <p className="text-stone-300 text-sm mt-2 relative z-10">{dish.description}</p>
                                </div>
                                <div className="p-6 flex-1 space-y-6 bg-white">
                                    <div>
                                        <h4 className="text-xs font-bold uppercase text-stone-400 tracking-wider mb-3">使用食材</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {dish.ingredientsUsed.map((ing, i) => (
                                                <Badge key={i} color="bg-green-50 text-green-700 border border-green-100 px-3 py-1">{ing}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold uppercase text-stone-400 tracking-wider mb-3">烹饪步骤</h4>
                                        <ul className="space-y-4">
                                            {dish.steps.map((step, sIdx) => (
                                                <li key={sIdx} className="flex gap-4 text-stone-700 leading-relaxed">
                                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold mt-0.5">{sIdx + 1}</span>
                                                    <span className="text-sm">{step}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
            </div>
        )}
        </div>
    </div>
  );
};