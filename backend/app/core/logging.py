"""Structured logging configuration for the application.

Provides a consistent log format across all modules.
"""

import logging
import sys

LOG_FORMAT: str = "%(asctime)s | %(levelname)-8s | %(name)s | %(message)s"

_configured: bool = False


def _configure_root_logger() -> None:
    """Configure the root logger once with a standard format and stream handler."""
    global _configured  # noqa: PLW0603
    if _configured:
        return

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(logging.Formatter(LOG_FORMAT))

    root = logging.getLogger()
    root.setLevel(logging.INFO)
    root.addHandler(handler)

    _configured = True


def get_logger(name: str) -> logging.Logger:
    """Return a configured logger for the given module *name*.

    Args:
        name: Dot-separated logger name (typically ``__name__``).

    Returns:
        A :class:`logging.Logger` with the application-wide format applied.
    """
    _configure_root_logger()
    return logging.getLogger(name)
