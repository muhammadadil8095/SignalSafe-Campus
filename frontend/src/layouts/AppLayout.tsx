/**
 * AppLayout — shell that wraps all student-facing pages.
 * Provides consistent header + bottom nav + safe content area.
 */
import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/40 px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg
            className="w-6 h-6 text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
            />
          </svg>
          <span className="font-bold text-white text-sm">SignalSafe Campus</span>
        </div>
        <span className="text-xs text-slate-500">Recognize · Resist · Report</span>
      </header>

      {/* Page content */}
      <main className="flex-1 overflow-y-auto pb-20 px-4 py-6">
        <Outlet />
      </main>

      <NavBar />
    </div>
  );
}
