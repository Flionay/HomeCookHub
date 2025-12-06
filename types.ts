export enum StorageLocation {
  FRIDGE = '冰箱冷藏',
  FREEZER = '冰箱冷冻',
  PANTRY = '常温/储物柜',
  OTHER = '其他位置'
}

export enum DishCategory {
  MEAT = '荤菜/肉禽',
  VEG = '素菜/时蔬',
  SEAFOOD = '海鲜/水产',
  SOUP = '汤羹/炖品',
  STAPLE = '主食/面点',
  DRINK = '饮品/甜点',
  OTHER = '其他'
}

export enum Chef {
  HUSBAND = '男主人',
  WIFE = '女主人',
  BOTH = '共同合作/任何人'
}

export interface Ingredient {
  id: string;
  name: string;
  location: StorageLocation;
  category: DishCategory;
  quantity: string;
}

export interface Recipe {
  id: string;
  name: string;
  category: DishCategory;
  chef: Chef;
  rating: number; // 1-5
  notes: string;
  timesCooked: number;
  lastCooked?: string;
  imageUrl?: string; // Added for visual enhancement
}

export interface GeneratedDish {
  name: string;
  description: string;
  ingredientsUsed: string[];
  steps: string[];
}

export interface GeneratedMenu {
  title: string;
  reasoning: string;
  dishes: GeneratedDish[];
}