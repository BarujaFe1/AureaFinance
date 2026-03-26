from __future__ import annotations

import json
import os
import tempfile
from datetime import datetime
from decimal import Decimal, InvalidOperation
from typing import Any

def format_currency_br(value: float) -> str:
    try:
        v = float(value)
    except Exception:
        v = 0.0
    s = f"{v:,.2f}"
    return "R$ " + s.replace(",", "X").replace(".", ",").replace("X", ".")

def format_percent(value: float) -> str:
    try:
        v = float(value)
    except Exception:
        v = 0.0
    return f"{v:+.2f}%"

def parse_float_br(s: str) -> float:
    """Aceita '1.23' ou '1,23' e remove separadores de milhar."""
    if s is None:
        raise ValueError("valor vazio")
    t = str(s).strip()
    if not t:
        raise ValueError("valor vazio")
    t = t.replace(" ", "")
    # remove moeda e símbolos
    for ch in ["R$", "%"]:
        t = t.replace(ch, "")
    # normaliza
    if "," in t and "." in t:
        # decide separador decimal pelo último
        if t.rfind(",") > t.rfind("."):
            t = t.replace(".", "").replace(",", ".")
        else:
            t = t.replace(",", "")
    elif "," in t:
        t = t.replace(",", ".")
    try:
        return float(t)
    except ValueError:
        raise ValueError(f"não foi possível converter '{s}'")

def parse_date_br(s: str) -> datetime:
    s = str(s).strip()
    for fmt in ("%d/%m/%y", "%d/%m/%Y"):
        try:
            return datetime.strptime(s, fmt)
        except ValueError:
            pass
    raise ValueError("Data inválida. Use dd/mm/aa ou dd/mm/aaaa.")

def atomic_write_json(path: str, data: Any) -> None:
    folder = os.path.dirname(path) or "."
    os.makedirs(folder, exist_ok=True)
    fd, tmp = tempfile.mkstemp(prefix="._tmp_", suffix=".json", dir=folder)
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        os.replace(tmp, path)
    finally:
        try:
            if os.path.exists(tmp):
                os.remove(tmp)
        except Exception:
            pass

def read_json(path: str) -> Any:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def safe_decimal(x: Any) -> Decimal:
    try:
        return Decimal(str(x))
    except (InvalidOperation, ValueError):
        return Decimal("0")
