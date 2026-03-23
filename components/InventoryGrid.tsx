'use client';
import { InventoryItem } from '@/lib/types';

interface Props {
  items: InventoryItem[];
  onUpdate: (id: string, delta: number, qty: number) => void;
}

// Regroupe les items par catégorie
function groupByCategory(items: InventoryItem[]) {
  return items.reduce<Record<string, InventoryItem[]>>((acc, item) => {
    const cat = item.foodName; // On utilise le nom comme fallback
    // La vraie catégorie viendrait de FOOD_DATABASE, on la simule ici
    return acc;
  }, {});
}

export default function InventoryGrid({ items, onUpdate }: Props) {
  if (items.length === 0) {
    return (
      <div className="text-center py-16 text-gray-300">
        <p className="text-5xl mb-3">📭</p>
        <p className="text-lg font-medium">Rien ici pour le moment</p>
        <p className="text-sm">Appuie sur + pour ajouter un aliment</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 p-4">
      {items.map(item => (
        <div
          key={item.id}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-2"
        >
          <div className="flex items-start justify-between">
            <span className="text-3xl">{item.emoji}</span>
            <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
              {item.unit}
            </span>
          </div>
          <p className="font-semibold text-sm leading-tight">{item.foodName}</p>
          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={() => onUpdate(item.id!, -1, item.quantity)}
              className="w-8 h-8 rounded-full bg-red-50 text-red-400 font-bold text-lg flex items-center justify-center"
            >−</button>
            <span className="flex-1 text-center font-bold text-lg">{item.quantity}</span>
            <button
              onClick={() => onUpdate(item.id!, +1, item.quantity)}
              className="w-8 h-8 rounded-full bg-green-50 text-green-500 font-bold text-lg flex items-center justify-center"
            >+</button>
          </div>
        </div>
      ))}
    </div>
  );
}
