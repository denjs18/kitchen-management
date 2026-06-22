import { FoodLocation } from './types';

export interface Aisle {
  label: string;
  emoji: string;
  categories: string[];
  order: number;
}

export const AISLES: Aisle[] = [
  { label: 'Fruits & Légumes', emoji: '🥦', categories: ['Légumes', 'Fruits'], order: 1 },
  { label: 'Boucherie & Poissonnerie', emoji: '🥩', categories: ['Viandes', 'Poissons'], order: 2 },
  { label: 'Laitiers & Œufs', emoji: '🥛', categories: ['Laitiers & Œufs'], order: 3 },
  { label: 'Féculents & Boulangerie', emoji: '🍞', categories: ['Féculents'], order: 4 },
  { label: 'Épicerie & Conserves', emoji: '🥫', categories: ['Conserves', 'Épices'], order: 5 },
  { label: 'Sucré & Biscuits', emoji: '🍫', categories: ['Sucré'], order: 6 },
  { label: 'Surgelés', emoji: '🧊', categories: ['Surgelés'], order: 7 },
];

export function getAisle(category: string): Aisle {
  return AISLES.find(a => a.categories.includes(category))
    ?? { label: 'Autre', emoji: '🛒', categories: [], order: 99 };
}

const CATEGORY_DEFAULT_LOCATION: Record<string, FoodLocation> = {
  'Viandes': 'frigo',
  'Poissons': 'frigo',
  'Laitiers & Œufs': 'frigo',
  'Légumes': 'frigo',
  'Fruits': 'frigo',
  'Féculents': 'sec',
  'Conserves': 'sec',
  'Épices': 'sec',
  'Sucré': 'sec',
  'Surgelés': 'congelateur',
};

export function defaultLocation(category: string): FoodLocation {
  return CATEGORY_DEFAULT_LOCATION[category] ?? 'sec';
}
