/**
 * VerdictCard — displays full analysis result: risk badge, score bar,
 * reasons list, tags and advice. All data comes from the backend.
 * No risk logic is calculated here.
 */
import type { AnalysisResponse } from '../../types/api';
import RiskBadge from './RiskBadge';

interface Props {
  result: AnalysisResponse;
  onReport?: () => void;
}

const RISK_BAR: Record<string, string> = {
  red: 'bg-red-500',
  amber: 'bg-amber-400',
  green: 'bg-emerald-500',
};

export default function VerdictCard({ result, onReport }: Props) {
  const barColor = RISK_BAR[result.risk] ?? 'bg-slate-500';
  const barWidth = `${Math.round(result.score * 100)}%`;

  return (
    <article
      aria-label="Verdict details"
      className="rounded-2xl bg-slate-800/60 border border-slate-700/60 p-5 space-y-5 w-full max-w-lg mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <RiskBadge risk={result.risk} score={result.score} />
        <span className="text-xs text-slate-500">
          {result.kind.toUpperCase()} · {result.model_version}
        </span>
      </div>

      {/* Score bar */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span>Risk score</span>
          <span>{Math.round(result.score * 100)} / 100</span>
        </div>
        <div
          className="h-2 rounded-full bg-slate-700 overflow-hidden"
          role="progressbar"
          aria-valuenow={Math.round(result.score * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Risk score"
        >
          <div
            className={`h-full rounded-full transition-all duration-700 ${barColor}`}
            style={{ width: barWidth }}
          />
        </div>
      </div>

      {/* Domain (for URL checks) */}
      {result.domain && (
        <div className="text-sm text-slate-400">
          <span className="text-slate-500 mr-1">Domain:</span>
          <code className="text-slate-300 bg-slate-900/40 px-1.5 py-0.5 rounded text-xs">
            {result.domain}
          </code>
        </div>
      )}

      {/* Advice */}
      <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-3">
        <p className="text-sm text-blue-300 leading-relaxed">{result.advice}</p>
      </div>

      {/* Reasons */}
      {result.reasons.length > 0 && (
        <section aria-label="Detection reasons">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
            Why we flagged this
          </h3>
          <ul className="space-y-2">
            {result.reasons.map((r) => (
              <li
                key={r.code}
                className="flex items-start gap-2 text-sm text-slate-300"
              >
                <span className="mt-0.5 w-2 h-2 rounded-full bg-slate-500 shrink-0" aria-hidden="true" />
                <span>
                  {r.text}
                  <span className="ml-1.5 text-xs text-slate-500">
                    [{r.code}]
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Tags */}
      {result.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5" aria-label="Tags">
          {result.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-slate-700/60 text-slate-400 border border-slate-600/40"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* check_id (for report linkage) */}
      <p className="text-xs text-slate-600">
        Check ID: <code className="text-slate-500">{result.check_id}</code>
      </p>

      {/* Report button */}
      {onReport && (
        <button
          onClick={onReport}
          className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 border border-slate-600/50 text-slate-200 text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          Report this threat
        </button>
      )}
    </article>
  );
}
