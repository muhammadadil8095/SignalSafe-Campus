# SignalSafe Campus — Phase 0 Setup Guide

> **Document Status:** Phase 0 — Foundation  
> **Last Updated:** 2026-10-30

This guide walks you through setting up the SignalSafe Campus development environment from scratch.

---

## Prerequisites

| Tool | Version | Purpose |
|---|---|---|
| Python | 3.11+ | Backend API server |
| Node.js | 18+ | Frontend PWA development |
| npm | 9+ | Frontend package management |
| Git | 2.40+ | Version control |

---

## 1. Clone the Repository

```bash
git clone https://github.com/muhammadadil8095/SignalSafe-Campus.git
cd SignalSafe-Campus
```

---

## 2. Backend Setup

### 2.1 Create Virtual Environment

```bash
cd backend
python -m venv .venv
```

### 2.2 Activate Virtual Environment

**Windows (PowerShell):**
```powershell
.venv\Scripts\Activate.ps1
```

**Windows (Command Prompt):**
```cmd
.venv\Scripts\activate.bat
```

**macOS / Linux:**
```bash
source .venv/bin/activate
```

### 2.3 Install Dependencies

```bash
pip install -r requirements.txt
```

### 2.4 Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and fill in your values
# See docs/SECURITY_GUIDELINES.md for variable descriptions
```

> [!WARNING]
> Never commit your `.env` file. It contains secrets that must stay local.

### 2.5 Start the Backend Server

```bash
uvicorn app.main:app --reload
```

### 2.6 Verify Backend

- **Health check:** Open [http://localhost:8000/health](http://localhost:8000/health) — should return `{"status": "ok"}`
- **API docs:** Open [http://localhost:8000/docs](http://localhost:8000/docs) — interactive Swagger UI

---

## 3. Frontend Setup

### 3.1 Install Dependencies

```bash
cd frontend
npm install
```

### 3.2 Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and fill in:
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_anon_key
# VITE_API_BASE_URL=http://localhost:8000
```

### 3.3 Start the Development Server

```bash
npm run dev
```

### 3.4 Verify Frontend

- Open [http://localhost:5173](http://localhost:5173) — should display the SignalSafe Campus app

---

## 4. Environment Files Reference

### `backend/.env.example`

```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Telegram Bot (Phase 2)
TELEGRAM_BOT_TOKEN=your-telegram-bot-token

# LLM Provider (optional)
LLM_API_KEY=your-llm-api-key

# Server
HOST=0.0.0.0
PORT=8000
ENVIRONMENT=development
```

### `frontend/.env.example`

```env
# Supabase (public/anon values)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Backend API
VITE_API_BASE_URL=http://localhost:8000
```

---

## 5. Full Development Stack

To run the complete development stack, open **two terminal windows**:

**Terminal 1 — Backend:**
```bash
cd backend
.venv\Scripts\Activate.ps1    # Windows
uvicorn app.main:app --reload
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

### Verification Checklist

| Check | URL | Expected Result |
|---|---|---|
| Backend health | http://localhost:8000/health | `{"status": "ok"}` |
| Backend docs | http://localhost:8000/docs | Swagger UI |
| Frontend app | http://localhost:5173 | App loads |

---

## 6. Troubleshooting

### Python / Backend Issues

| Problem | Solution |
|---|---|
| `python` not found | Ensure Python 3.11+ is installed and in PATH |
| `pip install` fails | Upgrade pip: `python -m pip install --upgrade pip` |
| Port 8000 in use | Use a different port: `uvicorn app.main:app --reload --port 8001` |
| Module not found | Ensure virtual environment is activated |
| `.env` not loaded | Check that `.env` is in the `backend/` directory |

### Node.js / Frontend Issues

| Problem | Solution |
|---|---|
| `npm` not found | Install Node.js 18+ from [nodejs.org](https://nodejs.org) |
| `npm install` fails | Delete `node_modules/` and `package-lock.json`, then retry |
| Port 5173 in use | Vite auto-selects the next available port |
| CORS errors | Ensure backend CORS allows `http://localhost:5173` |
| Env vars not loaded | Variables must be prefixed with `VITE_` for Vite |

### General Issues

| Problem | Solution |
|---|---|
| Git clone fails | Check SSH keys or use HTTPS URL |
| Permission denied | Run terminal as administrator (Windows) or check file permissions |
| `.env` committed | Remove from tracking: `git rm --cached .env` and add to `.gitignore` |

---

## 7. Next Steps

After setup is verified:

1. Create your feature branch (see [TEAM_ASSIGNMENTS.md](./TEAM_ASSIGNMENTS.md))
2. Review the [API Contract](./API_CONTRACT.md) and [Database Schema](./DATABASE_SCHEMA.md)
3. Read the [Security Guidelines](./SECURITY_GUIDELINES.md)
4. Read the [Contributing Guide](../CONTRIBUTING.md)
5. Start building your module!
