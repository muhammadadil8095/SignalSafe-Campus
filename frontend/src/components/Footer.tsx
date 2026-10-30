/**
 * Footer — Swiss luxury-brutalist footer.
 * Deep dark theme (#1e1e1e) with 60% opacity off-white text (#f6f6f6).
 * 4-column layout including brand summary, navigation, company links, and contact details with line icons.
 * Includes a thin 5% opacity white top border.
 */
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full bg-[#1e1e1e] text-[#f6f6f6] border-t border-white/5 pt-16 pb-20 px-6 sm:px-12 font-satoshi">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-sm">
        {/* Column 1: Brand Summary */}
        <div className="space-y-4">
          <span className="font-clash text-2xl text-white font-bold tracking-tight block">
            SIGNALSAFE
          </span>
          <p className="text-[#f6f6f6]/60 text-xs leading-relaxed max-w-xs font-normal">
            Institutional cybersecurity infrastructure for higher education. Zero-trust heuristic evaluation, on-device optical verification, and tamper-proof cryptographic audit ledgers.
          </p>
          <div className="pt-2 text-[11px] text-[#f6f6f6]/40 font-mono">
            EST. 2026 · CAMPUS DEFENSE SYSTEM
          </div>
        </div>

        {/* Column 2: Navigation */}
        <div className="space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#f6f6f6] font-bold block">
            Navigation
          </span>
          <ul className="space-y-2 text-xs text-[#f6f6f6]/60">
            <li>
              <Link to="/" className="hover:text-white transition-colors duration-150">
                Dashboard Overview
              </Link>
            </li>
            <li>
              <Link to="/scan" className="hover:text-white transition-colors duration-150">
                Optical QR Scanner
              </Link>
            </li>
            <li>
              <Link to="/check" className="hover:text-white transition-colors duration-150">
                Threat Vector Inspector
              </Link>
            </li>
            <li>
              <Link to="/admin" className="hover:text-white transition-colors duration-150">
                Incident Triage Deck
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Institutional Governance */}
        <div className="space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#f6f6f6] font-bold block">
            Governance
          </span>
          <ul className="space-y-2 text-xs text-[#f6f6f6]/60">
            <li>
              <span className="hover:text-white transition-colors cursor-default">
                Zero-Crawl Policy
              </span>
            </li>
            <li>
              <span className="hover:text-white transition-colors cursor-default">
                On-Device Matrix Isolation
              </span>
            </li>
            <li>
              <span className="hover:text-white transition-colors cursor-default">
                SHA-256 Chain of Custody
              </span>
            </li>
            <li>
              <span className="hover:text-white transition-colors cursor-default">
                Pseudonymous Disclosure
              </span>
            </li>
          </ul>
        </div>

        {/* Column 4: Contact & Emergency Dispatch */}
        <div className="space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#f6f6f6] font-bold block">
            Dispatch Center
          </span>
          <div className="space-y-2.5 text-xs text-[#f6f6f6]/60">
            <div className="flex items-center gap-2.5">
              <svg className="w-4 h-4 text-[#f6f6f6]/80 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
              <span>campus-security@university.edu</span>
            </div>

            <div className="flex items-center gap-2.5">
              <svg className="w-4 h-4 text-[#f6f6f6]/80 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
              </svg>
              <span>Campus SOC: +1 (800) 555-SAFE</span>
            </div>

            <div className="flex items-center gap-2.5">
              <svg className="w-4 h-4 text-[#f6f6f6]/80 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
              <span>Information Security Office, Hall 4</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-[#f6f6f6]/40 font-mono gap-4">
        <span>© 2026 SIGNALSAFE CAMPUS INITIATIVE. ALL RIGHTS RESERVED.</span>
        <span>SWISS EDITORIAL ARCHITECTURE · LUXURY BRUTALIST SYSTEM</span>
      </div>
    </footer>
  );
}

