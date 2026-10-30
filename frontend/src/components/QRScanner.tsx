/**
 * QRScanner — Swiss minimalist optical scanner.
 * On-device QR decoding via Nimiq qr-scanner library.
 * Zero frame upload: only decoded string is emitted.
 */
import { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';

export type QRScannerState =
  | 'idle'
  | 'requesting'
  | 'scanning'
  | 'denied'
  | 'error';

interface Props {
  onResult: (decodedText: string) => void;
  onStateChange?: (state: QRScannerState) => void;
}

export default function QRScanner({ onResult, onStateChange }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const [state, setState] = useState<QRScannerState>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  function updateState(s: QRScannerState) {
    setState(s);
    onStateChange?.(s);
  }

  useEffect(() => {
    if (!videoRef.current) return;

    updateState('requesting');

    const scanner = new QrScanner(
      videoRef.current,
      (result) => {
        onResult(result.data);
      },
      {
        preferredCamera: 'environment',
        highlightScanRegion: false,
        highlightCodeOutline: false,
        returnDetailedScanResult: true,
      },
    );

    scannerRef.current = scanner;

    scanner
      .start()
      .then(() => updateState('scanning'))
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : String(err);
        if (
          msg.toLowerCase().includes('permission') ||
          msg.toLowerCase().includes('denied') ||
          msg.toLowerCase().includes('notallowed')
        ) {
          updateState('denied');
          setErrorMsg(
            'Camera permission blocked. Permit camera access in browser preferences.',
          );
        } else {
          updateState('error');
          setErrorMsg(`Optical sensor unavailable: ${msg}`);
        }
      });

    return () => {
      scanner.destroy();
      scannerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative w-full max-w-sm mx-auto aspect-square border border-[#1e1e1e] bg-[#ffffff] overflow-hidden group shadow-sm">
      {/* Video Stream */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        aria-label="Camera viewfinder for QR code scanning"
        playsInline
        muted
      />

      {/* Swiss Monochromatic Reticle */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
        <div className="flex items-center justify-between text-[10px] font-mono tracking-widest uppercase">
          <span className="px-2 py-0.5 bg-[#ffffff] text-[#111111] border border-[#1e1e1e]/20 font-bold">
            LIVE SENSOR
          </span>
          <span className="px-2 py-0.5 bg-[#ffffff] text-[#111111] border border-[#1e1e1e]/20">
            WASM ENGINE
          </span>
        </div>

        {/* Minimalist framing corners */}
        <div className="relative self-center w-48 h-48 flex items-center justify-center">
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#111111]" />
          <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-[#111111]" />
          <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-[#111111]" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#111111]" />
          <div className="w-1.5 h-1.5 bg-[#111111]" />
        </div>

        <div className="text-center">
          <span className="inline-block text-[10px] font-mono uppercase tracking-wider text-[#111111] bg-[#ffffff] px-2.5 py-1 border border-[#1e1e1e]/20">
            FRAME QR MATRIX INSIDE BOUNDS
          </span>
        </div>
      </div>

      {/* Requesting Sensor */}
      {state === 'requesting' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#ffffff]/95 p-6 text-center gap-2">
          <div className="w-6 h-6 border-2 border-[#1e1e1e]/20 border-t-[#111111] rounded-full animate-spin" />
          <p className="text-xs font-mono uppercase tracking-wider text-[#111111]">
            Engaging optical sensor…
          </p>
        </div>
      )}

      {/* Sensor Error */}
      {(state === 'denied' || state === 'error') && (
        <div
          role="alert"
          className="absolute inset-0 flex flex-col items-center justify-center bg-[#ffffff] p-6 text-center gap-3"
        >
          <div className="w-8 h-8 border border-[#111111] flex items-center justify-center font-mono font-bold text-sm">
            ✕
          </div>
          <p className="text-xs font-medium text-[#111111] max-w-xs">{errorMsg}</p>
        </div>
      )}
    </div>
  );
}

export async function decodeQRFromFile(file: File): Promise<string> {
  const result = await QrScanner.scanImage(file, { returnDetailedScanResult: true });
  return result.data;
}
