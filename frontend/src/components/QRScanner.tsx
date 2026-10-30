/**
 * QRScanner — On-device QR code decoding using the Nimiq qr-scanner library.
 *
 * Security rules:
 * - QR image data NEVER leaves the device.
 * - Only the decoded text payload is forwarded for analysis.
 * - Clean, non-distracting professional viewfinder.
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
            'Camera permission was denied. Please allow camera access in your browser settings to scan QR codes.',
          );
        } else {
          updateState('error');
          setErrorMsg(`Camera unavailable: ${msg}`);
        }
      });

    return () => {
      scanner.destroy();
      scannerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative w-full max-w-sm mx-auto aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
      {/* Live camera stream */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        aria-label="Camera viewfinder for QR code scanning"
        playsInline
        muted
      />

      {/* Clean Viewfinder Guide */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-5">
        <div className="flex items-center justify-between text-[11px] font-medium text-slate-400">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900/90 border border-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Active Viewfinder
          </span>
          <span className="px-2.5 py-1 rounded bg-slate-900/90 border border-slate-700 font-mono text-[10px]">
            On-Device Decode
          </span>
        </div>

        {/* Framing Corners */}
        <div className="relative self-center w-48 h-48 flex items-center justify-center">
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-slate-300 rounded-tl" />
          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-slate-300 rounded-tr" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-slate-300 rounded-bl" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-slate-300 rounded-br" />
        </div>

        <div className="text-center">
          <span className="inline-block text-xs font-medium text-slate-300 bg-slate-900/90 px-3 py-1 rounded border border-slate-700">
            Point camera directly at QR code
          </span>
        </div>
      </div>

      {/* Loading state */}
      {state === 'requesting' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 p-6 text-center gap-2">
          <div className="w-6 h-6 border-2 border-slate-600 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-xs text-slate-300 font-medium">Initializing camera…</p>
        </div>
      )}

      {/* Error state */}
      {(state === 'denied' || state === 'error') && (
        <div
          role="alert"
          className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/95 p-6 text-center gap-3"
        >
          <div className="w-10 h-10 rounded-full bg-red-950/50 border border-red-800 flex items-center justify-center text-red-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <p className="text-xs text-red-300 font-medium leading-relaxed max-w-xs">{errorMsg}</p>
        </div>
      )}
    </div>
  );
}

export async function decodeQRFromFile(file: File): Promise<string> {
  const result = await QrScanner.scanImage(file, { returnDetailedScanResult: true });
  return result.data;
}
