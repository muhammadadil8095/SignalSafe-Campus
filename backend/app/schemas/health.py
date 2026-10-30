"""Health-check response schemas."""

from pydantic import BaseModel


class HealthResponse(BaseModel):
    """Schema for the ``/health`` endpoint response."""

    status: str
    service: str
    version: str
