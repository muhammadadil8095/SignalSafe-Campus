/**
 * RiskBadge — colour-coded pill for red / amber / green verdicts.
 * Accessible: includes role="status" and a descriptive aria-label.
 */
import type { RiskLevel } from '../../types/api';

interface Props {
  risk: RiskLevel;
  score?: number;
}

const CONFIG: Record<RiskLevel, { label: string; classes: string; dot: string }> = {
  red: {
    label: 'High Risk',
    classes: 'bg-red-500/15 border border-red-500/40 text-red-300',
    dot: 'bg-red-400 animate-pulse',
  },
  amber: {
    label: 'Caution',
    classes: 'bg-amber-500/15 border border-amber-500/40 text-amber-300',
    dot: 'bg-amber-400',
  },
  green: {
    label: 'Safe',
    classes: 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300',
    dot: 'bg-emerald-400',
  },
};

export default function RiskBadge({ risk, score }: Props) {
  const cfg = CONFIG[risk];
  return (
    <span
      role="status"
      aria-label={`Risk level: ${cfg.label}${score !== undefined ? `, score ${Math.round(score * 100)}` : ''}`}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${cfg.classes}`}
    >
      <span className={`w-2 h-2 rounded-full ${cfg.dot}`} aria-hidden="true" />
      {cfg.label}
      {score !== undefined && (
        <span className="ml-1 opacity-70 text-xs font-normal">
          {Math.round(score * 100)}%
        </span>
      )}
    </span>
  );
}
