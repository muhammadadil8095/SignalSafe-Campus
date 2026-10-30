/**
 * AdminPage — campus administrator triage console.
 * Styled as a futuristic incident command console with glassmorphism,
 * real-time filtering, audit timeline, and quick status mutation.
 *
 * All authorization and RLS enforced securely on the backend.
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

const STATUS_CONFIG: Record<ReportStatus, { label: string; color: string; pill: string }> = {
  received: {
    label: 'Received',
    color: 'text-blue-400',
    pill: 'bg-blue-500/15 border-blue-500/30 text-blue-300',
  },
  under_review: {
    label: 'Under Review',
    color: 'text-amber-400',
    pill: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
  },
  resolved: {
    label: 'Resolved',
    color: 'text-emerald-400',
    pill: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
  },
  dismissed: {
    label: 'Dismissed',
    color: 'text-slate-400',
    pill: 'bg-slate-700/30 border-slate-600/30 text-slate-400',
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
          : 'Unable to query admin report queue. Authentication required.',
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
      // Non-blocking: audit logs are secondary
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
      setError(err instanceof Error ? err.message : 'Status transition failed.');
    } finally {
      setPatchLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 float-in">
      {/* Deck Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Incident Triage Command Deck
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Campus security officer oversight • Append-only audit verification
          </p>
        </div>

        <button
          onClick={() => void fetchReports()}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-xl glass border border-white/10 hover:border-cyan-400/30 transition-all cursor-pointer"
        >
          <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Refresh Feed
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setFilterStatus('')}
          className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer whitespace-nowrap ${
            filterStatus === ''
              ? 'bg-blue-600/20 border-blue-400 text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.3)]'
              : 'glass border-white/5 text-slate-400 hover:text-white'
          }`}
        >
          All Incident Types
        </button>
        {STATUS_OPTIONS.map((s) => {
          const active = filterStatus === s;
          const cfg = STATUS_CONFIG[s];
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer whitespace-nowrap ${
                active
                  ? 'bg-blue-600/20 border-blue-400 text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.3)]'
                  : 'glass border-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {cfg.label}
            </button>
          );
        })}
      </div>

      {error && <ErrorBanner message={error} onRetry={() => void fetchReports()} />}

      {loading && (
        <div className="rounded-3xl glass p-10">
          <Spinner label="Querying campus incident database…" />
        </div>
      )}

      {/* Empty State */}
      {!loading && reports.length === 0 && (
        <div className="rounded-3xl glass p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center mx-auto text-slate-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-slate-300">Queue is Clear</p>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            No incidents found matching current filter state.
          </p>
        </div>
      )}

      {/* Incident Cards Feed */}
      <div className="space-y-3">
        {reports.map((report) => {
          const isSelected = selectedReport?.report_id === report.report_id;
          const statusCfg = STATUS_CONFIG[report.status] ?? STATUS_CONFIG.received;

          return (
            <button
              key={report.report_id}
              onClick={() => void openReport(report)}
              className={`w-full text-left rounded-3xl p-5 border transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'glass-strong border-cyan-400/50 shadow-[0_0_24px_rgba(34,211,238,0.15)]'
                  : 'glass border-white/5 hover:border-white/15'
              }`}
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white capitalize">
                      {report.category} Incident
                    </span>
                    {report.pseudonymous && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-white/5">
                        ANONYMOUS
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] font-mono text-slate-500">
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
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${statusCfg.pill}`}>
                    {statusCfg.label}
                  </span>
                </div>
              </div>

              {report.note && (
                <p className="text-xs text-slate-300 mt-3 line-clamp-2 leading-relaxed bg-slate-950/40 p-2.5 rounded-xl border border-white/5">
                  "{report.note}"
                </p>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Report Inspection & Remediation Console */}
      {selectedReport && (
        <div className="rounded-3xl glass-strong border border-white/10 p-6 space-y-5 shadow-2xl relative overflow-hidden float-in">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              Incident Remediation Panel
            </h2>
            <button
              onClick={() => setSelectedReport(null)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Close ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-2xl bg-slate-950/40 border border-white/5">
              <p className="text-[10px] uppercase text-slate-500">Report ID</p>
              <p className="text-slate-200 select-all font-semibold mt-0.5">{selectedReport.report_id.slice(0, 12)}…</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950/40 border border-white/5">
              <p className="text-[10px] uppercase text-slate-500">Check UUID</p>
              <p className="text-cyan-300 select-all font-semibold mt-0.5">{selectedReport.check_id.slice(0, 12)}…</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950/40 border border-white/5">
              <p className="text-[10px] uppercase text-slate-500">Category / Severity</p>
              <p className="text-slate-200 capitalize mt-0.5">{selectedReport.category} · {selectedReport.severity}</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950/40 border border-white/5">
              <p className="text-[10px] uppercase text-slate-500">Disclosure Mode</p>
              <p className="text-slate-200 mt-0.5">{selectedReport.pseudonymous ? 'Pseudonymous' : 'Identified'}</p>
            </div>
          </div>

          {selectedReport.note && (
            <div className="space-y-1">
              <p className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
                Reporter Narrative
              </p>
              <p className="text-xs text-slate-300 p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 leading-relaxed">
                {selectedReport.note}
              </p>
            </div>
          )}

          {/* Status Mutation Controls */}
          <div className="space-y-3 pt-3 border-t border-white/5">
            <p className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
              Escalate / Triage Incident
            </p>

            <div className="grid grid-cols-2 gap-2">
              {STATUS_OPTIONS.map((s) => {
                const active = patchStatus === s;
                const cfg = STATUS_CONFIG[s];
                return (
                  <label
                    key={s}
                    className={`flex items-center gap-2 p-2.5 rounded-2xl border text-xs font-medium cursor-pointer transition-all ${
                      active
                        ? 'bg-blue-600/20 border-blue-400 text-blue-300 shadow-md'
                        : 'glass border-white/5 text-slate-400 hover:text-white'
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
                    <span className={`w-2 h-2 rounded-full ${active ? 'bg-cyan-400' : 'bg-slate-600'}`} />
                    {cfg.label}
                  </label>
                );
              })}
            </div>

            <textarea
              rows={2}
              value={patchNote}
              onChange={(e) => setPatchNote(e.target.value)}
              placeholder="Internal resolution note (e.g. Physical sticker removed from Hall C)..."
              maxLength={1000}
              className="w-full rounded-2xl bg-slate-950/70 p-3 text-xs text-slate-200 placeholder-slate-600 border border-white/5 focus:outline-none focus:ring-1 focus:ring-cyan-400 resize-none font-mono"
            />

            <button
              onClick={() => void handlePatch()}
              disabled={patchLoading}
              className="w-full btn-glow py-3 px-4 rounded-2xl text-xs font-semibold text-white flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {patchLoading ? 'Updating Audit Ledger…' : 'Commit Status Modification'}
            </button>
          </div>

          {/* Audit Trail Timeline */}
          <div className="pt-3 border-t border-white/5 space-y-2">
            <h3 className="text-[11px] font-mono uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              Cryptographic Audit Log
            </h3>

            {auditLoading && <Spinner label="Querying append-only event stream…" />}

            {!auditLoading && auditLog.length === 0 && (
              <p className="text-[11px] text-slate-500 font-mono">No prior audit modifications registered.</p>
            )}

            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {auditLog.map((evt) => (
                <div
                  key={evt.event_id}
                  className="flex items-start gap-2.5 text-[11px] font-mono p-2.5 rounded-xl bg-slate-950/40 border border-white/5"
                >
                  <span className="text-cyan-400 font-semibold">{evt.action}</span>
                  <span className="text-slate-400">by {evt.actor}</span>
                  <span className="text-slate-600 ml-auto">{new Date(evt.created_at).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
