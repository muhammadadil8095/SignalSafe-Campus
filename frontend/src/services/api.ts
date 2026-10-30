/**
 * Central API client for SignalSafe Campus.
 *
 * All backend calls go through this module so that the base URL and
 * error-handling are managed in one place.
 * Never hardcode secrets here; use VITE_API_BASE_URL in .env.local.
 */

import type {
  AnalysisRequest,
  AnalysisResponse,
  ReportRequest,
  ReportResponse,
  AdminReport,
  AdminReportPatch,
  AuditEvent,
  HealthResponse,
} from '../types/api';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

// ── Low-level fetch wrapper ────────────────────────────────────────────────

async function request<T>(
  path: string,
  options: RequestInit & { json?: boolean } = {},
): Promise<T> {
  const { json = true, headers, ...rest } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(headers as Record<string, string>),
    },
    ...rest,
  });

  if (!response.ok) {
    let detail: string;
    try {
      const body = await response.json();
      detail = body?.detail ?? body?.message ?? JSON.stringify(body);
    } catch {
      detail = await response.text();
    }
    throw new Error(`API ${response.status}: ${detail}`);
  }

  if (json) return response.json() as Promise<T>;
  return response as unknown as T;
}

// ── Typed endpoint methods ─────────────────────────────────────────────────

export const api = {
  /** GET /health */
  health(): Promise<HealthResponse> {
    return request<HealthResponse>('/health');
  },

  /**
   * POST /api/v1/analyze
   * The backend is the sole source of risk scores.
   */
  analyze(body: AnalysisRequest): Promise<AnalysisResponse> {
    return request<AnalysisResponse>('/api/v1/analyze', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  /** POST /api/v1/reports */
  submitReport(body: ReportRequest): Promise<ReportResponse> {
    return request<ReportResponse>('/api/v1/reports', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  // ── Admin endpoints ──────────────────────────────────────────────────────

  /** GET /api/v1/admin/reports */
  getAdminReports(status?: string): Promise<AdminReport[]> {
    const qs = status ? `?status=${encodeURIComponent(status)}` : '';
    return request<AdminReport[]>(`/api/v1/admin/reports${qs}`);
  },

  /** PATCH /api/v1/admin/reports/{report_id} */
  patchAdminReport(
    reportId: string,
    body: AdminReportPatch,
  ): Promise<AdminReport> {
    return request<AdminReport>(`/api/v1/admin/reports/${reportId}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  /** GET /api/v1/admin/audit?report_id=uuid */
  getAuditLog(reportId: string): Promise<AuditEvent[]> {
    return request<AuditEvent[]>(
      `/api/v1/admin/audit?report_id=${encodeURIComponent(reportId)}`,
    );
  },
};
