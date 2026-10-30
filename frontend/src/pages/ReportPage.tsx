/**
 * ReportPage — Clear, student-friendly incident reporting form.
 */
import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import type { ReportCategory, ReportSeverity, RiskLevel } from '../types/api';
import ErrorBanner from '../components/ErrorBanner';

interface LocationState {
  check_id: string;
  risk: RiskLevel;
}

const CATEGORIES: { value: ReportCategory; label: string; desc: string }[] = [
  { value: 'phishing', label: 'Fake Login Website / Phishing', desc: 'A counterfeit university website or form trying to steal student passwords or OTPs.' },
  { value: 'qr', label: 'Suspicious QR Code Sticker', desc: 'A physical sticker found on campus noticeboards, payment counters, or desks.' },
  { value: 'payment', label: 'Payment or Fee Scam', desc: 'An unauthorized message asking you to pay fees or fines to an unfamiliar personal UPI ID.' },
  { value: 'bullying', label: 'Online Harassment or Bullying', desc: 'Threatening, abusive, or harmful messages sent in campus group chats or forums.' },
  { value: 'other', label: 'Other Suspicious Incident', desc: 'Any other security concern or suspicious message that needs university review.' },
];

const SEVERITIES: { value: ReportSeverity; label: string; hint: string }[] = [
  { value: 'low', label: 'LOW', hint: 'Minor nuisance or unsolicited spam' },
  { value: 'medium', label: 'MEDIUM', hint: 'Suspicious link with potential risk' },
  { value: 'high', label: 'HIGH', hint: 'Actively attempting to steal logins or money' },
  { value: 'critical', label: 'CRITICAL', hint: 'Immediate danger or large-scale attack' },
];

export default function ReportPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;

  const [category, setCategory] = useState<ReportCategory>('phishing');
  const [severity, setSeverity] = useState<ReportSeverity>('medium');
  const [note, setNote] = useState('');
  const [pseudonymous, setPseudonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const checkId = state?.check_id ?? '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkId) return;

    setLoading(true);
    setError('');
    try {
      const result = await api.submitReport({
        check_id: checkId,
        category,
        severity,
        note: note.trim() || undefined,
        pseudonymous,
      });
      navigate('/report-confirm', { state: { report: result } });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to submit incident report. Please verify connection.',
      );
    } finally {
      setLoading(false);
    }
  };

  if (!checkId) {
    return (
      <div className="max-w-md mx-auto text-center py-20 space-y-4 font-satoshi">
        <p className="text-[#838282] text-sm">No recent threat check attached. Please scan or check an item first.</p>
        <Link
          to="/"
          className="pill-button-invert inline-block px-6 py-2.5 text-xs uppercase tracking-wider font-bold"
        >
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6 px-4 py-8 font-satoshi">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1e1e1e]/10">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs uppercase font-bold tracking-wider text-[#111111] hover:text-[#838282] transition-colors"
        >
          <span>←</span>
          <span>Back to Verdict</span>
        </button>

        <span className="font-mono text-[11px] uppercase tracking-widest text-[#838282]">
          CAMPUS SECURITY DISPATCH
        </span>
      </div>

      <div>
        <h1 className="font-clash text-3xl font-bold tracking-tight text-[#111111]">
          Report a Threat to Security
        </h1>
        <p className="text-xs text-[#838282] mt-1.5 leading-relaxed">
          Reporting suspicious links, stickers, or messages helps campus authorities take down scams and warn other students quickly.
        </p>

        <div className="mt-2 text-xs font-mono text-[#838282]">
          ATTACHED CHECK ID: <code className="text-[#111111] font-bold">{checkId}</code>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Category */}
        <div className="space-y-1.5">
          <label
            htmlFor="report-category"
            className="text-xs font-mono uppercase tracking-wider text-[#838282] block"
          >
            1. WHAT TYPE OF INCIDENT IS THIS?
          </label>
          <select
            id="report-category"
            value={category}
            onChange={(e) => setCategory(e.target.value as ReportCategory)}
            className="w-full bg-[#ffffff] border border-[#1e1e1e] p-3 text-xs sm:text-sm font-medium text-[#111111] focus:outline-none focus:ring-1 focus:ring-[#111111] cursor-pointer"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-[#838282]">
            {CATEGORIES.find((c) => c.value === category)?.desc}
          </p>
        </div>

        {/* Severity */}
        <fieldset className="space-y-1.5">
          <legend className="text-xs font-mono uppercase tracking-wider text-[#838282]">
            2. HOW URGENT OR DANGEROUS IS IT?
          </legend>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SEVERITIES.map((s) => {
              const active = severity === s.value;
              return (
                <label
                  key={s.value}
                  className={`flex flex-col items-center justify-center p-3 border text-center cursor-pointer transition-colors ${
                    active
                      ? 'bg-[#111111] text-[#f2f2f2] border-[#111111]'
                      : 'bg-[#ffffff] text-[#111111] border-[#1e1e1e]/20 hover:border-[#1e1e1e]/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="severity"
                    value={s.value}
                    checked={active}
                    onChange={() => setSeverity(s.value)}
                    className="sr-only"
                  />
                  <span className="text-xs font-mono font-bold">{s.label}</span>
                  <span className={`text-[9px] mt-0.5 ${active ? 'text-[#b6b5b5]' : 'text-[#838282]'}`}>
                    {s.hint}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {/* Note */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="report-note"
              className="text-xs font-mono uppercase tracking-wider text-[#838282]"
            >
              3. EXTRA CONTEXT <span className="normal-case text-slate-500">(Optional)</span>
            </label>
            <span className="text-xs font-mono text-[#838282]">
              {note.length} / 2000
            </span>
          </div>
          <textarea
            id="report-note"
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Tell us where you saw this (e.g. sticker on Science Building 2nd floor, or text message from +91 98xxx)..."
            maxLength={2000}
            className="w-full bg-[#ffffff] border border-[#1e1e1e] p-3 text-xs sm:text-sm text-[#111111] placeholder-[#b6b5b5] focus:outline-none focus:ring-1 focus:ring-[#111111] resize-none leading-relaxed"
          />
        </div>

        {/* Anonymous Submission */}
        <div className="p-4 bg-[#ffffff] border border-[#1e1e1e]/20 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#111111]">
              Submit Anonymously
            </p>
            <p className="text-[11px] text-[#838282]">
              Your student name and identity will not be shared with campus review staff.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={pseudonymous}
              onChange={(e) => setPseudonymous(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-10 h-5 bg-[#b6b5b5] rounded-full peer peer-checked:bg-[#111111] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
          </label>
        </div>

        {error && <ErrorBanner message={error} onRetry={() => setError('')} />}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full pill-button-invert py-3 px-6 text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
        >
          {loading ? 'Submitting to security team…' : 'Submit Report to Campus Security →'}
        </button>
      </form>
    </div>
  );
}
