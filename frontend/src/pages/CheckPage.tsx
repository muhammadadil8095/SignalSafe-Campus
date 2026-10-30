/**
 * CheckPage — manual URL / message text input for analysis.
 *
 * Users paste a suspicious URL or message text.
 * The backend is the only source of truth for risk scores.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import type { AnalysisKind, AnalysisResponse } from '../types/api';
import ErrorBanner from '../components/ErrorBanner';
import Spinner from '../components/Spinner';

const KIND_OPTIONS: { value: AnalysisKind; label: string; placeholder: string }[] = [
  {
    value: 'url',
    label: 'URL / Link',
    placeholder: 'Paste a suspicious URL, e.g. https://campus-fee.xyz/pay',
  },
  {
    value: 'message',
    label: 'Message text',
    placeholder: 'Paste a suspicious SMS, email or message body…',
  },
  {
    value: 'payment',
    label: 'Payment request',
    placeholder: 'Describe or paste the payment request or UPI details…',
  },
  {
    value: 'bullying',
    label: 'Bullying / harassment',
    placeholder: 'Paste the message you want to assess…',
  },
];

export default function CheckPage() {
  const navigate = useNavigate();
  const [kind, setKind] = useState<AnalysisKind>('url');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currentOption = KIND_OPTIONS.find((o) => o.value === kind)!;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    setLoading(true);
    setError('');
    try {
      const result: AnalysisResponse = await api.analyze({
        kind,
        input: trimmed,
        language: 'en',
        channel: 'pwa',
      });
      navigate('/verdict', { state: { result, source: kind } });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Analysis failed. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Check Something Suspicious</h1>
        <p className="text-slate-400 text-sm mt-1">
          Our backend analyses it — no local risk calculation in the browser.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Kind selector */}
        <fieldset>
          <legend className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
            What are you checking?
          </legend>
          <div className="grid grid-cols-2 gap-2">
            {KIND_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer text-sm transition-colors duration-150 ${
                  kind === opt.value
                    ? 'bg-blue-600/20 border-blue-500/50 text-blue-300'
                    : 'bg-slate-800/40 border-slate-700/40 text-slate-400 hover:bg-slate-800/70'
                }`}
              >
                <input
                  type="radio"
                  name="kind"
                  value={opt.value}
                  checked={kind === opt.value}
                  onChange={() => setKind(opt.value)}
                  className="sr-only"
                />
                <span
                  className={`w-3 h-3 rounded-full border-2 shrink-0 ${
                    kind === opt.value ? 'border-blue-400 bg-blue-400' : 'border-slate-600'
                  }`}
                  aria-hidden="true"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>

        {/* Input */}
        <div>
          <label
            htmlFor="check-input"
            className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2"
          >
            {currentOption.label}
          </label>
          <textarea
            id="check-input"
            rows={5}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={currentOption.placeholder}
            required
            maxLength={4000}
            className="w-full rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-200 placeholder-slate-600 text-sm px-4 py-3 resize-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition"
          />
          <p className="text-xs text-slate-600 mt-1 text-right">
            {input.length} / 4000
          </p>
        </div>

        {error && <ErrorBanner message={error} onRetry={() => setError('')} />}

        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/40 text-white font-semibold text-sm transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Analysing…
            </>
          ) : (
            'Analyse Now'
          )}
        </button>
      </form>

      {loading && (
        <div className="flex justify-center py-4">
          <Spinner label="Sending to backend for analysis…" />
        </div>
      )}
    </div>
  );
}
