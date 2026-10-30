/**
 * Spinner — accessible cyber/radar loading indicator with glowing rings.
 * Magic UI & Unlumen AI inspired styling.
 */
interface Props {
  label?: string;
}

export default function Spinner({ label = 'Analysing threat telemetry…' }: Props) {
  return (
    <div
      role="status"
      aria-label={label}
      className="flex flex-col items-center justify-center gap-4 py-6"
    >
      <div className="relative flex items-center justify-center w-14 h-14">
        {/* Outer pulsating ring */}
        <div className="absolute inset-0 rounded-full border border-blue-500/30 ping-slow" />
        {/* Spinning gradient ring */}
        <div className="absolute inset-1 rounded-full border-2 border-transparent border-t-blue-400 border-r-indigo-500 animate-spin" />
        {/* Inner reverse spinner */}
        <div
          className="absolute inset-3 rounded-full border border-transparent border-b-cyan-400 border-l-violet-400 animate-spin"
          style={{ animationDirection: 'reverse', animationDuration: '1.2s' }}
        />
        {/* Core pulsing glow dot */}
        <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-blue-400 to-cyan-300 shadow-lg shadow-cyan-400/50 animate-pulse" />
      </div>

      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
        <span className="text-xs font-medium tracking-wide text-slate-300 uppercase">
          {label}
        </span>
      </div>
    </div>
  );
}
