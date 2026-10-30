/** API response types — shared contract with backend */

export interface HealthResponse {
  status: string;
  service: string;
  version: string;
}

// ── Analyse ────────────────────────────────────────────────────────────────

export type AnalysisKind = 'url' | 'message' | 'payment' | 'bullying';
export type RiskLevel = 'green' | 'amber' | 'red';
export type Channel = 'pwa' | 'telegram' | 'admin';
export type Language = 'en' | 'hi' | 'kn';

export interface Reason {
  code: string;
  text: string;
  source: 'rule' | 'ml' | 'llm';
}

export interface AnalysisRequest {
  kind: AnalysisKind;
  input: string;
  language?: Language;
  channel: Channel;
}

export interface AnalysisResponse {
  check_id: string;
  kind: AnalysisKind;
  risk: RiskLevel;
  score: number;
  reasons: Reason[];
  tags: string[];
  advice: string;
  domain?: string;
  language: Language;
  model_version: string;
}

// ── Report ─────────────────────────────────────────────────────────────────

export type ReportCategory = 'phishing' | 'qr' | 'payment' | 'bullying' | 'other';
export type ReportSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface ReportRequest {
  check_id: string;
  category: ReportCategory;
  severity: ReportSeverity;
  note?: string;
  pseudonymous?: boolean;
}

export interface ReportResponse {
  report_id: string;
  status: string;
  evidence_sha256: string;
  created_at: string;
}

// ── Admin ──────────────────────────────────────────────────────────────────

export type ReportStatus =
  | 'received'
  | 'under_review'
  | 'resolved'
  | 'dismissed';

export interface AdminReport {
  report_id: string;
  check_id: string;
  category: ReportCategory;
  severity: ReportSeverity;
  status: ReportStatus;
  note?: string;
  admin_note?: string;
  pseudonymous: boolean;
  evidence_sha256?: string;
  created_at: string;
  updated_at?: string;
}

export interface AdminReportPatch {
  status: ReportStatus;
  admin_note?: string;
}

export interface AuditEvent {
  event_id: string;
  report_id: string;
  action: string;
  actor: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}
