import { useState } from 'react';
import { checkHealth } from '../services/health';
import type { HealthResponse } from '../types/api';

type ConnectionState = 'idle' | 'loading' | 'success' | 'error';

export default function LandingPage() {
  const [connectionState, setConnectionState] = useState<ConnectionState>('idle');
  const [healthData, setHealthData] = useState<HealthResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCheckConnection = async () => {
    setConnectionState('loading');
    setErrorMessage('');
    setHealthData(null);

    try {
      const data = await checkHealth();
      setHealthData(data);
      setConnectionState('success');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Connection failed');
      setConnectionState('error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex flex-col items-center justify-center px-4">
      {/* Header section */}
      <div className="text-center max-w-2xl mx-auto">
        {/* Shield icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-3">
          SignalSafe Campus
        </h1>

        {/* Tagline */}
        <p className="text-lg sm:text-xl text-blue-300 font-medium mb-6">
          Recognize. Resist. Report.
        </p>

        {/* Description */}
        <p className="text-slate-400 text-base sm:text-lg leading-relaxed mb-10 max-w-xl mx-auto">
          An intelligent campus cybersecurity platform that helps students, faculty
          and administrators identify phishing attempts, scan suspicious QR codes,
          analyse threat messages and report security incidents — all with
          explainable, actionable alerts.
        </p>

        {/* Connection test button */}
        <button
          onClick={handleCheckConnection}
          disabled={connectionState === 'loading'}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-medium transition-colors duration-200 cursor-pointer disabled:cursor-wait"
        >
          {connectionState === 'loading' ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Connecting…
            </>
          ) : (
            <>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m9.86-2.06a4.5 4.5 0 0 0-1.242-7.244l-4.5-4.5a4.5 4.5 0 0 0-6.364 6.364L4.757 8.188" />
              </svg>
              Check Backend Connection
            </>
          )}
        </button>

        {/* Connection result */}
        {connectionState === 'success' && healthData && (
          <div className="mt-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-left max-w-md mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-300 font-semibold text-sm uppercase tracking-wide">
                Connected
              </span>
            </div>
            <div className="space-y-1 text-sm">
              <p className="text-slate-300">
                <span className="text-slate-500">Status:</span>{' '}
                <span className="text-emerald-300">{healthData.status}</span>
              </p>
              <p className="text-slate-300">
                <span className="text-slate-500">Service:</span>{' '}
                {healthData.service}
              </p>
              <p className="text-slate-300">
                <span className="text-slate-500">Version:</span>{' '}
                {healthData.version}
              </p>
            </div>
          </div>
        )}

        {connectionState === 'error' && (
          <div className="mt-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-left max-w-md mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span className="text-red-300 font-semibold text-sm uppercase tracking-wide">
                Connection Failed
              </span>
            </div>
            <p className="text-slate-400 text-sm">{errorMessage}</p>
            <p className="text-slate-500 text-xs mt-2">
              Make sure the backend is running on{' '}
              <code className="text-slate-400">http://localhost:8000</code>
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="absolute bottom-6 text-center">
        <p className="text-slate-600 text-sm">
          SignalSafe Campus — Phase 0 Foundation
        </p>
      </footer>
    </div>
  );
}

