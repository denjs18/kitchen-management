'use client';
import { useState } from 'react';
import { Recipe, RecipeWithScore, RecipeIngredient, FoodUnit, RecipeCategory } from '@/lib/types';
import { FOOD_DATABASE } from '@/lib/foodDatabase';

interface Props {
  recipe: RecipeWithScore;
  onClose: () => void;
  onSave: (id: string, data: Partial<Recipe>) => void;
  onDelete: (id: string) => void;
}

const RECIPE_CATEGORIES: RecipeCategory[] = ['Apéro', 'Entrées', 'Plats', 'Desserts', 'Snacks', 'Boissons'];

export default function RecipeModal({ recipe, onClose, onSave, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(recipe.name);
  const [emoji, setEmoji] = useState(recipe.emoji);
  const [category, setCategory] = useState<RecipeCategory>(recipe.category);
  const [servings, setServings] = useState(recipe.servings);
  const [prepTime, setPrepTime] = useState(recipe.prepTime);
  const [cookTime, setCookTime] = useState(recipe.cookTime);
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>(recipe.ingredients);
  const [instructions, setInstructions] = useState<string[]>(recipe.instructions);
  const [ingSearch, setIngSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const matchPct = Math.round(recipe.matchScore * 100);
  const matchColor = matchPct === 100 ? 'text-green-600 bg-green-50'
    : matchPct >= 50 ? 'text-amber-600 bg-amber-50'
    : 'text-red-500 bg-red-50';

  const handleSave = () => {
    onSave(recipe.id!, { name, emoji, category, servings, prepTime, cookTime, ingredients, instructions });
    setEditing(false);
  };

  const addIngredient = (food: typeof FOOD_DATABASE[0]) => {
    if (ingredients.find(i => i.foodId === food.id)) return;
    setIngredients(prev => [...prev, { foodId: food.id, foodName: food.name, quantity: 1, unit: food.unit }]);
    setIngSearch('');
  };

  const updateIngQty = (idx: number, qty: number) => {
    setIngredients(prev => prev.map((ing, i) => i === idx ? { ...ing, quantity: qty } : ing));
  };

  const removeIngredient = (idx: number) => {
    setIngredients(prev => prev.filter((_, i) => i !== idx));
  };

  const updateInstruction = (idx: number, val: string) => {
    setInstructions(prev => prev.map((s, i) => i === idx ? val : s));
  };

  const ingResults = ingSearch
    ? FOOD_DATABASE.filter(f => f.name.toLowerCase().includes(ingSearch.toLowerCase())).slice(0, 8)
    : [];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end md:items-center" onClick={onClose}>
      <div
        className="w-full max-w-2xl mx-auto bg-white rounded-t-3xl md:rounded-3xl max-h-[93vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b flex-shrink-0">
          <div className="flex items-center gap-3">
            {editing
              ? <input value={emoji} onChange={e => setEmoji(e.target.value)} className="w-12 text-3xl text-center" />
              : <span className="text-3xl">{emoji}</span>
            }
            {editing
              ? <input value={name} onChange={e => setName(e.target.value)}
                  className="font-bold text-lg border-b-2 border-blue-400 outline-none" />
              : <h2 className="font-bold text-lg">{name}</h2>
            }
          </div>
          <div className="flex gap-2">
            {editing ? (
              <>
                <button onClick={() => setEditing(false)} className="text-gray-400 text-sm px-3 py-1.5 rounded-xl bg-gray-100">Annuler</button>
                <button onClick={handleSave} className="text-white text-sm px-3 py-1.5 rounded-xl bg-blue-500 font-medium">Enregistrer</button>
              </>
            ) : (
              <>
                <button onClick={() => setEditing(true)} className="text-blue-500 text-sm px-3 py-1.5 rounded-xl bg-blue-50 font-medium">✏️ Éditer</button>
                <button onClick={onClose} className="text-gray-400 text-xl px-2">✕</button>
              </>
            )}
          </div>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 p-5 space-y-5">

          {/* Méta */}
          <div className="flex gap-3 flex-wrap">
            {editing ? (
              <select value={category} onChange={e => setCategory(e.target.value as RecipeCategory)}
                className="border rounded-xl px-3 py-1.5 text-sm font-medium">
                {RECIPE_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            ) : (
              <span className="bg-purple-50 text-purple-600 text-sm font-medium px-3 py-1.5 rounded-xl">{category}</span>
            )}
            <span className={`text-sm font-bold px-3 py-1.5 rounded-xl ${matchColor}`}>
              {matchPct}% disponible
            </span>
            <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-xl">
              🕐 {prepTime + cookTime} min
            </span>
            <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-xl">
              👤 {editing
                ? <input type="number" value={servings} onChange={e => setServings(+e.target.value)}
                    className="w-8 text-center border-b outline-none" />
                : servings} pers.
            </span>
          </div>

          {/* Barre de progression matching */}
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Ingrédients disponibles</span>
              <span>{recipe.availableIngredients.length}/{recipe.ingredients.length}</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  matchPct === 100 ? 'bg-green-400' : matchPct >= 50 ? 'bg-amber-400' : 'bg-red-400'
                }`}
                style={{ width: `${matchPct}%` }}
              />
            </div>
          </div>

          {/* Ingrédients */}
          <div>
            <h3 className="font-bold text-base mb-3">🛒 Ingrédients</h3>

            {editing && (
              <div className="relative mb-3">
                <input
                  value={ingSearch}
                  onChange={e => setIngSearch(e.target.value)}
                  placeholder="Ajouter un ingrédient..."
                  className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {ingResults.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white border rounded-xl shadow-lg mt-1 max-h-36 overflow-y-auto">
                    {ingResults.map(f => (
                      <li key={f.id} onClick={() => addIngredient(f)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm">
                        <span>{f.emoji}</span> {f.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <ul className="space-y-2">
              {ingredients.map((ing, idx) => {
                const available = recipe.availableIngredients.includes(ing.foodName);
                const missing = recipe.missingIngredients.includes(ing.foodName);
                return (
                  <li key={idx} className={`flex items-center gap-3 rounded-xl px-3 py-2.5
                    ${available ? 'bg-green-50' : missing ? 'bg-red-50' : 'bg-gray-50'}`}>
                    <span className="text-lg">
                      {available ? '✅' : missing ? '❌' : '⚪'}
                    </span>
                    <span className="flex-1 text-sm font-medium">{ing.foodName}</span>
                    {editing ? (
                      <>
                        <input
                          type="number"
                          value={ing.quantity}
                          onChange={e => updateIngQty(idx, +e.target.value)}
                          className="w-16 border rounded-lg px-2 py-1 text-sm text-center"
                        />
                        <span className="text-xs text-gray-400">{ing.unit}</span>
                        <button onClick={() => removeIngredient(idx)} className="text-red-400 text-xs ml-1">✕</button>
                      </>
                    ) : (
                      <span className="text-sm text-gray-500">{ing.quantity} {ing.unit}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Étapes */}
          <div>
            <h3 className="font-bold text-base mb-3">👨‍🍳 Préparation</h3>
            <ol className="space-y-3">
              {instructions.map((step, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="w-7 h-7 rounded-full bg-blue-500 text-white text-xs font-bold
                    flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  {editing ? (
                    <textarea
                      value={step}
                      onChange={e => updateInstruction(idx, e.target.value)}
                      rows={2}
                      className="flex-1 border rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  ) : (
                    <p className="text-sm text-gray-700 leading-relaxed pt-1">{step}</p>
                  )}
                </li>
              ))}
              {editing && (
                <button
                  onClick={() => setInstructions(prev => [...prev, ''])}
                  className="text-blue-500 text-sm font-medium"
                >
                  + Ajouter une étape
                </button>
              )}
            </ol>
          </div>

          {/* Supprimer */}
          {!editing && (
            <div className="pt-2 border-t">
              {confirmDelete ? (
                <div className="flex gap-3">
                  <p className="flex-1 text-sm text-red-500">Supprimer cette recette ?</p>
                  <button onClick={() => { onDelete(recipe.id!); onClose(); }}
                    className="text-white bg-red-500 text-sm px-4 py-2 rounded-xl font-medium">Oui</button>
                  <button onClick={() => setConfirmDelete(false)}
                    className="text-gray-500 text-sm px-4 py-2 rounded-xl bg-gray-100">Non</button>
                </div>
              ) : (
                <button onClick={() => setConfirmDelete(true)}
                  className="text-red-400 text-sm font-medium">🗑 Supprimer la recette</button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
