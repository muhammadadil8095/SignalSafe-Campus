# SignalSafe Campus – Backend API

FastAPI backend for **SignalSafe Campus**, an AI-powered campus safety platform that analyses tips and social-media signals to surface potential threats in real time.

## Quick Start

```bash
# 1. Create & activate a virtual environment
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS / Linux

# 2. Install dependencies
pip install -r requirements.txt

# 3. Run the development server
uvicorn app.main:app --reload
```

The API will be available at **http://127.0.0.1:8000**.

## Available Endpoints

| Method | Path       | Description          |
| ------ | ---------- | -------------------- |
| GET    | `/health`  | Liveness / readiness |
| GET    | `/docs`    | Swagger UI           |
| GET    | `/redoc`   | ReDoc documentation  |

## Running Tests

```bash
pytest
```

## Project Layout

```
backend/
├── app/
│   ├── main.py          # Application entry-point
│   ├── api/             # Route handlers
│   ├── core/            # Config, logging, shared utilities
│   ├── models/          # Database / ORM models
│   ├── schemas/         # Pydantic request/response schemas
│   ├── services/        # Business logic layer
│   ├── detectors/       # Threat detection modules
│   ├── ml/              # ML model wrappers
│   └── bot/             # Telegram bot integration
├── tests/               # Pytest test suite
├── requirements.txt
└── pytest.ini
```

## Configuration

Settings are loaded from environment variables (or a `.env` file in the `backend/` directory). All external service credentials are **optional** – the API runs standalone without any API keys.

See [`app/core/config.py`](app/core/config.py) for the full list of available settings.
