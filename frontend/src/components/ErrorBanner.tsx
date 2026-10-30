/**
 * ErrorBanner — Professional inline alert container.
 */
interface Props {
  message: string;
  onRetry?: () => void;
}

export default function ErrorBanner({ message, onRetry }: Props) {
  return (
    <div
      role="alert"
      className="rounded-xl bg-red-950/40 border border-red-800/60 p-4 flex items-start gap-3 text-red-200"
    >
      <div className="w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 text-red-400">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.008v.008H12v-.008Z"
          />
        </svg>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm font-medium leading-relaxed">
          {message}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-xs font-semibold text-red-400 hover:text-red-300 underline focus:outline-none focus:ring-1 focus:ring-red-400 rounded"
          >
            Retry request
          </button>
        )}
      </div>
    </div>
  );
}
