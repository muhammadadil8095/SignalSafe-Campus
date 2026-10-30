/**
 * VerdictPage — Displays backend analysis results in a clean layout.
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
      <div className="max-w-sm mx-auto text-center py-16 space-y-3">
        <p className="text-slate-400 text-sm">No analysis result loaded.</p>
        <Link
          to="/"
          className="inline-block px-3 py-1.5 rounded-lg bg-slate-800 text-blue-400 text-xs font-semibold hover:bg-slate-700 transition-colors"
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
    <div className="max-w-lg mx-auto space-y-4">
      {/* Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(backPath)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          Back to Inspector
        </button>

        <span className="text-[11px] font-mono text-slate-400">
          Inference Complete
        </span>
      </div>

      {/* Main Result */}
      <VerdictCard result={result} onReport={handleReport} />

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2.5 pt-1">
        <Link
          to="/scan"
          className="btn-secondary text-center text-xs py-2 px-3 rounded-lg"
        >
          Scan Another QR
        </Link>
        <Link
          to="/check"
          className="btn-secondary text-center text-xs py-2 px-3 rounded-lg"
        >
          Inspect Another Item
        </Link>
      </div>
    </div>
  );
}
