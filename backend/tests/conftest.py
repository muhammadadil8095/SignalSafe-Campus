"""Shared pytest fixtures for the SignalSafe test suite."""

import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture()
def client() -> TestClient:
    """Provide a FastAPI ``TestClient`` scoped to each test function."""
    return TestClient(app)
