/**
 * HomePage — Swiss Luxury-Brutalist Architecture with Clear, Comprehensive Copy.
 * Written in plain, accessible language so any student or staff member understands immediately.
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
    <div className="w-full space-y-24 pb-20 font-satoshi">
      {/* ─────────────────────────────────────────────────────────────────────────
          1. HERO SECTION
      ────────────────────────────────────────────────────────────────────────── */}
      <section className="min-h-[75vh] flex flex-col justify-between items-center text-center px-4 pt-12 pb-8 border-b border-[#1e1e1e]/10">
        {/* Status Tag */}
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-[#1e1e1e]/15 bg-[#ffffff] text-xs font-mono uppercase tracking-widest text-[#111111]">
          <span className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          <span>{backendOnline ? 'SECURITY ENGINE ACTIVE & READY' : 'CONNECTING TO CAMPUS ENGINE'}</span>
          <span className="text-[#838282]">· OFFICIAL SAFETY SYSTEM</span>
        </div>

        {/* Center Typographic Echo Stack */}
        <div className="my-auto py-8">
          <div className="echo-stack">
            {/* Background Echo Layers */}
            <span className="echo-layer echo-layer-4 text-[11vw] sm:text-[140px] md:text-[170px] lg:text-[190px] font-bold select-none">
              VERIFY
            </span>
            <span className="echo-layer echo-layer-3 text-[11vw] sm:text-[140px] md:text-[170px] lg:text-[190px] font-bold select-none">
              VERIFY
            </span>
            <span className="echo-layer echo-layer-2 text-[11vw] sm:text-[140px] md:text-[170px] lg:text-[190px] font-bold select-none">
              VERIFY
            </span>
            <span className="echo-layer echo-layer-1 text-[11vw] sm:text-[140px] md:text-[170px] lg:text-[190px] font-bold select-none">
              VERIFY
            </span>
            {/* Foreground Layer */}
            <h1 className="echo-foreground text-[11vw] sm:text-[140px] md:text-[170px] lg:text-[190px] font-bold tracking-[-0.05em] leading-[0.9]">
              VERIFY
            </h1>
          </div>

          <p className="max-w-xl mx-auto mt-6 text-sm sm:text-base text-[#838282] font-medium leading-relaxed">
            Check suspicious QR codes, fake college fee links, text scams, and harassment before you click or pay. Built to protect everyone on campus.
          </p>
        </div>

        {/* Bottom Hero Anchor Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            to="/scan"
            className="pill-button-invert px-8 py-3.5 text-xs uppercase tracking-widest font-bold inline-flex items-center gap-3"
          >
            <span>Scan a QR Code</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
          </Link>
          <Link
            to="/check"
            className="px-8 py-3.5 text-xs uppercase tracking-widest font-bold text-[#111111] hover:text-[#838282] transition-colors"
          >
            Check a Link or Message →
          </Link>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────
          2. PHILOSOPHY / HOW IT HELPS YOU SECTION
      ────────────────────────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 sm:px-12 space-y-16">
        {/* Vertical Hairline Divider */}
        <div className="flex justify-center">
          <div className="w-[1px] h-24 bg-[#1e1e1e]/10" />
        </div>

        {/* Large-scale Quote */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#838282] block">
            HOW SIGNALSAFE WORKS
          </span>
          <blockquote className="font-clash text-3xl sm:text-5xl md:text-6xl font-bold tracking-[-0.05em] leading-[1.0] text-[#111111]">
            “RECOGNIZE SCAMS EARLY. RESIST FALSE PANIC.{' '}
            <span className="font-editorial-serif font-normal italic tracking-normal text-[#111111]">
              report
            </span>{' '}
            TO KEEP YOUR CAMPUS SAFE.”
          </blockquote>
        </div>

        {/* 3-Column Informational Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-[#1e1e1e]/10">
          <div className="space-y-3">
            <span className="font-mono text-xs text-[#838282]">STEP 01 / SCAN OR PASTE</span>
            <h3 className="font-clash text-xl font-bold text-[#111111] tracking-tight">
              Instant Safety Check
            </h3>
            <p className="text-xs text-[#838282] leading-relaxed">
              Scan a physical QR code with your camera or paste any link, SMS, or payment demand. The system scans the text without ever opening the dangerous website.
            </p>
          </div>

          <div className="space-y-3">
            <span className="font-mono text-xs text-[#838282]">STEP 02 / EASY-TO-READ VERDICT</span>
            <h3 className="font-clash text-xl font-bold text-[#111111] tracking-tight">
              Clear Explanations
            </h3>
            <p className="text-xs text-[#838282] leading-relaxed">
              Get an instant Green, Amber, or Red result with practical advice and plain-English reasons—like whether the website is pretending to be an official university portal.
            </p>
          </div>

          <div className="space-y-3">
            <span className="font-mono text-xs text-[#838282]">STEP 03 / DIRECT INCIDENT ACTION</span>
            <h3 className="font-clash text-xl font-bold text-[#111111] tracking-tight">
              Report in One Click
            </h3>
            <p className="text-xs text-[#838282] leading-relaxed">
              If something looks like a scam, report it to campus authorities. You can submit anonymously and receive a digital receipt proving your report was securely logged.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────
          3. ASYMMETRICAL SHOWCASE GRID
      ────────────────────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#1e1e1e]/10 pb-4 gap-2">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#838282] block">
              CAMPUS PROTECTION CAPABILITIES
            </span>
            <h2 className="font-clash text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight mt-1">
              What You Can Check on SignalSafe
            </h2>
          </div>
          <span className="font-mono text-xs text-[#838282]">SAFE & PRIVATE ALWAYS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* Item 1: Large 8-column card */}
          <div className="md:col-span-8 rounded-sm border border-[#1e1e1e]/15 bg-[#ffffff] p-8 overflow-hidden group flex flex-col justify-between min-h-[340px]">
            <div className="flex justify-between items-start">
              <span className="font-mono text-xs text-[#838282]">FEATURE 01 · PHYSICAL QR PROTECTION</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-[#f2f2f2] text-[#111111] border border-[#1e1e1e]/10">
                PRIVATE ON YOUR PHONE
              </span>
            </div>

            <div className="my-6">
              <h3 className="font-clash text-3xl sm:text-4xl font-bold text-[#111111] tracking-tight">
                Inspect Posters, Flyers & Stickers
              </h3>
              <p className="text-xs sm:text-sm text-[#838282] mt-2 max-w-lg leading-relaxed">
                Found a suspicious QR code on an exam hall noticeboard, library desk, or parking meter? Scan it safely. We read the QR code on your phone without ever transmitting your camera footage.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-[#1e1e1e]/10">
              <Link to="/scan" className="text-xs font-bold uppercase tracking-wider text-[#111111] flex items-center gap-2 group-hover:underline">
                <span>Open QR Scanner</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Item 2: Vertical 4-column pill card */}
          <div className="md:col-span-4 pill-vertical-container group bg-[#ffffff]">
            <div className="w-full h-full bg-gradient-to-b from-[#e5e5e5] via-[#d4d4d4] to-[#1e1e1e] hover-grayscale-lift flex flex-col items-center justify-between p-10 text-center">
              <span className="font-mono text-xs uppercase tracking-widest text-[#111111] font-bold">
                PRIVACY GUARANTEE
              </span>

              {/* Centered Circular Overlay */}
              <div className="pill-overlay-circle w-40 h-40 rounded-full bg-[#111111] text-[#f2f2f2] flex flex-col items-center justify-center p-4 text-center border border-white/20 shadow-2xl">
                <span className="font-clash text-base font-bold block leading-none">
                  ZERO DATA SALE
                </span>
                <span className="text-[9px] font-mono uppercase tracking-wider text-[#b6b5b5] mt-1.5 leading-tight">
                  YOUR PHOTOS STAY ON YOUR PHONE
                </span>
              </div>

              <span className="font-mono text-[10px] uppercase text-white/70 tracking-wider">
                BUILT FOR STUDENTS & FACULTY
              </span>
            </div>
          </div>

          {/* Item 3: Circular 5-column aspect-square */}
          <div className="md:col-span-5 aspect-square rounded-full border border-[#1e1e1e]/15 bg-[#ffffff] p-8 flex flex-col items-center justify-center text-center hover-grayscale-lift group">
            <div className="w-16 h-16 rounded-full border border-[#1e1e1e]/20 flex items-center justify-center mb-4 group-hover:scale-110 ease-editorial bg-[#f2f2f2]">
              <svg className="w-7 h-7 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#838282]">
              OFFICIAL VERIFICATION
            </span>
            <h3 className="font-clash text-2xl font-bold text-[#111111] tracking-tight mt-1">
              Allowlist Matching
            </h3>
            <p className="text-xs text-[#838282] max-w-xs mt-2 leading-relaxed">
              We check every website against verified university domain lists to catch fake login portals trying to steal your student password.
            </p>
          </div>

          {/* Item 4: Wide 7-column rectangle */}
          <div className="md:col-span-7 rounded-sm border border-[#1e1e1e]/15 bg-[#ffffff] p-8 flex flex-col justify-between hover-grayscale-lift group">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[#838282]">FEATURE 02 · TAMPER-PROOF REPORTS</span>
              <span className="font-mono text-xs text-[#111111]">ANONYMOUS OPTION INCLUDED</span>
            </div>

            <div className="my-6 space-y-2">
              <h3 className="font-clash text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight">
                Alert Campus Security With Proof
              </h3>
              <p className="text-xs sm:text-sm text-[#838282] leading-relaxed max-w-md">
                When you report an incident, the system creates a cryptographic fingerprint of the evidence. Campus authorities can act quickly without anyone altering your statement.
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#1e1e1e]/10">
              <span className="text-xs font-mono text-[#838282]">PROTECTED BY DIGITAL HASH</span>
              <Link to="/report" className="text-xs font-bold uppercase tracking-wider text-[#111111] hover:underline">
                Submit an Incident →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────
          4. BESPOKE SERVICE CARDS
      ────────────────────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 space-y-8">
        <div className="border-b border-[#1e1e1e]/10 pb-4">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#838282] block">
            MAIN TOOLS
          </span>
          <h2 className="font-clash text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight mt-1">
            Choose What You Want to Do
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <Link
            to="/scan"
            className="card-service rounded-sm p-8 flex flex-col justify-between min-h-[340px] group cursor-pointer"
          >
            <div>
              <div className="geometric-icon-box mb-6 shadow-sm">
                <svg className="w-6 h-6 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 18.75h.75v.75h-.75v-.75ZM18.75 13.5h.75v.75h-.75v-.75ZM18.75 18.75h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z" />
                </svg>
              </div>

              <h3 className="font-clash text-2xl font-bold text-[#111111] tracking-tight mb-2">
                Scan QR Code
              </h3>
              <p className="text-xs text-[#838282] leading-relaxed">
                Aim your phone camera at physical notices, brochures, or stickers to check whether the link is genuine or dangerous.
              </p>
            </div>

            <div className="pt-6 border-t border-[#1e1e1e]/10 flex items-center justify-between text-xs font-bold tracking-wide text-[#111111]">
              <span>OPEN QR SCANNER</span>
              <svg className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </Link>

          {/* Card 2 */}
          <Link
            to="/check"
            className="card-service rounded-sm p-8 flex flex-col justify-between min-h-[340px] group cursor-pointer"
          >
            <div>
              <div className="geometric-icon-box mb-6 shadow-sm">
                <svg className="w-6 h-6 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m9.86-2.06a4.5 4.5 0 0 0-1.242-7.244l-4.5-4.5a4.5 4.5 0 0 0-6.364 6.364L4.757 8.188" />
                </svg>
              </div>

              <h3 className="font-clash text-2xl font-bold text-[#111111] tracking-tight mb-2">
                Check Link or Text
              </h3>
              <p className="text-xs text-[#838282] leading-relaxed">
                Paste any web link, suspicious text message, payment request, or abusive message to see an instant risk assessment.
              </p>
            </div>

            <div className="pt-6 border-t border-[#1e1e1e]/10 flex items-center justify-between text-xs font-bold tracking-wide text-[#111111]">
              <span>INSPECT TEXT</span>
              <svg className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </Link>

          {/* Card 3 */}
          <Link
            to="/admin"
            className="card-service rounded-sm p-8 flex flex-col justify-between min-h-[340px] group cursor-pointer"
          >
            <div>
              <div className="geometric-icon-box mb-6 shadow-sm">
                <svg className="w-6 h-6 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 0 1 14.25 5.25Z" />
                </svg>
              </div>

              <h3 className="font-clash text-2xl font-bold text-[#111111] tracking-tight mb-2">
                Security Admin Desk
              </h3>
              <p className="text-xs text-[#838282] leading-relaxed">
                For authorized campus security personnel to review submitted incident reports, take action, and manage the audit log.
              </p>
            </div>

            <div className="pt-6 border-t border-[#1e1e1e]/10 flex items-center justify-between text-xs font-bold tracking-wide text-[#111111]">
              <span>ADMIN CONSOLE</span>
              <svg className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
