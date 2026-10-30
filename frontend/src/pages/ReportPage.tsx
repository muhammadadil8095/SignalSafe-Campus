/**
 * ReportPage — submit a security incident report.
 * Linked from VerdictPage; carries check_id via router state.
 * Evidence upload uses approved private-storage flow (backend handles SHA-256).
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

const CATEGORIES: { value: ReportCategory; label: string }[] = [
  { value: 'phishing', label: 'Phishing / fake login' },
  { value: 'qr', label: 'Malicious QR code' },
  { value: 'payment', label: 'Payment / UPI fraud' },
  { value: 'bullying', label: 'Cyberbullying / harassment' },
  { value: 'other', label: 'Other' },
];

const SEVERITIES: { value: ReportSeverity; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: 'text-emerald-400' },
  { value: 'medium', label: 'Medium', color: 'text-amber-400' },
  { value: 'high', label: 'High', color: 'text-orange-400' },
  { value: 'critical', label: 'Critical', color: 'text-red-400' },
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
        err instanceof Error ? err.message : 'Failed to submit report. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  if (!checkId) {
    return (
      <div className="max-w-sm mx-auto text-center py-16 space-y-4">
        <p className="text-slate-400">No analysis result linked. Please analyse something first.</p>
        <button
          onClick={() => navigate('/')}
          className="text-blue-400 underline text-sm hover:text-blue-300"
        >
          Go home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-slate-400 hover:text-slate-300 mb-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          Back
        </button>
        <h1 className="text-xl font-bold text-white">Report a Threat</h1>
        <p className="text-slate-400 text-sm mt-1">
          Reporting helps protect others. Your report is linked to the scan result.
        </p>
        <p className="text-xs text-slate-600 mt-1">
          Check ID: <code className="text-slate-500">{checkId}</code>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Category */}
        <div>
          <label
            htmlFor="report-category"
            className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2"
          >
            Category
          </label>
          <select
            id="report-category"
            value={category}
            onChange={(e) => setCategory(e.target.value as ReportCategory)}
            className="w-full rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-200 text-sm px-4 py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Severity */}
        <fieldset>
          <legend className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
            Severity
          </legend>
          <div className="grid grid-cols-4 gap-2">
            {SEVERITIES.map((s) => (
              <label
                key={s.value}
                className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border cursor-pointer text-xs transition-colors duration-150 ${
                  severity === s.value
                    ? 'bg-slate-700/60 border-slate-500/60'
                    : 'bg-slate-800/40 border-slate-700/40 hover:bg-slate-800/70'
                }`}
              >
                <input
                  type="radio"
                  name="severity"
                  value={s.value}
                  checked={severity === s.value}
                  onChange={() => setSeverity(s.value)}
                  className="sr-only"
                />
                <span className={`font-semibold ${s.color}`}>{s.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Note */}
        <div>
          <label
            htmlFor="report-note"
            className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2"
          >
            Additional context <span className="font-normal normal-case text-slate-600">(optional)</span>
          </label>
          <textarea
            id="report-note"
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Where did you encounter this? Any other context that might help the admin team…"
            maxLength={2000}
            className="w-full rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-200 placeholder-slate-600 text-sm px-4 py-3 resize-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition"
          />
          <p className="text-xs text-slate-600 mt-1 text-right">{note.length} / 2000</p>
        </div>

        {/* Pseudonymous toggle */}
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              checked={pseudonymous}
              onChange={(e) => setPseudonymous(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-10 h-6 rounded-full bg-slate-700 peer-checked:bg-blue-600 transition-colors" />
            <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform peer-checked:translate-x-4" />
          </div>
          <div>
            <p className="text-sm text-slate-300 font-medium">Submit anonymously</p>
            <p className="text-xs text-slate-500">
              Your identity will not be visible to administrators.
            </p>
          </div>
        </label>

        {error && <ErrorBanner message={error} onRetry={() => setError('')} />}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/40 text-white font-semibold text-sm transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Submitting…
            </>
          ) : (
            'Submit Report'
          )}
        </button>
      </form>
    </div>
  );
}
