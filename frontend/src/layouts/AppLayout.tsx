import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar';
import AuroraBackground from '../components/AuroraBackground';

export default function AppLayout() {
  return (
    <div className="relative min-h-screen flex flex-col text-white">
      <AuroraBackground />

      {/* Top bar */}
      <header className="relative z-40 flex items-center justify-between px-5 h-14 glass-strong border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          {/* Shield wordmark */}
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
            </svg>
          </div>
          <span className="font-semibold text-sm tracking-tight text-white/90">SignalSafe</span>
        </div>
        <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-white/30">
          Campus · Secure
        </span>
      </header>

      {/* Page content */}
      <main className="relative z-10 flex-1 overflow-y-auto pb-24 px-4 py-6">
        <Outlet />
      </main>

      <NavBar />
    </div>
  );
}
