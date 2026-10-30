/**
 * VerdictCard — Displays threat analysis results in a clean, professional,
 * institutional format.
 */
import type { AnalysisResponse } from '../../types/api';
import RiskBadge from './RiskBadge';

interface Props {
  result: AnalysisResponse;
  onReport?: () => void;
}

const RISK_COLORS: Record<string, { bar: string; text: string }> = {
  red: {
    bar: 'bg-red-500',
    text: 'text-red-400',
  },
  amber: {
    bar: 'bg-amber-500',
    text: 'text-amber-400',
  },
  green: {
    bar: 'bg-emerald-500',
    text: 'text-emerald-400',
  },
};

export default function VerdictCard({ result, onReport }: Props) {
  const theme = RISK_COLORS[result.risk] ?? RISK_COLORS.amber;
  const scorePct = Math.round(result.score * 100);

  return (
    <article
      aria-label="Verdict details"
      className="rounded-xl card-clean p-6 space-y-5 w-full max-w-lg mx-auto"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-800">
        <RiskBadge risk={result.risk} score={result.score} size="md" />
        <span className="text-xs font-mono text-slate-400 uppercase">
          {result.kind} · {result.model_version}
        </span>
      </div>

      {/* Threat Score Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-medium">
          <span className="text-slate-400">Threat Confidence Score</span>
          <span className={`font-mono font-semibold ${theme.text}`}>
            {scorePct}%
          </span>
        </div>
        <div
          className="h-2 rounded-full bg-slate-800 overflow-hidden"
          role="progressbar"
          aria-valuenow={scorePct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Threat confidence score"
        >
          <div
            className={`h-full rounded-full transition-all duration-500 ${theme.bar}`}
            style={{ width: `${Math.max(scorePct, 3)}%` }}
          />
        </div>
      </div>

      {/* Target Domain if applicable */}
      {result.domain && (
        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs">
          <span className="text-slate-400">Target Host:</span>
          <code className="font-mono text-slate-200 font-semibold px-2 py-0.5 rounded bg-slate-800">
            {result.domain}
          </code>
        </div>
      )}

      {/* Recommended Advice */}
      <div className="rounded-lg bg-blue-950/20 border border-blue-900/40 p-4">
        <div className="flex items-center gap-2 mb-1 text-blue-400 font-semibold text-xs">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z" />
          </svg>
          Recommended Safety Action
        </div>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
          {result.advice}
        </p>
      </div>

      {/* Evidence-Backed Explainability Reasons */}
      {result.reasons.length > 0 && (
        <section aria-label="Detection reasons" className="space-y-2 pt-1">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Detected Threat Signals ({result.reasons.length})
          </h3>
          <div className="space-y-1.5">
            {result.reasons.map((r) => (
              <div
                key={r.code}
                className="flex items-start justify-between gap-3 p-3 rounded-lg bg-slate-900/70 border border-slate-800/80 text-xs"
              >
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0 mt-1.5" />
                  <span className="text-slate-300 leading-normal">{r.text}</span>
                </div>
                <span className="shrink-0 font-mono text-[11px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                  {r.code}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tags */}
      {result.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1" aria-label="Tags">
          {result.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Check ID */}
      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500 font-mono">
        <span>Check ID:</span>
        <code className="text-slate-400 select-all">{result.check_id}</code>
      </div>

      {/* Report Button */}
      {onReport && (
        <button
          onClick={onReport}
          className="w-full btn-primary py-2.5 px-4 rounded-lg text-sm font-medium transition-colors cursor-pointer"
        >
          Report Threat to Campus Security
        </button>
      )}
    </article>
  );
}
