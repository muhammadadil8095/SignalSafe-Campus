/**
 * HomePage — Clean, professional campus cybersecurity portal.
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

  const ACTIONS = [
    {
      to: '/scan',
      label: 'Scan QR Code',
      badge: 'On-Device',
      description:
        'Point your camera at physical flyers, cafeteria posters, or payment stickers. Decoded locally in memory without uploading images.',
      icon: (
        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 18.75h.75v.75h-.75v-.75ZM18.75 13.5h.75v.75h-.75v-.75ZM18.75 18.75h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z" />
        </svg>
      ),
    },
    {
      to: '/check',
      label: 'Inspect URL / Text Message',
      badge: 'ML + Rules',
      description:
        'Analyze suspicious URLs, unsolicited payment demands, fake exam fee links, or harassing messages with instant explainable reasons.',
      icon: (
        <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <section className="text-left pt-2 pb-1 space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <div className="inline-flex items-center gap-2 text-xs px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700 font-mono">
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
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Campus Threat Protection
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed max-w-lg">
          Detect phishing portals, inspect deceptive QR codes, and report threats to campus security with cryptographic evidence integrity.
        </p>
      </section>

      {/* Action Cards */}
      <section aria-label="Main tools" className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Inspection Vectors
        </h2>
        <div className="grid grid-cols-1 gap-3">
          {ACTIONS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="card-interactive rounded-xl p-4 flex items-start gap-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                {item.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-white text-sm">
                    {item.label}
                  </h3>
                  <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {item.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-normal">
                  {item.description}
                </p>
              </div>

              <div className="text-slate-500 self-center pl-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Safety Guidelines */}
      <section className="card-clean rounded-xl p-4 space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
          <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.008v.008H12v-.008Z" />
          </svg>
          Campus Security Policy Reminders
        </div>
        <ul className="space-y-1.5 text-xs text-slate-400">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0 mt-1.5" />
            <span>Never input your student credentials or OTP after scanning an unfamiliar physical QR sticker.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0 mt-1.5" />
            <span>Official university departments do not solicit urgent fees or fines via personal UPI IDs.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0 mt-1.5" />
            <span>Reporting threats creates an append-only cryptographic audit record for administration triage.</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
