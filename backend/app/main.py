"""FastAPI application entry-point for SignalSafe Campus API.

Start the server with::

    uvicorn app.main:app --reload
"""

from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.health import router as health_router
from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)


# ── Lifespan ──────────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifespan: runs startup and shutdown logic."""
    logger.info("SignalSafe Campus API started")
    yield
    logger.info("SignalSafe Campus API shutting down")


# ── App factory ───────────────────────────────────────────────────────────────

app = FastAPI(
    title="SignalSafe Campus API",
    description=(
        "Backend API for SignalSafe Campus – an AI-powered campus safety "
        "platform that analyses tips and social-media signals to surface "
        "potential threats in real time."
    ),
    version=settings.APP_VERSION,
    lifespan=lifespan,
)

# ── Middleware ────────────────────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────

# Health check lives at root (/health) and under /api/v1/health
app.include_router(health_router)

# Placeholder for versioned API routes (Phase 1+)
from fastapi import APIRouter  # noqa: E402

api_v1_router = APIRouter(prefix=settings.API_V1_PREFIX)
api_v1_router.include_router(health_router)
app.include_router(api_v1_router)


# ── Exception handlers ───────────────────────────────────────────────────────

@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Catch-all handler that returns structured JSON for unexpected errors."""
    logger.error("Unhandled exception on %s %s: %s", request.method, request.url, exc)
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "type": type(exc).__name__,
        },
    )
