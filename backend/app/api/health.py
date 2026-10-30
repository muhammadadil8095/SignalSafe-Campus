"""Health-check endpoint.

Provides a lightweight probe for liveness / readiness checks.
Mounted at the application root (not under the versioned API prefix).
"""

from fastapi import APIRouter

from app.core.config import settings
from app.schemas.health import HealthResponse

router = APIRouter(tags=["health"])


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Health check",
    description="Returns the current health status of the API.",
)
async def health_check() -> HealthResponse:
    """Return a simple health status payload."""
    return HealthResponse(
        status="ok",
        service="signalsafe-api",
        version=settings.APP_VERSION,
    )
