/**
 * Spinner — Swiss minimalist monochromatic loader.
 */
interface Props {
  label?: string;
}

export default function Spinner({ label = 'PROCESSING TELEMETRY…' }: Props) {
  return (
    <div
      role="status"
      aria-label={label}
      className="flex flex-col items-center justify-center gap-3 py-8 font-satoshi"
    >
      <div className="w-8 h-8 rounded-full border border-[#1e1e1e]/20 border-t-[#111111] animate-spin" />
      <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-[#838282]">
        {label}
      </span>
    </div>
  );
}
