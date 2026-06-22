'use client';
import { useState } from 'react';
import { useShoppingList } from '@/hooks/useShoppingList';
import { useInventory } from '@/hooks/useInventory';
import { ShoppingItem, FoodLocation, FoodUnit } from '@/lib/types';
import { getAisle, AISLES, defaultLocation } from '@/lib/shoppingUtils';
import { searchFoods, FOOD_DATABASE } from '@/lib/foodDatabase';

const LOCATIONS: { value: FoodLocation; label: string; emoji: string; color: string }[] = [
  { value: 'frigo', label: 'Frigo', emoji: '❄️', color: 'bg-cyan-500' },
  { value: 'congelateur', label: 'Congélo', emoji: '🧊', color: 'bg-indigo-500' },
  { value: 'sec', label: 'Sec', emoji: '🗄️', color: 'bg-amber-500' },
];

export default function CoursesPage() {
  const { list, loading, addItem, toggleChecked, removeItem, clearChecked, clearAll } = useShoppingList();
  const { addItem: addToInventory } = useInventory();
  const [showAdd, setShowAdd] = useState(false);
  const [showRanger, setShowRanger] = useState(false);
  const [locationMap, setLocationMap] = useState<Record<string, FoodLocation>>({});
  const [query, setQuery] = useState('');
  const [addQty, setAddQty] = useState(1);
  const [addUnit, setAddUnit] = useState<FoodUnit>('unité');
  const [selectedFood, setSelectedFood] = useState<typeof FOOD_DATABASE[0] | null>(null);
  const [customName, setCustomName] = useState('');
  const [customEmoji, setCustomEmoji] = useState('🛒');

  const unchecked = list.filter(i => !i.checked);
  const checked = list.filter(i => i.checked);

  const openRanger = () => {
    const map: Record<string, FoodLocation> = {};
    checked.forEach(item => {
      map[item.id!] = defaultLocation(item.category);
    });
    setLocationMap(map);
    setShowRanger(true);
  };

  const handleRanger = async () => {
    await Promise.all(
      checked.map(item =>
        addToInventory({
          foodId: item.foodId ?? `custom-${item.foodName}`,
          foodName: item.foodName,
          emoji: item.emoji,
          location: locationMap[item.id!] ?? defaultLocation(item.category),
          quantity: item.quantity,
          unit: item.unit,
        })
      )
    );
    await clearChecked();
    setShowRanger(false);
  };

  const handleAdd = () => {
    if (selectedFood) {
      addItem({
        foodId: selectedFood.id,
        foodName: selectedFood.name,
        emoji: selectedFood.emoji,
        category: selectedFood.category,
        quantity: addQty,
        unit: selectedFood.unit,
      });
    } else if (customName.trim()) {
      addItem({
        foodName: customName.trim(),
        emoji: customEmoji,
        category: 'Autre',
        quantity: addQty,
        unit: addUnit,
      });
    }
    setShowAdd(false);
    setQuery('');
    setSelectedFood(null);
    setCustomName('');
    setCustomEmoji('🛒');
    setAddQty(1);
  };

  const searchResults = query ? searchFoods(query).slice(0, 8) : [];

  const groupedUnchecked = AISLES
    .map(aisle => ({
      aisle,
      items: unchecked.filter(i => aisle.categories.includes(i.category)),
    }))
    .concat([{
      aisle: { label: 'Autre', emoji: '🛒', categories: [], order: 99 },
      items: unchecked.filter(i => !AISLES.some(a => a.categories.includes(i.category))),
    }])
    .filter(g => g.items.length > 0);

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-4xl animate-bounce">🛒</p>
    </div>
  );

  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-teal-600 px-5 pt-12 pb-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white font-bold text-2xl">🛒 Liste de courses</h1>
            <p className="text-white/70 text-sm mt-0.5">
              {unchecked.length} article{unchecked.length !== 1 ? 's' : ''} à acheter
            </p>
          </div>
          {list.length > 0 && (
            <button
              onClick={clearAll}
              className="text-white/60 text-xs border border-white/30 rounded-full px-3 py-1.5"
            >
              Tout vider
            </button>
          )}
        </div>
      </div>

      <div className="pb-44">
        {list.length === 0 ? (
          <div className="text-center py-20 text-gray-300">
            <p className="text-6xl mb-3">🛒</p>
            <p className="text-lg font-medium text-gray-400">La liste est vide</p>
            <p className="text-sm mt-1">Appuie sur + pour ajouter un article</p>
          </div>
        ) : (
          <>
            {/* Articles par rayon */}
            {groupedUnchecked.map(({ aisle, items }) => (
              <div key={aisle.label} className="mt-4">
                <div className="flex items-center gap-2 px-4 mb-2">
                  <span className="text-base">{aisle.emoji}</span>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{aisle.label}</p>
                </div>
                <div className="px-3 space-y-1.5">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
                      <button
                        onClick={() => toggleChecked(item.id!, true)}
                        className="w-6 h-6 rounded-full border-2 border-gray-300 flex-shrink-0 hover:border-green-400 transition-colors"
                      />
                      <span className="text-xl flex-shrink-0">{item.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{item.foodName}</p>
                        {item.fromRecipe && (
                          <p className="text-xs text-purple-400">Pour {item.fromRecipe}</p>
                        )}
                      </div>
                      <span className="text-sm text-gray-400 flex-shrink-0">{item.quantity} {item.unit}</span>
                      <button onClick={() => removeItem(item.id!)} className="text-gray-300 text-sm ml-1 flex-shrink-0">✕</button>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Articles cochés */}
            {checked.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center gap-2 px-4 mb-2">
                  <p className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                    ✓ Achetés ({checked.length})
                  </p>
                </div>
                <div className="px-3 space-y-1.5">
                  {checked.map(item => (
                    <div key={item.id} className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100 opacity-60">
                      <button
                        onClick={() => toggleChecked(item.id!, false)}
                        className="w-6 h-6 rounded-full bg-green-400 flex items-center justify-center flex-shrink-0"
                      >
                        <span className="text-white text-xs font-bold">✓</span>
                      </button>
                      <span className="text-xl flex-shrink-0">{item.emoji}</span>
                      <p className="flex-1 text-sm text-gray-400 line-through truncate">{item.foodName}</p>
                      <span className="text-xs text-gray-300">{item.quantity} {item.unit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Bouton "Ranger les courses" quand des articles sont cochés */}
      {checked.length > 0 && (
        <div className="fixed bottom-20 left-0 right-0 px-4 z-40">
          <button
            onClick={openRanger}
            className="w-full bg-green-500 text-white py-4 rounded-2xl font-bold text-base shadow-xl flex items-center justify-center gap-2"
          >
            📦 Ranger les courses ({checked.length})
          </button>
        </div>
      )}

      {/* FAB ajouter */}
      <button
        onClick={() => setShowAdd(true)}
        className="fixed right-5 bottom-24 w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-teal-600
          text-white text-2xl shadow-xl flex items-center justify-center z-40 active:scale-95 transition-transform"
      >
        +
      </button>

      {/* ── Modal "Ajouter un article" ── */}
      {showAdd && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end" onClick={() => setShowAdd(false)}>
          <div className="w-full max-w-2xl mx-auto bg-white rounded-t-3xl p-5" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <h2 className="text-lg font-bold mb-4">Ajouter à la liste</h2>

            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Emoji"
                value={selectedFood ? selectedFood.emoji : customEmoji}
                onChange={e => setCustomEmoji(e.target.value)}
                disabled={!!selectedFood}
                className="w-14 border rounded-xl px-2 py-3 text-center text-xl disabled:bg-gray-50"
              />
              <input
                type="text"
                placeholder="🔍 Rechercher ou saisir..."
                value={selectedFood ? selectedFood.name : query}
                onChange={e => { setQuery(e.target.value); setSelectedFood(null); setCustomName(e.target.value); }}
                autoFocus
                className="flex-1 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              {selectedFood && (
                <button onClick={() => { setSelectedFood(null); setQuery(''); }} className="text-gray-400 px-2">✕</button>
              )}
            </div>

            {searchResults.length > 0 && !selectedFood && (
              <ul className="border rounded-xl max-h-36 overflow-y-auto divide-y mb-3">
                {searchResults.map(food => (
                  <li
                    key={food.id}
                    onClick={() => { setSelectedFood(food); setQuery(food.name); setAddUnit(food.unit); }}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-green-50 cursor-pointer text-sm"
                  >
                    <span>{food.emoji}</span>
                    <span className="font-medium">{food.name}</span>
                    <span className="text-xs text-gray-400 ml-auto">{food.category}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex items-center gap-4 my-4">
              <button
                onClick={() => setAddQty(q => Math.max(1, q - 1))}
                className="w-10 h-10 rounded-full bg-gray-100 text-gray-700 font-bold text-xl flex items-center justify-center"
              >−</button>
              <span className="flex-1 text-center text-2xl font-bold">
                {addQty}
                <span className="text-sm font-normal text-gray-400 ml-1">
                  {selectedFood ? selectedFood.unit : addUnit}
                </span>
              </span>
              <button
                onClick={() => setAddQty(q => q + 1)}
                className="w-10 h-10 rounded-full bg-gray-100 text-gray-700 font-bold text-xl flex items-center justify-center"
              >+</button>
            </div>

            {!selectedFood && (
              <div className="mb-4">
                <select
                  value={addUnit}
                  onChange={e => setAddUnit(e.target.value as FoodUnit)}
                  className="w-full border rounded-xl px-3 py-2.5 text-sm"
                >
                  {['unité', 'g', 'kg', 'ml', 'L', 'tranche', 'portion'].map(u => <option key={u}>{u}</option>)}
                </select>
              </div>
            )}

            <button
              onClick={handleAdd}
              disabled={!selectedFood && !customName.trim()}
              className="w-full bg-green-500 disabled:bg-gray-200 text-white py-4 rounded-2xl font-bold text-base"
            >
              Ajouter à la liste
            </button>
          </div>
        </div>
      )}

      {/* ── Modal "Ranger les courses" ── */}
      {showRanger && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end">
          <div className="w-full max-w-2xl mx-auto bg-white rounded-t-3xl max-h-[80vh] flex flex-col">
            <div className="p-5 border-b flex-shrink-0">
              <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
              <h2 className="text-lg font-bold">Ranger les courses</h2>
              <p className="text-sm text-gray-400 mt-0.5">Choisis où mettre chaque article</p>
            </div>

            <div className="overflow-y-auto flex-1 p-4 space-y-3">
              {checked.map(item => (
                <div key={item.id} className="bg-gray-50 rounded-2xl p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{item.emoji}</span>
                    <p className="text-sm font-semibold text-gray-700">{item.foodName}</p>
                    <span className="text-xs text-gray-400 ml-auto">{item.quantity} {item.unit}</span>
                  </div>
                  <div className="flex gap-2">
                    {LOCATIONS.map(loc => (
                      <button
                        key={loc.value}
                        onClick={() => setLocationMap(m => ({ ...m, [item.id!]: loc.value }))}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-semibold border-2 transition-all
                          ${(locationMap[item.id!] ?? defaultLocation(item.category)) === loc.value
                            ? `${loc.color} text-white border-transparent`
                            : 'bg-white text-gray-500 border-gray-200'}`}
                      >
                        {loc.emoji} {loc.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t flex gap-3 flex-shrink-0">
              <button
                onClick={() => setShowRanger(false)}
                className="flex-1 py-3.5 rounded-2xl bg-gray-100 text-gray-600 font-semibold"
              >
                Annuler
              </button>
              <button
                onClick={handleRanger}
                className="flex-1 py-3.5 rounded-2xl bg-green-500 text-white font-bold"
              >
                ✓ Confirmer & ranger
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
