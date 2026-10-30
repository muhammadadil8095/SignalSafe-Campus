/**
 * CheckPage — Multi-vector threat inspector with comprehensive, easy-to-understand copy.
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
    label: 'Website Link / URL',
    badge: 'DOMAIN CHECK',
    placeholder: 'e.g. https://campus-verify-fees.xyz/portal/login',
    hint: 'Checks if the web address is fake, has strange spelling, or mimics an official college login page.',
  },
  {
    value: 'message',
    label: 'SMS or Text Message',
    badge: 'MESSAGE SCAN',
    placeholder: 'e.g. URGENT: Dean of Students office requires verification of your hall ticket immediately or your seat will be cancelled...',
    hint: 'Detects fake urgency, people pretending to be university officials, and deceptive links.',
  },
  {
    value: 'payment',
    label: 'Fee or Payment Request',
    badge: 'FINANCIAL FRAUD',
    placeholder: 'e.g. Hostel dues overdue: Please send 4,500 INR to registrar-helpdesk@okhdfcbank before 5 PM today...',
    hint: 'Flags unofficial UPI IDs, personal bank transfer requests, and fraudulent fine notices.',
  },
  {
    value: 'bullying',
    label: 'Harassment or Bullying',
    badge: 'HARASSMENT FILTER',
    placeholder: 'Paste the abusive or threatening text you received on campus channels or student groups...',
    hint: 'Screens for abusive language, threats, and cyberbullying patterns.',
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
          : 'Could not connect to the security engine right now. Please verify your internet connection or try again shortly.',
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
          <span>Back to Home</span>
        </Link>
        <span className="font-mono text-[11px] uppercase tracking-widest text-[#838282]">
          CHECK BEFORE CLICKING
        </span>
      </div>

      {/* Header */}
      <div>
        <h1 className="font-clash text-3xl font-bold tracking-tight text-[#111111]">
          Check a Link or Message
        </h1>
        <p className="text-xs text-[#838282] mt-1 leading-relaxed">
          Not sure if an SMS, link, or payment request is real? Paste it below to receive an instant, evidence-backed security check.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Choice Grid */}
        <fieldset className="space-y-1.5">
          <legend className="text-xs font-mono uppercase tracking-wider text-[#838282]">
            WHAT WOULD YOU LIKE TO CHECK?
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
              PASTE CONTENT HERE
            </label>
            <span className="text-xs font-mono text-[#838282]">
              {input.length} / 4000 characters
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
          <p className="text-[11px] text-[#838282] leading-relaxed">
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
            <span>Analyzing for threats…</span>
          ) : (
            <>
              <span>Check for Threats</span>
              <span>→</span>
            </>
          )}
        </button>
      </form>

      {loading && (
        <div className="border border-[#1e1e1e] bg-[#ffffff] p-6">
          <Spinner label="Scanning link patterns and checking university allowlist…" />
        </div>
      )}
    </div>
  );
}
