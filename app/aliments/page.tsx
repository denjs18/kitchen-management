'use client';
import { useState } from 'react';
import { useInventory } from '@/hooks/useInventory';
import InventoryGrid from '@/components/InventoryGrid';
import FoodSearchModal from '@/components/FoodSearchModal';
import MultiScanModal from '@/components/MultiScanModal';
import { FoodLocation } from '@/lib/types';
import { getExpiryStatus } from '@/lib/expiryUtils';

const TABS: { value: FoodLocation; label: string; emoji: string; gradient: string }[] = [
  { value: 'frigo', label: 'Frigo', emoji: '❄️', gradient: 'from-cyan-400 to-blue-500' },
  { value: 'congelateur', label: 'Congélateur', emoji: '🧊', gradient: 'from-indigo-400 to-purple-500' },
  { value: 'sec', label: 'Sec', emoji: '🗄️', gradient: 'from-amber-400 to-orange-500' },
];

export default function AlimentsPage() {
  const { loading, addItem, updateQuantity, getByLocation, inventory } = useInventory();
  const [tab, setTab] = useState<FoodLocation>('frigo');
  const [showModal, setShowModal] = useState(false);
  const [showMultiScan, setShowMultiScan] = useState(false);
  const current = TABS.find(t => t.value === tab)!;

  const urgentItems = inventory.filter(i => {
    const s = getExpiryStatus(i.expiryDate);
    return s === 'expired' || s === 'soon';
  });

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <p className="text-4xl mb-2 animate-bounce">📦</p>
        <p className="text-gray-400">Chargement...</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Header avec gradient */}
      <div className={`bg-gradient-to-r ${current.gradient} px-5 pt-12 pb-6`}>
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-white font-bold text-2xl">📦 Mon garde-manger</h1>
          <button
            onClick={() => setShowMultiScan(true)}
            className="bg-white/20 text-white text-sm font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5"
          >
            📷 Multi-scan
          </button>
        </div>
        <p className="text-white/70 text-sm">{inventory.length} aliment{inventory.length > 1 ? 's' : ''} en stock</p>

        {/* Tabs */}
        <div className="flex gap-2 mt-4">
          {TABS.map(t => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all
                ${tab === t.value
                  ? 'bg-white text-gray-800 shadow-md'
                  : 'bg-white/20 text-white'}`}
            >
              {t.emoji} {t.label}
              <span className={`ml-1 text-xs ${tab === t.value ? 'text-gray-400' : 'text-white/60'}`}>
                ({getByLocation(t.value).length})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Bandeau d'alerte péremption */}
      {urgentItems.length > 0 && (
        <div className="mx-4 mt-4 bg-orange-50 border border-orange-200 rounded-2xl p-3">
          <p className="text-sm font-semibold text-orange-700 mb-2">
            ⚠️ {urgentItems.length} aliment{urgentItems.length > 1 ? 's' : ''} à consommer rapidement
          </p>
          <div className="flex flex-wrap gap-2">
            {urgentItems.map(item => {
              const isExpired = getExpiryStatus(item.expiryDate) === 'expired';
              return (
                <span
                  key={item.id}
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    isExpired ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                  }`}
                >
                  {item.emoji} {item.foodName}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Content */}
      <InventoryGrid
        items={getByLocation(tab)}
        onUpdate={updateQuantity}
      />

      {/* FAB */}
      <button
        onClick={() => setShowModal(true)}
        className={`fixed right-5 bottom-24 w-14 h-14 rounded-full bg-gradient-to-br ${current.gradient}
          text-white text-2xl shadow-xl flex items-center justify-center z-40
          active:scale-95 transition-transform`}
      >
        +
      </button>

      {showModal && (
        <FoodSearchModal
          onAdd={(item) => { addItem(item); }}
          onClose={() => setShowModal(false)}
        />
      )}

      {showMultiScan && (
        <MultiScanModal
          onAdd={(item) => { addItem(item); }}
          onClose={() => setShowMultiScan(false)}
        />
      )}
    </>
  );
}
