import { FoodItem } from './types';

export const FOOD_DATABASE: FoodItem[] = [
  // 🥩 Viandes
  { id: 'poulet-entier', name: 'Poulet entier', category: 'Viandes', unit: 'unité', emoji: '🍗' },
  { id: 'blanc-poulet', name: 'Blanc de poulet', category: 'Viandes', unit: 'g', emoji: '🍗' },
  { id: 'cuisse-poulet', name: 'Cuisse de poulet', category: 'Viandes', unit: 'unité', emoji: '🍗' },
  { id: 'boeuf-hache', name: 'Bœuf haché', category: 'Viandes', unit: 'g', emoji: '🥩' },
  { id: 'steak-boeuf', name: 'Steak de bœuf', category: 'Viandes', unit: 'unité', emoji: '🥩' },
  { id: 'cote-porc', name: 'Côte de porc', category: 'Viandes', unit: 'unité', emoji: '🥩' },
  { id: 'lardons', name: 'Lardons', category: 'Viandes', unit: 'g', emoji: '🥓' },
  { id: 'jambon', name: 'Jambon blanc', category: 'Viandes', unit: 'tranche', emoji: '🍖' },
  { id: 'jambon-cru', name: 'Jambon cru', category: 'Viandes', unit: 'tranche', emoji: '🍖' },
  { id: 'saucisse', name: 'Saucisse', category: 'Viandes', unit: 'unité', emoji: '🌭' },
  { id: 'merguez', name: 'Merguez', category: 'Viandes', unit: 'unité', emoji: '🌭' },
  { id: 'escalope-veau', name: 'Escalope de veau', category: 'Viandes', unit: 'unité', emoji: '🥩' },
  { id: 'agneau-gigot', name: 'Gigot d\'agneau', category: 'Viandes', unit: 'unité', emoji: '🥩' },
  { id: 'canard-magret', name: 'Magret de canard', category: 'Viandes', unit: 'unité', emoji: '🦆' },

  // 🐟 Poissons & Fruits de mer
  { id: 'saumon', name: 'Saumon', category: 'Poissons', unit: 'g', emoji: '🐟' },
  { id: 'thon-boite', name: 'Thon en boîte', category: 'Poissons', unit: 'unité', emoji: '🐟' },
  { id: 'sardines-boite', name: 'Sardines en boîte', category: 'Poissons', unit: 'unité', emoji: '🐟' },
  { id: 'crevettes', name: 'Crevettes', category: 'Poissons', unit: 'g', emoji: '🦐' },
  { id: 'moules', name: 'Moules', category: 'Poissons', unit: 'kg', emoji: '🦪' },
  { id: 'cabillaud', name: 'Cabillaud', category: 'Poissons', unit: 'g', emoji: '🐡' },
  { id: 'sole', name: 'Sole', category: 'Poissons', unit: 'unité', emoji: '🐡' },
  { id: 'lieu-noir', name: 'Lieu noir', category: 'Poissons', unit: 'g', emoji: '🐟' },

  // 🥚 Produits laitiers & Œufs
  { id: 'oeuf', name: 'Œuf', category: 'Laitiers & Œufs', unit: 'unité', emoji: '🥚' },
  { id: 'lait', name: 'Lait', category: 'Laitiers & Œufs', unit: 'ml', emoji: '🥛' },
  { id: 'beurre', name: 'Beurre', category: 'Laitiers & Œufs', unit: 'g', emoji: '🧈' },
  { id: 'creme-fraiche', name: 'Crème fraîche', category: 'Laitiers & Œufs', unit: 'ml', emoji: '🥛' },
  { id: 'fromage-rape', name: 'Fromage râpé', category: 'Laitiers & Œufs', unit: 'g', emoji: '🧀' },
  { id: 'parmesan', name: 'Parmesan', category: 'Laitiers & Œufs', unit: 'g', emoji: '🧀' },
  { id: 'mozzarella', name: 'Mozzarella', category: 'Laitiers & Œufs', unit: 'unité', emoji: '🧀' },
  { id: 'camembert', name: 'Camembert', category: 'Laitiers & Œufs', unit: 'unité', emoji: '🧀' },
  { id: 'roquefort', name: 'Roquefort', category: 'Laitiers & Œufs', unit: 'g', emoji: '🧀' },
  { id: 'yaourt', name: 'Yaourt nature', category: 'Laitiers & Œufs', unit: 'unité', emoji: '🥛' },
  { id: 'fromage-blanc', name: 'Fromage blanc', category: 'Laitiers & Œufs', unit: 'g', emoji: '🥛' },
  { id: 'mascarpone', name: 'Mascarpone', category: 'Laitiers & Œufs', unit: 'g', emoji: '🧀' },
  { id: 'ricotta', name: 'Ricotta', category: 'Laitiers & Œufs', unit: 'g', emoji: '🧀' },

  // 🥦 Légumes frais
  { id: 'tomate', name: 'Tomate', category: 'Légumes', unit: 'unité', emoji: '🍅' },
  { id: 'tomate-cerise', name: 'Tomates cerises', category: 'Légumes', unit: 'g', emoji: '🍅' },
  { id: 'oignon', name: 'Oignon', category: 'Légumes', unit: 'unité', emoji: '🧅' },
  { id: 'ail', name: 'Ail', category: 'Légumes', unit: 'unité', emoji: '🧄' },
  { id: 'carotte', name: 'Carotte', category: 'Légumes', unit: 'unité', emoji: '🥕' },
  { id: 'courgette', name: 'Courgette', category: 'Légumes', unit: 'unité', emoji: '🥒' },
  { id: 'aubergine', name: 'Aubergine', category: 'Légumes', unit: 'unité', emoji: '🍆' },
  { id: 'poivron-rouge', name: 'Poivron rouge', category: 'Légumes', unit: 'unité', emoji: '🫑' },
  { id: 'poivron-vert', name: 'Poivron vert', category: 'Légumes', unit: 'unité', emoji: '🫑' },
  { id: 'brocoli', name: 'Brocoli', category: 'Légumes', unit: 'unité', emoji: '🥦' },
  { id: 'chou-fleur', name: 'Chou-fleur', category: 'Légumes', unit: 'unité', emoji: '🥦' },
  { id: 'epinards', name: 'Épinards', category: 'Légumes', unit: 'g', emoji: '🥬' },
  { id: 'salade', name: 'Salade verte', category: 'Légumes', unit: 'unité', emoji: '🥗' },
  { id: 'champignons', name: 'Champignons', category: 'Légumes', unit: 'g', emoji: '🍄' },
  { id: 'poireau', name: 'Poireau', category: 'Légumes', unit: 'unité', emoji: '🥬' },
  { id: 'celeri', name: 'Céleri', category: 'Légumes', unit: 'unité', emoji: '🥬' },
  { id: 'concombre', name: 'Concombre', category: 'Légumes', unit: 'unité', emoji: '🥒' },
  { id: 'pomme-de-terre', name: 'Pomme de terre', category: 'Légumes', unit: 'unité', emoji: '🥔' },
  { id: 'patate-douce', name: 'Patate douce', category: 'Légumes', unit: 'unité', emoji: '🍠' },
  { id: 'petits-pois', name: 'Petits pois', category: 'Légumes', unit: 'g', emoji: '🫛' },
  { id: 'haricots-verts', name: 'Haricots verts', category: 'Légumes', unit: 'g', emoji: '🫘' },
  { id: 'asperges', name: 'Asperges', category: 'Légumes', unit: 'unité', emoji: '🌿' },

  // 🍎 Fruits
  { id: 'pomme', name: 'Pomme', category: 'Fruits', unit: 'unité', emoji: '🍎' },
  { id: 'banane', name: 'Banane', category: 'Fruits', unit: 'unité', emoji: '🍌' },
  { id: 'citron', name: 'Citron', category: 'Fruits', unit: 'unité', emoji: '🍋' },
  { id: 'orange', name: 'Orange', category: 'Fruits', unit: 'unité', emoji: '🍊' },
  { id: 'fraises', name: 'Fraises', category: 'Fruits', unit: 'g', emoji: '🍓' },
  { id: 'framboises', name: 'Framboises', category: 'Fruits', unit: 'g', emoji: '🫐' },
  { id: 'myrtilles', name: 'Myrtilles', category: 'Fruits', unit: 'g', emoji: '🫐' },
  { id: 'raisin', name: 'Raisin', category: 'Fruits', unit: 'g', emoji: '🍇' },
  { id: 'peche', name: 'Pêche', category: 'Fruits', unit: 'unité', emoji: '🍑' },
  { id: 'poire', name: 'Poire', category: 'Fruits', unit: 'unité', emoji: '🍐' },

  // 🌾 Féculents & Céréales
  { id: 'pates', name: 'Pâtes', category: 'Féculents', unit: 'g', emoji: '🍝' },
  { id: 'riz', name: 'Riz', category: 'Féculents', unit: 'g', emoji: '🍚' },
  { id: 'riz-basmati', name: 'Riz basmati', category: 'Féculents', unit: 'g', emoji: '🍚' },
  { id: 'semoule', name: 'Semoule', category: 'Féculents', unit: 'g', emoji: '🌾' },
  { id: 'quinoa', name: 'Quinoa', category: 'Féculents', unit: 'g', emoji: '🌾' },
  { id: 'lentilles', name: 'Lentilles', category: 'Féculents', unit: 'g', emoji: '🫘' },
  { id: 'pois-chiches', name: 'Pois chiches', category: 'Féculents', unit: 'g', emoji: '🫘' },
  { id: 'haricots-blancs', name: 'Haricots blancs', category: 'Féculents', unit: 'g', emoji: '🫘' },
  { id: 'farine', name: 'Farine', category: 'Féculents', unit: 'g', emoji: '🌾' },
  { id: 'farine-complete', name: 'Farine complète', category: 'Féculents', unit: 'g', emoji: '🌾' },
  { id: 'pain', name: 'Pain', category: 'Féculents', unit: 'tranche', emoji: '🍞' },
  { id: 'pain-de-mie', name: 'Pain de mie', category: 'Féculents', unit: 'tranche', emoji: '🍞' },
  { id: 'flocons-avoine', name: 'Flocons d\'avoine', category: 'Féculents', unit: 'g', emoji: '🌾' },
  { id: 'polenta', name: 'Polenta', category: 'Féculents', unit: 'g', emoji: '🌾' },

  // 🫙 Conserves & Sauces
  { id: 'tomates-concassees', name: 'Tomates concassées', category: 'Conserves', unit: 'unité', emoji: '🫙' },
  { id: 'tomates-pelees', name: 'Tomates pelées', category: 'Conserves', unit: 'unité', emoji: '🫙' },
  { id: 'concentre-tomate', name: 'Concentré de tomate', category: 'Conserves', unit: 'g', emoji: '🫙' },
  { id: 'lait-coco', name: 'Lait de coco', category: 'Conserves', unit: 'ml', emoji: '🥥' },
  { id: 'bouillon-cube', name: 'Bouillon cube', category: 'Conserves', unit: 'unité', emoji: '🫙' },
  { id: 'sauce-soja', name: 'Sauce soja', category: 'Conserves', unit: 'ml', emoji: '🫙' },
  { id: 'sauce-tomate', name: 'Sauce tomate', category: 'Conserves', unit: 'ml', emoji: '🫙' },
  { id: 'vinaigre', name: 'Vinaigre', category: 'Conserves', unit: 'ml', emoji: '🫙' },
  { id: 'huile-olive', name: 'Huile d\'olive', category: 'Conserves', unit: 'ml', emoji: '🫒' },
  { id: 'huile-tournesol', name: 'Huile de tournesol', category: 'Conserves', unit: 'ml', emoji: '🫙' },
  { id: 'moutarde', name: 'Moutarde', category: 'Conserves', unit: 'g', emoji: '🫙' },
  { id: 'mayonnaise', name: 'Mayonnaise', category: 'Conserves', unit: 'g', emoji: '🫙' },
  { id: 'ketchup', name: 'Ketchup', category: 'Conserves', unit: 'g', emoji: '🫙' },
  { id: 'cornichons', name: 'Cornichons', category: 'Conserves', unit: 'unité', emoji: '🥒' },
  { id: 'olives', name: 'Olives', category: 'Conserves', unit: 'g', emoji: '🫒' },

  // 🧂 Épices & Condiments secs
  { id: 'sel', name: 'Sel', category: 'Épices', unit: 'g', emoji: '🧂' },
  { id: 'poivre', name: 'Poivre', category: 'Épices', unit: 'g', emoji: '🧂' },
  { id: 'cumin', name: 'Cumin', category: 'Épices', unit: 'g', emoji: '🌿' },
  { id: 'curcuma', name: 'Curcuma', category: 'Épices', unit: 'g', emoji: '🌿' },
  { id: 'paprika', name: 'Paprika', category: 'Épices', unit: 'g', emoji: '🌿' },
  { id: 'curry', name: 'Curry', category: 'Épices', unit: 'g', emoji: '🌿' },
  { id: 'herbes-provence', name: 'Herbes de Provence', category: 'Épices', unit: 'g', emoji: '🌿' },
  { id: 'thym', name: 'Thym', category: 'Épices', unit: 'g', emoji: '🌿' },
  { id: 'laurier', name: 'Laurier', category: 'Épices', unit: 'unité', emoji: '🌿' },
  { id: 'basilic', name: 'Basilic', category: 'Épices', unit: 'g', emoji: '🌿' },
  { id: 'persil', name: 'Persil', category: 'Épices', unit: 'g', emoji: '🌿' },
  { id: 'coriandre', name: 'Coriandre', category: 'Épices', unit: 'g', emoji: '🌿' },
  { id: 'cannelle', name: 'Cannelle', category: 'Épices', unit: 'g', emoji: '🌿' },
  { id: 'muscade', name: 'Noix de muscade', category: 'Épices', unit: 'g', emoji: '🌿' },
  { id: 'piment', name: 'Piment', category: 'Épices', unit: 'g', emoji: '🌶️' },

  // 🍫 Épicerie sucrée
  { id: 'sucre', name: 'Sucre', category: 'Sucré', unit: 'g', emoji: '🍬' },
  { id: 'sucre-roux', name: 'Sucre roux', category: 'Sucré', unit: 'g', emoji: '🍬' },
  { id: 'miel', name: 'Miel', category: 'Sucré', unit: 'g', emoji: '🍯' },
  { id: 'chocolat-noir', name: 'Chocolat noir', category: 'Sucré', unit: 'g', emoji: '🍫' },
  { id: 'chocolat-lait', name: 'Chocolat au lait', category: 'Sucré', unit: 'g', emoji: '🍫' },
  { id: 'poudre-cacao', name: 'Poudre de cacao', category: 'Sucré', unit: 'g', emoji: '🍫' },
  { id: 'levure', name: 'Levure chimique', category: 'Sucré', unit: 'g', emoji: '🌾' },
  { id: 'vanille', name: 'Extrait de vanille', category: 'Sucré', unit: 'ml', emoji: '🌿' },
  { id: 'confiture', name: 'Confiture', category: 'Sucré', unit: 'g', emoji: '🫙' },
  { id: 'nutella', name: 'Nutella', category: 'Sucré', unit: 'g', emoji: '🍫' },

  // 🧊 Surgelés
  { id: 'surgele-epinards', name: 'Épinards surgelés', category: 'Surgelés', unit: 'g', emoji: '🥬' },
  { id: 'surgele-petits-pois', name: 'Petits pois surgelés', category: 'Surgelés', unit: 'g', emoji: '🫛' },
  { id: 'surgele-poisson', name: 'Filets de poisson surgelés', category: 'Surgelés', unit: 'unité', emoji: '🐟' },
  { id: 'surgele-frites', name: 'Frites surgelées', category: 'Surgelés', unit: 'g', emoji: '🍟' },
  { id: 'surgele-crevettes', name: 'Crevettes surgelées', category: 'Surgelés', unit: 'g', emoji: '🦐' },
  { id: 'glace', name: 'Glace', category: 'Surgelés', unit: 'L', emoji: '🍦' },
  { id: 'pate-brisee', name: 'Pâte brisée', category: 'Surgelés', unit: 'unité', emoji: '🥧' },
  { id: 'pate-feuilletee', name: 'Pâte feuilletée', category: 'Surgelés', unit: 'unité', emoji: '🥧' },
];

export const FOOD_CATEGORIES = [...new Set(FOOD_DATABASE.map(f => f.category))];

export const searchFoods = (query: string): FoodItem[] => {
  const q = query.toLowerCase().trim();
  if (!q) return FOOD_DATABASE;
  return FOOD_DATABASE.filter(f =>
    f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q)
  );
};
