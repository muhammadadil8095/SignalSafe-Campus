/**
 * ScanPage — Swiss luxury-brutalist optical scanner view.
 */
import { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
            : 'Threat evaluation service was unreachable. Please verify backend connection.',
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
      setError('Could not decode a QR code from this image. Please ensure the QR is well-lit and in focus.');
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6 px-4 py-8 font-satoshi">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1e1e1e]/10">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs uppercase font-bold tracking-wider text-[#111111] hover:text-[#838282] transition-colors"
        >
          <span>←</span>
          <span>Return Home</span>
        </Link>
        <span className="font-mono text-[11px] uppercase tracking-widest text-[#838282]">
          LOCAL DECODE
        </span>
      </div>

      {/* Header */}
      <div>
        <h1 className="font-clash text-3xl font-bold tracking-tight text-[#111111]">
          Optical Scanner
        </h1>
        <p className="text-xs text-[#838282] mt-1 leading-relaxed">
          Point camera directly at suspicious QR stickers. Processing occurs in-memory; camera frames are never transmitted.
        </p>
      </div>

      {pageState === 'analysing' && (
        <div className="border border-[#1e1e1e] bg-[#ffffff] p-8 shadow-sm">
          <Spinner label="EVALUATING DECODED PAYLOAD WITH THREAT MODELS…" />
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
            className="w-full text-center text-xs font-bold uppercase tracking-wider text-[#111111] hover:text-[#838282] transition-colors py-2 block"
          >
            Camera restricted? Upload QR image locally →
          </button>
        </div>
      )}

      {/* Image upload fallback */}
      {useFallback && pageState !== 'analysing' && (
        <div className="space-y-4">
          <div className="border border-[#1e1e1e] bg-[#ffffff] p-6 text-center space-y-4 shadow-sm">
            <div>
              <p className="font-clash text-lg font-bold text-[#111111]">Select QR File</p>
              <p className="text-xs text-[#838282] mt-0.5">
                Decoded locally via client-side canvas. Zero data uploaded.
              </p>
            </div>

            <label
              htmlFor="qr-upload"
              className="pill-button-invert px-6 py-2.5 text-xs font-bold uppercase tracking-wider cursor-pointer inline-block"
            >
              {fallbackFile ? fallbackFile.name : 'Choose Image'}
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
                <Spinner label="DECODING MATRIX LOCALLY…" />
              </div>
            )}
          </div>

          <button
            onClick={() => {
              setUseFallback(false);
              setFallbackFile(null);
              setError('');
            }}
            className="w-full text-center text-xs font-bold uppercase tracking-wider text-[#111111] hover:text-[#838282] transition-colors"
          >
            ← Return to live viewfinder
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

      {/* Policy Guarantee */}
      <div className="border-t border-[#1e1e1e]/15 pt-4 text-center text-[11px] font-mono text-[#838282]">
        ZERO-CRAWL DIRECTIVE: PAYLOADS ARE NEVER VISITED OR LOADED BY BROWSER.
      </div>
    </div>
  );
}
