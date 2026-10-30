/**
 * Manual / reproducible check list for the SignalSafe Campus PWA.
 *
 * These tests document the verified flows and act as a regression checklist.
 * Run them manually in a browser after `npm run dev` with the backend running,
 * or adapt them for an e2e framework (Playwright / Cypress) if time permits.
 *
 * Test coverage for the API client is outlined here so the team can add
 * automated unit tests with Vitest when the backend is available.
 */

// ─── api client unit-test stubs (Vitest) ────────────────────────────────────
// Uncomment and run `npx vitest` once Vitest is added.

/*
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from '../src/services/api';

const MOCK_ANALYZE: AnalysisResponse = {
  check_id: 'test-uuid',
  kind: 'url',
  risk: 'red',
  score: 0.92,
  reasons: [{ code: 'URL_IP_HOST', text: 'IP-address host', source: 'rule' }],
  tags: ['credential_request'],
  advice: 'Do not enter credentials.',
  domain: '192.168.1.1',
  language: 'en',
  model_version: 'url-v1',
};

describe('api.analyze', () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => MOCK_ANALYZE,
    } as Response);
  });

  it('posts to /api/v1/analyze with channel=pwa', async () => {
    const result = await api.analyze({
      kind: 'url',
      input: 'https://suspicious.example.com',
      channel: 'pwa',
    });
    expect(result.risk).toBe('red');
    expect((global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0]).toContain('/api/v1/analyze');
  });

  it('throws on non-OK response', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 422,
      json: async () => ({ detail: 'Validation error' }),
    } as Response);
    await expect(
      api.analyze({ kind: 'url', input: 'x', channel: 'pwa' })
    ).rejects.toThrow('422');
  });
});

describe('api.submitReport', () => {
  it('posts to /api/v1/reports', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        report_id: 'r-uuid',
        status: 'received',
        evidence_sha256: 'abc123',
        created_at: new Date().toISOString(),
      }),
    } as Response);

    const result = await api.submitReport({
      check_id: 'test-uuid',
      category: 'phishing',
      severity: 'high',
    });
    expect(result.report_id).toBe('r-uuid');
  });
});
*/

// ─── Manual check list ───────────────────────────────────────────────────────

export const MANUAL_CHECKS = [
  {
    id: 'HOME-01',
    description: 'Home page loads with backend status indicator',
    steps: [
      'Run `npm run dev`',
      'Open http://localhost:5173',
      'Verify SignalSafe Campus title is shown',
      'Verify backend status pill shows "Backend connected" (green) or "Backend unavailable" (red)',
    ],
  },
  {
    id: 'SCAN-01',
    description: 'QR camera scanner starts and decodes',
    steps: [
      'Navigate to /scan',
      'Allow camera permission',
      'Point camera at a QR code containing a URL',
      'Verify analysis spinner appears, then redirect to /verdict',
    ],
  },
  {
    id: 'SCAN-02',
    description: 'Camera permission denied shows fallback message',
    steps: [
      'Open /scan in a browser with camera permission denied',
      'Verify "Camera access was denied" message is shown',
      'Verify fallback upload option is offered automatically',
    ],
  },
  {
    id: 'SCAN-03',
    description: 'Image upload fallback decodes QR on-device',
    steps: [
      'Click "Camera not working? Upload a QR image instead"',
      'Upload a PNG/JPG containing a valid QR code',
      'Verify decoded URL is sent to backend; redirect to /verdict',
      'Confirm no image data was sent to the network (check DevTools Network tab)',
    ],
  },
  {
    id: 'CHECK-01',
    description: 'Manual URL check shows verdict',
    steps: [
      'Navigate to /check',
      'Select "URL / Link"',
      'Paste a test URL',
      'Click Analyse Now',
      'Verify redirect to /verdict with risk badge, score bar, reasons and advice',
    ],
  },
  {
    id: 'CHECK-02',
    description: 'Backend error shows clear error state, no fake verdict',
    steps: [
      'Stop the backend server',
      'Try to analyse a URL',
      'Verify error banner is shown',
      'Confirm no risk verdict is displayed',
    ],
  },
  {
    id: 'VERDICT-01',
    description: 'Verdict card renders all fields',
    steps: [
      'After a successful analysis',
      'Verify risk badge (red/amber/green) is shown',
      'Verify score progress bar is correct width',
      'Verify reasons list is shown',
      'Verify advice box is shown',
      'Verify "Report this threat" button is present',
    ],
  },
  {
    id: 'REPORT-01',
    description: 'Report submission and confirmation',
    steps: [
      'From a verdict, click "Report this threat"',
      'Select a category and severity',
      'Optionally add a note',
      'Toggle pseudonymous if desired',
      'Submit',
      'Verify redirect to /report-confirm with report_id and SHA-256 hash',
    ],
  },
  {
    id: 'ADMIN-01',
    description: 'Admin page lists and updates reports',
    steps: [
      'Navigate to /admin',
      'Verify report list loads (or empty-state message if no reports)',
      'Click a report to expand',
      'Change status to "under_review"',
      'Add an admin note',
      'Click Save update',
      'Verify list refreshes with new status',
    ],
  },
  {
    id: 'A11Y-01',
    description: 'Keyboard navigation',
    steps: [
      'Use Tab key to navigate all interactive elements',
      'Verify focus rings are visible on all buttons, links, inputs',
      'Verify ARIA labels are present on icon-only buttons',
    ],
  },
  {
    id: 'PWA-01',
    description: 'PWA installability',
    steps: [
      'Build with `npm run build` and serve over HTTPS',
      'Open in Chrome/Edge on mobile',
      'Verify "Add to Home Screen" prompt appears',
      'Install and verify app icon is shown',
      'Verify app opens in standalone mode (no browser chrome)',
    ],
  },
];

// Export so the checks can be imported in a future test runner
export default MANUAL_CHECKS;

