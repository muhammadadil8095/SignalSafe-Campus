import { api } from './api';
import type { HealthResponse } from '../types/api';

/** Check backend health. */
export async function checkHealth(): Promise<HealthResponse> {
  return api.health();
}
