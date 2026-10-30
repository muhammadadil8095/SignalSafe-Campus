/**
 * ReportConfirmPage — shown after successful report submission.
 * Displays report ID, SHA-256 evidence hash, and status.
 */
import { useLocation, Link } from 'react-router-dom';
import type { ReportResponse } from '../types/api';

interface LocationState {
  report: ReportResponse;
}

export default function ReportConfirmPage() {
  const location = useLocation();
  const state = location.state as LocationState | null;
  const report = state?.report;

  if (!report) {
    return (
      <div className="max-w-sm mx-auto text-center py-16 space-y-4">
        <p className="text-slate-400">No report data found.</p>
        <Link to="/" className="text-blue-400 underline text-sm hover:text-blue-300">
          Go home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto space-y-6 py-4">
      {/* Success icon */}
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-emerald-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
      </div>

      <div className="text-center">
        <h1 className="text-xl font-bold text-white">Report Submitted</h1>
        <p className="text-slate-400 text-sm mt-2">
          Thank you for helping keep campus safe. An admin will review your report.
        </p>
      </div>

      {/* Report details card */}
      <div className="rounded-2xl bg-slate-800/60 border border-slate-700/60 p-5 space-y-4">
        <Detail label="Report ID" value={report.report_id} mono />
        <Detail label="Status" value={report.status} />
        <Detail label="Submitted at" value={new Date(report.created_at).toLocaleString()} />
        <div>
          <p className="text-xs text-slate-500 mb-1">Evidence hash (SHA-256)</p>
          <code className="block text-xs text-slate-400 break-all bg-slate-900/40 rounded-lg px-3 py-2">
            {report.evidence_sha256}
          </code>
          <p className="text-xs text-slate-600 mt-1">
            This hash proves the submitted evidence bytes have not changed since upload.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <Link
          to="/"
          className="w-full text-center px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          Done — go home
        </Link>
        <Link
          to="/scan"
          className="w-full text-center px-4 py-3 rounded-xl border border-slate-700/50 text-slate-400 hover:bg-slate-800/40 text-sm transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          Scan another QR code
        </Link>
      </div>
    </div>
  );
}

function Detail({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-xs text-slate-500 mb-0.5">{label}</p>
      <p className={`text-sm text-slate-200 break-all ${mono ? 'font-mono' : ''}`}>{value}</p>
    </div>
  );
}
