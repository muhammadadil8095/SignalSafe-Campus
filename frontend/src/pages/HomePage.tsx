/**
 * HomePage — Swiss Luxury-Brutalist Architecture.
 * Implements:
 * 1. Full-width Typographic Echo Stack Hero (11vw / 180px, 5 text layers)
 * 2. Philosophy / Narrative with vertical hairline & editorial serif accent
 * 3. Asymmetrical 12-Column Showcase Grid with pill-shaped vertical container
 * 4. Bespoke Service Cards (64x64 rotating geometric boxes & transparent-to-white hover)
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
    <div className="w-full space-y-24 pb-20">
      {/* ─────────────────────────────────────────────────────────────────────────
          1. HERO SECTION (70vh to 100vh, massive text, pure typographic weight)
      ────────────────────────────────────────────────────────────────────────── */}
      <section className="min-h-[75vh] flex flex-col justify-between items-center text-center px-4 pt-12 pb-8 border-b border-[#1e1e1e]/10">
        {/* Status Tag */}
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-[#1e1e1e]/15 bg-[#ffffff] text-xs font-mono uppercase tracking-widest text-[#111111]">
          <span className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          <span>{backendOnline ? 'TELEMETRY GATEWAY CONNECTED' : 'INITIALIZING DEFENSE NETWORK'}</span>
          <span className="text-[#838282]">· 2026 EDITION</span>
        </div>

        {/* Center Massive Typographic Echo Stack (11vw / up to 180px) */}
        <div className="my-auto py-8">
          <div className="echo-stack">
            {/* Layer 5 (Bottom) */}
            <span className="echo-layer echo-layer-4 text-[11vw] sm:text-[140px] md:text-[170px] lg:text-[190px] font-bold select-none">
              DEFENSE
            </span>
            {/* Layer 4 */}
            <span className="echo-layer echo-layer-3 text-[11vw] sm:text-[140px] md:text-[170px] lg:text-[190px] font-bold select-none">
              DEFENSE
            </span>
            {/* Layer 3 */}
            <span className="echo-layer echo-layer-2 text-[11vw] sm:text-[140px] md:text-[170px] lg:text-[190px] font-bold select-none">
              DEFENSE
            </span>
            {/* Layer 2 */}
            <span className="echo-layer echo-layer-1 text-[11vw] sm:text-[140px] md:text-[170px] lg:text-[190px] font-bold select-none">
              DEFENSE
            </span>
            {/* Foreground Layer (Top) */}
            <h1 className="echo-foreground text-[11vw] sm:text-[140px] md:text-[170px] lg:text-[190px] font-bold tracking-[-0.05em] leading-[0.9]">
              DEFENSE
            </h1>
          </div>

          <p className="max-w-md mx-auto mt-6 text-sm text-[#838282] font-satoshi font-medium tracking-normal leading-relaxed">
            Swiss minimalist cybersecurity system for university networks. High-contrast lexical inference, camera matrix isolation, and immutable incident auditing.
          </p>
        </div>

        {/* Bottom Hero Anchor Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            to="/scan"
            className="pill-button-invert px-8 py-3.5 text-xs uppercase tracking-widest font-bold inline-flex items-center gap-3"
          >
            <span>Launch Optical QR Radar</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
          </Link>
          <Link
            to="/check"
            className="px-8 py-3.5 text-xs uppercase tracking-widest font-bold text-[#111111] hover:text-[#838282] transition-colors"
          >
            Inspect Suspicious Text →
          </Link>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────
          2. PHILOSOPHY / NARRATIVE SECTION
          - Centered block with 1px #1e1e1e/10 hairline divider leading in
          - Large-scale quote (4xl to 6xl) in Clash Display + serif italic keyword
          - 3-column grid with 32px gaps, bold H3 + light-weight Satoshi body
      ────────────────────────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 sm:px-12 space-y-16">
        {/* Vertical Hairline Divider (1px #1e1e1e/10) */}
        <div className="flex justify-center">
          <div className="w-[1px] h-24 bg-[#1e1e1e]/10" />
        </div>

        {/* Large-scale Quote */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#838282] block">
            THE CAMPUS DEFENSE MANIFESTO
          </span>
          <blockquote className="font-clash text-3xl sm:text-5xl md:text-6xl font-bold tracking-[-0.05em] leading-[1.0] text-[#111111]">
            “SECURITY IS NOT A WALL. IT IS AN{' '}
            <span className="font-editorial-serif font-normal italic tracking-normal text-[#111111]">
              honest
            </span>{' '}
            PRACTICE OF DETECTING DECEPTION BEFORE ACTION.”
          </blockquote>
        </div>

        {/* 3-Column Grid with 32px (gap-8) gaps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-[#1e1e1e]/10">
          <div className="space-y-3">
            <span className="font-mono text-xs text-[#838282]">01 / TRANSPARENCY</span>
            <h3 className="font-clash text-xl font-bold text-[#111111] tracking-tight">
              Explainable Signals
            </h3>
            <p className="text-xs text-[#838282] font-normal leading-relaxed">
              Every threat classification is backed by human-readable lexical rules and feature attribution. No opaque verdicts; students see exactly why a link is deceptive.
            </p>
          </div>

          <div className="space-y-3">
            <span className="font-mono text-xs text-[#838282]">02 / ISOLATION</span>
            <h3 className="font-clash text-xl font-bold text-[#111111] tracking-tight">
              On-Device Geometry
            </h3>
            <p className="text-xs text-[#838282] font-normal leading-relaxed">
              Camera frames never travel across the wire. The Nimiq WebAssembly engine scans optical matrices directly in browser memory, sending only normalized destination strings.
            </p>
          </div>

          <div className="space-y-3">
            <span className="font-mono text-xs text-[#838282]">03 / IMMUTABILITY</span>
            <h3 className="font-clash text-xl font-bold text-[#111111] tracking-tight">
              Cryptographic Custody
            </h3>
            <p className="text-xs text-[#838282] font-normal leading-relaxed">
              Reported evidence generates a SHA-256 digest appended to an administrative audit ledger. Security triage officers examine tamper-proof forensic records.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────
          3. ASYMMETRICAL SHOWCASE GRID
          12-column grid featuring mixed aspect ratios:
          1. Large 8-column rectangular card (rounded-sm)
          2. Vertical 4-column pill-shaped card (h: 500px, rounded-full, hover overlay)
          3. Circular 5-column aspect-square image
          4. Wide 7-column rectangle
          All start at 20% grayscale, transition to 100% color & 1.05x on hover
      ────────────────────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#1e1e1e]/10 pb-4 gap-2">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#838282] block">
              ARCHITECTURE OVERVIEW
            </span>
            <h2 className="font-clash text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight mt-1">
              Asymmetrical Defense Showcase
            </h2>
          </div>
          <span className="font-mono text-xs text-[#838282]">FIG. 01 — MULTI-MODAL RADAR</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* Item 1: Large 8-column rectangular card with rounded-sm */}
          <div className="md:col-span-8 rounded-sm border border-[#1e1e1e]/15 bg-[#ffffff] p-8 overflow-hidden group flex flex-col justify-between min-h-[360px]">
            <div className="flex justify-between items-start">
              <span className="font-mono text-xs text-[#838282]">MODULE 01 · RADAR</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#f2f2f2] text-[#111111] border border-[#1e1e1e]/10">
                IN-MEMORY CAMERA
              </span>
            </div>

            <div className="my-6">
              <h3 className="font-clash text-3xl sm:text-4xl font-bold text-[#111111] tracking-tight">
                Physical Threat Neutralization
              </h3>
              <p className="text-xs text-[#838282] mt-2 max-w-lg leading-relaxed">
                Counterfeited university fee stickers, malicious notices, and hijacked parking payments are decoded instantaneously. Zero link auto-execution protects browser state.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-[#1e1e1e]/10">
              <Link to="/scan" className="text-xs font-bold uppercase tracking-wider text-[#111111] flex items-center gap-2 group-hover:underline">
                <span>Engage Viewfinder</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Item 2: Vertical 4-column pill-shaped card (h: 500px, rounded-full, image scale, circular overlay) */}
          <div className="md:col-span-4 pill-vertical-container group bg-[#ffffff]">
            {/* Visual background representation */}
            <div className="w-full h-full bg-gradient-to-b from-[#e5e5e5] via-[#d4d4d4] to-[#1e1e1e] hover-grayscale-lift flex flex-col items-center justify-between p-10">
              <span className="font-mono text-xs uppercase tracking-widest text-[#111111]">
                PILL SHOWCASE
              </span>

              {/* Centered Circular Overlay (only visible on hover) */}
              <div className="pill-overlay-circle w-36 h-36 rounded-full bg-[#111111] text-[#f2f2f2] flex flex-col items-center justify-center p-4 text-center border border-white/20 shadow-2xl">
                <span className="font-clash text-sm font-bold block leading-none">
                  ISO-27001
                </span>
                <span className="text-[9px] font-mono uppercase tracking-wider text-[#b6b5b5] mt-1">
                  VERIFIED PROTOCOL
                </span>
              </div>

              <span className="font-mono text-[10px] uppercase text-white/60 tracking-wider">
                SWISS MONOCHROME
              </span>
            </div>
          </div>

          {/* Item 3: Circular 5-column aspect-square image/container */}
          <div className="md:col-span-5 aspect-square rounded-full border border-[#1e1e1e]/15 bg-[#ffffff] p-8 flex flex-col items-center justify-center text-center hover-grayscale-lift group">
            <div className="w-16 h-16 rounded-full border border-[#1e1e1e]/20 flex items-center justify-center mb-4 group-hover:scale-110 ease-editorial">
              <svg className="w-7 h-7 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#838282]">
              HEURISTIC GATE
            </span>
            <h3 className="font-clash text-2xl font-bold text-[#111111] tracking-tight mt-1">
              Zero-Trust Filter
            </h3>
            <p className="text-xs text-[#838282] max-w-xs mt-2 leading-relaxed">
              Every URI parsed against campus registrar allowlists, Punycode indicators, and IP host obfuscations.
            </p>
          </div>

          {/* Item 4: Wide 7-column rectangle */}
          <div className="md:col-span-7 rounded-sm border border-[#1e1e1e]/15 bg-[#ffffff] p-8 flex flex-col justify-between hover-grayscale-lift group">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[#838282]">MODULE 03 · DISPATCH</span>
              <span className="font-mono text-xs text-[#111111]">POST /api/v1/reports</span>
            </div>

            <div className="my-6 space-y-2">
              <h3 className="font-clash text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight">
                Authenticated Incident Dispatch
              </h3>
              <p className="text-xs text-[#838282] leading-relaxed max-w-md">
                Direct conduit to campus administration. Reports retain cryptographic hashes of threat inputs without exposing sensitive student identity.
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#1e1e1e]/10">
              <span className="text-xs font-mono text-[#838282]">AES / SHA-256 EVIDENCE CUSTODY</span>
              <Link to="/report" className="text-xs font-bold uppercase tracking-wider text-[#111111] hover:underline">
                File Report →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────
          4. BESPOKE SERVICE CARDS
          3-column grid of cards with #1e1e1e/10 borders.
          Backgrounds transition from transparent to #ffffff on hover.
          Contains small geometric icon container (64x64px) that rotates 12 degrees on hover.
          Use arrow-right icons for CTAs with a tracking-wide bold Satoshi font.
      ────────────────────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 space-y-8">
        <div className="border-b border-[#1e1e1e]/10 pb-4">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#838282] block">
            CORE SERVICES
          </span>
          <h2 className="font-clash text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight mt-1">
            Bespoke Defense Modules
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Service Card 1: Optical Scanner */}
          <Link
            to="/scan"
            className="card-service rounded-sm p-8 flex flex-col justify-between min-h-[340px] group cursor-pointer"
          >
            <div>
              {/* 64x64 geometric icon container rotating 12deg on hover */}
              <div className="geometric-icon-box mb-6 shadow-sm">
                <svg className="w-6 h-6 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 18.75h.75v.75h-.75v-.75ZM18.75 13.5h.75v.75h-.75v-.75ZM18.75 18.75h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z" />
                </svg>
              </div>

              <h3 className="font-clash text-2xl font-bold text-[#111111] tracking-tight mb-2">
                Optical QR Scanner
              </h3>
              <p className="text-xs text-[#838282] font-normal leading-relaxed">
                Real-time on-device QR matrix decoding using client-side WebAssembly. Camera stream remains strictly local.
              </p>
            </div>

            <div className="pt-6 border-t border-[#1e1e1e]/10 flex items-center justify-between text-xs font-bold tracking-wide text-[#111111] font-satoshi">
              <span>SCAN QR FLYER</span>
              <svg className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </Link>

          {/* Service Card 2: Threat Vector Inspector */}
          <Link
            to="/check"
            className="card-service rounded-sm p-8 flex flex-col justify-between min-h-[340px] group cursor-pointer"
          >
            <div>
              {/* 64x64 geometric icon container rotating 12deg on hover */}
              <div className="geometric-icon-box mb-6 shadow-sm">
                <svg className="w-6 h-6 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m9.86-2.06a4.5 4.5 0 0 0-1.242-7.244l-4.5-4.5a4.5 4.5 0 0 0-6.364 6.364L4.757 8.188" />
                </svg>
              </div>

              <h3 className="font-clash text-2xl font-bold text-[#111111] tracking-tight mb-2">
                Threat Inspector
              </h3>
              <p className="text-xs text-[#838282] font-normal leading-relaxed">
                Direct analysis of suspicious URLs, deceptive SMS alerts, urgent payment demands, and harassment strings.
              </p>
            </div>

            <div className="pt-6 border-t border-[#1e1e1e]/10 flex items-center justify-between text-xs font-bold tracking-wide text-[#111111] font-satoshi">
              <span>CHECK PAYLOAD</span>
              <svg className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </Link>

          {/* Service Card 3: Incident Triage Deck */}
          <Link
            to="/admin"
            className="card-service rounded-sm p-8 flex flex-col justify-between min-h-[340px] group cursor-pointer"
          >
            <div>
              {/* 64x64 geometric icon container rotating 12deg on hover */}
              <div className="geometric-icon-box mb-6 shadow-sm">
                <svg className="w-6 h-6 text-[#111111]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 0 1 14.25 5.25Z" />
                </svg>
              </div>

              <h3 className="font-clash text-2xl font-bold text-[#111111] tracking-tight mb-2">
                Incident Triage Deck
              </h3>
              <p className="text-xs text-[#838282] font-normal leading-relaxed">
                Centralized console for authorized security officers. Review received incident reports, transition status, and verify SHA-256 audit logs.
              </p>
            </div>

            <div className="pt-6 border-t border-[#1e1e1e]/10 flex items-center justify-between text-xs font-bold tracking-wide text-[#111111] font-satoshi">
              <span>SECURITY CONSOLE</span>
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
