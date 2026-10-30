# SignalSafe Campus — Frontend (Member B)

Mobile-first React PWA for the SignalSafe Campus cybersecurity platform.  
Owned by **Member B** as part of the 24-hour hackathon implementation.

---

## What this module does

| Feature | Status |
|---|---|
| Mobile-first React + Vite + TypeScript + Tailwind | ✅ |
| PWA manifest + service-worker (vite-plugin-pwa) | ✅ |
| On-device QR code scanning (Nimiq qr-scanner) | ✅ |
| Image-upload QR fallback (local-decode only) | ✅ |
| Manual URL / message / payment / bullying input | ✅ |
| Verdict screen — risk badge, score bar, reasons, tags, advice | ✅ |
| Report submission form (POST /api/v1/reports) | ✅ |
| Report confirmation page with SHA-256 evidence hash | ✅ |
| Admin triage console (list, filter, update, audit log) | ✅ |
| Loading / error / permission-denied / retry states | ✅ |
| Keyboard-accessible, ARIA-labelled UI | ✅ |
| No API keys hardcoded; all secrets via `.env.local` | ✅ |

---

## Technology stack

- **React 19** + **TypeScript** + **Vite 8**
- **Tailwind CSS v4** (Vite plugin)
- **vite-plugin-pwa** — generates service-worker and web app manifest
- **qr-scanner** (Nimiq) — on-device QR decoding, no image upload
- **react-router-dom v7** — client-side routing

---

## Security rules enforced

- QR image data **never leaves the device**; only decoded text is sent to backend.
- **No risk scoring in the browser** — verdicts come entirely from `POST /api/v1/analyze`.
- No API keys or Supabase service-role credentials are present in any source file.
- Evidence SHA-256 hashes are computed and returned by the backend, not the browser.
- Network failure shows a "backend unavailable" state; it never shows a fake verdict.

---

## Setup

### Prerequisites

- **Node.js 20+** (recommended via [nvm-windows](https://github.com/coreybutler/nvm-windows))
- **Python 3** (for icon generation only)

### Install dependencies

```powershell
cd frontend
npm install
```

### Environment variables

```powershell
copy .env.example .env.local
# Edit .env.local and set VITE_API_BASE_URL if your backend runs elsewhere
```

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8000` | Backend base URL (no trailing slash) |

### Generate PWA icons

```powershell
npm run gen:icons
# Writes public/icons/icon-192.png and icon-512.png
```

---

## Running locally

```powershell
# Start development server (proxies /api and /health to localhost:8000)
npm run dev
# Open http://localhost:5173
```

> **Camera access** requires a secure origin (HTTPS or `localhost`).  
> `localhost` works in all modern browsers; for HTTPS use the deployment steps below.

---

## Building for production

```powershell
npm run build
# Output → frontend/dist/
```

### HTTPS preview (required for camera on mobile)

```powershell
npm run preview -- --host
# Then access via your local network IP over HTTPS, or deploy to Netlify/Vercel
```

### Deploy (Netlify example)

```powershell
# Install Netlify CLI once
npm install -g netlify-cli
netlify deploy --dir=dist --prod
```

Set `VITE_API_BASE_URL` as an environment variable in your hosting dashboard (never in committed files).

---

## Type-checking

```powershell
npm run typecheck
```

---

## Manual test checklist

See [`src/tests/checks.ts`](src/tests/checks.ts) for the full reproducible checklist.

Key flows to verify:

1. **QR scan → verdict → report → confirmation** (core demo path)
2. Camera permission denied → fallback image upload → decode on-device → verdict
3. Backend unavailable → clear error state, no fake verdict
4. Admin page: list reports, change status, view audit log
5. Keyboard navigation (Tab focus rings visible throughout)
6. PWA install prompt on HTTPS (standalone mode)

---

## API contract consumed

All calls go to the backend. No risk logic is in the browser.

```
POST /api/v1/analyze    → AnalysisResponse (risk, score, reasons, tags, advice)
POST /api/v1/reports    → ReportResponse   (report_id, status, evidence_sha256)
GET  /api/v1/admin/reports
PATCH /api/v1/admin/reports/{id}
GET  /api/v1/admin/audit?report_id=uuid
GET  /health
```

---

## Files created / changed

```
frontend/
├── index.html                         (updated — PWA meta tags, correct title)
├── vite.config.ts                     (updated — vite-plugin-pwa added)
├── package.json                       (updated — qr-scanner, vite-plugin-pwa, workbox-window)
├── .env.example                       (new)
├── scripts/
│   └── gen_icons.py                   (new — stdlib-only icon generator)
├── public/
│   └── icons/
│       ├── icon-192.png               (new — generated PWA icon)
│       └── icon-512.png               (new — generated PWA icon)
└── src/
    ├── App.tsx                        (updated — all routes wired)
    ├── types/
    │   └── api.ts                     (updated — full shared contract types)
    ├── services/
    │   ├── api.ts                     (updated — typed endpoint methods)
    │   └── health.ts                  (updated — uses new api.health())
    ├── components/
    │   ├── RiskBadge.tsx              (new)
    │   ├── Spinner.tsx                (new)
    │   ├── ErrorBanner.tsx            (new)
    │   ├── VerdictCard.tsx            (new)
    │   ├── QRScanner.tsx              (new — on-device decode, fallback)
    │   └── NavBar.tsx                 (new — accessible bottom nav)
    ├── layouts/
    │   └── AppLayout.tsx              (new — header + nav shell)
    ├── pages/
    │   ├── HomePage.tsx               (new — dashboard + quick actions)
    │   ├── ScanPage.tsx               (new — camera QR scan + fallback)
    │   ├── CheckPage.tsx              (new — manual text/URL input)
    │   ├── VerdictPage.tsx            (new — verdict display)
    │   ├── ReportPage.tsx             (new — report submission form)
    │   ├── ReportConfirmPage.tsx      (new — confirmation + SHA-256 hash)
    │   └── AdminPage.tsx              (new — admin triage console)
    └── tests/
        └── checks.ts                  (new — manual/reproducible checklist)
```

---

## Known limitations

- **No automated e2e tests** — manual checklist in `src/tests/checks.ts`; Playwright can be added.
- **QR scanner worker path** — qr-scanner loads a WASM worker; if you see 404s in production, ensure the `node_modules/qr-scanner/` wasm files are copied to `dist`. Vite usually handles this automatically.
- **Admin authentication** — the admin page calls the backend directly; the backend is responsible for auth/RLS. This page will return errors if the session does not have admin rights.
- **Language translations** — English only. Translation templates (hi / kn) are a stretch goal; the analysis `language` field is passed as `'en'` for now.
- **No offline verdict caching** — the service-worker caches static assets and health checks. Analysis requests require network; offline results are not stored.
- **Icon quality** — icons are generated with stdlib Python (no image library). Replace `public/icons/icon-*.png` with higher-quality assets when time permits.

---

## Integration instructions for the team

1. **Backend (Member A/C):** This module calls `POST /api/v1/analyze`, `POST /api/v1/reports`, `GET/PATCH /api/v1/admin/reports`, `GET /api/v1/admin/audit`, and `GET /health`. No schema changes from the frozen API contract.
2. **Supabase (Member C):** RLS enforcement is server-side. The PWA does not bypass it.
3. **Telegram bot (Member D):** No shared code. Both channels call the same backend.
4. **Environment:** Set `VITE_API_BASE_URL` in your CI/CD deployment environment. Never commit `.env.local`.
