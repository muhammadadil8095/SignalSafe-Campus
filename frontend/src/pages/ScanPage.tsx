/**
 * ScanPage — Optical QR scanner with plain-language guidance.
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
            : 'We could not connect to the security engine right now. Please check your internet connection or try again shortly.',
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
      setError('We could not detect a QR code in that photo. Please try a clearer, well-lit photo.');
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
          <span>Back to Home</span>
        </Link>
        <span className="font-mono text-[11px] uppercase tracking-widest text-[#838282]">
          PRIVATE ON YOUR DEVICE
        </span>
      </div>

      {/* Header */}
      <div>
        <h1 className="font-clash text-3xl font-bold tracking-tight text-[#111111]">
          Scan a QR Code
        </h1>
        <p className="text-xs text-[#838282] mt-1.5 leading-relaxed">
          Hold your phone camera steady over the QR code. We decode the link directly inside your browser so your photos stay completely private.
        </p>
      </div>

      {pageState === 'analysing' && (
        <div className="border border-[#1e1e1e] bg-[#ffffff] p-8 shadow-sm">
          <Spinner label="Checking the link for phishing and scams…" />
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
            Camera not opening? Upload a photo instead →
          </button>
        </div>
      )}

      {/* Image upload fallback */}
      {useFallback && pageState !== 'analysing' && (
        <div className="space-y-4">
          <div className="border border-[#1e1e1e] bg-[#ffffff] p-6 text-center space-y-4 shadow-sm">
            <div>
              <p className="font-clash text-lg font-bold text-[#111111]">Upload QR Photo</p>
              <p className="text-xs text-[#838282] mt-1">
                Select a screenshot or photo of the QR code from your gallery. It is scanned locally on your device without being uploaded.
              </p>
            </div>

            <label
              htmlFor="qr-upload"
              className="pill-button-invert px-6 py-2.5 text-xs font-bold uppercase tracking-wider cursor-pointer inline-block"
            >
              {fallbackFile ? fallbackFile.name : 'Choose Photo from Device'}
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
                <Spinner label="Reading QR code from photo…" />
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
            ← Switch back to live camera
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

      {/* Safety Notice */}
      <div className="border-t border-[#1e1e1e]/15 pt-4 text-center text-[11px] text-[#838282]">
        <span className="font-bold text-[#111111]">Safety Promise: </span>
        SignalSafe inspects website addresses safely. It will never open or redirect your browser to an unverified website.
      </div>
    </div>
  );
}
