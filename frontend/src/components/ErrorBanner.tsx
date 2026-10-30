/**
 * ErrorBanner — accessible inline error message with optional retry action.
 */
interface Props {
  message: string;
  onRetry?: () => void;
}

export default function ErrorBanner({ message, onRetry }: Props) {
  return (
    <div
      role="alert"
      className="rounded-xl bg-red-500/10 border border-red-500/30 p-4 flex items-start gap-3"
    >
      {/* Icon */}
      <svg
        className="w-5 h-5 text-red-400 shrink-0 mt-0.5"
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
      <div className="flex-1 min-w-0">
        <p className="text-red-300 text-sm">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-xs text-red-400 underline hover:text-red-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 rounded"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
