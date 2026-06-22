'use client';
import { useInventory } from '@/hooks/useInventory';
import { useRecipes } from '@/hooks/useRecipes';
import { getExpiryStatus, getDaysUntilExpiry } from '@/lib/expiryUtils';

export default function DashboardPage() {
  const { inventory, loading: invLoading } = useInventory();
  const { loading: recLoading, getMatchedRecipes } = useRecipes(inventory);

  if (invLoading || recLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-4xl mb-2 animate-bounce">📊</p>
          <p className="text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  const expired = inventory.filter(i => getExpiryStatus(i.expiryDate) === 'expired');
  const expiringSoon = inventory.filter(i => getExpiryStatus(i.expiryDate) === 'soon');
  const withExpiry = inventory.filter(i => i.expiryDate);
  const byLocation = {
    frigo: inventory.filter(i => i.location === 'frigo').length,
    congelateur: inventory.filter(i => i.location === 'congelateur').length,
    sec: inventory.filter(i => i.location === 'sec').length,
  };

  const cookableTonight = getMatchedRecipes().filter(r => r.matchScore === 1);

  const nextToExpire = [...inventory]
    .filter(i => i.expiryDate)
    .sort((a, b) => {
      const da = getDaysUntilExpiry(a.expiryDate) ?? Infinity;
      const db = getDaysUntilExpiry(b.expiryDate) ?? Infinity;
      return da - db;
    })
    .slice(0, 5);

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-500 to-indigo-600 px-5 pt-12 pb-6">
        <h1 className="text-white font-bold text-2xl mb-1">📊 Tableau de bord</h1>
        <p className="text-white/70 text-sm">Vue d&apos;ensemble de ta cuisine</p>
      </div>

      <div className="p-4 space-y-4">

        {/* Alertes urgentes */}
        {(expired.length > 0 || expiringSoon.length > 0) && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
            <h2 className="font-bold text-red-700 mb-3">⚠️ Alertes</h2>
            <div className="space-y-2">
              {expired.map(item => (
                <div key={item.id} className="flex items-center gap-2">
                  <span className="text-xl">{item.emoji}</span>
                  <span className="text-sm font-medium text-red-700 flex-1">{item.foodName}</span>
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                    Périmé
                  </span>
                </div>
              ))}
              {expiringSoon.map(item => {
                const days = getDaysUntilExpiry(item.expiryDate);
                return (
                  <div key={item.id} className="flex items-center gap-2">
                    <span className="text-xl">{item.emoji}</span>
                    <span className="text-sm font-medium text-orange-700 flex-1">{item.foodName}</span>
                    <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium">
                      {days === 0 ? "Aujourd'hui" : days === 1 ? 'Demain' : `${days}j`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Stats globales */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <p className="text-3xl font-bold text-gray-800">{inventory.length}</p>
            <p className="text-sm text-gray-400 mt-0.5">Aliments en stock</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <p className="text-3xl font-bold text-green-600">{cookableTonight.length}</p>
            <p className="text-sm text-gray-400 mt-0.5">Recettes ce soir</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <p className="text-3xl font-bold text-orange-500">{expiringSoon.length + expired.length}</p>
            <p className="text-sm text-gray-400 mt-0.5">À consommer vite</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <p className="text-3xl font-bold text-blue-500">{withExpiry.length}</p>
            <p className="text-sm text-gray-400 mt-0.5">Avec date suivie</p>
          </div>
        </div>

        {/* Répartition par emplacement */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <h2 className="font-bold text-gray-700 mb-3">Répartition du stock</h2>
          <div className="space-y-3">
            {[
              { label: 'Frigo', emoji: '❄️', count: byLocation.frigo, color: 'bg-cyan-400' },
              { label: 'Congélateur', emoji: '🧊', count: byLocation.congelateur, color: 'bg-indigo-400' },
              { label: 'Sec', emoji: '🗄️', count: byLocation.sec, color: 'bg-amber-400' },
            ].map(loc => {
              const pct = inventory.length > 0 ? Math.round((loc.count / inventory.length) * 100) : 0;
              return (
                <div key={loc.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-600">{loc.emoji} {loc.label}</span>
                    <span className="text-gray-400">{loc.count} aliments</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${loc.color} rounded-full transition-all`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Prochaines péremptions */}
        {nextToExpire.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <h2 className="font-bold text-gray-700 mb-3">📅 Prochaines péremptions</h2>
            <div className="space-y-2">
              {nextToExpire.map(item => {
                const days = getDaysUntilExpiry(item.expiryDate);
                const status = getExpiryStatus(item.expiryDate);
                const textColor = status === 'expired' ? 'text-red-600' : status === 'soon' ? 'text-orange-500' : 'text-green-600';
                const bgColor = status === 'expired' ? 'bg-red-50' : status === 'soon' ? 'bg-orange-50' : 'bg-green-50';
                return (
                  <div key={item.id} className={`flex items-center gap-3 p-2 rounded-xl ${bgColor}`}>
                    <span className="text-2xl">{item.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 truncate">{item.foodName}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(item.expiryDate!).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                    <span className={`text-xs font-semibold ${textColor}`}>
                      {days !== null && days < 0 ? 'Périmé' : days === 0 ? "Auj." : `${days}j`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recettes disponibles ce soir */}
        {cookableTonight.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <h2 className="font-bold text-gray-700 mb-3">🍳 Cuisinables ce soir</h2>
            <div className="space-y-2">
              {cookableTonight.slice(0, 4).map(r => (
                <div key={r.id} className="flex items-center gap-3 bg-green-50 p-2 rounded-xl">
                  <span className="text-2xl">{r.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">{r.name}</p>
                    <p className="text-xs text-gray-400">{r.prepTime + r.cookTime} min · {r.servings} pers.</p>
                  </div>
                  <span className="text-xs font-semibold text-green-600">✓ Prêt</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
