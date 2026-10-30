/**
 * CheckPage — manual input inspector for suspicious URLs, messages, payment requests,
 * or harassment.
 * Styled with Magic UI segmented selector and frosted glass inputs.
 * Backend serves as the single source of truth for threat verdicts.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import type { AnalysisKind, AnalysisResponse } from '../types/api';
import ErrorBanner from '../components/ErrorBanner';
import Spinner from '../components/Spinner';

interface Option {
  value: AnalysisKind;
  label: string;
  badge: string;
  placeholder: string;
  hint: string;
}

const KIND_OPTIONS: Option[] = [
  {
    value: 'url',
    label: 'Link / URL',
    badge: 'Lexical ML',
    placeholder: 'https://campus-verify-fees.xyz/portal/login',
    hint: 'Checks for IP hosts, punycode, typosquatting & official domain allowlist.',
  },
  {
    value: 'message',
    label: 'SMS / Text',
    badge: 'Heuristics',
    placeholder: 'URGENT: Dean of Students office requires verification of exam hall pass immediately or face cancellation...',
    hint: 'Flags authority impersonation, artificial urgency, and deceptive link mismatches.',
  },
  {
    value: 'payment',
    label: 'UPI / Fee',
    badge: 'Synthetic Rule',
    placeholder: 'Hostel dues pending: Pay 4,500 INR to registrar-helpdesk@okhdfcbank before 5 PM today.',
    hint: 'Evaluates unverified VPA formats, direct transfer solicitations and panic triggers.',
  },
  {
    value: 'bullying',
    label: 'Harassment',
    badge: 'Lexicon Match',
    placeholder: 'Paste the abusive or threatening text you received on campus channels...',
    hint: 'Scans for toxic patterns and harassment keywords.',
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
        err instanceof Error
          ? err.message
          : 'Threat inspection failed. Please verify API gateway availability.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-6 float-in">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Inspect Suspicious Artifact
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Analyzed by the centralized security backend. No heuristic decisions made in the browser.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Magic UI Style Segmented Vector Selector */}
        <fieldset className="space-y-2">
          <legend className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
            Vector Classification
          </legend>
          <div className="grid grid-cols-2 gap-2">
            {KIND_OPTIONS.map((opt) => {
              const active = kind === opt.value;
              return (
                <label
                  key={opt.value}
                  className={`relative flex flex-col justify-between p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 select-none ${
                    active
                      ? 'bg-blue-600/15 border-blue-400/50 shadow-[0_0_20px_rgba(59,130,246,0.2)]'
                      : 'glass border-white/5 text-slate-400 hover:border-white/15'
                  }`}
                >
                  <input
                    type="radio"
                    name="kind"
                    value={opt.value}
                    checked={active}
                    onChange={() => setKind(opt.value)}
                    className="sr-only"
                  />
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-semibold ${active ? 'text-white' : 'text-slate-300'}`}>
                      {opt.label}
                    </span>
                    <span className={`w-2 h-2 rounded-full ${active ? 'bg-cyan-400 animate-pulse' : 'bg-slate-700'}`} />
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">
                    {opt.badge}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {/* Input Textarea Container */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="check-input"
              className="text-[11px] font-mono uppercase tracking-widest text-slate-400"
            >
              Payload Input
            </label>
            <span className="text-[11px] font-mono text-slate-500">
              {input.length} / 4000
            </span>
          </div>

          <div className="relative rounded-3xl glass p-1 focus-within:ring-2 focus-within:ring-cyan-400/50 transition-all">
            <textarea
              id="check-input"
              rows={5}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={currentOption.placeholder}
              required
              maxLength={4000}
              className="w-full rounded-2xl bg-slate-950/60 p-4 text-slate-200 placeholder-slate-600 text-xs sm:text-sm font-mono border-0 focus:outline-none resize-none"
            />
          </div>
          <p className="text-[11px] text-slate-400 px-1">
            {currentOption.hint}
          </p>
        </div>

        {error && <ErrorBanner message={error} onRetry={() => setError('')} />}

        {/* Submission CTA */}
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="w-full btn-glow py-3.5 px-4 rounded-2xl font-semibold text-sm text-white flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>Querying Inference Engine…</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <span>Evaluate Threat Vector</span>
            </>
          )}
        </button>
      </form>

      {loading && (
        <div className="rounded-3xl glass p-6">
          <Spinner label="Executing multi-layer risk scoring…" />
        </div>
      )}
    </div>
  );
}
