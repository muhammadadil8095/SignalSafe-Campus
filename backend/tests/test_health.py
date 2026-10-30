"""Tests for the /health endpoint."""

from fastapi.testclient import TestClient


def test_health_returns_200(client: TestClient) -> None:
    """GET /health should return HTTP 200."""
    response = client.get("/health")
    assert response.status_code == 200


def test_health_status_ok(client: TestClient) -> None:
    """Response body must contain status='ok' and service='signalsafe-api'."""
    data = client.get("/health").json()
    assert data["status"] == "ok"
    assert data["service"] == "signalsafe-api"


def test_health_contains_version(client: TestClient) -> None:
    """Response body must include a non-empty 'version' field."""
    data = client.get("/health").json()
    assert "version" in data
    assert isinstance(data["version"], str)
    assert len(data["version"]) > 0


def test_api_v1_health(client: TestClient) -> None:
    """GET /api/v1/health should also return HTTP 200 and health payload."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "signalsafe-api"
    assert data["version"] == "0.1.0"

