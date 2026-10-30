/**
 * AdminPage — campus administrator triage console.
 * Lists received reports, allows status updates and shows audit log.
 *
 * Access control is enforced at the backend (RLS + role check).
 * This page only shows what the API returns for the authenticated session.
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

const STATUS_COLOR: Record<ReportStatus, string> = {
  received: 'text-blue-400',
  under_review: 'text-amber-400',
  resolved: 'text-emerald-400',
  dismissed: 'text-slate-500',
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
      setError(err instanceof Error ? err.message : 'Failed to load reports.');
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
      // Audit log is optional; don't block review
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
      setError(err instanceof Error ? err.message : 'Failed to update report.');
    } finally {
      setPatchLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Admin — Incident Triage</h1>
        <p className="text-slate-400 text-sm mt-1">
          Review reported incidents. Access is controlled by the backend.
        </p>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-slate-500 font-semibold uppercase tracking-widest">Filter:</span>
        {['', ...STATUS_OPTIONS].map((s) => (
          <button
            key={s || 'all'}
            onClick={() => setFilterStatus(s)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              filterStatus === s
                ? 'bg-blue-600/20 border-blue-500/40 text-blue-300'
                : 'border-slate-700/50 text-slate-500 hover:text-slate-300'
            }`}
          >
            {s || 'All'}
          </button>
        ))}
        <button
          onClick={() => void fetchReports()}
          className="ml-auto text-xs px-3 py-1.5 rounded-full border border-slate-700/50 text-slate-500 hover:text-slate-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          Refresh
        </button>
      </div>

      {error && <ErrorBanner message={error} onRetry={() => void fetchReports()} />}

      {loading && (
        <div className="flex justify-center py-10">
          <Spinner label="Loading reports…" />
        </div>
      )}

      {/* Report list */}
      {!loading && reports.length === 0 && (
        <p className="text-slate-500 text-sm text-center py-8">No reports found.</p>
      )}

      <div className="space-y-3">
        {reports.map((report) => (
          <button
            key={report.report_id}
            onClick={() => void openReport(report)}
            className={`w-full text-left rounded-2xl border p-4 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              selectedReport?.report_id === report.report_id
                ? 'bg-blue-600/10 border-blue-500/40'
                : 'bg-slate-800/40 border-slate-700/40 hover:bg-slate-800/70'
            }`}
          >
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div>
                <p className="text-sm font-semibold text-white capitalize">
                  {report.category}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {new Date(report.created_at).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <RiskBadge
                  risk={report.severity === 'critical' || report.severity === 'high' ? 'red' : report.severity === 'medium' ? 'amber' : 'green'}
                />
                <span className={`text-xs font-semibold ${STATUS_COLOR[report.status]}`}>
                  {report.status.replace('_', ' ')}
                </span>
              </div>
            </div>
            {report.note && (
              <p className="text-xs text-slate-400 mt-2 line-clamp-2">{report.note}</p>
            )}
          </button>
        ))}
      </div>

      {/* Detail panel */}
      {selectedReport && (
        <div className="rounded-2xl bg-slate-800/60 border border-slate-700/60 p-5 space-y-4">
          <h2 className="text-base font-bold text-white">Report Detail</h2>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <Info label="Report ID" value={selectedReport.report_id} mono />
            <Info label="Check ID" value={selectedReport.check_id} mono />
            <Info label="Category" value={selectedReport.category} />
            <Info label="Severity" value={selectedReport.severity} />
            <Info label="Pseudonymous" value={selectedReport.pseudonymous ? 'Yes' : 'No'} />
            <Info label="Created" value={new Date(selectedReport.created_at).toLocaleString()} />
          </div>

          {selectedReport.note && (
            <div>
              <p className="text-xs text-slate-500 mb-1">Reporter note</p>
              <p className="text-sm text-slate-300 leading-relaxed">{selectedReport.note}</p>
            </div>
          )}

          {/* Update status */}
          <div className="space-y-3 pt-2 border-t border-slate-700/40">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              Update status
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {STATUS_OPTIONS.map((s) => (
                <label
                  key={s}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer text-xs transition-colors ${
                    patchStatus === s
                      ? 'bg-blue-600/20 border-blue-500/40 text-blue-300'
                      : 'bg-slate-900/30 border-slate-700/40 text-slate-400 hover:bg-slate-800/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="patchStatus"
                    value={s}
                    checked={patchStatus === s}
                    onChange={() => setPatchStatus(s)}
                    className="sr-only"
                  />
                  {s.replace('_', ' ')}
                </label>
              ))}
            </div>

            <textarea
              rows={3}
              value={patchNote}
              onChange={(e) => setPatchNote(e.target.value)}
              placeholder="Admin note (optional)…"
              maxLength={1000}
              className="w-full rounded-xl bg-slate-900/40 border border-slate-700/50 text-slate-200 placeholder-slate-600 text-sm px-4 py-3 resize-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            />

            <button
              onClick={() => void handlePatch()}
              disabled={patchLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/40 text-white text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer disabled:cursor-not-allowed"
            >
              {patchLoading ? 'Saving…' : 'Save update'}
            </button>
          </div>

          {/* Audit log */}
          <div className="pt-2 border-t border-slate-700/40">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
              Audit log
            </h3>
            {auditLoading && <Spinner label="Loading audit log…" />}
            {!auditLoading && auditLog.length === 0 && (
              <p className="text-xs text-slate-600">No audit events found.</p>
            )}
            <ol className="space-y-2">
              {auditLog.map((evt) => (
                <li key={evt.event_id} className="text-xs text-slate-400">
                  <span className="text-slate-500">
                    {new Date(evt.created_at).toLocaleString()}
                  </span>{' '}
                  — <span className="text-slate-300 font-medium">{evt.action}</span> by{' '}
                  <span className="text-slate-400">{evt.actor}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}

function Info({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-slate-500 mb-0.5">{label}</p>
      <p className={`text-slate-300 break-all ${mono ? 'font-mono text-xs' : ''}`}>{value}</p>
    </div>
  );
}
