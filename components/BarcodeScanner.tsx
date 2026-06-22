'use client';
import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';

interface Props {
  onDetected: (barcode: string) => void;
  onClose: () => void;
}

export default function BarcodeScanner({ onDetected, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<'loading' | 'scanning' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const detectedRef = useRef(false);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    let active = true;

    const start = async () => {
      try {
        setStatus('scanning');
        await codeReader.decodeFromConstraints(
          { video: { facingMode: 'environment' } },
          videoRef.current!,
          (result, error) => {
            if (!active) return;
            if (result && !detectedRef.current) {
              detectedRef.current = true;
              BrowserMultiFormatReader.releaseAllStreams();
              onDetected(result.getText());
            }
            void error; // NotFoundException is thrown every frame with no barcode — ignore
          }
        );
      } catch {
        if (active) {
          setErrorMsg("Impossible d'accéder à la caméra. Vérifie les permissions dans les réglages.");
          setStatus('error');
        }
      }
    };

    start();

    return () => {
      active = false;
      BrowserMultiFormatReader.releaseAllStreams();
    };
  }, [onDetected]);

  return (
    <div className="fixed inset-0 z-[60] bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12 bg-black/80">
        <button onClick={onClose} className="text-white text-sm font-medium px-2 py-1">
          ✕ Fermer
        </button>
        <p className="text-white text-sm font-semibold">Scanner un code-barres</p>
        <div className="w-20" />
      </div>

      {/* Camera viewfinder */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          playsInline
          muted
        />

        {/* Scanning frame overlay */}
        {status === 'scanning' && (
          <div className="relative z-10 w-72 h-44 pointer-events-none">
            <div className="absolute inset-0 rounded-xl" style={{ boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)' }} />
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-xl" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-xl" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-xl" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-xl" />
            <div className="absolute left-3 right-3 h-0.5 bg-green-400 rounded-full animate-bounce top-1/2" />
          </div>
        )}

        {status === 'loading' && (
          <div className="relative z-10 text-center text-white">
            <p className="text-4xl mb-2 animate-pulse">📷</p>
            <p className="text-sm">Activation de la caméra...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="relative z-10 text-center px-8">
            <p className="text-4xl mb-3">⚠️</p>
            <p className="text-white text-sm mb-4">{errorMsg}</p>
            <button
              onClick={onClose}
              className="bg-white text-black px-6 py-2 rounded-full text-sm font-semibold"
            >
              Retour
            </button>
          </div>
        )}
      </div>

      {status === 'scanning' && (
        <div className="p-6 text-center bg-black/80">
          <p className="text-white/70 text-sm">Pointe la caméra vers le code-barres du produit</p>
        </div>
      )}
    </div>
  );
}
