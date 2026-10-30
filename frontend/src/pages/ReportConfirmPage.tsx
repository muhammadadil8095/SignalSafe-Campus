/**
 * ReportConfirmPage — Swiss luxury-brutalist cryptographic evidence receipt.
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
      <div className="max-w-md mx-auto text-center py-20 space-y-4 font-satoshi">
        <p className="text-[#838282] text-sm">No report submission data found.</p>
        <Link
          to="/"
          className="pill-button-invert inline-block px-6 py-2.5 text-xs uppercase tracking-wider font-bold"
        >
          Return to Overview
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
    <div className="max-w-md mx-auto space-y-6 px-4 py-8 font-satoshi">
      {/* Icon Badge */}
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-full border-2 border-[#111111] flex items-center justify-center font-clash text-2xl font-bold text-[#111111]">
          ✓
        </div>
      </div>

      <div className="text-center space-y-1">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#838282]">
          AUDIT CHAIN SEALED
        </span>
        <h1 className="font-clash text-3xl font-bold tracking-tight text-[#111111]">
          Evidence Receipt
        </h1>
        <p className="text-xs text-[#838282] max-w-xs mx-auto">
          The threat evidence has been cryptographically signed and queued for campus administrator review.
        </p>
      </div>

      {/* Structured Receipt Box */}
      <div className="border border-[#1e1e1e] bg-[#ffffff] p-6 space-y-4 text-xs font-mono shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-[#1e1e1e]/15">
          <span className="text-[#838282] uppercase text-[10px]">INCIDENT STATUS</span>
          <span className="bg-[#111111] text-[#f2f2f2] px-2 py-0.5 text-[11px] font-bold">
            {report.status.toUpperCase()}
          </span>
        </div>

        <div>
          <p className="text-[#838282] uppercase text-[10px]">RECORD IDENTIFIER</p>
          <p className="text-[#111111] font-bold select-all mt-0.5">{report.report_id}</p>
        </div>

        <div>
          <p className="text-[#838282] uppercase text-[10px]">TIMESTAMP RECORDED</p>
          <p className="text-[#111111] mt-0.5">
            {new Date(report.created_at).toLocaleString()}
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[#838282] uppercase text-[10px]">
              EVIDENCE SHA-256 DIGEST
            </span>
            <button
              onClick={copyHash}
              className="text-[11px] font-bold text-[#111111] underline underline-offset-2 hover:text-[#838282] cursor-pointer"
            >
              {copied ? 'COPIED ✓' : 'COPY'}
            </button>
          </div>
          <code className="block text-[11px] bg-[#f2f2f2] p-3 border border-[#1e1e1e]/20 text-[#111111] break-all select-all font-mono leading-relaxed">
            {report.evidence_sha256}
          </code>
          <p className="text-[10px] text-[#838282] mt-1.5 leading-normal">
            This SHA-256 digest acts as a mathematical guarantee that the submitted evidence remains unaltered in the audit log.
          </p>
        </div>
      </div>

      {/* Return Actions */}
      <div className="space-y-3">
        <Link
          to="/"
          className="w-full pill-button-invert py-3 px-6 text-xs uppercase tracking-widest font-bold text-center block"
        >
          Return to Overview
        </Link>
        <Link
          to="/scan"
          className="w-full border border-[#1e1e1e]/30 bg-[#ffffff] text-[#111111] hover:bg-[#f2f2f2] py-2.5 px-4 text-xs uppercase tracking-wider font-bold text-center block transition-colors"
        >
          Scan Another QR Code
        </Link>
      </div>
    </div>
  );
}
