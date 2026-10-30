/**
 * ScanPage — On-device QR camera scanner and local image upload fallback.
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
            : 'Threat analysis request failed. Please check backend connection.',
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
      setError('Could not decode a valid QR code from this image. Please ensure the image is clear.');
    }
  };

  return (
    <div className="max-w-sm mx-auto space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white">QR Code Scanner</h1>
        <p className="text-xs text-slate-400 mt-1">
          Camera frames are decoded locally in your browser and never uploaded.
        </p>
      </div>

      {pageState === 'analysing' && (
        <div className="card-clean rounded-xl p-8">
          <Spinner label="Evaluating target URL with detection engine…" />
        </div>
      )}

      {(pageState === 'scanning' || pageState === 'done') && !useFallback && (
        <div className="space-y-3">
          <QRScannerComponent
            onResult={handleQRResult}
            onStateChange={(s) => {
              if (s === 'denied' || s === 'error') setUseFallback(true);
            }}
          />

          <button
            onClick={() => setUseFallback(true)}
            className="w-full text-center text-xs text-slate-400 hover:text-slate-200 transition-colors py-2"
          >
            Camera restricted? Upload an image instead →
          </button>
        </div>
      )}

      {/* Fallback File Upload */}
      {useFallback && pageState !== 'analysing' && (
        <div className="space-y-3">
          <div className="card-clean rounded-xl p-6 text-center space-y-3">
            <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
              </svg>
            </div>

            <div>
              <p className="text-sm font-semibold text-white">Inspect QR Image</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Decoded completely in-browser without server upload.
              </p>
            </div>

            <label
              htmlFor="qr-upload"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium cursor-pointer transition-colors"
            >
              {fallbackFile ? fallbackFile.name : 'Select Image File'}
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
                <Spinner label="Decoding QR matrix locally…" />
              </div>
            )}
          </div>

          <button
            onClick={() => {
              setUseFallback(false);
              setFallbackFile(null);
              setError('');
            }}
            className="w-full text-center text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            ← Back to camera viewfinder
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

      <div className="rounded-lg bg-slate-900 border border-slate-800 p-3 text-center text-[11px] text-slate-400">
        <p className="font-semibold text-slate-300">Safe Inspection Guarantee</p>
        <p className="mt-0.5">The application never automatically visits or opens the extracted link.</p>
      </div>
    </div>
  );
}
