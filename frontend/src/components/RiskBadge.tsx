/**
 * RiskBadge — Swiss luxury-brutalist editorial risk pill.
 * High contrast monochromatic aesthetic with clear categorical distinction.
 */
import type { RiskLevel } from '../types/api';

interface Props {
  risk: RiskLevel;
  score?: number;
  size?: 'sm' | 'md' | 'lg';
}

const CONFIG: Record<RiskLevel, {
  label: string;
  classes: string;
  indicator: string;
}> = {
  red: {
    label: 'HIGH RISK',
    classes: 'bg-[#111111] text-[#f2f2f2] border border-[#111111]',
    indicator: 'bg-red-500',
  },
  amber: {
    label: 'SUSPICIOUS',
    classes: 'bg-[#ffffff] text-[#111111] border border-[#1e1e1e]/40',
    indicator: 'bg-amber-500',
  },
  green: {
    label: 'LEGITIMATE',
    classes: 'bg-[#ffffff] text-[#111111] border border-[#1e1e1e]/20',
    indicator: 'bg-emerald-500',
  },
};

export default function RiskBadge({ risk, score, size = 'sm' }: Props) {
  const cfg = CONFIG[risk] ?? CONFIG.amber;
  const isLg = size === 'lg';

  return (
    <span
      role="status"
      aria-label={`Risk level: ${cfg.label}${score !== undefined ? `, score ${Math.round(score * 100)}` : ''}`}
      className={`inline-flex items-center gap-2 rounded-full font-mono font-bold tracking-wider uppercase ${cfg.classes} ${
        isLg ? 'px-4 py-1.5 text-xs' : 'px-3 py-1 text-[10px]'
      }`}
    >
      <span
        className={`rounded-full shrink-0 ${cfg.indicator} ${isLg ? 'w-2 h-2' : 'w-1.5 h-1.5'}`}
        aria-hidden="true"
      />
      {cfg.label}
      {score !== undefined && (
        <span className="opacity-60 font-mono text-[10px]">
          [{Math.round(score * 100)}%]
        </span>
      )}
    </span>
  );
}
