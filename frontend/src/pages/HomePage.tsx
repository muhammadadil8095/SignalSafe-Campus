/**
 * HomePage — Student cybersecurity hub with Magic UI & Unlumen AI aesthetic.
 * Features:
 * - Live animated aurora gradient background
 * - Shimmer typography
 * - Dynamic Bento-grid quick action cards
 * - Real-time backend telemetry beacon
 * - Ambient defense guidelines
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
      label: 'Optical QR Scanner',
      tag: 'ON-DEVICE DECODE',
      description:
        'Zero-trust camera viewfinder. Decodes payloads locally in browser memory without image transmission.',
      icon: (
        <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 18.75h.75v.75h-.75v-.75ZM18.75 13.5h.75v.75h-.75v-.75ZM18.75 18.75h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z" />
        </svg>
      ),
      glowColor: 'group-hover:border-cyan-500/40 group-hover:shadow-[0_0_24px_rgba(34,211,238,0.2)]',
      pedestal: 'bg-cyan-500/10 border-cyan-500/20 shadow-cyan-500/20',
    },
    {
      to: '/check',
      label: 'Threat Inspector',
      tag: 'LEXICAL + LLM RULES',
      description:
        'Submit suspicious links, unsolicited fee requests, fake portal texts, or bullying messages.',
      icon: (
        <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
        </svg>
      ),
      glowColor: 'group-hover:border-indigo-500/40 group-hover:shadow-[0_0_24px_rgba(99,102,241,0.2)]',
      pedestal: 'bg-indigo-500/10 border-indigo-500/20 shadow-indigo-500/20',
    },
  ];

  return (
    <div className="space-y-8 max-w-lg mx-auto float-in">
      {/* Hero Header */}
      <section className="text-center pt-2 relative">
        {/* Glowing Shield Icon */}
        <div className="flex justify-center mb-5 relative">
          <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600/20 via-indigo-600/30 to-violet-600/20 border border-white/15 flex items-center justify-center shadow-2xl backdrop-blur-xl">
            {/* Ambient inner glow */}
            <div className="absolute inset-2 rounded-2xl bg-indigo-500/10 blur-sm" />
            <svg
              className="w-10 h-10 text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.7)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
              />
            </svg>
          </div>
        </div>

        {/* Shimmer title & tagline */}
        <h1 className="text-3xl font-extrabold tracking-tight shimmer-text mb-2">
          SignalSafe Campus
        </h1>
        <p className="text-sm font-medium text-slate-300 max-w-sm mx-auto leading-relaxed">
          Real-time forensic threat intelligence. Protect your credentials, payments, and campus identity.
        </p>

        {/* Telemetry Status Beacon */}
        <div className="mt-4 inline-flex items-center gap-2 text-xs px-3.5 py-1.5 rounded-full glass border border-white/10 shadow-lg">
          {backendOnline === null && (
            <span className="text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-500 animate-pulse" />
              Probing defense gateway…
            </span>
          )}
          {backendOnline === true && (
            <span className="text-emerald-300 flex items-center gap-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              FastAPI Threat Engine Active
            </span>
          )}
          {backendOnline === false && (
            <span className="text-rose-300 flex items-center gap-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              Defense Gateway Offline (Check Port 8000)
            </span>
          )}
        </div>
      </section>

      {/* Bento Grid: Actions */}
      <section aria-label="Detection vectors" className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-slate-400 px-1">
          <span>Active Vectors</span>
          <span className="text-[10px] text-cyan-400">PWA OPTIMIZED</span>
        </div>

        <div className="grid grid-cols-1 gap-3.5">
          {ACTIONS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`group relative overflow-hidden rounded-3xl glass p-5 border border-white/10 transition-all duration-300 hover:scale-[1.01] hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${item.glowColor}`}
            >
              {/* Specular highlight */}
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-md ${item.pedestal}`}
                >
                  {item.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="font-semibold text-white text-base group-hover:text-cyan-300 transition-colors">
                      {item.label}
                    </h2>
                    <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded-full bg-slate-900/80 border border-white/5">
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="self-center pl-1 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Campus Security Best Practices Card */}
      <section className="rounded-3xl glass p-5 border border-white/10 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-300">
          <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.008v.008H12v-.008Z" />
          </svg>
          Zero-Trust Campus Rules
        </div>

        <ul className="space-y-2 text-xs text-slate-400 leading-normal">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1" />
            <span>Campus finance and exam halls never request UPI payments via unverified physical QR stickers.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 mt-1" />
            <span>Always inspect raw host domains for punycode or IP-based hosts prior to authentication.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0 mt-1" />
            <span>Reports trigger immutable SHA-256 evidence logs for authorised security officer audit.</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
