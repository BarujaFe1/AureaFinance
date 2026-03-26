from __future__ import annotations

import os
import threading
from dataclasses import dataclass
from datetime import datetime
from decimal import Decimal, ROUND_HALF_UP
from typing import Dict, List, Any, Optional, Tuple

from .config import DEFAULT_DB_FILE
from .utils import atomic_write_json, read_json, parse_date_br, safe_decimal

@dataclass(frozen=True)
class Position:
    ticker: str
    categoria: str
    qtd: float
    pm: float
    custo_total: float

@dataclass(frozen=True)
class Stats:
    total_investido: float
    valor_atual: float
    lucro_prejuizo: float
    retorno_percentual: float
    num_ativos: int

class PortfolioManager:
    """Gerencia dados, valida transações e calcula posições com custo médio móvel."""

    def __init__(self, db_file: str = DEFAULT_DB_FILE):
        self.db_file = db_file
        self._lock = threading.Lock()
        self.dados: Dict[str, Any] = {}
        self.precos_atuais: Dict[str, float] = {}
        self._load_or_create()

    def _load_or_create(self) -> None:
        with self._lock:
            if os.path.exists(self.db_file):
                try:
                    self.dados = read_json(self.db_file)
                    if not isinstance(self.dados, dict):
                        raise ValueError("db inválido")
                except Exception:
                    self.dados = {}
            else:
                self.dados = {}
                atomic_write_json(self.db_file, self.dados)

    def save(self) -> None:
        with self._lock:
            atomic_write_json(self.db_file, self.dados)

    # ------------------------
    # Ativos
    # ------------------------
    def add_asset(self, ticker: str, categoria: str, url: Optional[str] = None) -> bool:
        ticker = ticker.strip().upper()
        if not ticker:
            raise ValueError("Ticker vazio")
        with self._lock:
            if ticker in self.dados:
                return False
            self.dados[ticker] = {
                "categoria": categoria,
                "url": url,
                "data_adicao": datetime.now().strftime("%d/%m/%Y"),
                "transacoes": [],
            }
            self.save()
            return True

    def remove_asset(self, ticker: str) -> bool:
        ticker = ticker.strip().upper()
        with self._lock:
            if ticker not in self.dados:
                return False
            del self.dados[ticker]
            self.save()
            # remove preço cacheado
            self.precos_atuais.pop(ticker, None)
            return True

    def set_price(self, ticker: str, price: float) -> None:
        ticker = ticker.strip().upper()
        with self._lock:
            self.precos_atuais[ticker] = float(price)

    def get_asset_url(self, ticker: str) -> Optional[str]:
        ticker = ticker.strip().upper()
        with self._lock:
            return (self.dados.get(ticker) or {}).get("url")

    def get_asset_category(self, ticker: str) -> str:
        ticker = ticker.strip().upper()
        with self._lock:
            return (self.dados.get(ticker) or {}).get("categoria") or "Desconhecida"

    # ------------------------
    # Transações
    # ------------------------
    def add_transaction(self, ticker: str, data: str, tipo: str, qtd: str | float, preco: str | float) -> None:
        ticker = ticker.strip().upper()
        if not ticker:
            raise ValueError("Ativo inválido")

        # valida data
        dt = parse_date_br(data)
        data_norm = dt.strftime("%d/%m/%y")

        # valida tipo
        tipo = tipo.strip().capitalize()
        if tipo not in ("Compra", "Venda"):
            raise ValueError("Tipo deve ser Compra ou Venda")

        # valida números
        q = Decimal(str(qtd))
        p = Decimal(str(preco))
        if q <= 0 or p <= 0:
            raise ValueError("Quantidade e preço devem ser positivos")

        with self._lock:
            if ticker not in self.dados:
                # heurística simples
                categoria = "Cripto" if len(ticker) <= 5 and not any(c.isdigit() for c in ticker) else "Ações B3"
                self.dados[ticker] = {"categoria": categoria, "url": None, "transacoes": []}

            # valida venda não exceder saldo
            if tipo == "Venda":
                pos = self._position_for_locked(ticker)
                if Decimal(str(pos.qtd)) < q:
                    raise ValueError("Quantidade de venda excede o saldo disponível")

            self.dados[ticker]["transacoes"].append({
                "id": str(datetime.now().timestamp()),
                "data": data_norm,
                "tipo": tipo,
                "qtd": float(q),
                "preco": float(p),
            })
            self.save()

    def all_transactions(self) -> List[Dict[str, Any]]:
        with self._lock:
            txs: List[Dict[str, Any]] = []
            for ticker, info in self.dados.items():
                for t in info.get("transacoes", []):
                    txs.append({
                        "ativo": ticker,
                        "categoria": info.get("categoria", "Desconhecida"),
                        **t,
                        "total": float(safe_decimal(t.get("qtd")) * safe_decimal(t.get("preco"))),
                    })
        # ordena por data desc
        def key(x):
            try:
                return parse_date_br(x["data"])
            except Exception:
                return datetime.min
        txs.sort(key=key, reverse=True)
        return txs

    # ------------------------
    # Cálculos (custo médio móvel)
    # ------------------------
    def positions(self) -> List[Position]:
        with self._lock:
            positions = []
            for ticker in sorted(self.dados.keys()):
                pos = self._position_for_locked(ticker)
                if pos.qtd > 0:
                    positions.append(pos)
            return positions

    def _position_for_locked(self, ticker: str) -> Position:
        info = self.dados.get(ticker) or {}
        categoria = info.get("categoria") or "Desconhecida"
        trans = list(info.get("transacoes") or [])

        # ordena cronologicamente para cálculo consistente
        def k(t):
            try:
                return (parse_date_br(t.get("data", "01/01/00")), t.get("id", ""))
            except Exception:
                return (datetime.min, t.get("id", ""))
        trans.sort(key=k)

        qtd = Decimal("0")
        custo = Decimal("0")

        for t in trans:
            q = safe_decimal(t.get("qtd"))
            p = safe_decimal(t.get("preco"))
            tipo = (t.get("tipo") or "").strip().capitalize()

            if tipo == "Compra":
                custo += q * p
                qtd += q
            elif tipo == "Venda":
                # custo médio móvel: reduz custo proporcional ao PM vigente
                if qtd <= 0:
                    continue
                pm_atual = (custo / qtd)
                custo -= pm_atual * q
                qtd -= q
                if qtd < 0:
                    qtd = Decimal("0")
                    custo = Decimal("0")

        if qtd > 0:
            pm = (custo / qtd).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
        else:
            pm = Decimal("0")

        return Position(
            ticker=ticker,
            categoria=categoria,
            qtd=float(qtd),
            pm=float(pm),
            custo_total=float(custo),
        )

    def stats(self) -> Stats:
        with self._lock:
            pos = self.positions()
            total_investido = sum(p.custo_total for p in pos)
            valor_atual = 0.0
            for p in pos:
                price = self.precos_atuais.get(p.ticker, p.pm)
                valor_atual += p.qtd * float(price)

            lucro = valor_atual - total_investido
            ret = (lucro / total_investido * 100.0) if total_investido > 0 else 0.0
            return Stats(
                total_investido=float(total_investido),
                valor_atual=float(valor_atual),
                lucro_prejuizo=float(lucro),
                retorno_percentual=float(ret),
                num_ativos=len(pos),
            )
