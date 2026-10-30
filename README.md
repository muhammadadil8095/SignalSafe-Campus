# 🛡️ SignalSafe Campus

**Recognize. Resist. Report.**

SignalSafe Campus is an AI-powered platform that helps university students detect phishing, scam, and social-engineering threats. Students can check suspicious URLs, text messages, and QR codes through a mobile-friendly web app or Telegram bot — and receive instant, explainable risk verdicts.

---

## ✨ Features

- **URL Analysis** — Detect phishing and malicious links using ML-based classification
- **Text Analysis** — Identify social-engineering patterns in messages
- **QR Code Scanning** — Decode and analyze QR codes via camera or image upload
- **Risk Verdicts** — Clear green / amber / red risk levels with explanations
- **Incident Reporting** — Submit reports with evidence for campus security review
- **Admin Dashboard** — Manage reports, view audit logs, maintain domain whitelists
- **Telegram Bot** — Access the same detection engine through Telegram
- **Audit Trail** — Full logging of administrative actions

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python 3.11+, FastAPI, Pydantic, Uvicorn, SlowAPI |
| ML / Detection | Python, scikit-learn, pandas, numpy (XGBoost/SHAP optional) |
| Frontend | React, Vite, TypeScript, Tailwind CSS, React Router, Recharts, qr-scanner |
| Messaging | python-telegram-bot |
| Database & Auth | Supabase PostgreSQL, Supabase Auth, Row Level Security, Private Storage |
| Testing | Pytest, Vitest |

---

## 🚀 Quick Start

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1    # Windows PowerShell
# source .venv/bin/activate   # macOS / Linux
pip install -r requirements.txt
cp ../.env.example .env       # Configure your environment
uvicorn app.main:app --reload
```

Verify: [http://localhost:8000/health](http://localhost:8000/health) → `{"status": "ok", "service": "signalsafe-api", "version": "0.1.0"}`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Verify: [http://localhost:5173](http://localhost:5173)

> See [docs/PHASE0_SETUP.md](docs/PHASE0_SETUP.md) for the complete setup guide with troubleshooting.

---

## 📁 Project Structure

```
SignalSafe-Campus/
├── backend/              # FastAPI backend & analysis engine
│   ├── app/              # Application source code
│   └── tests/            # Backend test suite
├── frontend/             # React PWA (Vite + TypeScript)
│   ├── src/              # Frontend source code
│   └── public/           # Static assets
├── ml/                   # Machine learning module
│   ├── datasets/         # Training & evaluation datasets
│   ├── notebooks/        # Jupyter notebooks for exploration
│   ├── training/         # Model training scripts & artifacts
│   └── evaluation/       # Evaluation metrics & reports
├── supabase/             # Database migrations & seed data
│   ├── migrations/       # SQL migration files
│   └── seed.sql          # Development seed data
├── docs/                 # Project documentation
│   ├── ARCHITECTURE.md   # System architecture & diagrams
│   ├── API_CONTRACT.md   # API endpoint specifications
│   ├── DATABASE_SCHEMA.md # Database table definitions
│   ├── SECURITY_GUIDELINES.md # Security practices
│   ├── TEAM_ASSIGNMENTS.md # Team roles & responsibilities
│   └── PHASE0_SETUP.md  # Development setup guide
├── .github/              # GitHub templates
├── CONTRIBUTING.md       # Contribution guidelines
└── README.md             # This file
```

---

## 👥 Team & Modules

| Member | Module | Branch |
|---|---|---|
| Member A | Detection & ML | `feature/detection-ml` |
| Member B | Frontend / PWA | `feature/pwa-frontend` |
| Member C | Platform & Admin | `feature/platform-admin` |
| Member D | Telegram, QA & Demo | `feature/telegram-qa` |

See [docs/TEAM_ASSIGNMENTS.md](docs/TEAM_ASSIGNMENTS.md) for detailed responsibilities.

---

## 📖 Documentation

| Document | Description |
|---|---|
| [Architecture](docs/ARCHITECTURE.md) | System architecture, diagrams, and design principles |
| [API Contract](docs/API_CONTRACT.md) | REST API endpoint specifications |
| [Database Schema](docs/DATABASE_SCHEMA.md) | PostgreSQL table definitions and relationships |
| [Security Guidelines](docs/SECURITY_GUIDELINES.md) | Security practices and requirements |
| [Team Assignments](docs/TEAM_ASSIGNMENTS.md) | Team roles, responsibilities, and coordination |
| [Setup Guide](docs/PHASE0_SETUP.md) | Development environment setup |
| [Contributing](CONTRIBUTING.md) | Branch conventions, commit format, PR process |

---

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for branch naming conventions, commit format, PR process, and security requirements.

---

## 📄 License

*License TBD — to be determined by the project team.*
