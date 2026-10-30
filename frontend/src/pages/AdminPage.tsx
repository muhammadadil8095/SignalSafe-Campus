/**
 * AdminPage — Swiss luxury-brutalist campus incident triage console.
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

const STATUS_LABELS: Record<ReportStatus, string> = {
  received: 'RECEIVED',
  under_review: 'UNDER REVIEW',
  resolved: 'RESOLVED',
  dismissed: 'DISMISSED',
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
          : 'Failed to query report queue. Administrator authorization required.',
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
    <div className="max-w-4xl mx-auto space-y-6 px-4 py-8 font-satoshi">
      {/* Console Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 border-b border-[#1e1e1e]/15 gap-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#838282] block">
            ADMINISTRATIVE DISPATCH
          </span>
          <h1 className="font-clash text-3xl font-bold tracking-tight text-[#111111] mt-1">
            Incident Triage Deck
          </h1>
          <p className="text-xs text-[#838282] mt-0.5">
            Campus security officer oversight with append-only cryptographic audit logging.
          </p>
        </div>

        <button
          onClick={() => void fetchReports()}
          className="pill-button-invert px-5 py-2 text-xs uppercase tracking-wider font-bold inline-flex items-center gap-2 self-start sm:self-auto"
        >
          <span>Refresh Queue</span>
          <span>↻</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono font-bold">
        <button
          onClick={() => setFilterStatus('')}
          className={`px-3 py-1.5 border transition-colors whitespace-nowrap uppercase ${
            filterStatus === ''
              ? 'bg-[#111111] text-[#f2f2f2] border-[#111111]'
              : 'bg-[#ffffff] text-[#111111] border-[#1e1e1e]/20 hover:border-[#1e1e1e]/50'
          }`}
        >
          ALL QUEUES
        </button>
        {STATUS_OPTIONS.map((s) => {
          const active = filterStatus === s;
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 border transition-colors whitespace-nowrap uppercase ${
                active
                  ? 'bg-[#111111] text-[#f2f2f2] border-[#111111]'
                  : 'bg-[#ffffff] text-[#111111] border-[#1e1e1e]/20 hover:border-[#1e1e1e]/50'
              }`}
            >
              {STATUS_LABELS[s]}
            </button>
          );
        })}
      </div>

      {error && <ErrorBanner message={error} onRetry={() => void fetchReports()} />}

      {loading && (
        <div className="border border-[#1e1e1e] bg-[#ffffff] p-8">
          <Spinner label="FETCHING AUDIT LEDGER ENTRIES…" />
        </div>
      )}

      {/* Empty State */}
      {!loading && reports.length === 0 && (
        <div className="border border-[#1e1e1e]/20 bg-[#ffffff] p-8 text-center space-y-1 font-mono text-xs text-[#838282]">
          <p className="font-bold text-[#111111]">QUEUE EMPTY</p>
          <p>No reports currently assigned to this status filter.</p>
        </div>
      )}

      {/* Incident List */}
      <div className="space-y-3">
        {reports.map((report) => {
          const isSelected = selectedReport?.report_id === report.report_id;

          return (
            <button
              key={report.report_id}
              onClick={() => void openReport(report)}
              className={`w-full text-left p-5 border transition-all cursor-pointer ${
                isSelected
                  ? 'border-[#111111] bg-[#ffffff] shadow-md'
                  : 'border-[#1e1e1e]/15 bg-[#ffffff] hover:border-[#1e1e1e]/40'
              }`}
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-clash text-base font-bold text-[#111111] uppercase tracking-tight">
                      {report.category} Incident
                    </span>
                    {report.pseudonymous && (
                      <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 border border-[#1e1e1e]/20 text-[#838282] bg-[#f2f2f2]">
                        ANONYMOUS
                      </span>
                    )}
                  </div>
                  <p className="font-mono text-[11px] text-[#838282] mt-0.5">
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
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 border border-[#1e1e1e]/20 bg-[#f2f2f2] text-[#111111]">
                    {report.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {report.note && (
                <p className="text-xs text-[#111111] mt-3 leading-relaxed border-t border-[#1e1e1e]/10 pt-2 font-normal">
                  "{report.note}"
                </p>
              )}
            </button>
          );
        })}
      </div>

      {/* Investigation Drawer */}
      {selectedReport && (
        <div className="border-2 border-[#111111] bg-[#ffffff] p-6 space-y-5 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-[#1e1e1e]/15">
            <h2 className="font-clash text-lg font-bold text-[#111111] uppercase tracking-tight">
              Incident Remediation Panel
            </h2>
            <button
              onClick={() => setSelectedReport(null)}
              className="text-xs font-mono font-bold text-[#838282] hover:text-[#111111]"
            >
              [CLOSE ✕]
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 bg-[#f2f2f2] border border-[#1e1e1e]/10">
              <p className="text-[10px] text-[#838282] uppercase">REPORT ID</p>
              <p className="text-[#111111] font-bold select-all mt-0.5">{selectedReport.report_id}</p>
            </div>
            <div className="p-3 bg-[#f2f2f2] border border-[#1e1e1e]/10">
              <p className="text-[10px] text-[#838282] uppercase">CHECK UUID</p>
              <p className="text-[#111111] font-bold select-all mt-0.5">{selectedReport.check_id}</p>
            </div>
            <div className="p-3 bg-[#f2f2f2] border border-[#1e1e1e]/10">
              <p className="text-[10px] text-[#838282] uppercase">CATEGORY / SEVERITY</p>
              <p className="text-[#111111] uppercase mt-0.5">{selectedReport.category} · {selectedReport.severity}</p>
            </div>
            <div className="p-3 bg-[#f2f2f2] border border-[#1e1e1e]/10">
              <p className="text-[10px] text-[#838282] uppercase">DISCLOSURE TYPE</p>
              <p className="text-[#111111] mt-0.5">{selectedReport.pseudonymous ? 'Pseudonymous' : 'Identified'}</p>
            </div>
          </div>

          {selectedReport.note && (
            <div>
              <p className="text-[11px] font-mono font-bold uppercase text-[#838282]">REPORTER STATEMENT</p>
              <p className="text-xs text-[#111111] mt-1 p-3 bg-[#f2f2f2] border border-[#1e1e1e]/10 leading-relaxed">
                {selectedReport.note}
              </p>
            </div>
          )}

          {/* Status Mutation Controls */}
          <div className="space-y-3 pt-3 border-t border-[#1e1e1e]/15">
            <p className="text-[11px] font-mono font-bold uppercase text-[#838282]">
              TRANSITION INCIDENT STATE
            </p>

            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              {STATUS_OPTIONS.map((s) => {
                const active = patchStatus === s;
                return (
                  <label
                    key={s}
                    className={`flex items-center gap-2 p-2.5 border cursor-pointer font-bold transition-colors ${
                      active
                        ? 'bg-[#111111] text-[#f2f2f2] border-[#111111]'
                        : 'bg-[#ffffff] text-[#111111] border-[#1e1e1e]/20 hover:border-[#1e1e1e]/50'
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
                    <span className={`w-2 h-2 ${active ? 'bg-[#f2f2f2]' : 'bg-[#111111]'}`} />
                    {STATUS_LABELS[s]}
                  </label>
                );
              })}
            </div>

            <textarea
              rows={2}
              value={patchNote}
              onChange={(e) => setPatchNote(e.target.value)}
              placeholder="Internal resolution notes for cryptographic audit trail..."
              maxLength={1000}
              className="w-full bg-[#f2f2f2] border border-[#1e1e1e]/30 p-2.5 text-xs text-[#111111] placeholder-[#838282] focus:outline-none focus:ring-1 focus:ring-[#111111] resize-none font-mono"
            />

            <button
              onClick={() => void handlePatch()}
              disabled={patchLoading}
              className="w-full pill-button-invert py-2.5 px-4 text-xs font-mono font-bold uppercase tracking-wider cursor-pointer disabled:opacity-40"
            >
              {patchLoading ? 'Updating Audit Stream…' : 'Commit Status Modification →'}
            </button>
          </div>

          {/* Audit Log Timeline */}
          <div className="pt-3 border-t border-[#1e1e1e]/15 space-y-2">
            <h3 className="text-[11px] font-mono font-bold uppercase text-[#838282]">
              Append-Only Audit Stream
            </h3>

            {auditLoading && <Spinner label="QUERYING EVENT LOG…" />}

            {!auditLoading && auditLog.length === 0 && (
              <p className="text-xs font-mono text-[#838282]">No prior modifications logged.</p>
            )}

            <div className="space-y-1.5 max-h-36 overflow-y-auto font-mono text-xs">
              {auditLog.map((evt) => (
                <div
                  key={evt.event_id}
                  className="flex items-center justify-between p-2 bg-[#f2f2f2] border border-[#1e1e1e]/10 text-[#111111]"
                >
                  <div>
                    <span className="font-bold">{evt.action}</span>
                    <span className="text-[#838282] ml-2">by {evt.actor}</span>
                  </div>
                  <span className="text-[#838282] text-[10px]">{new Date(evt.created_at).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
