/**
 * ErrorBanner — Swiss brutalist alert container.
 */
interface Props {
  message: string;
  onRetry?: () => void;
}

export default function ErrorBanner({ message, onRetry }: Props) {
  return (
    <div
      role="alert"
      className="border border-[#1e1e1e] bg-[#ffffff] p-4 text-[#111111] font-satoshi flex items-start gap-3.5 shadow-sm"
    >
      <div className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 font-bold font-mono text-xs border border-[#111111]">
        !
      </div>

      <div className="flex-1 min-w-0">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#838282] block mb-0.5">
          ALERT / TELEMETRY ANOMALY
        </span>
        <p className="text-xs sm:text-sm font-medium leading-relaxed text-[#111111]">
          {message}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2.5 text-xs font-bold uppercase tracking-wider text-[#111111] underline underline-offset-4 hover:text-[#838282] transition-colors"
          >
            Retry Request →
          </button>
        )}
      </div>
    </div>
  );
}
