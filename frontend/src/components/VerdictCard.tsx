/**
 * VerdictCard — Swiss luxury-brutalist threat analysis presentation.
 * High-contrast monochromatic typography, clean data grid, and explainability breakdown.
 */
import type { AnalysisResponse } from '../../types/api';
import RiskBadge from './RiskBadge';

interface Props {
  result: AnalysisResponse;
  onReport?: () => void;
}

export default function VerdictCard({ result, onReport }: Props) {
  const scorePct = Math.round(result.score * 100);

  return (
    <article
      aria-label="Verdict details"
      className="border border-[#1e1e1e] bg-[#ffffff] p-6 sm:p-8 space-y-6 w-full max-w-lg mx-auto shadow-sm font-satoshi"
    >
      {/* Header Info */}
      <div className="flex items-center justify-between pb-4 border-b border-[#1e1e1e]/15">
        <RiskBadge risk={result.risk} score={result.score} size="md" />
        <span className="font-mono text-xs uppercase tracking-wider text-[#838282]">
          {result.kind} · {result.model_version}
        </span>
      </div>

      {/* Threat Score Metric */}
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-[#838282]">
            THREAT CONFIDENCE COEFFICIENT
          </span>
          <span className="font-clash text-2xl font-bold text-[#111111]">
            {scorePct}%
          </span>
        </div>

        {/* High contrast sharp meter */}
        <div
          className="h-2 bg-[#f2f2f2] border border-[#1e1e1e]/20 overflow-hidden"
          role="progressbar"
          aria-valuenow={scorePct}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full bg-[#111111] transition-all duration-500 ease-out"
            style={{ width: `${Math.max(scorePct, 2)}%` }}
          />
        </div>
      </div>

      {/* Target Host */}
      {result.domain && (
        <div className="p-3 bg-[#f2f2f2] border border-[#1e1e1e]/15 flex items-center justify-between text-xs">
          <span className="font-mono uppercase text-[10px] text-[#838282]">HOST IDENTIFIER</span>
          <code className="font-mono font-bold text-[#111111] select-all">
            {result.domain}
          </code>
        </div>
      )}

      {/* Editorial Advisement Box */}
      <div className="border border-[#1e1e1e] p-4 bg-[#f2f2f2]">
        <span className="font-mono text-[10px] uppercase tracking-widest text-[#111111] font-bold block mb-1">
          TACTICAL DIRECTIVE
        </span>
        <p className="text-xs sm:text-sm text-[#111111] font-medium leading-relaxed">
          {result.advice}
        </p>
      </div>

      {/* Explainable Telemetry Signals */}
      {result.reasons.length > 0 && (
        <section aria-label="Detection reasons" className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="font-clash text-sm font-bold uppercase tracking-tight text-[#111111]">
              Forensic Signal Log
            </h3>
            <span className="font-mono text-[11px] text-[#838282]">
              {result.reasons.length} FLAGS IDENTIFIED
            </span>
          </div>

          <div className="space-y-2">
            {result.reasons.map((r) => (
              <div
                key={r.code}
                className="p-3 border border-[#1e1e1e]/15 bg-[#ffffff] flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <p className="text-[#111111] font-medium leading-normal">
                    {r.text}
                  </p>
                </div>
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-[#f2f2f2] border border-[#1e1e1e]/20 text-[#111111] shrink-0">
                  {r.code}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tags */}
      {result.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {result.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-mono uppercase px-2 py-0.5 border border-[#1e1e1e]/20 bg-[#ffffff] text-[#838282]"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Dossier ID */}
      <div className="pt-2 border-t border-[#1e1e1e]/15 flex items-center justify-between text-[11px] font-mono text-[#838282]">
        <span>CHECK ID:</span>
        <code className="text-[#111111] select-all">{result.check_id}</code>
      </div>

      {/* Report Button: Pill button that inverts on hover */}
      {onReport && (
        <button
          onClick={onReport}
          className="w-full pill-button-invert py-3 px-6 text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 cursor-pointer mt-4"
        >
          <span>Escalate to Security Administration</span>
          <span>→</span>
        </button>
      )}
    </article>
  );
}
