import { FoodUnit } from './types';

export interface ScannedProduct {
  name: string;
  emoji: string;
  category: string;
  quantity: number;
  unit: FoodUnit;
  expiryDate?: Date;
}

const CATEGORY_MAP: { keywords: string[]; category: string; emoji: string }[] = [
  { keywords: ['meat', 'beef', 'pork', 'chicken', 'poultry', 'veal', 'lamb', 'viande', 'boeuf', 'poulet', 'porc'], category: 'Viandes', emoji: '🥩' },
  { keywords: ['fish', 'seafood', 'salmon', 'tuna', 'shrimp', 'poisson', 'saumon', 'thon', 'crevette', 'mer'], category: 'Poissons', emoji: '🐟' },
  { keywords: ['dairy', 'milk', 'cheese', 'yogurt', 'cream', 'butter', 'egg', 'lait', 'fromage', 'yaourt', 'oeuf', 'crème', 'beurre'], category: 'Laitiers & Œufs', emoji: '🥛' },
  { keywords: ['vegetable', 'legume', 'carrot', 'tomato', 'onion', 'légume', 'carotte', 'tomate', 'oignon', 'salade'], category: 'Légumes', emoji: '🥦' },
  { keywords: ['fruit', 'apple', 'banana', 'orange', 'berry', 'pomme', 'banane', 'fraise', 'raisin'], category: 'Fruits', emoji: '🍎' },
  { keywords: ['pasta', 'rice', 'bread', 'cereal', 'flour', 'grain', 'pâtes', 'riz', 'pain', 'farine', 'féculent'], category: 'Féculents', emoji: '🍝' },
  { keywords: ['canned', 'conserve', 'preserved', 'boîte', 'bocal', 'conserve'], category: 'Conserves', emoji: '🥫' },
  { keywords: ['spice', 'herb', 'condiment', 'sauce', 'épice', 'herbe', 'sel', 'poivre', 'moutarde'], category: 'Épices', emoji: '🧂' },
  { keywords: ['sweet', 'candy', 'chocolate', 'biscuit', 'cake', 'sugar', 'sucré', 'chocolat', 'gâteau', 'sucre', 'biscuit'], category: 'Sucré', emoji: '🍫' },
  { keywords: ['frozen', 'surgelé', 'congelé'], category: 'Surgelés', emoji: '🧊' },
];

function guessCategory(tags: string[], name: string): { category: string; emoji: string } {
  const haystack = [...tags, name].join(' ').toLowerCase();
  for (const entry of CATEGORY_MAP) {
    if (entry.keywords.some(kw => haystack.includes(kw))) {
      return { category: entry.category, emoji: entry.emoji };
    }
  }
  return { category: 'Conserves', emoji: '🛒' };
}

function parseQuantityAndUnit(raw?: string): { quantity: number; unit: FoodUnit } {
  if (!raw) return { quantity: 1, unit: 'unité' };
  const match = raw.match(/(\d+(?:[.,]\d+)?)\s*(g|kg|ml|l|cl)/i);
  if (!match) return { quantity: 1, unit: 'unité' };
  const num = parseFloat(match[1].replace(',', '.'));
  const rawUnit = match[2].toLowerCase();
  const unitMap: Record<string, FoodUnit> = { g: 'g', kg: 'kg', ml: 'ml', l: 'L', cl: 'ml' };
  const unit = unitMap[rawUnit] ?? 'unité';
  const quantity = rawUnit === 'cl' ? num * 10 : num;
  return { quantity, unit };
}

function parseExpiryDate(raw?: string): Date | undefined {
  if (!raw) return undefined;
  const cleaned = raw.trim().replace(/\s/g, '');
  // Try ISO format first
  const d = new Date(cleaned);
  if (!isNaN(d.getTime())) return d;
  // Try DD/MM/YYYY
  const match = cleaned.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (match) return new Date(`${match[3]}-${match[2]}-${match[1]}`);
  return undefined;
}

export async function fetchProductByBarcode(barcode: string): Promise<ScannedProduct | null> {
  try {
    const res = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`,
      { headers: { 'User-Agent': 'KitchenManagement/1.0' } }
    );
    const data = await res.json();
    if (data.status === 0 || !data.product) return null;

    const p = data.product;
    const name: string = p.product_name_fr || p.product_name || p.generic_name_fr || p.generic_name || '';
    if (!name) return null;

    const tags: string[] = [
      ...(p.categories_tags ?? []),
      ...(p.food_groups_tags ?? []),
      p.product_name_fr ?? '',
    ];
    const { category, emoji } = guessCategory(tags, name);
    const { quantity, unit } = parseQuantityAndUnit(p.quantity);
    const expiryDate = parseExpiryDate(p.expiration_date);

    return { name, emoji, category, quantity, unit, expiryDate };
  } catch {
    return null;
  }
}
