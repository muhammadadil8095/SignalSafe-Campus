/**
 * Background — Clean, muted dark background with subtle grid overlay.
 * Professional institutional cybersecurity aesthetic (no neon/glowing blobs).
 */
export default function AuroraBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-grid"
    >
      {/* Subtle top ambient vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-transparent to-slate-950/80" />
    </div>
  );
}
