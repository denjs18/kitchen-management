export type FoodLocation = 'frigo' | 'congelateur' | 'sec';
export type FoodUnit = 'unité' | 'g' | 'kg' | 'ml' | 'L' | 'tranche' | 'portion';
export type RecipeCategory = 'Apéro' | 'Entrées' | 'Plats' | 'Desserts' | 'Snacks' | 'Boissons';

export interface FoodItem {
  id: string;
  name: string;
  category: string;
  unit: FoodUnit;
  emoji: string;
}

export interface InventoryItem {
  id?: string;
  foodId: string;
  foodName: string;
  emoji: string;
  location: FoodLocation;
  quantity: number;
  unit: FoodUnit;
  updatedAt: Date;
  purchaseDate?: Date;
  expiryDate?: Date;
}

export interface RecipeIngredient {
  foodId: string;
  foodName: string;
  quantity: number;
  unit: FoodUnit;
}

export interface Recipe {
  id?: string;
  name: string;
  emoji: string;
  category: RecipeCategory;
  servings: number;
  prepTime: number;
  cookTime: number;
  ingredients: RecipeIngredient[];
  instructions: string[];
  isDefault?: boolean;
}

export interface RecipeWithScore extends Recipe {
  matchScore: number;
  availableIngredients: string[];
  missingIngredients: string[];
}
