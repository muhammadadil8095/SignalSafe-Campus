# Supabase — Database & Storage

This directory contains database migrations and seed data for the SignalSafe Campus Supabase project.

## Directory Structure

```
supabase/
├── migrations/       # Timestamped SQL migration files
│   └── .gitkeep      # Preserves empty directory in Git
├── seed.sql          # Sample data for local development
└── README.md         # This file
```

## Migrations

Database migrations are stored as SQL files in `migrations/` with timestamp-based names:

```
YYYYMMDDHHMMSS_description.sql
```

Example:
```
20261030060000_create_profiles_table.sql
20261030060100_create_checks_table.sql
```

### Migration Rules

- Each migration should be **idempotent** where possible
- Include comments describing the migration purpose
- Follow the table dependency order defined in [DATABASE_SCHEMA.md](../docs/DATABASE_SCHEMA.md)
- Test migrations locally before committing
- Never modify a migration that has already been applied to shared environments

## Seed Data

`seed.sql` contains sample data for local development and testing:

- Sample official domains
- Test user profiles (not real credentials)
- Example check results and reports

> [!CAUTION]
> Never include production data, real credentials, or personally identifiable information in seed files.

## Schema Reference

See [docs/DATABASE_SCHEMA.md](../docs/DATABASE_SCHEMA.md) for the complete table definitions, relationships, and RLS requirements.
