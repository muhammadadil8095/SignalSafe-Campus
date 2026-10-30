/**
 * AppLayout — Swiss luxury-brutalist shell.
 * Spec:
 * - Sticky header with a height of 80px (h-20).
 * - Background: #f2f2f2 with 90% opacity and backdrop-blur(12px).
 * - Links: 14px uppercase Satoshi with 120ms color transition to #b6b5b5.
 * - Pill-shaped action button with 1px solid #1e1e1e border that inverts on hover.
 * - Footer with deep dark theme (#1e1e1e).
 */
import { Outlet, NavLink, Link } from 'react-router-dom';
import Footer from '../components/Footer';
import AuroraBackground from '../components/AuroraBackground';

export default function AppLayout() {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#f2f2f2] text-[#111111] font-satoshi selection:bg-[#111111] selection:text-[#f2f2f2]">
      <AuroraBackground />

      {/* 80px Sticky Header */}
      <header className="sticky top-0 z-50 h-20 w-full bg-[#f2f2f2]/90 backdrop-blur-[12px] border-b border-[#1e1e1e]/10 px-6 sm:px-12 flex items-center justify-between">
        {/* Brandmark in Clash Display */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-[#111111] text-[#f2f2f2] flex items-center justify-center font-clash text-lg font-bold">
            S
          </div>
          <span className="font-clash text-xl font-bold tracking-tight text-[#111111]">
            SIGNALSAFE
          </span>
        </Link>

        {/* Desktop Navigation Links (14px uppercase Satoshi with 120ms color transition to #b6b5b5) */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          {[
            { to: '/', label: 'Overview' },
            { to: '/scan', label: 'Scan QR' },
            { to: '/check', label: 'Inspect Vector' },
            { to: '/admin', label: 'Incident Triage' },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `text-[14px] uppercase font-bold tracking-wider transition-colors duration-[120ms] ${
                  isActive
                    ? 'text-[#111111] underline underline-offset-8 decoration-1'
                    : 'text-[#111111] hover:text-[#b6b5b5]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Action Button: Pill-shaped with 1px solid #1e1e1e border that inverts on hover */}
        <div className="flex items-center gap-3">
          <Link
            to="/report"
            className="pill-button-invert px-5 py-2.5 text-xs uppercase tracking-wider font-bold inline-flex items-center gap-2"
          >
            <span>Report Threat</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
          </Link>
        </div>
      </header>

      {/* Mobile Top Secondary Sub-nav for PWA convenience */}
      <div className="md:hidden flex items-center justify-around bg-[#f2f2f2] border-b border-[#1e1e1e]/10 py-2.5 px-4 text-xs font-bold uppercase tracking-wider overflow-x-auto">
        <NavLink
          to="/"
          end
          className={({ isActive }) => (isActive ? 'text-[#111111] border-b-2 border-[#111111] pb-1' : 'text-[#838282]')}
        >
          Overview
        </NavLink>
        <NavLink
          to="/scan"
          className={({ isActive }) => (isActive ? 'text-[#111111] border-b-2 border-[#111111] pb-1' : 'text-[#838282]')}
        >
          Scan QR
        </NavLink>
        <NavLink
          to="/check"
          className={({ isActive }) => (isActive ? 'text-[#111111] border-b-2 border-[#111111] pb-1' : 'text-[#838282]')}
        >
          Inspect
        </NavLink>
        <NavLink
          to="/admin"
          className={({ isActive }) => (isActive ? 'text-[#111111] border-b-2 border-[#111111] pb-1' : 'text-[#838282]')}
        >
          Admin
        </NavLink>
      </div>

      {/* Main Surface */}
      <main className="relative z-10 flex-1 w-full">
        <Outlet />
      </main>

      {/* Swiss Editorial Footer */}
      <Footer />
    </div>
  );
}
