/**
 * ReportConfirmPage — cryptographic incident receipt.
 * Styled with Unlumen AI aesthetic: Monospaced receipt block, verified hash badge,
 * copy-to-clipboard functionality, and audit trail confirmation.
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
      <div className="max-w-sm mx-auto text-center py-20 space-y-4 float-in">
        <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center mx-auto text-slate-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
        <p className="text-slate-400 text-sm">No report receipt found in current session memory.</p>
        <Link
          to="/"
          className="inline-block px-4 py-2 rounded-xl glass border border-white/10 text-cyan-400 text-xs font-semibold"
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
    <div className="max-w-sm mx-auto space-y-6 py-4 float-in">
      {/* Verified Shield Badge */}
      <div className="flex justify-center">
        <div className="relative w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(52,211,153,0.25)]">
          <div className="absolute inset-2 rounded-2xl bg-emerald-500/10 blur-sm" />
          <svg
            className="w-10 h-10 text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]"
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

      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Evidence Sealed
        </h1>
        <p className="text-xs text-slate-400 max-w-xs mx-auto">
          Your incident submission has been logged into the campus security queue with tamper-evident hashing.
        </p>
      </div>

      {/* Cryptographic Receipt Card */}
      <div className="rounded-3xl glass-strong border border-white/10 p-5 space-y-4 shadow-2xl relative overflow-hidden">
        {/* Specular top line */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent" />

        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400">
            Dossier Status
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {report.status.toUpperCase()}
          </span>
        </div>

        <div className="space-y-3 text-xs font-mono">
          <div>
            <p className="text-[10px] uppercase text-slate-500 tracking-wider">Report Identifier</p>
            <p className="text-slate-200 select-all font-semibold mt-0.5">{report.report_id}</p>
          </div>

          <div>
            <p className="text-[10px] uppercase text-slate-500 tracking-wider">Timestamp Logged</p>
            <p className="text-slate-300 mt-0.5">
              {new Date(report.created_at).toLocaleString()}
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase text-slate-500 tracking-wider">
                Evidence SHA-256 Checksum
              </span>
              <button
                onClick={copyHash}
                className="text-[10px] text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer flex items-center gap-1"
              >
                {copied ? '✓ Copied' : 'Copy Hash'}
              </button>
            </div>
            <code className="block text-[11px] text-cyan-300/90 break-all bg-slate-950/80 rounded-xl p-3 border border-white/5 select-all">
              {report.evidence_sha256}
            </code>
            <p className="text-[10px] text-slate-500 mt-1.5 leading-normal">
              This cryptographic digest guarantees the reported threat bytes remain unaltered during administrative review.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        <Link
          to="/"
          className="w-full btn-glow py-3.5 px-4 rounded-2xl font-semibold text-sm text-white text-center cursor-pointer"
        >
          Return to Mission Dashboard
        </Link>
        <Link
          to="/scan"
          className="w-full py-3 px-4 rounded-2xl glass border border-white/10 text-slate-300 hover:text-white text-xs font-medium text-center transition-colors"
        >
          Scan Another QR Code
        </Link>
      </div>
    </div>
  );
}
