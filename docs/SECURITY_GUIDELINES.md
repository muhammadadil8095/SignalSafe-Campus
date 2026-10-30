# SignalSafe Campus — Security Guidelines

> **Document Status:** Phase 0 — Foundation  
> **Last Updated:** 2026-10-30

> [!CAUTION]
> All team members must read and follow these guidelines. Security violations — especially committing secrets to version control — can compromise the entire project and real user data.

---

## 1. Environment Variable Management

### Classification of Variables

Environment variables are classified into two categories: **public** (safe for frontend bundles) and **secret** (backend-only, never exposed to clients).

#### 🔒 Secret Variables (Backend Only)

These variables must **never** appear in frontend code, browser bundles, public repositories, or client-side configuration.

| Variable | Purpose | Location |
|---|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase admin access (bypasses RLS) | `backend/.env` |
| `TELEGRAM_BOT_TOKEN` | Telegram Bot API authentication | `backend/.env` |
| `LLM_API_KEY` | LLM provider API key (if used) | `backend/.env` |
| `DATABASE_URL` | Direct PostgreSQL connection string | `backend/.env` |

#### 🌐 Public / Anon Variables (Safe for Frontend)

These variables are intentionally public and designed to be included in frontend bundles. They provide limited, safe access scoped by RLS policies.

| Variable | Purpose | Location |
|---|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL | `frontend/.env` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous/public key | `frontend/.env` |
| `VITE_API_BASE_URL` | Backend API base URL | `frontend/.env` |

> [!IMPORTANT]
> The Supabase **anon key** is designed to be public. It only grants access permitted by Row-Level Security policies. The **service role key** bypasses all RLS and must never leave the backend server.

### Environment File Rules

1. **Never commit `.env` files.** They are listed in `.gitignore`.
2. Use `.env.example` files as templates with placeholder values.
3. Each team member creates their own `.env` from the example.
4. Production secrets are managed through the deployment platform's secret manager.

---

## 2. Git Security

### `.gitignore` Protections

The project `.gitignore` must include:

```gitignore
# Environment files
.env
.env.local
.env.*.local
backend/.env
frontend/.env

# Secret files
*.pem
*.key
service-account*.json

# Python
__pycache__/
*.pyc
.venv/

# Node
node_modules/
dist/

# IDE
.vscode/settings.json
.idea/
```

### Pre-Commit Checks

- Review every `git diff` before committing to ensure no secrets are included
- Consider using tools like `git-secrets` or `trufflehog` for automated detection
- If a secret is accidentally committed, **rotate it immediately** — removing it from history is not sufficient

### Branch Protection Expectations

For the `main` branch:

- **No direct pushes** — all changes must go through pull requests
- **At least one approval** required before merging
- **Status checks** must pass (when CI is configured)
- **No force pushes** to `main`
- Security-sensitive files (`.env.example`, RLS policies, auth middleware) require careful review

---

## 3. Code Review Requirements

### Security-Sensitive Changes

The following types of changes require **explicit security review** by at least one team member:

| Change Type | Examples |
|---|---|
| Authentication logic | JWT validation, role checks, middleware |
| RLS policies | Any Supabase migration touching `CREATE POLICY` |
| API authorization | Endpoint permission decorators, admin guards |
| Environment variables | Adding new secrets, changing `.env.example` |
| Storage access | Evidence bucket policies, signed URL generation |
| Dependency updates | New packages, version bumps (check for advisories) |
| Shared contracts | `API_CONTRACT.md`, `DATABASE_SCHEMA.md` |

### Review Checklist for PRs

- [ ] No secrets or credentials in the diff
- [ ] No hardcoded URLs, tokens, or keys
- [ ] Input validation is present for new endpoints
- [ ] Error messages do not leak internal details
- [ ] New dependencies have been evaluated for security

---

## 4. Supabase Row-Level Security (RLS)

### Principles

1. **RLS is always enabled** on every table — no exceptions
2. **Deny by default** — if no policy grants access, the query returns nothing
3. **Policies use `auth.uid()`** to scope access to the authenticated user
4. **Admin role checks** use a database function that verifies the user's role from `profiles`
5. **Service role key bypasses RLS** — it is only used by the backend server, never by clients

### Policy Naming Convention

```
{table}_{role}_{operation}
```

Examples:
- `profiles_student_select_own`
- `reports_admin_update_status`
- `audit_log_service_insert`

> [!NOTE]
> RLS policies are defined in this document as requirements. The actual SQL policies will be implemented and tested during the platform module phase. Do not make security claims about untested policies.

---

## 5. Evidence Storage Privacy

### Storage Architecture

- Evidence files are stored in a **private** Supabase Storage bucket
- The bucket has **no public access** — files cannot be accessed via direct URL
- Access is granted through **signed URLs** generated by the backend with short expiration times (e.g., 5 minutes)
- Only the backend (using the service role key) can generate signed URLs

### Access Control

| Actor | Can Upload | Can View | Can Delete |
|---|---|---|---|
| Student (own reports) | ✅ | ✅ (via signed URL) | ❌ |
| Admin | ❌ | ✅ (via signed URL) | ❌ |
| Backend service | ✅ | ✅ | ✅ |

### File Validation

- Maximum file size: 10 MB
- Allowed types: `image/png`, `image/jpeg`, `image/webp`, `application/pdf`
- File names are sanitized before storage
- Content-type is validated server-side (not just by extension)

---

## 6. API Security

### Rate Limiting

All endpoints must be rate-limited to prevent abuse:

| Endpoint | Limit |
|---|---|
| `POST /api/v1/analyze` | 30/min/user |
| `POST /api/v1/reports` | 10/min/user |
| `GET /api/v1/admin/*` | 60/min/admin |

### Input Validation

- All request bodies are validated using Pydantic models
- URL inputs are parsed and validated before analysis
- Text inputs are truncated to a maximum length
- File uploads are validated for size and content type
- SQL injection is prevented by Supabase's parameterized queries

### CORS Configuration

```python
# Backend CORS settings
ALLOWED_ORIGINS = [
    "http://localhost:5173",       # Local dev frontend
    "https://signalsafe.example"   # Production domain (placeholder)
]
```

- Only explicitly listed origins are allowed
- Credentials are supported for authenticated requests
- `*` (wildcard) is **never used** in production

### Response Security Headers

The API should return:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

---

## 7. Sensitive Data Handling

### What We Store

| Data | Storage | Notes |
|---|---|---|
| Analyzed URLs/text | Hashed (`input_hash`) | Raw input is **not** stored in the database |
| Analysis results | `checks` table | Verdicts and scores are stored |
| User reports | `reports` table | Free-text descriptions |
| Evidence files | Private Storage | Encrypted at rest by Supabase |
| Audit trail | `audit_log` table | Immutable, append-only |

### What We Never Store

- Plaintext passwords (handled by Supabase Auth)
- Raw credit card or financial data
- Government-issued IDs
- Service role keys in the database

---

## 8. Dependency Security

- Run `pip audit` (Python) and `npm audit` (Node.js) regularly
- Pin dependency versions in `requirements.txt` and `package.json`
- Review dependency changelogs before major version updates
- Avoid dependencies with known vulnerabilities or no recent maintenance

---

## 9. Incident Response

If a security issue is discovered:

1. **Do not disclose publicly** — report to the team privately
2. **Rotate compromised credentials** immediately
3. **Audit access logs** for unauthorized activity
4. **Document the incident** including timeline, impact, and remediation
5. **Update security controls** to prevent recurrence
