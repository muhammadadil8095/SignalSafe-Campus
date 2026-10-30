/**
 * HomePage — Designed with Snitch UX Clarity & Billboard Design 101 principles.
 * Clear affordances, zero unnecessary cognitive friction, and immediate action paths.
 */
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { checkHealth } from '../services/health';

export default function HomePage() {
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  useEffect(() => {
    checkHealth()
      .then(() => setBackendOnline(true))
      .catch(() => setBackendOnline(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Billboard Hero Header */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 text-xs px-2.5 py-1 rounded bg-slate-900 border border-slate-800 font-mono">
            {backendOnline === null && (
              <span className="text-slate-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" />
                Connecting to backend…
              </span>
            )}
            {backendOnline === true && (
              <span className="text-emerald-400 flex items-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Detection Engine Connected
              </span>
            )}
            {backendOnline === false && (
              <span className="text-rose-400 flex items-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                Backend Offline (Check port 8000)
              </span>
            )}
          </div>
          <span className="text-[11px] font-mono text-slate-500">Student Defense</span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Campus Threat Inspector
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed mt-1">
            Verify suspicious QR codes, links, fee payment requests, and harassment messages before taking action.
          </p>
        </div>
      </section>

      {/* Primary Action Doors (Gulf of Execution: Immediate, obvious starting points) */}
      <section aria-label="Action choices" className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          What would you like to inspect?
        </h2>

        <div className="grid grid-cols-1 gap-3">
          {/* Action 1: QR Scanner */}
          <Link
            to="/scan"
            className="card-interactive rounded-xl p-4 flex items-start gap-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <div className="w-11 h-11 rounded-lg bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 18.75h.75v.75h-.75v-.75ZM18.75 13.5h.75v.75h-.75v-.75ZM18.75 18.75h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z" />
              </svg>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-white text-sm sm:text-base">
                  Scan Physical QR Code
                </span>
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  On-Device
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-normal">
                Point camera at flyers, posters, or payment stickers. Decoded directly in your browser without uploading photos.
              </p>
            </div>

            <div className="text-slate-500 self-center pl-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </div>
          </Link>

          {/* Action 2: Text / Link Inspector */}
          <Link
            to="/check"
            className="card-interactive rounded-xl p-4 flex items-start gap-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <div className="w-11 h-11 rounded-lg bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-white text-sm sm:text-base">
                  Inspect Link, SMS, or Message
                </span>
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  ML Analysis
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-normal">
                Paste suspicious URLs, fake fee notices, or unsolicited messages for evidence-based threat verdicts and advice.
              </p>
            </div>

            <div className="text-slate-500 self-center pl-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </div>
          </Link>
        </div>
      </section>

      {/* Safety Policy & Trust Anchors */}
      <section className="card-clean rounded-xl p-4 space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
          <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.008v.008H12v-.008Z" />
          </svg>
          Campus Verification Standards
        </div>
        <ul className="space-y-1.5 text-xs text-slate-400">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0 mt-1.5" />
            <span>Campus finance and exam halls never request UPI payments through temporary physical QR stickers.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0 mt-1.5" />
            <span>All scans execute locally or call centralized detection models. Raw URLs are never visited by backends.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0 mt-1.5" />
            <span>Escalated threat reports generate an immutable SHA-256 evidence digest for campus security review.</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
