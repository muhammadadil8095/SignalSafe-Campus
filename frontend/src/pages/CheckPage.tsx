/**
 * CheckPage — Swiss luxury-brutalist threat vector inspector.
 */
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
    badge: 'LEXICAL ML',
    placeholder: 'https://campus-verify-fees.xyz/portal/login',
    hint: 'Evaluates IP hosts, punycode, typosquatting & official domain allowlist.',
  },
  {
    value: 'message',
    label: 'SMS / Text',
    badge: 'HEURISTICS',
    placeholder: 'URGENT: Dean of Students office requires verification of your hall pass immediately...',
    hint: 'Flags authority impersonation, artificial urgency, and deceptive link mismatches.',
  },
  {
    value: 'payment',
    label: 'Fee Demand',
    badge: 'SYNTHETIC RULES',
    placeholder: 'Hostel dues pending: Pay 4,500 INR to registrar-helpdesk@okhdfcbank before 5 PM today.',
    hint: 'Evaluates unverified VPA formats, direct transfer solicitations, and panic triggers.',
  },
  {
    value: 'bullying',
    label: 'Harassment',
    badge: 'LEXICON MATCH',
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
    <div className="max-w-lg mx-auto space-y-6 px-4 py-8 font-satoshi">
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
          INFERENCE PIPELINE
        </span>
      </div>

      {/* Header */}
      <div>
        <h1 className="font-clash text-3xl font-bold tracking-tight text-[#111111]">
          Threat Inspector
        </h1>
        <p className="text-xs text-[#838282] mt-1 leading-relaxed">
          Submit suspicious links, texts, or fee notices. Analysis is processed through centralized detection models.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Classification Choice Grid */}
        <fieldset className="space-y-1.5">
          <legend className="text-xs font-mono uppercase tracking-wider text-[#838282]">
            SELECT THREAT VECTOR
          </legend>
          <div className="grid grid-cols-2 gap-2">
            {KIND_OPTIONS.map((opt) => {
              const active = kind === opt.value;
              return (
                <label
                  key={opt.value}
                  className={`flex flex-col justify-between p-3.5 border cursor-pointer transition-colors select-none ${
                    active
                      ? 'border-[#111111] bg-[#111111] text-[#f2f2f2]'
                      : 'border-[#1e1e1e]/15 bg-[#ffffff] text-[#111111] hover:border-[#1e1e1e]/40'
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
                    <span className="text-xs font-bold uppercase tracking-tight">{opt.label}</span>
                    <span className={`w-1.5 h-1.5 ${active ? 'bg-[#f2f2f2]' : 'bg-[#111111]'}`} />
                  </div>
                  <span className={`text-[9px] font-mono tracking-wider ${active ? 'text-[#b6b5b5]' : 'text-[#838282]'}`}>
                    {opt.badge}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {/* Input Textarea Container */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="check-input"
              className="text-xs font-mono uppercase tracking-wider text-[#838282]"
            >
              PAYLOAD CONTENT
            </label>
            <span className="text-xs font-mono text-[#838282]">
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
            className="w-full bg-[#ffffff] border border-[#1e1e1e] p-3 text-xs sm:text-sm font-mono text-[#111111] placeholder-[#b6b5b5] focus:outline-none focus:ring-1 focus:ring-[#111111] resize-none leading-relaxed"
          />
          <p className="text-[11px] text-[#838282]">
            {currentOption.hint}
          </p>
        </div>

        {error && <ErrorBanner message={error} onRetry={() => setError('')} />}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="w-full pill-button-invert py-3 px-6 text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span>Evaluating Threat Vector…</span>
          ) : (
            <>
              <span>Execute Threat Evaluation</span>
              <span>→</span>
            </>
          )}
        </button>
      </form>

      {loading && (
        <div className="border border-[#1e1e1e] bg-[#ffffff] p-6">
          <Spinner label="EXECUTING LEXICAL ATTRIBUTION & CLASSIFICATION…" />
        </div>
      )}
    </div>
  );
}
