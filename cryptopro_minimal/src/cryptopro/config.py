from __future__ import annotations

from dataclasses import dataclass

@dataclass(frozen=True)
class Theme:
    bg: str
    card: str
    text: str
    muted: str
    border: str
    accent: str
    success: str
    danger: str
    warning: str

LIGHT = Theme(
    bg="#F5F5F7",
    card="#FFFFFF",
    text="#1D1D1F",
    muted="#6E6E73",
    border="#D2D2D7",
    accent="#0071E3",
    success="#34C759",
    danger="#FF3B30",
    warning="#FF9500",
)

DARK = Theme(
    bg="#0B0B0F",
    card="#141418",
    text="#F5F5F7",
    muted="#A1A1A6",
    border="#2C2C2E",
    accent="#0A84FF",
    success="#30D158",
    danger="#FF453A",
    warning="#FF9F0A",
)

DEFAULT_DB_FILE = "portfolio_db.json"
DEFAULT_HISTORY_FILE = "performance_history.json"

APP_TITLE = "CryptoPro"
APP_GEOMETRY = "1320x820"
MIN_SIZE = (1100, 650)

CACHE_DURATION_SEC = 300  # 5 minutos
