'use client';
import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { fetchProductByBarcode, ScannedProduct } from '@/lib/openFoodFacts';
import { FoodLocation, FoodUnit, InventoryItem } from '@/lib/types';

interface Props {
  onAdd: (item: Omit<InventoryItem, 'id' | 'updatedAt'>) => void;
  onClose: () => void;
}

const LOCATIONS: { value: FoodLocation; label: string; emoji: string; color: string }[] = [
  { value: 'frigo', label: 'Frigo', emoji: '❄️', color: 'bg-cyan-500' },
  { value: 'congelateur', label: 'Congélo', emoji: '🧊', color: 'bg-indigo-500' },
  { value: 'sec', label: 'Sec', emoji: '🗄️', color: 'bg-amber-500' },
];

type PanelState = 'idle' | 'loading' | 'found' | 'not-found';

export default function MultiScanModal({ onAdd, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const detectedRef = useRef(false);
  const activeRef = useRef(true);

  const [camStatus, setCamStatus] = useState<'loading' | 'scanning' | 'error'>('loading');
  const [camError, setCamError] = useState('');
  const [panel, setPanel] = useState<PanelState>('idle');
  const [product, setProduct] = useState<ScannedProduct | null>(null);
  const [location, setLocation] = useState<FoodLocation>('frigo');
  const [quantity, setQuantity] = useState(1);
  const [customName, setCustomName] = useState('');
  const [addedCount, setAddedCount] = useState(0);
  const [toast, setToast] = useState('');

  useEffect(() => {
    activeRef.current = true;
    const codeReader = new BrowserMultiFormatReader();

    const start = async () => {
      try {
        setCamStatus('scanning');
        await codeReader.decodeFromConstraints(
          { video: { facingMode: 'environment' } },
          videoRef.current!,
          async (result, error) => {
            if (!activeRef.current || detectedRef.current) return;
            if (result) {
              detectedRef.current = true;
              setPanel('loading');
              setProduct(null);
              setCustomName('');
              const p = await fetchProductByBarcode(result.getText());
              if (!activeRef.current) return;
              if (p) {
                setProduct(p);
                setQuantity(p.quantity > 0 ? p.quantity : 1);
                setPanel('found');
              } else {
                setPanel('not-found');
              }
            }
            void error;
          }
        );
      } catch {
        if (activeRef.current) {
          setCamError("Impossible d'accéder à la caméra. Vérifie les permissions.");
          setCamStatus('error');
        }
      }
    };

    start();

    return () => {
      activeRef.current = false;
      BrowserMultiFormatReader.releaseAllStreams();
    };
  }, []);

  const reset = () => {
    setPanel('idle');
    setProduct(null);
    detectedRef.current = false;
  };

  const flash = (name: string) => {
    setToast(`✅ ${name} ajouté`);
    setTimeout(() => setToast(''), 2000);
  };

  const handleAdd = () => {
    if (!product) return;
    onAdd({
      foodId: `custom-${Date.now()}`,
      foodName: product.name,
      emoji: product.emoji,
      location,
      quantity,
      unit: product.unit,
      expiryDate: product.expiryDate,
    });
    setAddedCount(c => c + 1);
    flash(product.name);
    reset();
  };

  const handleAddManual = () => {
    const name = customName.trim();
    if (!name) return;
    onAdd({
      foodId: `custom-${Date.now()}`,
      foodName: name,
      emoji: '🛒',
      location,
      quantity,
      unit: 'unité' as FoodUnit,
    });
    setAddedCount(c => c + 1);
    flash(name);
    reset();
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-12 pb-4 bg-black/80">
        <button onClick={onClose} className="text-white/70 text-sm font-medium px-2 py-1">
          ✕ Fermer
        </button>
        <p className="text-white text-sm font-semibold">📷 Multi-scan</p>
        <div className={`rounded-full px-3 py-1 transition-colors ${addedCount > 0 ? 'bg-green-500' : 'bg-white/20'}`}>
          <p className="text-white text-sm font-bold">
            {addedCount} ajouté{addedCount !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Camera viewfinder */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          playsInline
          muted
        />

        {/* Scanning frame — visible only when idle */}
        {panel === 'idle' && camStatus === 'scanning' && (
          <div className="relative z-10 w-72 h-44 pointer-events-none">
            <div className="absolute inset-0 rounded-xl" style={{ boxShadow: '0 0 0 9999px rgba(0,0,0,0.55)' }} />
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-xl" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-xl" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-xl" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-xl" />
            <div className="absolute left-3 right-3 h-0.5 bg-green-400 rounded-full animate-bounce top-1/2" />
          </div>
        )}

        {/* Camera loading */}
        {camStatus === 'loading' && (
          <div className="relative z-10 text-center text-white">
            <p className="text-4xl mb-2 animate-pulse">📷</p>
            <p className="text-sm">Activation de la caméra...</p>
          </div>
        )}

        {/* Camera error */}
        {camStatus === 'error' && (
          <div className="relative z-10 text-center px-8">
            <p className="text-4xl mb-3">⚠️</p>
            <p className="text-white text-sm mb-4">{camError}</p>
            <button onClick={onClose} className="bg-white text-black px-6 py-2 rounded-full text-sm font-semibold">
              Retour
            </button>
          </div>
        )}

        {/* Success toast */}
        {toast && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-green-500 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg whitespace-nowrap">
            {toast}
          </div>
        )}
      </div>

      {/* ── Bottom panels ── */}

      {panel === 'idle' && (
        <div className="px-4 py-5 bg-black/80 text-center">
          <p className="text-white/60 text-sm">Pointe la caméra vers un code-barres</p>
        </div>
      )}

      {panel === 'loading' && (
        <div className="bg-white rounded-t-3xl px-5 pt-4 pb-8 flex items-center gap-3">
          <span className="text-2xl animate-spin inline-block">⏳</span>
          <p className="text-gray-700 font-medium">Recherche du produit...</p>
        </div>
      )}

      {panel === 'found' && product && (
        <div className="bg-white rounded-t-3xl px-5 pt-4 pb-8">
          {/* Product info */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{product.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-base truncate">{product.name}</p>
              <p className="text-xs text-gray-400">{product.category}</p>
            </div>
            <button onClick={reset} className="text-gray-300 text-xl px-1">✕</button>
          </div>

          {/* Location */}
          <div className="flex gap-2 mb-3">
            {LOCATIONS.map(loc => (
              <button
                key={loc.value}
                onClick={() => setLocation(loc.value)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold border-2 transition-all
                  ${location === loc.value
                    ? `${loc.color} text-white border-transparent`
                    : 'bg-white text-gray-500 border-gray-200'}`}
              >
                {loc.emoji} {loc.label}
              </button>
            ))}
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="w-10 h-10 rounded-full bg-gray-100 text-gray-700 text-xl font-bold flex items-center justify-center"
            >−</button>
            <span className="flex-1 text-center text-2xl font-bold">
              {quantity}
              <span className="text-sm font-normal text-gray-400 ml-1">{product.unit}</span>
            </span>
            <button
              onClick={() => setQuantity(q => q + 1)}
              className="w-10 h-10 rounded-full bg-gray-100 text-gray-700 text-xl font-bold flex items-center justify-center"
            >+</button>
          </div>

          <button
            onClick={handleAdd}
            className="w-full bg-green-500 text-white py-3.5 rounded-2xl font-bold text-base"
          >
            ✓ Ajouter au stock
          </button>
        </div>
      )}

      {panel === 'not-found' && (
        <div className="bg-white rounded-t-3xl px-5 pt-4 pb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">❓</span>
            <p className="font-semibold text-gray-700">Produit non trouvé</p>
            <button onClick={reset} className="ml-auto text-gray-300 text-xl px-1">✕</button>
          </div>
          <p className="text-sm text-gray-400 mb-3">Saisis le nom manuellement ou passe au suivant.</p>

          <input
            type="text"
            placeholder="Nom du produit..."
            value={customName}
            onChange={e => setCustomName(e.target.value)}
            className="w-full border rounded-xl px-4 py-3 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            autoFocus
          />

          <div className="flex gap-2 mb-3">
            {LOCATIONS.map(loc => (
              <button
                key={loc.value}
                onClick={() => setLocation(loc.value)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold border-2 transition-all
                  ${location === loc.value
                    ? `${loc.color} text-white border-transparent`
                    : 'bg-white text-gray-500 border-gray-200'}`}
              >
                {loc.emoji} {loc.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleAddManual}
            disabled={!customName.trim()}
            className="w-full bg-blue-500 disabled:bg-gray-200 text-white py-3.5 rounded-2xl font-bold text-base"
          >
            ✓ Ajouter quand même
          </button>
        </div>
      )}
    </div>
  );
}
