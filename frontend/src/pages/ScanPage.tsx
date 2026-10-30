/**
 * ScanPage — on-device QR scanning interface.
 * Security contract enforced:
 * - QR image data stays on device (enforced by QRScanner component).
 * - Only decoded text is sent to the backend for analysis.
 * - Fallback: upload a QR image for local decode (no image leaves device).
 */
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import QRScannerComponent, { decodeQRFromFile } from '../components/QRScanner';
import ErrorBanner from '../components/ErrorBanner';
import Spinner from '../components/Spinner';
import { api } from '../services/api';
import type { AnalysisResponse } from '../types/api';

type PageState = 'scanning' | 'analysing' | 'done' | 'fallback';

export default function ScanPage() {
  const navigate = useNavigate();
  const [pageState, setPageState] = useState<PageState>('scanning');
  const [error, setError] = useState('');
  const [useFallback, setUseFallback] = useState(false);
  const [fallbackFile, setFallbackFile] = useState<File | null>(null);
  const [fallbackDecoding, setFallbackDecoding] = useState(false);

  const analyseDecodedText = useCallback(
    async (decodedText: string) => {
      setPageState('analysing');
      setError('');
      try {
        const result: AnalysisResponse = await api.analyze({
          kind: 'url',
          input: decodedText,
          language: 'en',
          channel: 'pwa',
        });
        navigate('/verdict', { state: { result, source: 'qr' } });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Threat engine analysis failed. Check your network or backend status.',
        );
        setPageState('scanning');
      }
    },
    [navigate],
  );

  const handleQRResult = useCallback(
    (decodedText: string) => {
      if (pageState !== 'scanning') return;
      void analyseDecodedText(decodedText);
    },
    [pageState, analyseDecodedText],
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFallbackFile(file);
    setFallbackDecoding(true);
    setError('');
    try {
      const decoded = await decodeQRFromFile(file);
      setFallbackDecoding(false);
      void analyseDecodedText(decoded);
    } catch {
      setFallbackDecoding(false);
      setError('Unable to parse QR matrix from selected photo. Ensure adequate lighting and focus.');
    }
  };

  return (
    <div className="max-w-sm mx-auto space-y-6 float-in">
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
          <span>Optical QR Radar</span>
        </h1>
        <p className="text-xs text-slate-400">
          Decoded in-memory on this device. No camera frames are stored or transmitted.
        </p>
      </div>

      {pageState === 'analysing' && (
        <div className="rounded-3xl glass p-8">
          <Spinner label="Executing lexical threat extraction…" />
        </div>
      )}

      {(pageState === 'scanning' || pageState === 'done') && !useFallback && (
        <div className="space-y-4">
          <QRScannerComponent
            onResult={handleQRResult}
            onStateChange={(s) => {
              if (s === 'denied' || s === 'error') setUseFallback(true);
            }}
          />

          <button
            onClick={() => setUseFallback(true)}
            className="w-full text-center text-xs text-slate-400 hover:text-cyan-300 transition-colors py-2 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            Camera restricted? Upload QR snapshot locally →
          </button>
        </div>
      )}

      {/* Image upload fallback */}
      {useFallback && pageState !== 'analysing' && (
        <div className="space-y-4">
          <div className="rounded-3xl glass-strong border border-dashed border-white/20 p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
              </svg>
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                Inspect Stored QR Screenshot
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                File is processed solely through local WebAssembly rendering.
              </p>
            </div>

            <label
              htmlFor="qr-upload"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 text-xs font-semibold cursor-pointer transition-all shadow-lg"
            >
              {fallbackFile ? fallbackFile.name : 'Choose Image File'}
              <input
                id="qr-upload"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleFileChange}
              />
            </label>

            {fallbackDecoding && (
              <div className="pt-2">
                <Spinner label="Executing in-browser matrix decode…" />
              </div>
            )}
          </div>

          <button
            onClick={() => {
              setUseFallback(false);
              setFallbackFile(null);
              setError('');
            }}
            className="w-full text-center text-xs text-slate-400 hover:text-white transition-colors"
          >
            ← Return to live optical scanner
          </button>
        </div>
      )}

      {error && (
        <ErrorBanner
          message={error}
          onRetry={() => {
            setError('');
            setPageState('scanning');
          }}
        />
      )}

      {/* Safety assurance footer */}
      <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-white/5 text-center text-[11px] text-slate-500 space-y-1">
        <p className="font-mono text-cyan-400/80">NO REDIRECT POLICY</p>
        <p>The scanner will inspect threat markers without ever navigating your browser to the URL.</p>
      </div>
    </div>
  );
}
