'use client';
import { useState, useEffect, useMemo } from 'react';
import { useInventory } from '@/hooks/useInventory';
import { useRecipes } from '@/hooks/useRecipes';
import { useShoppingList } from '@/hooks/useShoppingList';
import RecipeModal from '@/components/RecipeModal';
import { Recipe, RecipeWithScore, RecipeCategory } from '@/lib/types';
import { FOOD_DATABASE } from '@/lib/foodDatabase';

const CATEGORIES: { value: RecipeCategory | 'Tout'; label: string; emoji: string }[] = [
  { value: 'Tout', label: 'Tout', emoji: '✨' },
  { value: 'Apéro', label: 'Apéro', emoji: '🥂' },
  { value: 'Entrées', label: 'Entrées', emoji: '🥗' },
  { value: 'Plats', label: 'Plats', emoji: '🍽️' },
  { value: 'Desserts', label: 'Desserts', emoji: '🍰' },
  { value: 'Snacks', label: 'Snacks', emoji: '🥪' },
  { value: 'Boissons', label: 'Boissons', emoji: '🧃' },
];

export default function RecettesPage() {
  const { inventory } = useInventory();
  const { recipes, loading, addRecipe, updateRecipe, deleteRecipe, getMatchedRecipes, seedDefaultRecipes } = useRecipes(inventory);
  const { addItems } = useShoppingList();

  const [category, setCategory] = useState<RecipeCategory | 'Tout'>('Tout');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<RecipeWithScore | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [seeded, setSeeded] = useState(false);

  // Ingredient filter
  const [showIngFilter, setShowIngFilter] = useState(false);
  const [ingSearch, setIngSearch] = useState('');
  const [selectedIngIds, setSelectedIngIds] = useState<string[]>([]);

  useEffect(() => {
    if (!loading && !seeded) {
      setSeeded(true);
      seedDefaultRecipes();
    }
  }, [loading]);

  const allMatched = getMatchedRecipes();

  const filtered = useMemo(() => {
    let result = category === 'Tout' ? allMatched : allMatched.filter(r => r.category === category);

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(r => r.name.toLowerCase().includes(q));
    }

    if (selectedIngIds.length > 0) {
      result = result
        .filter(r => r.ingredients.some(ing => selectedIngIds.includes(ing.foodId)))
        .sort((a, b) => {
          const aHits = a.ingredients.filter(i => selectedIngIds.includes(i.foodId)).length;
          const bHits = b.ingredients.filter(i => selectedIngIds.includes(i.foodId)).length;
          return bHits - aHits;
        });
    }

    return result;
  }, [allMatched, category, search, selectedIngIds]);

  const cookableNow = allMatched.filter(r => r.matchScore === 1);
  const almostReady = allMatched.filter(r => r.matchScore >= 0.7 && r.matchScore < 1);

  // Build ingredient list for filter (from all recipes + FOOD_DATABASE)
  const allIngredients = useMemo(() => {
    const seen = new Set<string>();
    const items: { id: string; name: string; emoji: string }[] = [];
    recipes.forEach(r => r.ingredients.forEach(ing => {
      if (!seen.has(ing.foodId)) {
        seen.add(ing.foodId);
        const food = FOOD_DATABASE.find(f => f.id === ing.foodId);
        items.push({ id: ing.foodId, name: ing.foodName, emoji: food?.emoji ?? '🥄' });
      }
    }));
    return items.sort((a, b) => a.name.localeCompare(b.name));
  }, [recipes]);

  const filteredIngredients = ingSearch
    ? allIngredients.filter(i => i.name.toLowerCase().includes(ingSearch.toLowerCase()))
    : allIngredients;

  const toggleIng = (id: string) => {
    setSelectedIngIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const selectedIngNames = selectedIngIds
    .map(id => allIngredients.find(i => i.id === id)?.name ?? id)
    .slice(0, 3);

  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-400 to-pink-500 px-5 pt-12 pb-4">
        <h1 className="text-white font-bold text-2xl mb-1">🍳 Mes Recettes</h1>
        <p className="text-white/70 text-sm">{cookableNow.length} cuisinables maintenant · {allMatched.length} au total</p>

        <div className="flex gap-3 mt-3">
          {[
            { label: 'Cuisinables', count: cookableNow.length, color: 'bg-green-400' },
            { label: 'Presque prêtes', count: almostReady.length, color: 'bg-amber-400' },
            { label: 'Total', count: allMatched.length, color: 'bg-white/30' },
          ].map(s => (
            <div key={s.label} className={`flex-1 ${s.color} rounded-2xl p-3 text-white`}>
              <p className="text-2xl font-bold">{s.count}</p>
              <p className="text-xs font-medium opacity-90">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="px-4 pt-3 pb-2 space-y-2">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base">🔍</span>
          <input
            type="text"
            placeholder="Rechercher une recette..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-2xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">✕</button>
          )}
        </div>

        {/* Filtre ingrédients */}
        <button
          onClick={() => setShowIngFilter(true)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold border-2 transition-all w-full
            ${selectedIngIds.length > 0
              ? 'border-orange-400 bg-orange-50 text-orange-600'
              : 'border-gray-200 bg-white text-gray-500'}`}
        >
          <span>🥕</span>
          {selectedIngIds.length === 0
            ? 'Filtrer par ingrédients'
            : `${selectedIngNames.join(', ')}${selectedIngIds.length > 3 ? ` +${selectedIngIds.length - 3}` : ''}`}
          {selectedIngIds.length > 0 && (
            <button
              onClick={e => { e.stopPropagation(); setSelectedIngIds([]); }}
              className="ml-auto text-orange-400"
            >✕</button>
          )}
        </button>
      </div>

      {/* Filtres catégories */}
      <div className="flex gap-2 px-4 py-2 overflow-x-auto no-scrollbar">
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all
              ${category === cat.value
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-white text-gray-500 border border-gray-200'}`}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Résumé filtres actifs */}
      {(search || selectedIngIds.length > 0) && (
        <p className="px-4 pb-1 text-xs text-gray-400">
          {filtered.length} résultat{filtered.length !== 1 ? 's' : ''}
          {search && ` pour "${search}"`}
          {selectedIngIds.length > 0 && ` avec ${selectedIngIds.length} ingrédient${selectedIngIds.length > 1 ? 's' : ''}`}
        </p>
      )}

      {/* Section "Ce soir" */}
      {category === 'Tout' && !search && selectedIngIds.length === 0 && cookableNow.length > 0 && (
        <div className="px-4 mb-4">
          <h2 className="font-bold text-base mb-3">✅ Cuisinables ce soir</h2>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {cookableNow.slice(0, 5).map(recipe => (
              <button
                key={recipe.id}
                onClick={() => setSelected(recipe)}
                className="flex-shrink-0 bg-green-50 border border-green-200 rounded-2xl p-4 text-left w-36"
              >
                <p className="text-3xl mb-1">{recipe.emoji}</p>
                <p className="font-semibold text-sm leading-tight text-gray-800">{recipe.name}</p>
                <p className="text-xs text-green-600 mt-1 font-medium">100% dispo ✓</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Liste principale */}
      <div className="px-4 space-y-3 pb-28">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-300">
            <p className="text-5xl mb-3">🍽️</p>
            <p className="font-medium text-gray-400">Aucune recette trouvée</p>
            {(search || selectedIngIds.length > 0) && (
              <button
                onClick={() => { setSearch(''); setSelectedIngIds([]); setCategory('Tout'); }}
                className="mt-3 text-sm text-orange-500 font-medium"
              >
                Effacer les filtres
              </button>
            )}
          </div>
        )}

        {filtered.map(recipe => {
          const pct = Math.round(recipe.matchScore * 100);
          const barColor = pct === 100 ? 'bg-green-400' : pct >= 70 ? 'bg-amber-400' : 'bg-red-400';
          const bgColor = pct === 100 ? 'border-green-200 bg-green-50/30' : 'border-gray-100 bg-white';
          const ingHits = selectedIngIds.length > 0
            ? recipe.ingredients.filter(i => selectedIngIds.includes(i.foodId)).length
            : 0;

          return (
            <button
              key={recipe.id}
              onClick={() => setSelected(recipe)}
              className={`w-full text-left rounded-2xl border p-4 shadow-sm ${bgColor} active:scale-[0.99] transition-transform`}
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{recipe.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-base leading-tight">{recipe.name}</p>
                    <div className="flex gap-1 flex-shrink-0">
                      {ingHits > 0 && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full text-purple-700 bg-purple-100">
                          {ingHits}/{selectedIngIds.length} 🥕
                        </span>
                      )}
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full
                        ${pct === 100 ? 'text-green-700 bg-green-100'
                          : pct >= 70 ? 'text-amber-700 bg-amber-100'
                          : 'text-red-600 bg-red-100'}`}>
                        {pct}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-400">{recipe.category}</span>
                    <span className="text-xs text-gray-400">🕐 {recipe.prepTime + recipe.cookTime} min</span>
                    <span className="text-xs text-gray-400">👤 {recipe.servings}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
                    <div className={`h-full ${barColor} rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                  {recipe.missingIngredients.length > 0 && (
                    <p className="text-xs text-red-400 mt-1.5">
                      ❌ Manque : {recipe.missingIngredients.slice(0, 3).join(', ')}
                      {recipe.missingIngredients.length > 3 && ` +${recipe.missingIngredients.length - 3}`}
                    </p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowAddForm(true)}
        className="fixed right-5 bottom-24 w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-pink-500
          text-white text-2xl shadow-xl flex items-center justify-center z-40 active:scale-95 transition-transform"
      >
        +
      </button>

      {/* Modal détail recette */}
      {selected && (
        <RecipeModal
          recipe={selected}
          onClose={() => setSelected(null)}
          onSave={(id, data) => { updateRecipe(id, data); setSelected(null); }}
          onDelete={(id) => { deleteRecipe(id); setSelected(null); }}
          onAddMissingToList={() => {
            const items = selected.missingIngredients.map(name => {
              const food = FOOD_DATABASE.find(f => f.name === name);
              const ing = selected.ingredients.find(i => i.foodName === name);
              return {
                foodId: food?.id,
                foodName: name,
                emoji: food?.emoji ?? '🛒',
                category: food?.category ?? 'Autre',
                quantity: ing?.quantity ?? 1,
                unit: ing?.unit ?? 'unité' as const,
                fromRecipe: selected.name,
              };
            });
            addItems(items);
          }}
        />
      )}

      {/* ── Modal filtre par ingrédients ── */}
      {showIngFilter && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end" onClick={() => setShowIngFilter(false)}>
          <div
            className="w-full max-w-2xl mx-auto bg-white rounded-t-3xl max-h-[80vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-5 border-b flex-shrink-0">
              <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold">Filtrer par ingrédients</h2>
                {selectedIngIds.length > 0 && (
                  <button onClick={() => setSelectedIngIds([])} className="text-sm text-orange-500 font-medium">
                    Tout effacer
                  </button>
                )}
              </div>
              <input
                type="text"
                placeholder="🔍 Chercher un ingrédient..."
                value={ingSearch}
                onChange={e => setIngSearch(e.target.value)}
                className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div className="overflow-y-auto flex-1 p-4">
              <div className="grid grid-cols-2 gap-2">
                {filteredIngredients.map(ing => {
                  const active = selectedIngIds.includes(ing.id);
                  return (
                    <button
                      key={ing.id}
                      onClick={() => toggleIng(ing.id)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-left text-sm font-medium transition-all
                        ${active
                          ? 'border-orange-400 bg-orange-50 text-orange-700'
                          : 'border-gray-100 bg-gray-50 text-gray-600'}`}
                    >
                      <span className="text-base">{ing.emoji}</span>
                      <span className="truncate">{ing.name}</span>
                      {active && <span className="ml-auto text-orange-500 text-xs">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-4 border-t flex-shrink-0">
              <button
                onClick={() => { setShowIngFilter(false); setIngSearch(''); }}
                className="w-full bg-orange-500 text-white py-4 rounded-2xl font-bold text-base"
              >
                {selectedIngIds.length === 0
                  ? 'Fermer'
                  : `Voir les recettes avec ${selectedIngIds.length} ingrédient${selectedIngIds.length > 1 ? 's' : ''}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
