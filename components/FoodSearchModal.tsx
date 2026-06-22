'use client';
import { useState } from 'react';
import { searchFoods, FOOD_DATABASE, FOOD_CATEGORIES } from '@/lib/foodDatabase';
import { FoodItem, FoodLocation, FoodUnit, InventoryItem } from '@/lib/types';
import BarcodeScanner from '@/components/BarcodeScanner';
import { fetchProductByBarcode } from '@/lib/openFoodFacts';

interface Props {
  onAdd: (item: Omit<InventoryItem, 'id' | 'updatedAt'>) => void;
  onClose: () => void;
}

const LOCATIONS: { value: FoodLocation; label: string; emoji: string; color: string }[] = [
  { value: 'frigo', label: 'Frigo', emoji: '❄️', color: 'bg-cyan-500' },
  { value: 'congelateur', label: 'Congélateur', emoji: '🧊', color: 'bg-indigo-500' },
  { value: 'sec', label: 'Sec', emoji: '🗄️', color: 'bg-amber-500' },
];

function toDateInputValue(date: Date): string {
  return date.toISOString().split('T')[0];
}

export default function FoodSearchModal({ onAdd, onClose }: Props) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<FoodItem | null>(null);
  const [location, setLocation] = useState<FoodLocation>('frigo');
  const [quantity, setQuantity] = useState(1);
  const [isCustom, setIsCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customCategory, setCustomCategory] = useState(FOOD_CATEGORIES[0]);
  const [customUnit, setCustomUnit] = useState<FoodUnit>('unité');
  const [customEmoji, setCustomEmoji] = useState('🍽️');
  const [purchaseDateStr, setPurchaseDateStr] = useState('');
  const [expiryDateStr, setExpiryDateStr] = useState('');
  const [showDates, setShowDates] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [scanStatus, setScanStatus] = useState<'idle' | 'loading' | 'not-found'>('idle');
  const results = searchFoods(query);

  const handleBarcodeDetected = async (barcode: string) => {
    setShowScanner(false);
    setScanStatus('loading');
    const product = await fetchProductByBarcode(barcode);
    if (!product) {
      setScanStatus('not-found');
      return;
    }
    setScanStatus('idle');
    setIsCustom(true);
    setCustomName(product.name);
    setCustomEmoji(product.emoji);
    setCustomCategory(product.category);
    setCustomUnit(product.unit);
    setQuantity(product.quantity > 0 ? product.quantity : 1);
    if (product.expiryDate) {
      setExpiryDateStr(toDateInputValue(product.expiryDate));
      setShowDates(true);
    }
  };

  const handleAdd = () => {
    const purchaseDate = purchaseDateStr ? new Date(purchaseDateStr) : undefined;
    const expiryDate = expiryDateStr ? new Date(expiryDateStr) : undefined;

    if (isCustom) {
      if (!customName.trim()) return;
      onAdd({
        foodId: `custom-${Date.now()}`,
        foodName: customName,
        emoji: customEmoji,
        location,
        quantity,
        unit: customUnit,
        purchaseDate,
        expiryDate,
      });
    } else {
      if (!selected) return;
      onAdd({
        foodId: selected.id,
        foodName: selected.name,
        emoji: selected.emoji,
        location,
        quantity,
        unit: selected.unit,
        purchaseDate,
        expiryDate,
      });
    }
    onClose();
  };

  return (
    <>
      {showScanner && (
        <BarcodeScanner
          onDetected={handleBarcodeDetected}
          onClose={() => setShowScanner(false)}
        />
      )}

      <div className="fixed inset-0 z-50 bg-black/50 flex items-end" onClick={onClose}>
        <div
          className="w-full max-w-2xl mx-auto bg-white rounded-t-3xl p-5 max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          {/* Handle */}
          <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Ajouter un aliment</h2>
            <div className="flex items-center gap-3">
              <button
                onClick={() => { setScanStatus('idle'); setShowScanner(true); }}
                className="text-sm text-purple-500 font-medium flex items-center gap-1"
              >
                📷 Scanner
              </button>
              <button
                onClick={() => setIsCustom(v => !v)}
                className="text-sm text-blue-500 font-medium"
              >
                {isCustom ? '← Base' : '+ Perso'}
              </button>
            </div>
          </div>

          {/* Scan status banners */}
          {scanStatus === 'loading' && (
            <div className="bg-purple-50 rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
              <span className="animate-spin text-lg">⏳</span>
              <p className="text-sm text-purple-700 font-medium">Recherche du produit...</p>
            </div>
          )}
          {scanStatus === 'not-found' && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 mb-4 flex items-center justify-between">
              <p className="text-sm text-orange-700">Produit introuvable. Remplis le formulaire manuellement.</p>
              <button onClick={() => setScanStatus('idle')} className="text-orange-400 text-lg">✕</button>
            </div>
          )}

          {isCustom ? (
            /* ─── Formulaire aliment personnalisé / scanné ─── */
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Emoji"
                  value={customEmoji}
                  onChange={e => setCustomEmoji(e.target.value)}
                  className="w-16 border rounded-xl px-3 py-3 text-center text-2xl"
                />
                <input
                  type="text"
                  placeholder="Nom de l'aliment"
                  value={customName}
                  onChange={e => setCustomName(e.target.value)}
                  className="flex-1 border rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={customCategory}
                  onChange={e => setCustomCategory(e.target.value)}
                  className="border rounded-xl px-3 py-3 text-sm"
                >
                  {FOOD_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
                <select
                  value={customUnit}
                  onChange={e => setCustomUnit(e.target.value as FoodUnit)}
                  className="border rounded-xl px-3 py-3 text-sm"
                >
                  {['unité', 'g', 'kg', 'ml', 'L', 'tranche', 'portion'].map(u =>
                    <option key={u}>{u}</option>
                  )}
                </select>
              </div>
            </div>
          ) : (
            /* ─── Recherche dans la base ─── */
            <div>
              <input
                type="text"
                placeholder="🔍 Rechercher un aliment..."
                value={query}
                onChange={e => { setQuery(e.target.value); setSelected(null); }}
                autoFocus
                className="w-full border rounded-xl px-4 py-3 text-base mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {!selected && (
                <ul className="border rounded-xl max-h-44 overflow-y-auto divide-y mb-3">
                  {(query ? results : FOOD_DATABASE).slice(0, 25).map(food => (
                    <li
                      key={food.id}
                      onClick={() => { setSelected(food); setQuery(food.name); }}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 active:bg-blue-100 cursor-pointer"
                    >
                      <span className="text-xl">{food.emoji}</span>
                      <div>
                        <p className="font-medium text-sm">{food.name}</p>
                        <p className="text-xs text-gray-400">{food.category}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              {selected && (
                <div className="flex items-center gap-3 bg-blue-50 rounded-xl px-4 py-3 mb-3">
                  <span className="text-2xl">{selected.emoji}</span>
                  <p className="font-semibold flex-1">{selected.name}</p>
                  <button onClick={() => { setSelected(null); setQuery(''); }}
                    className="text-gray-400 text-sm">✕</button>
                </div>
              )}
            </div>
          )}

          {/* ─── Emplacement ─── */}
          <div className="flex gap-2 my-4">
            {LOCATIONS.map(loc => (
              <button
                key={loc.value}
                onClick={() => setLocation(loc.value)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all
                  ${location === loc.value
                    ? `${loc.color} text-white border-transparent`
                    : 'bg-white text-gray-500 border-gray-200'}`}
              >
                {loc.emoji} {loc.label}
              </button>
            ))}
          </div>

          {/* ─── Quantité ─── */}
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="w-12 h-12 rounded-full bg-gray-100 text-gray-700 text-2xl font-bold flex items-center justify-center"
            >−</button>
            <span className="flex-1 text-center text-3xl font-bold">
              {quantity}
              <span className="text-base font-normal text-gray-400 ml-1">
                {isCustom ? customUnit : selected?.unit ?? 'unité'}
              </span>
            </span>
            <button
              onClick={() => setQuantity(q => q + 1)}
              className="w-12 h-12 rounded-full bg-gray-100 text-gray-700 text-2xl font-bold flex items-center justify-center"
            >+</button>
          </div>

          {/* ─── Dates (optionnelles) ─── */}
          <button
            onClick={() => setShowDates(v => !v)}
            className="w-full text-sm text-gray-400 mb-3 text-left flex items-center gap-1"
          >
            <span className={`transition-transform ${showDates ? 'rotate-90' : ''}`}>▶</span>
            Dates (optionnel)
            {expiryDateStr && <span className="ml-auto text-orange-500 font-medium">📅 {expiryDateStr}</span>}
          </button>

          {showDates && (
            <div className="grid grid-cols-2 gap-3 mb-4 bg-gray-50 rounded-2xl p-3">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Date d&apos;achat</label>
                <input
                  type="date"
                  value={purchaseDateStr}
                  max={toDateInputValue(new Date())}
                  onChange={e => setPurchaseDateStr(e.target.value)}
                  className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Date de péremption</label>
                <input
                  type="date"
                  value={expiryDateStr}
                  onChange={e => setExpiryDateStr(e.target.value)}
                  className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
          )}

          <button
            onClick={handleAdd}
            disabled={!isCustom && !selected}
            className="w-full bg-blue-500 disabled:bg-gray-200 text-white py-4 rounded-2xl font-bold text-lg"
          >
            Ajouter ✓
          </button>
        </div>
      </div>
    </>
  );
}
