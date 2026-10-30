/**
 * ScanPage — on-device QR scanning.
 *
 * Security contract:
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
        // Navigate to verdict page, passing result via state.
        navigate('/verdict', { state: { result, source: 'qr' } });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Analysis failed. Please try again.',
        );
        setPageState('scanning');
      }
    },
    [navigate],
  );

  // Called once per successful QR decode from camera.
  const handleQRResult = useCallback(
    (decodedText: string) => {
      if (pageState !== 'scanning') return; // ignore subsequent frames
      void analyseDecodedText(decodedText);
    },
    [pageState, analyseDecodedText],
  );

  // Fallback: user uploads a QR image; decode happens locally.
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
      setError('Could not decode a QR code from that image. Try a clearer photo.');
    }
  };

  return (
    <div className="max-w-sm mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Scan QR Code</h1>
        <p className="text-slate-400 text-sm mt-1">
          QR image stays on your device — only the decoded content is analysed.
        </p>
      </div>

      {pageState === 'analysing' && (
        <div className="flex justify-center py-10">
          <Spinner label="Analysing…" />
        </div>
      )}

      {(pageState === 'scanning' || pageState === 'done') && !useFallback && (
        <>
          <QRScannerComponent
            onResult={handleQRResult}
            onStateChange={(s) => {
              if (s === 'denied' || s === 'error') setUseFallback(true);
            }}
          />
          <button
            onClick={() => setUseFallback(true)}
            className="w-full text-xs text-slate-500 underline hover:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
          >
            Camera not working? Upload a QR image instead
          </button>
        </>
      )}

      {/* Image upload fallback */}
      {useFallback && pageState !== 'analysing' && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-800/50 border border-slate-700/40 p-5 text-center space-y-3">
            <p className="text-slate-300 text-sm">
              Upload a photo of the QR code. The image is decoded entirely on your
              device — it is never uploaded to our servers.
            </p>
            <label
              htmlFor="qr-upload"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium cursor-pointer transition-colors duration-200 focus-within:ring-2 focus-within:ring-blue-500"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
              </svg>
              {fallbackFile ? fallbackFile.name : 'Choose QR image'}
              <input
                id="qr-upload"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleFileChange}
              />
            </label>
            {fallbackDecoding && <Spinner label="Decoding QR…" />}
          </div>
          <button
            onClick={() => {
              setUseFallback(false);
              setFallbackFile(null);
              setError('');
            }}
            className="w-full text-xs text-slate-500 underline hover:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
          >
            Try camera again
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

      {/* Security notice */}
      <p className="text-xs text-slate-600 text-center">
        This tool analyses threat indicators only. Never enter credentials after
        scanning an unknown QR code.
      </p>
    </div>
  );
}
