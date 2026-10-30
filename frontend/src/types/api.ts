/** API response types */

export interface HealthResponse {
  status: string;
  service: string;
  version: string;
}

export interface AnalysisRequest {
  kind: 'url' | 'qr' | 'message';
  input: string;
  language?: string;
  channel?: 'pwa' | 'telegram' | 'admin';
}

export interface AnalysisResponse {
  check_id: string;
  kind: string;
  risk: 'green' | 'amber' | 'red';
  score: number;
  reasons: string[];
  tags: string[];
  advice: string;
  domain?: string;
  language: string;
  model_version: string;
}

