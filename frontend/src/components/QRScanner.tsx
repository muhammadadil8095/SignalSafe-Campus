/**
 * QRScanner — on-device QR code decoding using the Nimiq qr-scanner library.
 *
 * Security rules enforced here:
 * - QR image data NEVER leaves the device.
 * - Only the decoded text payload is forwarded for analysis.
 * - No screenshot, upload, or network transfer of camera frames.
 *
 * Styled with high-tech HUD reticles and animated laser sweep.
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
        // Security boundary: Only decoded string forwarded
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
            'Camera permission was blocked. Allow camera access in your browser settings to scan in real-time.',
          );
        } else {
          updateState('error');
          setErrorMsg(`Optical viewfinder unavailable: ${msg}`);
        }
      });

    return () => {
      scanner.destroy();
      scannerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative w-full max-w-sm mx-auto aspect-square rounded-3xl overflow-hidden glass-strong border border-white/10 shadow-2xl group">
      {/* Live camera stream */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        aria-label="Camera viewfinder for QR code scanning"
        playsInline
        muted
      />

      {/* Cybernetic HUD overlay */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
        {/* Top HUD status */}
        <div className="flex items-center justify-between text-[11px] font-mono tracking-wider">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/70 border border-white/10 text-cyan-300 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            LIVE TELEMETRY
          </span>
          <span className="px-2.5 py-1 rounded-full bg-slate-950/70 border border-white/10 text-slate-400 backdrop-blur-md">
            LOCAL ENGINE
          </span>
        </div>

        {/* Central Target Reticle */}
        <div className="relative self-center w-52 h-52 flex items-center justify-center">
          {/* Corner brackets */}
          <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-cyan-400 rounded-tl-lg shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
          <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-cyan-400 rounded-tr-lg shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
          <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-cyan-400 rounded-bl-lg shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-cyan-400 rounded-br-lg shadow-[0_0_8px_rgba(34,211,238,0.6)]" />

          {/* Animated laser line */}
          {state === 'scanning' && (
            <div className="absolute inset-x-2 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_rgba(34,211,238,0.9)] animate-bounce" />
          )}

          {/* Central target crosshair */}
          <div className="w-2 h-2 rounded-full border border-cyan-400/50" />
        </div>

        {/* Bottom indicator */}
        <div className="text-center">
          <span className="inline-block text-[11px] font-medium text-slate-300 bg-slate-950/80 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md shadow-lg">
            Align QR code within reticle
          </span>
        </div>
      </div>

      {/* Requesting State */}
      {state === 'requesting' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/85 backdrop-blur-md p-6 text-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 animate-pulse">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-slate-200">
            Initialising optical sensor…
          </p>
          <p className="text-xs text-slate-400 max-w-xs">
            Zero frame retention: camera data is decoded exclusively in-memory.
          </p>
        </div>
      )}

      {/* Permission Denied or Error State */}
      {(state === 'denied' || state === 'error') && (
        <div
          role="alert"
          className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-md p-6 text-center gap-3.5"
        >
          <div className="w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 shadow-lg shadow-red-500/20">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
              />
            </svg>
          </div>
          <p className="text-sm font-semibold text-red-300">{errorMsg}</p>
          <p className="text-xs text-slate-400">
            Use the cryptographic image upload fallback below to inspect any QR code offline.
          </p>
        </div>
      )}
    </div>
  );
}

// ── Fallback: decode a QR from an uploaded image file ────────────────────────
// Decoded entirely in-browser memory via WASM/Canvas. Never uploaded.
export async function decodeQRFromFile(file: File): Promise<string> {
  const result = await QrScanner.scanImage(file, { returnDetailedScanResult: true });
  return result.data;
}
