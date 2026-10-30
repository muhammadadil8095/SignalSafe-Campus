import type { RiskLevel } from '../../types/api';

interface Props {
  risk: RiskLevel;
  score?: number;
  size?: 'sm' | 'md' | 'lg';
}

const CONFIG: Record<RiskLevel, {
  label: string;
  pill: string;
  dot: string;
}> = {
  red: {
    label: 'High Risk',
    pill: 'bg-red-500/10 border-red-500/30 text-red-400',
    dot: 'bg-red-500',
  },
  amber: {
    label: 'Suspicious',
    pill: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    dot: 'bg-amber-500',
  },
  green: {
    label: 'Legitimate',
    pill: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    dot: 'bg-emerald-500',
  },
};

export default function RiskBadge({ risk, score, size = 'sm' }: Props) {
  const cfg = CONFIG[risk] ?? CONFIG.amber;
  const isLg = size === 'lg';

  return (
    <span
      role="status"
      aria-label={`Risk level: ${cfg.label}${score !== undefined ? `, score ${Math.round(score * 100)}` : ''}`}
      className={`inline-flex items-center gap-2 rounded-full font-semibold border ${cfg.pill} ${
        isLg ? 'px-3.5 py-1.5 text-sm' : 'px-2.5 py-1 text-xs'
      }`}
    >
      <span
        className={`rounded-full shrink-0 ${cfg.dot} ${isLg ? 'w-2.5 h-2.5' : 'w-2 h-2'}`}
        aria-hidden="true"
      />
      {cfg.label}
      {score !== undefined && (
        <span className="opacity-75 font-mono text-[11px] font-normal">
          ({Math.round(score * 100)}%)
        </span>
      )}
    </span>
  );
}
