/**
 * HomePage — landing / dashboard for students.
 * Shows quick-action tiles and backend connection status.
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

  const TILES = [
    {
      to: '/scan',
      label: 'Scan QR Code',
      description: 'Point camera at a suspicious QR code to analyse it on-device.',
      color: 'blue',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 18.75h.75v.75h-.75v-.75ZM18.75 13.5h.75v.75h-.75v-.75ZM18.75 18.75h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z" />
        </svg>
      ),
    },
    {
      to: '/check',
      label: 'Check URL / Message',
      description: 'Paste a suspicious link or message text for instant analysis.',
      color: 'violet',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m9.86-2.06a4.5 4.5 0 0 0-1.242-7.244l-4.5-4.5a4.5 4.5 0 0 0-6.364 6.364L4.757 8.188" />
        </svg>
      ),
    },
  ];

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-600/15 border-blue-500/30 text-blue-400 hover:bg-blue-600/25',
    violet: 'bg-violet-600/15 border-violet-500/30 text-violet-400 hover:bg-violet-600/25',
  };

  return (
    <div className="space-y-8 max-w-lg mx-auto">
      {/* Hero */}
      <section className="text-center pt-2">
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
            <svg className="w-9 h-9 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
            </svg>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Stay Cyber-Safe</h1>
        <p className="text-slate-400 text-sm leading-relaxed">
          Scan QR codes, check suspicious links and report threats — all on your device.
        </p>

        {/* Backend status pill */}
        <div className="mt-4 inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border border-slate-700 bg-slate-800/50">
          {backendOnline === null && (
            <span className="text-slate-500">Checking backend…</span>
          )}
          {backendOnline === true && (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400">Backend connected</span>
            </>
          )}
          {backendOnline === false && (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              <span className="text-red-400">Backend unavailable</span>
            </>
          )}
        </div>
      </section>

      {/* Quick-action tiles */}
      <section aria-label="Quick actions">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
          What would you like to do?
        </h2>
        <div className="grid grid-cols-1 gap-3">
          {TILES.map((tile) => (
            <Link
              key={tile.to}
              to={tile.to}
              className={`flex items-center gap-4 p-4 rounded-2xl border transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${colorMap[tile.color]}`}
            >
              <div className="shrink-0">{tile.icon}</div>
              <div>
                <p className="font-semibold text-white text-sm">{tile.label}</p>
                <p className="text-slate-400 text-xs mt-0.5">{tile.description}</p>
              </div>
              <svg className="w-4 h-4 text-slate-500 ml-auto shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          ))}
        </div>
      </section>

      {/* Safety tips */}
      <section className="rounded-2xl bg-slate-800/40 border border-slate-700/40 p-4">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
          Safety reminders
        </h2>
        <ul className="space-y-2 text-sm text-slate-400">
          {[
            'Never enter your password or OTP after scanning an unknown QR code.',
            'Legitimate campus portals will not ask for bank details via QR.',
            'If you see something suspicious, report it — it helps protect others.',
          ].map((tip) => (
            <li key={tip} className="flex items-start gap-2">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" aria-hidden="true" />
              {tip}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
