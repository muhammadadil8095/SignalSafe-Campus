/**
 * Spinner — Clean, professional accessible loading indicator.
 */
interface Props {
  label?: string;
}

export default function Spinner({ label = 'Processing threat intelligence…' }: Props) {
  return (
    <div
      role="status"
      aria-label={label}
      className="flex flex-col items-center justify-center gap-3 py-6"
    >
      <div className="w-8 h-8 rounded-full border-2 border-slate-700 border-t-blue-500 animate-spin" />
      <span className="text-xs font-medium text-slate-400">
        {label}
      </span>
    </div>
  );
}
