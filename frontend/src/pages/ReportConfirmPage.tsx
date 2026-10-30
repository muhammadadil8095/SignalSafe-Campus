/**
 * ReportConfirmPage — Clean, professional evidence confirmation receipt.
 */
import { useLocation, Link } from 'react-router-dom';
import { useState } from 'react';
import type { ReportResponse } from '../types/api';

interface LocationState {
  report: ReportResponse;
}

export default function ReportConfirmPage() {
  const location = useLocation();
  const state = location.state as LocationState | null;
  const report = state?.report;
  const [copied, setCopied] = useState(false);

  if (!report) {
    return (
      <div className="max-w-sm mx-auto text-center py-16 space-y-3">
        <p className="text-slate-400 text-sm">No report submission data found.</p>
        <Link
          to="/"
          className="inline-block px-3 py-1.5 rounded-lg bg-slate-800 text-blue-400 text-xs font-semibold"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const copyHash = async () => {
    try {
      await navigator.clipboard.writeText(report.evidence_sha256);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="max-w-sm mx-auto space-y-5 py-2">
      {/* Success Icon */}
      <div className="flex justify-center">
        <div className="w-14 h-14 rounded-full bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
      </div>

      <div className="text-center space-y-1">
        <h1 className="text-xl font-bold text-white">
          Report Logged
        </h1>
        <p className="text-xs text-slate-400">
          Incident received and queued for campus administration review.
        </p>
      </div>

      {/* Details Box */}
      <div className="card-clean rounded-xl p-5 space-y-3 text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <span className="text-slate-400 uppercase font-semibold text-[10px]">Status</span>
          <span className="badge-green px-2 py-0.5 rounded text-xs font-semibold">
            {report.status.toUpperCase()}
          </span>
        </div>

        <div>
          <p className="text-slate-400 uppercase text-[10px] font-semibold">Report Identifier</p>
          <p className="text-slate-200 font-mono text-xs mt-0.5 select-all">{report.report_id}</p>
        </div>

        <div>
          <p className="text-slate-400 uppercase text-[10px] font-semibold">Logged Timestamp</p>
          <p className="text-slate-300 text-xs mt-0.5">
            {new Date(report.created_at).toLocaleString()}
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-slate-400 uppercase text-[10px] font-semibold">
              Evidence SHA-256 Checksum
            </span>
            <button
              onClick={copyHash}
              className="text-[11px] text-blue-400 hover:text-blue-300 font-medium cursor-pointer"
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
          <code className="block text-[11px] font-mono text-slate-300 break-all bg-slate-900 rounded p-2.5 border border-slate-800 select-all">
            {report.evidence_sha256}
          </code>
          <p className="text-[10px] text-slate-500 mt-1">
            Cryptographic digest verifying the evidence payload remains unaltered.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <Link
          to="/"
          className="w-full btn-primary py-2.5 px-4 rounded-lg text-xs font-medium text-center block"
        >
          Return to Dashboard
        </Link>
        <Link
          to="/scan"
          className="w-full btn-secondary py-2 px-4 rounded-lg text-xs font-medium text-center block"
        >
          Scan Another QR Code
        </Link>
      </div>
    </div>
  );
}
