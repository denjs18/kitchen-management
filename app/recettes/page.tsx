'use client';
import { useState, useEffect } from 'react';
import { useInventory } from '@/hooks/useInventory';
import { useRecipes } from '@/hooks/useRecipes';
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
  const { loading, addRecipe, updateRecipe, deleteRecipe, getMatchedRecipes, seedDefaultRecipes } = useRecipes(inventory);
  const [category, setCategory] = useState<RecipeCategory | 'Tout'>('Tout');
  const [selected, setSelected] = useState<RecipeWithScore | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [seeded, setSeeded] = useState(false);

  const allMatched = getMatchedRecipes();
  const filtered = category === 'Tout' ? allMatched : allMatched.filter(r => r.category === category);

  const cookableNow = allMatched.filter(r => r.matchScore === 1);
  const almostReady = allMatched.filter(r => r.matchScore >= 0.7 && r.matchScore < 1);

  useEffect(() => {
    if (!loading && allMatched.length === 0 && !seeded) {
      setSeeded(true);
      seedDefaultRecipes();
    }
  }, [loading, allMatched.length]);

  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-400 to-pink-500 px-5 pt-12 pb-5">
        <h1 className="text-white font-bold text-2xl mb-1">🍳 Mes Recettes</h1>
        <p className="text-white/70 text-sm">{cookableNow.length} cuisinables maintenant</p>

        {/* Stats rapides */}
        <div className="flex gap-3 mt-4">
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

      {/* Filtres catégories */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto no-scrollbar">
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

      {/* Section "Ce soir" — top suggestions */}
      {category === 'Tout' && cookableNow.length > 0 && (
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
      <div className="px-4 space-y-3 pb-6">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-300">
            <p className="text-5xl mb-3">🍽️</p>
            <p className="font-medium text-gray-400">Aucune recette dans cette catégorie</p>
          </div>
        )}

        {filtered.map(recipe => {
          const pct = Math.round(recipe.matchScore * 100);
          const barColor = pct === 100 ? 'bg-green-400' : pct >= 70 ? 'bg-amber-400' : 'bg-red-400';
          const bgColor = pct === 100 ? 'border-green-200 bg-green-50/30' : 'border-gray-100 bg-white';

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
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0
                      ${pct === 100 ? 'text-green-700 bg-green-100'
                        : pct >= 70 ? 'text-amber-700 bg-amber-100'
                        : 'text-red-600 bg-red-100'}`}>
                      {pct}%
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-400">{recipe.category}</span>
                    <span className="text-xs text-gray-400">🕐 {recipe.prepTime + recipe.cookTime} min</span>
                    <span className="text-xs text-gray-400">👤 {recipe.servings}</span>
                  </div>
                  {/* Barre matching */}
                  <div className="h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
                    <div className={`h-full ${barColor} rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                  {/* Ingrédients manquants */}
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

      {/* FAB ajouter recette */}
      <button
        onClick={() => setShowAddForm(true)}
        className="fixed right-5 bottom-24 w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-pink-500
          text-white text-2xl shadow-xl flex items-center justify-center z-40 active:scale-95 transition-transform"
      >
        +
      </button>

      {/* Modale détail/édition recette */}
      {selected && (
        <RecipeModal
          recipe={selected}
          onClose={() => setSelected(null)}
          onSave={(id, data) => { updateRecipe(id, data); setSelected(null); }}
          onDelete={(id) => { deleteRecipe(id); setSelected(null); }}
        />
      )}
    </>
  );
}
