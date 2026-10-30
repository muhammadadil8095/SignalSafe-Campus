/**
 * Spinner — accessible loading indicator.
 */
interface Props {
  label?: string;
}

export default function Spinner({ label = 'Loading…' }: Props) {
  return (
    <div role="status" aria-label={label} className="flex flex-col items-center gap-3">
      <svg
        className="animate-spin h-8 w-8 text-blue-400"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
      <span className="text-slate-400 text-sm">{label}</span>
    </div>
  );
}
