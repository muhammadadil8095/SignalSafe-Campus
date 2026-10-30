# Contributing to SignalSafe Campus

Thank you for contributing to SignalSafe Campus! This guide ensures consistent collaboration across the team.

---

## Branch Naming

Each team member works on a dedicated feature branch:

| Branch | Owner | Module |
|---|---|---|
| `feature/detection-ml` | Member A | Detection engine & ML models |
| `feature/pwa-frontend` | Member B | Student PWA interface |
| `feature/platform-admin` | Member C | Supabase platform & admin dashboard |
| `feature/telegram-qa` | Member D | Telegram bot, testing & demo |

### Rules

- Work on **your assigned branch** only
- Branch from `main` and keep your branch up to date with `main`
- Never push directly to `main`

---

## Commit Conventions

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
type(scope): description
```

### Types

| Type | Usage |
|---|---|
| `feat` | New feature or functionality |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `test` | Adding or updating tests |
| `chore` | Build config, dependencies, tooling |
| `refactor` | Code changes that neither fix bugs nor add features |
| `style` | Formatting, whitespace (no logic change) |

### Scopes

| Scope | Area |
|---|---|
| `api` | Backend API endpoints |
| `ml` | Machine learning / detection |
| `pwa` | Frontend PWA |
| `admin` | Admin dashboard |
| `telegram` | Telegram bot |
| `db` | Database schema / migrations |
| `auth` | Authentication |
| `docs` | Documentation |

### Examples

```
feat(api): add analyze endpoint with URL validation
fix(pwa): correct QR scanner camera permissions on iOS
docs(db): update checks table schema with channel column
test(telegram): add integration tests for bot commands
chore(api): upgrade FastAPI to 0.104
```

---

## Pull Request Procedure

### Creating a PR

1. **Push** your feature branch to the remote
2. **Open a PR** from your feature branch to `main`
3. **Fill in the PR template** completely (see [PR template](/.github/pull_request_template.md))
4. **Request a review** from at least one team member
5. **Address feedback** and update your branch
6. **Merge** only after receiving approval

### PR Title Format

Use the same commit convention format:

```
feat(api): implement analyze endpoint
```

### PR Size Guidelines

- Keep PRs focused on a single concern
- Aim for fewer than 400 lines of changes when possible
- Split large features into incremental PRs

---

## Code Review Expectations

### As a Reviewer

- Review within **24 hours** of being requested
- Check for correctness, security, and adherence to project conventions
- Leave constructive, specific feedback
- Approve only when all concerns are addressed

### As an Author

- Respond to all review comments
- Do not merge with unresolved conversations
- Rebase and resolve conflicts before requesting re-review

### Minimum Requirements

- **At least one approval** before merging
- All CI checks must pass (when configured)
- No merge conflicts with `main`

---

## Integration Rules

Before creating a PR:

1. **Pull the latest `main`** and rebase your branch
2. **Run the backend** and verify your changes work:
   ```bash
   cd backend && uvicorn app.main:app --reload
   ```
3. **Run the frontend** (if applicable):
   ```bash
   cd frontend && npm run dev
   ```
4. **Run tests** (if applicable):
   ```bash
   # Backend
   cd backend && pytest

   # Frontend
   cd frontend && npm test
   ```
5. **Check for lint/format issues**

---

## Security Requirements

> [!CAUTION]
> Violating these rules can compromise the project and user data.

- **Never commit secrets** — no API keys, tokens, passwords, or credentials in code
- **Never hardcode credentials** — use environment variables
- **Never commit `.env` files** — only `.env.example` with placeholder values
- **Review dependencies** — check for known vulnerabilities before adding packages
- **Sanitize inputs** — validate and sanitize all user inputs
- **Protect error messages** — never expose internal details in API responses

If you accidentally commit a secret:

1. **Rotate the credential immediately** — removing from history is not sufficient
2. Notify the team
3. Add the pattern to `.gitignore` if applicable

---

## Shared Contracts

The following documents define **shared interfaces** between modules:

- [`docs/API_CONTRACT.md`](docs/API_CONTRACT.md) — API endpoints, request/response schemas
- [`docs/DATABASE_SCHEMA.md`](docs/DATABASE_SCHEMA.md) — Database tables and relationships

### Change Process for Shared Contracts

1. **Discuss** the proposed change with all affected team members
2. **Create a separate PR** for the contract change (do not bundle with feature work)
3. **Get approval from at least two team members**
4. **Update all dependent code and documentation** in follow-up PRs

> [!IMPORTANT]
> Uncoordinated changes to shared contracts can break other team members' work. Always communicate first.

---

## Project Structure

```
SignalSafe-Campus/
├── backend/          # FastAPI backend
│   ├── app/          # Application code
│   └── tests/        # Backend tests
├── frontend/         # React PWA (Vite)
│   ├── src/          # Source code
│   └── public/       # Static assets
├── ml/               # ML datasets, notebooks, models
│   ├── datasets/
│   ├── notebooks/
│   ├── training/
│   └── evaluation/
├── supabase/         # Database migrations & seed data
│   ├── migrations/
│   └── seed.sql
├── docs/             # Project documentation
└── .github/          # PR and issue templates
```

---

## Getting Help

- Check [docs/PHASE0_SETUP.md](docs/PHASE0_SETUP.md) for setup issues
- Review [docs/SECURITY_GUIDELINES.md](docs/SECURITY_GUIDELINES.md) for security questions
- Open a GitHub issue for bugs or blockers
- Tag the relevant module owner for cross-module questions
