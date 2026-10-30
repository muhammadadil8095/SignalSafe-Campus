# SignalSafe Campus — API Contract

> **Document Status:** Phase 0 — Planned interfaces  
> **Last Updated:** 2026-10-30  
> **Base URL:** `/api/v1`

> [!WARNING]
> All endpoints listed below are **planned specifications** unless explicitly marked as implemented. Do not build client integrations against unimplemented endpoints. The health endpoint is the only one currently active.

## Overview

All frontend clients — Student PWA, Telegram Bot, and Admin Dashboard — consume this **single shared API**. The contract is the source of truth for request/response shapes. Changes to this document require team-wide coordination (see [CONTRIBUTING.md](../CONTRIBUTING.md)).

---

## Authentication

| Endpoint Pattern | Auth Required | Auth Method |
|---|---|---|
| `GET /health` | No | — |
| `POST /api/v1/analyze` | Yes | Bearer JWT (Supabase Auth) |
| `POST /api/v1/reports` | Yes | Bearer JWT (Supabase Auth) |
| `GET /api/v1/admin/*` | Yes | Bearer JWT (admin role) |
| `PATCH /api/v1/admin/*` | Yes | Bearer JWT (admin role) |

All authenticated requests must include:

```
Authorization: Bearer <supabase_access_token>
```

---

## Endpoints

### 1. Health Check

**`GET /health`** or **`GET /api/v1/health`** — ✅ **Implemented (Phase 0)**

Returns the current health status of the API server.

**Response `200 OK`:**

```json
{
  "status": "ok",
  "service": "signalsafe-api",
  "version": "0.1.0"
}
```

> [!NOTE]
> This is currently the only active operational endpoint. It is available both at the root path `/health` and at `/api/v1/health`. No authentication is required.

---

### 2. Analyze Content

**`POST /api/v1/analyze`** — 🔲 Planned

Submit a URL, text snippet, or message for analysis. The backend runs the detection pipeline and returns a structured verdict.

**Request Body:**

```json
{
  "kind": "url",
  "input": "https://example.test",
  "language": "en",
  "channel": "pwa"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `kind` | `string` | Yes | Type of content: `"url"`, `"text"`, `"qr"` |
| `input` | `string` | Yes | The raw content to analyze |
| `language` | `string` | No | ISO 639-1 language code (default: `"en"`) |
| `channel` | `string` | No | Source client: `"pwa"`, `"telegram"`, `"admin"` |

**Response `200 OK`:**

```json
{
  "check_id": "uuid",
  "kind": "url",
  "risk": "red",
  "score": 0.85,
  "reasons": [],
  "tags": [],
  "advice": "Verify through an official campus channel.",
  "domain": "example.test",
  "language": "en",
  "model_version": "url-v1"
}
```

| Field | Type | Description |
|---|---|---|
| `check_id` | `string (UUID)` | Unique identifier for this analysis |
| `kind` | `string` | Echoed content type |
| `risk` | `string` | Risk level: `"green"`, `"amber"`, `"red"` |
| `score` | `number` | Confidence score (0.0–1.0) |
| `reasons` | `string[]` | Human-readable reasons for the verdict |
| `tags` | `string[]` | Classification tags (e.g., `"phishing"`, `"impersonation"`) |
| `advice` | `string` | Actionable guidance for the user |
| `domain` | `string \| null` | Extracted domain (URL kind only) |
| `language` | `string` | Language used for advice text |
| `model_version` | `string` | Version of the detection model used |

**Error Responses:**

| Status | Description |
|---|---|
| `400` | Invalid request body or unsupported `kind` |
| `401` | Missing or invalid authentication token |
| `422` | Validation error (malformed input) |
| `429` | Rate limit exceeded |
| `500` | Internal analysis error |

---

### 3. Submit Incident Report

**`POST /api/v1/reports`** — 🔲 Planned

Allows authenticated users to submit incident reports, optionally attaching evidence.

**Request Body (`multipart/form-data`):**

| Field | Type | Required | Description |
|---|---|---|---|
| `check_id` | `string (UUID)` | No | Related analysis check ID |
| `description` | `string` | Yes | Free-text incident description |
| `category` | `string` | No | Report category (e.g., `"phishing"`, `"scam"`, `"impersonation"`) |
| `evidence` | `file` | No | Attached evidence file (image, screenshot) |

**Response `201 Created`:**

```json
{
  "report_id": "uuid",
  "status": "pending",
  "created_at": "2026-10-30T06:00:00Z"
}
```

**Error Responses:**

| Status | Description |
|---|---|
| `400` | Invalid request body |
| `401` | Missing or invalid authentication token |
| `413` | Evidence file too large |
| `422` | Validation error |

---

### 4. List Reports (Admin)

**`GET /api/v1/admin/reports`** — 🔲 Planned

Returns a paginated list of incident reports. Requires admin role.

**Query Parameters:**

| Param | Type | Default | Description |
|---|---|---|---|
| `status` | `string` | — | Filter by status: `"pending"`, `"reviewed"`, `"resolved"`, `"dismissed"` |
| `page` | `integer` | `1` | Page number |
| `per_page` | `integer` | `20` | Results per page (max 100) |

**Response `200 OK`:**

```json
{
  "reports": [
    {
      "report_id": "uuid",
      "user_id": "uuid",
      "check_id": "uuid | null",
      "description": "Received suspicious email...",
      "category": "phishing",
      "status": "pending",
      "created_at": "2026-10-30T06:00:00Z",
      "updated_at": "2026-10-30T06:00:00Z"
    }
  ],
  "total": 42,
  "page": 1,
  "per_page": 20
}
```

---

### 5. Update Report Status (Admin)

**`PATCH /api/v1/admin/reports/{report_id}`** — 🔲 Planned

Update the status of an incident report. Creates an audit log entry.

**Path Parameters:**

| Param | Type | Description |
|---|---|---|
| `report_id` | `UUID` | Target report ID |

**Request Body:**

```json
{
  "status": "reviewed",
  "admin_notes": "Confirmed phishing attempt from known domain."
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `status` | `string` | Yes | New status: `"reviewed"`, `"resolved"`, `"dismissed"` |
| `admin_notes` | `string` | No | Internal notes (not visible to reporter) |

**Response `200 OK`:**

```json
{
  "report_id": "uuid",
  "status": "reviewed",
  "updated_at": "2026-10-30T06:15:00Z"
}
```

---

### 6. Audit Log (Admin)

**`GET /api/v1/admin/audit`** — 🔲 Planned

Returns a paginated audit trail of admin actions.

**Query Parameters:**

| Param | Type | Default | Description |
|---|---|---|---|
| `action` | `string` | — | Filter by action type |
| `admin_id` | `UUID` | — | Filter by admin user |
| `page` | `integer` | `1` | Page number |
| `per_page` | `integer` | `50` | Results per page (max 100) |

**Response `200 OK`:**

```json
{
  "entries": [
    {
      "audit_id": "uuid",
      "admin_id": "uuid",
      "action": "report.status_change",
      "target_type": "report",
      "target_id": "uuid",
      "details": { "old_status": "pending", "new_status": "reviewed" },
      "created_at": "2026-10-30T06:15:00Z"
    }
  ],
  "total": 128,
  "page": 1,
  "per_page": 50
}
```

---

## Common Error Format

All error responses follow a consistent shape:

```json
{
  "detail": "Human-readable error description",
  "code": "ERROR_CODE",
  "field": "field_name (if applicable)"
}
```

---

## Rate Limiting

| Endpoint | Limit (Planned) |
|---|---|
| `POST /api/v1/analyze` | 30 requests / minute / user |
| `POST /api/v1/reports` | 10 requests / minute / user |
| `GET /api/v1/admin/*` | 60 requests / minute / admin |

Rate limit headers will be included in responses:

```
X-RateLimit-Limit: 30
X-RateLimit-Remaining: 28
X-RateLimit-Reset: 1698649200
```

---

## Versioning

The API is versioned via URL prefix (`/api/v1`). Breaking changes will increment the version number. Non-breaking additions (new optional fields, new endpoints) may be added within the same version.

---

## Client Integration Notes

| Client | Channel Value | Notes |
|---|---|---|
| Student PWA | `"pwa"` | Primary student interface |
| Telegram Bot | `"telegram"` | Bot adapter relays to same API |
| Admin Dashboard | `"admin"` | Admin-only endpoints + analysis |

> [!IMPORTANT]
> Changes to this API contract require coordination across all team members. See [CONTRIBUTING.md](../CONTRIBUTING.md) for the change process.
