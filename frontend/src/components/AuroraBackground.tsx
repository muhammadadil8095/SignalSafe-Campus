/**
 * AuroraBackground — persistent animated gradient mesh.
 * Sits behind every page; extracted so it doesn't re-mount on navigation.
 */
export default function AuroraBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Base */}
      <div className="absolute inset-0 bg-slate-950 dot-grid" />

      {/* Aurora blobs */}
      <div className="aurora-1 absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-indigo-600/20 blur-[120px]" />
      <div className="aurora-2 absolute top-1/3 -right-32 w-[420px] h-[420px] rounded-full bg-violet-600/15 blur-[140px]" />
      <div className="aurora-3 absolute -bottom-32 left-1/4 w-[460px] h-[460px] rounded-full bg-cyan-500/12 blur-[130px]" />
      <div className="aurora-1 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] rounded-full bg-blue-600/10 blur-[100px]" style={{ animationDelay: '-6s' }} />
    </div>
  );
}

