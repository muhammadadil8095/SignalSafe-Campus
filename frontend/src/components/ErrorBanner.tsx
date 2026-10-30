/**
 * ErrorBanner — accessible glass danger card with subtle neon red aura and retry action.
 */
interface Props {
  message: string;
  onRetry?: () => void;
}

export default function ErrorBanner({ message, onRetry }: Props) {
  return (
    <div
      role="alert"
      className="relative overflow-hidden rounded-2xl bg-red-950/30 border border-red-500/25 p-4 backdrop-blur-md shadow-lg shadow-red-950/40 flex items-start gap-3.5 float-in"
    >
      {/* Specular edge */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-400/40 to-transparent" />

      {/* Icon badge */}
      <div className="w-8 h-8 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center shrink-0 mt-0.5 text-red-400">
        <svg
          className="w-4 h-4"
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
        <p className="text-red-200 text-xs sm:text-sm font-medium leading-relaxed">
          {message}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 rounded-md"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
            Retry action
          </button>
        )}
      </div>
    </div>
  );
}
