import { GoogleGenAI, Type } from "@google/genai";
import { Ingredient, Recipe, GeneratedMenu } from "../types";

interface MenuRequestParams {
  inventory: Ingredient[];
  recipes: Recipe[];
  preferences: {
    chef: string;
    peopleCount: number;
    notes: string;
  };
}

export const generateMenuRecommendation = async (params: MenuRequestParams): Promise<GeneratedMenu | null> => {
  // Initialize the client here to ensure it uses the latest env var and handles runtime context correctly
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const { inventory, recipes, preferences } = params;

  // Prepare context strings with categories
  const inventoryStr = inventory.map(i => `- ${i.name} (${i.quantity}) [${i.category}] - 位置: ${i.location}`).join('\n');
  const recipeStr = recipes.map(r => `- ${r.name} (大厨: ${r.chef}, 评分: ${r.rating}/5, 分类: ${r.category})`).join('\n');

  const promptText = `
    你是一位专业的家庭主厨，正在为通过家庭库存和历史食谱规划一顿美餐。
    
    当前家庭库存 (Inventory):
    ${inventoryStr}

    家庭拿手菜谱 (History):
    ${recipeStr}

    需求详情:
    - 掌勺大厨: ${preferences.chef}
    - 用餐人数: ${preferences.peopleCount}
    - 特殊备注/想吃什么: ${preferences.notes || "无"}

    任务:
    请根据库存和偏好设计一份和谐的菜单（通常2-4道菜）。
    1. 优先消耗库存中的食材。
    2. 可以从拿手菜谱中选择，也可以根据库存推荐新菜。
    3. 所有的输出必须是**简体中文**。
    4. 菜名要好听，步骤要简洁明了。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: promptText }]
        }
      ],
      config: {
        systemInstruction: "你是一个热情、专业的家庭烹饪助手。请始终输出符合 Schema 的有效 JSON 格式。",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "这顿饭的主题名称 (例如: '周五温馨晚餐')" },
            reasoning: { type: Type.STRING, description: "推荐理由 (例如: 帮您消耗了冰箱里的鸡肉)" },
            dishes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "菜名" },
                  description: { type: Type.STRING, description: "简短描述" },
                  ingredientsUsed: { type: Type.ARRAY, items: { type: Type.STRING }, description: "用到的库存食材" },
                  steps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "简化的烹饪步骤 (3-5步)" }
                }
              }
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as GeneratedMenu;
    }
    return null;

  } catch (error) {
    console.error("Error generating menu:", error);
    throw error;
  }
};