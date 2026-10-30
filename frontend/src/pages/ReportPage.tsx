/**
 * ReportPage — submit a formal campus threat incident dossier.
 * Carries check_id from VerdictPage to ensure end-to-end evidence chain.
 * Styled with frosted glass cards and tactile selection pills.
 */
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import type { ReportCategory, ReportSeverity, RiskLevel } from '../types/api';
import ErrorBanner from '../components/ErrorBanner';

interface LocationState {
  check_id: string;
  risk: RiskLevel;
}

const CATEGORIES: { value: ReportCategory; label: string; desc: string }[] = [
  { value: 'phishing', label: 'Credential Phishing', desc: 'Counterfeit campus login portals or identity theft.' },
  { value: 'qr', label: 'Physical Malicious QR', desc: 'Tampered exam fee, library or cafeteria QR stickers.' },
  { value: 'payment', label: 'Financial / UPI Fraud', desc: 'Direct VPA transfer coercion or fake stipend requests.' },
  { value: 'bullying', label: 'Harassment / Threats', desc: 'Hostile intimidation on student groups or forums.' },
  { value: 'other', label: 'Unclassified Threat', desc: 'Novel suspicious vector or anomaly.' },
];

const SEVERITIES: { value: ReportSeverity; label: string; ring: string; color: string }[] = [
  { value: 'low', label: 'Low', ring: 'peer-checked:border-emerald-400 peer-checked:bg-emerald-950/40', color: 'text-emerald-400' },
  { value: 'medium', label: 'Medium', ring: 'peer-checked:border-amber-400 peer-checked:bg-amber-950/40', color: 'text-amber-400' },
  { value: 'high', label: 'High', ring: 'peer-checked:border-orange-500 peer-checked:bg-orange-950/40', color: 'text-orange-400' },
  { value: 'critical', label: 'Critical', ring: 'peer-checked:border-rose-500 peer-checked:bg-rose-950/40', color: 'text-rose-400' },
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
          : 'Unable to submit incident report. Verify network connection.',
      );
    } finally {
      setLoading(false);
    }
  };

  if (!checkId) {
    return (
      <div className="max-w-sm mx-auto text-center py-20 space-y-4 float-in">
        <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center mx-auto text-slate-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
        </div>
        <p className="text-slate-400 text-sm">No threat check attached to this session.</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 rounded-xl glass border border-white/10 text-cyan-400 text-xs font-semibold"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6 float-in">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-3 px-3 py-1.5 rounded-xl glass border border-white/5"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          Back
        </button>

        <h1 className="text-2xl font-bold tracking-tight text-white">
          Submit Incident Report
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Escalate to authorized campus security administrators with preserved forensic evidence.
        </p>

        <div className="mt-2.5 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-950/60 border border-white/5 text-[11px] font-mono text-cyan-400">
          <span>Target Check:</span>
          <code className="text-slate-300 font-semibold">{checkId.slice(0, 12)}…</code>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Category Dropdown / Segmented View */}
        <div className="space-y-2">
          <label
            htmlFor="report-category"
            className="text-[11px] font-mono uppercase tracking-widest text-slate-400 block"
          >
            Incident Category
          </label>
          <div className="relative rounded-2xl glass p-1">
            <select
              id="report-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as ReportCategory)}
              className="w-full rounded-xl bg-slate-950/80 px-4 py-3 text-slate-200 text-xs sm:text-sm font-medium border-0 focus:outline-none focus:ring-1 focus:ring-cyan-400 cursor-pointer"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value} className="bg-slate-900 text-white">
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <p className="text-[11px] text-slate-400 px-1">
            {CATEGORIES.find((c) => c.value === category)?.desc}
          </p>
        </div>

        {/* Severity Matrix */}
        <fieldset className="space-y-2">
          <legend className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
            Perceived Severity Level
          </legend>
          <div className="grid grid-cols-4 gap-2">
            {SEVERITIES.map((s) => (
              <label
                key={s.value}
                className="relative cursor-pointer"
              >
                <input
                  type="radio"
                  name="severity"
                  value={s.value}
                  checked={severity === s.value}
                  onChange={() => setSeverity(s.value)}
                  className="sr-only peer"
                />
                <div
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl glass border border-white/5 transition-all text-xs font-semibold ${s.ring} hover:border-white/20`}
                >
                  <span className={s.color}>{s.label}</span>
                </div>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Contextual Forensics Note */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="report-note"
              className="text-[11px] font-mono uppercase tracking-widest text-slate-400"
            >
              Contextual Observations
            </label>
            <span className="text-[11px] font-mono text-slate-500">
              {note.length} / 2000
            </span>
          </div>
          <div className="rounded-3xl glass p-1 focus-within:ring-2 focus-within:ring-cyan-400/50 transition-all">
            <textarea
              id="report-note"
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Detail location of physical QR sticker, sender handle, email header clues, or affected classmates..."
              maxLength={2000}
              className="w-full rounded-2xl bg-slate-950/60 p-4 text-slate-200 placeholder-slate-600 text-xs sm:text-sm border-0 focus:outline-none resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Anonymous Submission Toggle */}
        <div className="p-4 rounded-3xl glass border border-white/10 flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <p className="text-xs font-semibold text-white">
              Pseudonymous Disclosure
            </p>
            <p className="text-[11px] text-slate-400 leading-normal">
              Obscures your student handle in administrative triage views.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={pseudonymous}
              onChange={(e) => setPseudonymous(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500 shadow-inner" />
          </label>
        </div>

        {error && <ErrorBanner message={error} onRetry={() => setError('')} />}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full btn-glow py-3.5 px-4 rounded-2xl font-semibold text-sm text-white flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>Sealing Cryptographic Evidence…</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
              <span>Commit Incident Report</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
