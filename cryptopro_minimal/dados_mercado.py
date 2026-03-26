"""Catálogo e geração de URL por ativo.

Você pode substituir este arquivo pelo seu `dados_mercado.py` real.
O app usa:
- MASTER_LIST: dict[str, list[tuple[str, str, str]]]
  (emoji, ticker, nome)
- gerar_url(ticker, categoria) -> str
"""

from __future__ import annotations

import urllib.parse

MASTER_LIST = {
    "Cripto": [
        ("◼", "BTC", "Bitcoin"),
        ("◼", "ETH", "Ethereum"),
        ("◼", "SOL", "Solana"),
        ("◼", "LINK", "Chainlink"),
        ("◼", "USDT", "Tether"),
    ],
    "Ações B3": [
        ("◼", "PETR4", "Petrobras PN"),
        ("◼", "VALE3", "Vale ON"),
        ("◼", "ITUB4", "Itaú Unibanco PN"),
        ("◼", "BABA34", "Alibaba BDR"),
        ("◼", "MELI34", "Mercado Livre BDR"),
    ],
    "Global": [
        ("◼", "AAPL", "Apple Inc."),
        ("◼", "MSFT", "Microsoft"),
        ("◼", "NVDA", "NVIDIA"),
    ],
    "Índices": [
        ("◼", "IBOV", "Ibovespa"),
        ("◼", "SPX", "S&P 500"),
    ],
}

def gerar_url(ticker: str, categoria: str) -> str:
    """Gera URL de consulta (fallback) baseada em busca web.

    Observação:
    - Este app busca o preço via Selenium tentando extrair valores do HTML.
    - Para maior estabilidade, personalize este método para URLs fixas (TradingView, Investing, etc.)
    """
    q = f"{ticker} preço"
    return "https://www.google.com/search?q=" + urllib.parse.quote(q)
