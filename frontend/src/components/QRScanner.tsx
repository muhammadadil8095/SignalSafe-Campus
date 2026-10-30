/**
 * QRScanner — on-device QR code decoding using the Nimiq qr-scanner library.
 *
 * Security rules enforced here:
 * - QR image data NEVER leaves the device.
 * - Only the decoded text payload is forwarded for analysis.
 * - No screenshot, upload, or network transfer of camera frames.
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
        // Only the decoded text is emitted — no image data.
        onResult(result.data);
      },
      {
        preferredCamera: 'environment',
        highlightScanRegion: true,
        highlightCodeOutline: true,
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
            'Camera access was denied. Please allow camera permission in your browser settings and reload.',
          );
        } else {
          updateState('error');
          setErrorMsg(`Camera error: ${msg}`);
        }
      });

    return () => {
      scanner.destroy();
      scannerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative w-full max-w-sm mx-auto aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-slate-700">
      {/* Live camera preview */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        aria-label="Camera viewfinder for QR code scanning"
        playsInline
        muted
      />

      {/* Overlay messages */}
      {state === 'requesting' && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80">
          <p className="text-slate-300 text-sm text-center px-4">
            Requesting camera access…
          </p>
        </div>
      )}

      {state === 'scanning' && (
        <div className="absolute bottom-3 inset-x-0 flex justify-center pointer-events-none">
          <span className="bg-slate-900/70 text-slate-300 text-xs px-3 py-1 rounded-full backdrop-blur-sm">
            Point at a QR code
          </span>
        </div>
      )}

      {(state === 'denied' || state === 'error') && (
        <div
          role="alert"
          className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 p-6 text-center gap-3"
        >
          <svg
            className="w-10 h-10 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
            />
          </svg>
          <p className="text-red-300 text-sm leading-relaxed">{errorMsg}</p>
        </div>
      )}
    </div>
  );
}

// ── Fallback: decode a QR from an uploaded image file ────────────────────────
// Used when camera is unavailable (local-demo fallback only per handoff spec).

export async function decodeQRFromFile(file: File): Promise<string> {
  const result = await QrScanner.scanImage(file, { returnDetailedScanResult: true });
  return result.data;
}
