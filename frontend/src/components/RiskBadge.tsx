import type { RiskLevel } from '../../types/api';

interface Props {
  risk: RiskLevel;
  score?: number;
  size?: 'sm' | 'lg';
}

const CONFIG: Record<RiskLevel, {
  label: string;
  pill: string;
  dot: string;
  glow: string;
}> = {
  red: {
    label: 'High Risk',
    pill: 'bg-red-500/15 border border-red-500/30 text-red-300',
    dot: 'bg-red-400',
    glow: 'shadow-red-500/30',
  },
  amber: {
    label: 'Caution',
    pill: 'bg-amber-500/15 border border-amber-500/30 text-amber-300',
    dot: 'bg-amber-400',
    glow: 'shadow-amber-500/30',
  },
  green: {
    label: 'Safe',
    pill: 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300',
    dot: 'bg-emerald-400',
    glow: 'shadow-emerald-500/30',
  },
};

export default function RiskBadge({ risk, score, size = 'sm' }: Props) {
  const cfg = CONFIG[risk];
  const isLg = size === 'lg';

  return (
    <span
      role="status"
      aria-label={`Risk level: ${cfg.label}${score !== undefined ? `, score ${Math.round(score * 100)}` : ''}`}
      className={`inline-flex items-center gap-2 rounded-full font-semibold shadow-md ${cfg.pill} ${cfg.glow} ${isLg ? 'px-4 py-1.5 text-base' : 'px-3 py-1 text-xs'}`}
    >
      <span
        className={`rounded-full shrink-0 ${cfg.dot} ${isLg ? 'w-2.5 h-2.5' : 'w-2 h-2'} ${risk === 'red' ? 'animate-pulse' : ''}`}
        aria-hidden="true"
      />
      {cfg.label}
      {score !== undefined && (
        <span className={`opacity-60 font-normal ${isLg ? 'text-sm' : 'text-[10px]'}`}>
          {Math.round(score * 100)}%
        </span>
      )}
    </span>
  );
}
