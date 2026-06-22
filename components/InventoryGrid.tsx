'use client';
import { InventoryItem } from '@/lib/types';
import { getExpiryStatus, formatExpiryLabel } from '@/lib/expiryUtils';

interface Props {
  items: InventoryItem[];
  onUpdate: (id: string, delta: number, qty: number) => void;
}

const EXPIRY_STYLES = {
  expired: { card: 'border-red-300 bg-red-50', badge: 'bg-red-100 text-red-600' },
  soon:    { card: 'border-orange-300 bg-orange-50', badge: 'bg-orange-100 text-orange-600' },
  ok:      { card: 'border-green-200', badge: 'bg-green-100 text-green-600' },
  unknown: { card: 'border-gray-100', badge: '' },
};

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

  const sorted = [...items].sort((a, b) => {
    const order = { expired: 0, soon: 1, ok: 2, unknown: 3 };
    return order[getExpiryStatus(a.expiryDate)] - order[getExpiryStatus(b.expiryDate)];
  });

  return (
    <div className="grid grid-cols-2 gap-3 p-4">
      {sorted.map(item => {
        const status = getExpiryStatus(item.expiryDate);
        const label = formatExpiryLabel(item.expiryDate);
        const styles = EXPIRY_STYLES[status];

        return (
          <div
            key={item.id}
            className={`bg-white rounded-2xl shadow-sm border p-4 flex flex-col gap-2 ${styles.card}`}
          >
            <div className="flex items-start justify-between">
              <span className="text-3xl">{item.emoji}</span>
              <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                {item.unit}
              </span>
            </div>
            <p className="font-semibold text-sm leading-tight">{item.foodName}</p>

            {label && (
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full w-fit ${styles.badge}`}>
                {status === 'expired' ? '⚠️' : status === 'soon' ? '⏰' : '✓'} {label}
              </span>
            )}

            <div className="flex items-center gap-2 mt-auto">
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
        );
      })}
    </div>
  );
}
