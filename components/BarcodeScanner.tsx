'use client';
import { useEffect, useRef, useState } from 'react';

interface Props {
  onDetected: (barcode: string) => void;
  onClose: () => void;
}

declare global {
  interface Window {
    BarcodeDetector?: new (opts: { formats: string[] }) => {
      detect(image: HTMLVideoElement): Promise<{ rawValue: string }[]>;
    };
  }
}

export default function BarcodeScanner({ onDetected, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);
  const [status, setStatus] = useState<'loading' | 'scanning' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const detectedRef = useRef(false);

  useEffect(() => {
    if (!window.BarcodeDetector) {
      setErrorMsg("La détection de codes-barres n'est pas supportée sur ce navigateur (Chrome ou Safari 17+ requis).");
      setStatus('error');
      return;
    }

    const detector = new window.BarcodeDetector({
      formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'qr_code', 'code_128'],
    });

    const scan = async () => {
      const video = videoRef.current;
      if (!video || detectedRef.current) return;
      if (video.readyState >= 2) {
        try {
          const results = await detector.detect(video);
          if (results.length > 0 && !detectedRef.current) {
            detectedRef.current = true;
            streamRef.current?.getTracks().forEach(t => t.stop());
            onDetected(results[0].rawValue);
            return;
          }
        } catch {
          // detection failed on this frame, try next
        }
      }
      rafRef.current = requestAnimationFrame(scan);
    };

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' }, audio: false })
      .then(stream => {
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setStatus('scanning');
        rafRef.current = requestAnimationFrame(scan);
      })
      .catch(() => {
        setErrorMsg("Impossible d'accéder à la caméra. Vérifie les permissions.");
        setStatus('error');
      });

    return () => {
      cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, [onDetected]);

  return (
    <div className="fixed inset-0 z-60 bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12 bg-black/80">
        <button onClick={onClose} className="text-white text-sm font-medium">
          ✕ Fermer
        </button>
        <p className="text-white text-sm font-semibold">Scanner un code-barres</p>
        <div className="w-14" />
      </div>

      {/* Camera viewfinder */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          playsInline
          muted
        />

        {/* Scanning frame */}
        {status === 'scanning' && (
          <div className="relative z-10 w-72 h-40">
            <div className="absolute inset-0 border-2 border-white/30 rounded-xl" />
            {/* Corner markers */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-xl" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-xl" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-xl" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-xl" />
            {/* Scan line animation */}
            <div className="absolute left-2 right-2 h-0.5 bg-green-400 rounded-full animate-bounce top-1/2" />
          </div>
        )}

        {/* Status messages */}
        {status === 'loading' && (
          <div className="relative z-10 text-center text-white">
            <p className="text-4xl mb-2 animate-pulse">📷</p>
            <p className="text-sm">Activation de la caméra...</p>
          </div>
        )}
        {status === 'error' && (
          <div className="relative z-10 text-center px-8">
            <p className="text-4xl mb-3">⚠️</p>
            <p className="text-white text-sm">{errorMsg}</p>
            <button
              onClick={onClose}
              className="mt-4 bg-white text-black px-6 py-2 rounded-full text-sm font-semibold"
            >
              Retour
            </button>
          </div>
        )}
      </div>

      {/* Footer hint */}
      {status === 'scanning' && (
        <div className="p-6 text-center bg-black/80">
          <p className="text-white/70 text-sm">Pointe la caméra vers le code-barres du produit</p>
        </div>
      )}
    </div>
  );
}
