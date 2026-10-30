/**
 * VerdictPage — displays backend analysis result.
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
      <div className="max-w-sm mx-auto text-center py-16 space-y-4">
        <p className="text-slate-400">No analysis result to display.</p>
        <Link
          to="/"
          className="text-blue-400 underline text-sm hover:text-blue-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
        >
          Go home
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
    <div className="max-w-lg mx-auto space-y-5">
      {/* Back link */}
      <button
        onClick={() => navigate(backPath)}
        className="flex items-center gap-1 text-sm text-slate-400 hover:text-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
        Back
      </button>

      <h1 className="text-xl font-bold text-white">Analysis Result</h1>

      <VerdictCard result={result} onReport={handleReport} />

      {/* Scan another */}
      <div className="flex gap-3 pt-2">
        <Link
          to="/scan"
          className="flex-1 text-center text-xs px-3 py-2 rounded-xl border border-slate-700/50 text-slate-400 hover:bg-slate-800/40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          Scan another QR
        </Link>
        <Link
          to="/check"
          className="flex-1 text-center text-xs px-3 py-2 rounded-xl border border-slate-700/50 text-slate-400 hover:bg-slate-800/40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          Check another item
        </Link>
      </div>

      {/* Privacy note */}
      <p className="text-xs text-slate-600 text-center">
        Risk scores come from the backend. Scan data is not stored unless you submit a report.
      </p>
    </div>
  );
}
