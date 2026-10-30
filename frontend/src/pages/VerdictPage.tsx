/**
 * VerdictPage — Swiss luxury-brutalist dossier view.
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
      <div className="max-w-md mx-auto text-center py-20 space-y-4 font-satoshi">
        <p className="text-[#838282] text-sm">No analysis dossier active in memory.</p>
        <Link
          to="/"
          className="pill-button-invert inline-block px-6 py-2.5 text-xs uppercase tracking-wider font-bold"
        >
          Return to Overview
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
    <div className="max-w-lg mx-auto space-y-6 px-4 py-8 font-satoshi">
      {/* Navigation Line */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1e1e1e]/10">
        <button
          onClick={() => navigate(backPath)}
          className="inline-flex items-center gap-1.5 text-xs uppercase font-bold tracking-wider text-[#111111] hover:text-[#838282] transition-colors"
        >
          <span>←</span>
          <span>Back to Inspector</span>
        </button>

        <span className="font-mono text-xs uppercase tracking-widest text-[#838282]">
          VERIFIED BY ML ENGINE
        </span>
      </div>

      {/* Main Result Card */}
      <VerdictCard result={result} onReport={handleReport} />

      {/* Action Anchors */}
      <div className="grid grid-cols-2 gap-4 pt-2">
        <Link
          to="/scan"
          className="pill-button-invert text-center py-3 px-4 text-xs uppercase tracking-wider font-bold"
        >
          Scan Another QR
        </Link>
        <Link
          to="/check"
          className="pill-button-invert text-center py-3 px-4 text-xs uppercase tracking-wider font-bold"
        >
          Check Another Item
        </Link>
      </div>
    </div>
  );
}
