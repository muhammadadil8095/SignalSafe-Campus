/**
 * AdminPage — Clean, professional campus incident triage console.
 */
import { useEffect, useState, useCallback } from 'react';
import { api } from '../services/api';
import type { AdminReport, AuditEvent, ReportStatus } from '../types/api';
import ErrorBanner from '../components/ErrorBanner';
import Spinner from '../components/Spinner';
import RiskBadge from '../components/RiskBadge';

const STATUS_OPTIONS: ReportStatus[] = [
  'received',
  'under_review',
  'resolved',
  'dismissed',
];

const STATUS_CONFIG: Record<ReportStatus, { label: string; badgeClass: string }> = {
  received: {
    label: 'Received',
    badgeClass: 'bg-blue-950/40 border-blue-700/60 text-blue-300',
  },
  under_review: {
    label: 'Under Review',
    badgeClass: 'bg-amber-950/40 border-amber-700/60 text-amber-300',
  },
  resolved: {
    label: 'Resolved',
    badgeClass: 'bg-emerald-950/40 border-emerald-700/60 text-emerald-300',
  },
  dismissed: {
    label: 'Dismissed',
    badgeClass: 'bg-slate-800 border-slate-700 text-slate-400',
  },
};

export default function AdminPage() {
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('received');
  const [selectedReport, setSelectedReport] = useState<AdminReport | null>(null);
  const [auditLog, setAuditLog] = useState<AuditEvent[]>([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const [patchLoading, setPatchLoading] = useState(false);
  const [patchNote, setPatchNote] = useState('');
  const [patchStatus, setPatchStatus] = useState<ReportStatus>('received');

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getAdminReports(filterStatus || undefined);
      setReports(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load report queue. Administrator authorization required.',
      );
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    void fetchReports();
  }, [fetchReports]);

  const openReport = async (report: AdminReport) => {
    setSelectedReport(report);
    setPatchStatus(report.status);
    setPatchNote(report.admin_note ?? '');
    setAuditLog([]);
    setAuditLoading(true);
    try {
      const log = await api.getAuditLog(report.report_id);
      setAuditLog(log);
    } catch {
      // Non-blocking
    } finally {
      setAuditLoading(false);
    }
  };

  const handlePatch = async () => {
    if (!selectedReport) return;
    setPatchLoading(true);
    try {
      const updated = await api.patchAdminReport(selectedReport.report_id, {
        status: patchStatus,
        admin_note: patchNote.trim() || undefined,
      });
      setSelectedReport(updated);
      setReports((prev) =>
        prev.map((r) => (r.report_id === updated.report_id ? updated : r)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update report status.');
    } finally {
      setPatchLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">
            Incident Triage Console
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Campus security officer dashboard with append-only audit trail.
          </p>
        </div>

        <button
          onClick={() => void fetchReports()}
          className="btn-secondary text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setFilterStatus('')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
            filterStatus === ''
              ? 'bg-blue-600 text-white'
              : 'card-clean text-slate-400 hover:text-white'
          }`}
        >
          All
        </button>
        {STATUS_OPTIONS.map((s) => {
          const active = filterStatus === s;
          const cfg = STATUS_CONFIG[s];
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                active
                  ? 'bg-blue-600 text-white'
                  : 'card-clean text-slate-400 hover:text-white'
              }`}
            >
              {cfg.label}
            </button>
          );
        })}
      </div>

      {error && <ErrorBanner message={error} onRetry={() => void fetchReports()} />}

      {loading && (
        <div className="card-clean rounded-xl p-8">
          <Spinner label="Loading incident reports…" />
        </div>
      )}

      {/* Empty State */}
      {!loading && reports.length === 0 && (
        <div className="card-clean rounded-xl p-8 text-center space-y-1 text-slate-400">
          <p className="text-sm font-medium text-slate-300">No Incidents in Queue</p>
          <p className="text-xs">All clear for the selected filter state.</p>
        </div>
      )}

      {/* Incident List */}
      <div className="space-y-2.5">
        {reports.map((report) => {
          const isSelected = selectedReport?.report_id === report.report_id;
          const statusCfg = STATUS_CONFIG[report.status] ?? STATUS_CONFIG.received;

          return (
            <button
              key={report.report_id}
              onClick={() => void openReport(report)}
              className={`w-full text-left rounded-xl p-4 border transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 border-blue-500'
                  : 'card-interactive'
              }`}
            >
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white capitalize">
                      {report.category}
                    </span>
                    {report.pseudonymous && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        ANONYMOUS
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {new Date(report.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <RiskBadge
                    risk={
                      report.severity === 'critical' || report.severity === 'high'
                        ? 'red'
                        : report.severity === 'medium'
                        ? 'amber'
                        : 'green'
                    }
                  />
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${statusCfg.badgeClass}`}>
                    {statusCfg.label}
                  </span>
                </div>
              </div>

              {report.note && (
                <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                  "{report.note}"
                </p>
              )}
            </button>
          );
        })}
      </div>

      {/* Details & Action Drawer */}
      {selectedReport && (
        <div className="card-clean rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white">
              Incident Investigation
            </h2>
            <button
              onClick={() => setSelectedReport(null)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Close ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Report ID</p>
              <p className="text-slate-200 font-mono select-all mt-0.5">{selectedReport.report_id.slice(0, 14)}…</p>
            </div>
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Check ID</p>
              <p className="text-slate-200 font-mono select-all mt-0.5">{selectedReport.check_id.slice(0, 14)}…</p>
            </div>
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Category / Severity</p>
              <p className="text-slate-200 capitalize mt-0.5">{selectedReport.category} · {selectedReport.severity}</p>
            </div>
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Submission Type</p>
              <p className="text-slate-200 mt-0.5">{selectedReport.pseudonymous ? 'Anonymous' : 'Identified'}</p>
            </div>
          </div>

          {selectedReport.note && (
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase">Reporter Notes</p>
              <p className="text-xs text-slate-200 mt-1 p-2.5 rounded bg-slate-900 border border-slate-800 leading-relaxed">
                {selectedReport.note}
              </p>
            </div>
          )}

          {/* Status Mutation */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <p className="text-[11px] font-semibold text-slate-400 uppercase">Update Incident Status</p>

            <div className="grid grid-cols-2 gap-2">
              {STATUS_OPTIONS.map((s) => {
                const active = patchStatus === s;
                const cfg = STATUS_CONFIG[s];
                return (
                  <label
                    key={s}
                    className={`flex items-center gap-2 p-2 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                      active
                        ? 'bg-blue-950/40 border-blue-500 text-blue-300'
                        : 'card-clean text-slate-400 hover:text-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="patchStatus"
                      value={s}
                      checked={active}
                      onChange={() => setPatchStatus(s)}
                      className="sr-only"
                    />
                    <span className={`w-2 h-2 rounded-full ${active ? 'bg-blue-400' : 'bg-slate-600'}`} />
                    {cfg.label}
                  </label>
                );
              })}
            </div>

            <textarea
              rows={2}
              value={patchNote}
              onChange={(e) => setPatchNote(e.target.value)}
              placeholder="Internal resolution note for audit log..."
              maxLength={1000}
              className="w-full rounded-lg bg-slate-900 border border-slate-700 p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none font-mono"
            />

            <button
              onClick={() => void handlePatch()}
              disabled={patchLoading}
              className="w-full btn-primary py-2 px-3 rounded-lg text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
            >
              {patchLoading ? 'Updating Audit Ledger…' : 'Save Status Update'}
            </button>
          </div>

          {/* Audit Log */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <h3 className="text-[11px] font-semibold text-slate-400 uppercase">Audit Log Events</h3>

            {auditLoading && <Spinner label="Loading audit trail…" />}

            {!auditLoading && auditLog.length === 0 && (
              <p className="text-xs text-slate-500 font-mono">No audit events logged yet.</p>
            )}

            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {auditLog.map((evt) => (
                <div
                  key={evt.event_id}
                  className="flex items-center justify-between text-xs font-mono p-2 rounded bg-slate-900 border border-slate-800 text-slate-300"
                >
                  <div>
                    <span className="text-blue-400 font-semibold">{evt.action}</span>
                    <span className="text-slate-400 ml-1.5">by {evt.actor}</span>
                  </div>
                  <span className="text-slate-500 text-[10px]">{new Date(evt.created_at).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
