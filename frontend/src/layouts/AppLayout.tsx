import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar';
import AuroraBackground from '../components/AuroraBackground';

export default function AppLayout() {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#090d16] text-slate-100">
      <AuroraBackground />

      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-5 h-14 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
            </svg>
          </div>
          <div>
            <span className="font-semibold text-sm tracking-tight text-white block leading-none">
              SignalSafe Campus
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Cyber Threat Defense</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800/90 border border-slate-700 text-slate-300">
            v1.0
          </span>
        </div>
      </header>

      {/* Content Area */}
      <main className="relative z-10 flex-1 overflow-y-auto pb-24 px-4 py-6 max-w-xl mx-auto w-full">
        <Outlet />
      </main>

      <NavBar />
    </div>
  );
}
