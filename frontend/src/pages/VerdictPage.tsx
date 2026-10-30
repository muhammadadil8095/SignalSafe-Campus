/**
 * VerdictPage — displays backend analysis result with high-end telemetry presentation.
 * Navigated to by ScanPage and CheckPage via router state.
 */
import { useLocation, useNavigate, Link } from 'react-router-dom';
import type { AnalysisResponse } from '../types/api';
import VerdictCard from '../components/VerdictCard';

interface LocationState {
  result: AnalysisResponse;
  source: string;
}

export default function VerdictPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;

  if (!state?.result) {
    return (
      <div className="max-w-sm mx-auto text-center py-20 space-y-4 float-in">
        <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center mx-auto text-slate-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </div>
        <p className="text-slate-400 text-sm">No analysis dossier active in memory.</p>
        <Link
          to="/"
          className="inline-block px-4 py-2 rounded-xl glass border border-white/10 text-cyan-400 text-xs font-semibold hover:border-cyan-400/40 transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const { result } = state;

  const handleReport = () => {
    navigate('/report', { state: { check_id: result.check_id, risk: result.risk } });
  };

  const backPath = state.source === 'qr' ? '/scan' : '/check';

  return (
    <div className="max-w-lg mx-auto space-y-6 float-in">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(backPath)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-xl glass border border-white/5"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          Back to Inspector
        </button>

        <span className="text-[11px] font-mono text-cyan-400 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          VERDICT VERIFIED
        </span>
      </div>

      {/* Main Result Card */}
      <VerdictCard result={result} onReport={handleReport} />

      {/* Next Actions */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <Link
          to="/scan"
          className="text-center text-xs font-medium py-3 px-3 rounded-2xl glass border border-white/10 text-slate-300 hover:text-white hover:border-cyan-400/40 transition-all shadow-md"
        >
          Scan Another QR
        </Link>
        <Link
          to="/check"
          className="text-center text-xs font-medium py-3 px-3 rounded-2xl glass border border-white/10 text-slate-300 hover:text-white hover:border-indigo-400/40 transition-all shadow-md"
        >
          Inspect Another Item
        </Link>
      </div>

      {/* Audit Notice */}
      <p className="text-[11px] text-slate-500 text-center font-mono">
        All verdicts generated securely by centralized XGBoost/Rule pipeline.
      </p>
    </div>
  );
}
