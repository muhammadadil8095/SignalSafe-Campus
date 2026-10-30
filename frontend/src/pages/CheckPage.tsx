/**
 * CheckPage — Clean, professional input form for analyzing URLs, messages,
 * payment requests, and harassment text.
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
    hint: 'Evaluates IP hosts, punycode, entropy, and campus official allowlist.',
  },
  {
    value: 'message',
    label: 'SMS / Text',
    badge: 'Heuristics',
    placeholder: 'URGENT: Dean of Students office requires verification of your hall pass immediately...',
    hint: 'Identifies authority impersonation, artificial urgency, and link discrepancies.',
  },
  {
    value: 'payment',
    label: 'UPI / Fee Demand',
    badge: 'Rule Engine',
    placeholder: 'Hostel dues overdue: Send 4,500 INR to registrar-office@okhdfcbank before 5 PM today.',
    hint: 'Flags unverified VPAs and direct fund transfer coercion.',
  },
  {
    value: 'bullying',
    label: 'Harassment',
    badge: 'Lexicon Match',
    placeholder: 'Paste the abusive or threatening text message received on campus channels...',
    hint: 'Detects hostile patterns and cyberbullying markers.',
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
    <div className="max-w-lg mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-bold text-white">
          Inspect Threat Vector
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Inference performed by the centralized FastAPI threat engine.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Classification Selector */}
        <fieldset className="space-y-1.5">
          <legend className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Vector Type
          </legend>
          <div className="grid grid-cols-2 gap-2">
            {KIND_OPTIONS.map((opt) => {
              const active = kind === opt.value;
              return (
                <label
                  key={opt.value}
                  className={`flex flex-col justify-between p-3 rounded-lg border cursor-pointer transition-colors select-none ${
                    active
                      ? 'bg-blue-950/40 border-blue-500/60 text-white'
                      : 'card-clean text-slate-400 hover:border-slate-700 hover:text-slate-200'
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
                    <span className="text-xs font-semibold">{opt.label}</span>
                    <span className={`w-2 h-2 rounded-full ${active ? 'bg-blue-400' : 'bg-slate-700'}`} />
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">
                    {opt.badge}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {/* Input Textarea */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="check-input"
              className="text-xs font-semibold uppercase tracking-wider text-slate-400"
            >
              Payload Text
            </label>
            <span className="text-xs font-mono text-slate-500">
              {input.length} / 4000
            </span>
          </div>

          <textarea
            id="check-input"
            rows={5}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={currentOption.placeholder}
            required
            maxLength={4000}
            className="w-full rounded-lg bg-slate-900 border border-slate-700 p-3 text-slate-200 placeholder-slate-500 text-xs sm:text-sm font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
          />
          <p className="text-[11px] text-slate-400">
            {currentOption.hint}
          </p>
        </div>

        {error && <ErrorBanner message={error} onRetry={() => setError('')} />}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="w-full btn-primary py-2.5 px-4 rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Evaluating Payload…' : 'Analyze Threat'}
        </button>
      </form>

      {loading && (
        <div className="card-clean rounded-xl p-6">
          <Spinner label="Executing detection rules & ML inference…" />
        </div>
      )}
    </div>
  );
}
