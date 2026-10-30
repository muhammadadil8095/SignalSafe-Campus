/**
 * ReportPage — Incident submission form with clean, professional enterprise styling.
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
  { value: 'phishing', label: 'Credential Phishing', desc: 'Counterfeit login portals or student account compromise.' },
  { value: 'qr', label: 'Physical Malicious QR', desc: 'Tampered exam fee, cafeteria, or noticeboard QR stickers.' },
  { value: 'payment', label: 'Financial / UPI Fraud', desc: 'Unauthorized fee demands or fraudulent UPI solicitations.' },
  { value: 'bullying', label: 'Harassment / Threats', desc: 'Intimidation or hostile text on campus channels.' },
  { value: 'other', label: 'Unclassified Threat', desc: 'Other security anomalies or suspicious activity.' },
];

const SEVERITIES: { value: ReportSeverity; label: string; activeClass: string; color: string }[] = [
  { value: 'low', label: 'Low', activeClass: 'border-emerald-500 bg-emerald-950/30 text-emerald-300', color: 'text-emerald-400' },
  { value: 'medium', label: 'Medium', activeClass: 'border-amber-500 bg-amber-950/30 text-amber-300', color: 'text-amber-400' },
  { value: 'high', label: 'High', activeClass: 'border-orange-500 bg-orange-950/30 text-orange-300', color: 'text-orange-400' },
  { value: 'critical', label: 'Critical', activeClass: 'border-red-500 bg-red-950/30 text-red-300', color: 'text-red-400' },
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
      <div className="max-w-sm mx-auto text-center py-16 space-y-3">
        <p className="text-slate-400 text-sm">No analysis result linked to this report.</p>
        <button
          onClick={() => navigate('/')}
          className="px-3 py-1.5 rounded-lg bg-slate-800 text-blue-400 text-xs font-semibold"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-2"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          Back
        </button>
        <h1 className="text-xl font-bold text-white">
          Submit Incident Report
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Escalates findings to authorized campus security personnel with preserved evidence hash.
        </p>

        <div className="mt-2 text-xs font-mono text-slate-400">
          Attached Check ID: <code className="text-slate-200">{checkId}</code>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Category */}
        <div className="space-y-1.5">
          <label
            htmlFor="report-category"
            className="text-xs font-semibold uppercase tracking-wider text-slate-400 block"
          >
            Threat Category
          </label>
          <select
            id="report-category"
            value={category}
            onChange={(e) => setCategory(e.target.value as ReportCategory)}
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2.5 text-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value} className="bg-slate-900 text-white">
                {c.label}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-slate-400">
            {CATEGORIES.find((c) => c.value === category)?.desc}
          </p>
        </div>

        {/* Severity */}
        <fieldset className="space-y-1.5">
          <legend className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Severity Rating
          </legend>
          <div className="grid grid-cols-4 gap-2">
            {SEVERITIES.map((s) => {
              const active = severity === s.value;
              return (
                <label
                  key={s.value}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                    active
                      ? s.activeClass
                      : 'card-clean text-slate-400 hover:border-slate-700'
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
                  <span>{s.label}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {/* Context Note */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="report-note"
              className="text-xs font-semibold uppercase tracking-wider text-slate-400"
            >
              Additional Information <span className="font-normal text-slate-500">(Optional)</span>
            </label>
            <span className="text-xs font-mono text-slate-500">
              {note.length} / 2000
            </span>
          </div>
          <textarea
            id="report-note"
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Describe where this QR was found, sender details, or affected students..."
            maxLength={2000}
            className="w-full rounded-lg bg-slate-900 border border-slate-700 p-3 text-slate-200 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none leading-relaxed"
          />
        </div>

        {/* Pseudonymous Toggle */}
        <div className="card-clean rounded-lg p-3.5 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-white">
              Anonymous Submission
            </p>
            <p className="text-[11px] text-slate-400">
              Hides your identity from campus triage officers.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={pseudonymous}
              onChange={(e) => setPseudonymous(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-10 h-5 bg-slate-800 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
          </label>
        </div>

        {error && <ErrorBanner message={error} onRetry={() => setError('')} />}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary py-2.5 px-4 rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:opacity-50"
        >
          {loading ? 'Submitting Report…' : 'Submit Incident Report'}
        </button>
      </form>
    </div>
  );
}
