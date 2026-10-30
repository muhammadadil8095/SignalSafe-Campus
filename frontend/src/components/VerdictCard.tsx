/**
 * VerdictCard — Clear, comprehensive, and easy-to-understand threat breakdown.
 */
import type { AnalysisResponse } from '../../types/api';
import RiskBadge from './RiskBadge';

interface Props {
  result: AnalysisResponse;
  onReport?: () => void;
}

const RISK_LABELS: Record<string, string> = {
  red: 'HIGH RISK — LIKELY SCAM',
  amber: 'SUSPICIOUS — PROCEED WITH CAUTION',
  green: 'LEGITIMATE — SAFE TO PROCEED',
};

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
          {result.kind.toUpperCase()} CHECK
        </span>
      </div>

      {/* Human-Readable Risk Summary */}
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-[#838282]">
            THREAT RISK RATING
          </span>
          <span className="font-clash text-2xl font-bold text-[#111111]">
            {scorePct} / 100
          </span>
        </div>

        {/* Sharp High-Contrast Progress Bar */}
        <div
          className="h-2.5 bg-[#f2f2f2] border border-[#1e1e1e]/20 overflow-hidden"
          role="progressbar"
          aria-valuenow={scorePct}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className={`h-full transition-all duration-500 ease-out ${
              result.risk === 'red' ? 'bg-[#111111]' : result.risk === 'amber' ? 'bg-[#838282]' : 'bg-[#111111]'
            }`}
            style={{ width: `${Math.max(scorePct, 3)}%` }}
          />
        </div>

        <p className="text-xs font-mono text-[#838282]">
          Status:{' '}
          <span className="font-bold text-[#111111]">
            {RISK_LABELS[result.risk] || 'ANALYSIS COMPLETE'}
          </span>
        </p>
      </div>

      {/* Target Host */}
      {result.domain && (
        <div className="p-3 bg-[#f2f2f2] border border-[#1e1e1e]/15 flex items-center justify-between text-xs">
          <span className="font-mono uppercase text-[10px] text-[#838282]">WEBSITE ADDRESS CHECKED</span>
          <code className="font-mono font-bold text-[#111111] select-all">
            {result.domain}
          </code>
        </div>
      )}

      {/* What You Should Do Box */}
      <div className="border border-[#1e1e1e] p-4 bg-[#f2f2f2]">
        <span className="font-mono text-[10px] uppercase tracking-widest text-[#111111] font-bold block mb-1">
          RECOMMENDED ACTION
        </span>
        <p className="text-xs sm:text-sm text-[#111111] font-medium leading-relaxed">
          {result.advice}
        </p>
      </div>

      {/* Why We Flagged This */}
      {result.reasons.length > 0 && (
        <section aria-label="Detection reasons" className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="font-clash text-sm font-bold uppercase tracking-tight text-[#111111]">
              Why was this flagged? ({result.reasons.length} evidence points)
            </h3>
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

      {/* Security Tags */}
      {result.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {result.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-mono uppercase px-2 py-0.5 border border-[#1e1e1e]/20 bg-[#ffffff] text-[#838282]"
            >
              #{tag.replace(/_/g, ' ')}
            </span>
          ))}
        </div>
      )}

      {/* Check Verification ID */}
      <div className="pt-2 border-t border-[#1e1e1e]/15 flex items-center justify-between text-[11px] font-mono text-[#838282]">
        <span>INCIDENT CHECK CODE:</span>
        <code className="text-[#111111] select-all">{result.check_id}</code>
      </div>

      {/* Report Button */}
      {onReport && (
        <button
          onClick={onReport}
          className="w-full pill-button-invert py-3 px-6 text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 cursor-pointer mt-4"
        >
          <span>Report this scam to Campus Security</span>
          <span>→</span>
        </button>
      )}
    </article>
  );
}
