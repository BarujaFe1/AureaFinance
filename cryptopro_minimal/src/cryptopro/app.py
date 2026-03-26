from __future__ import annotations

import csv
import queue
import threading
from dataclasses import asdict
from datetime import datetime
from typing import Dict, List, Optional, Tuple

import customtkinter as ctk
from tkinter import messagebox

import dados_mercado

from .config import (
    APP_TITLE, APP_GEOMETRY, MIN_SIZE,
    LIGHT, DARK,
)
from .portfolio import PortfolioManager, Position
from .pricing import PriceService
from .utils import format_currency_br, format_percent, parse_float_br

ctk.set_default_color_theme("blue")

class PriceUpdateWorker(threading.Thread):
    def __init__(
        self,
        manager: PortfolioManager,
        price_service: PriceService,
        url_resolver,
        out_queue: queue.Queue,
        tickers: List[str],
        stop_event: threading.Event,
    ):
        super().__init__(daemon=True)
        self.manager = manager
        self.price_service = price_service
        self.url_resolver = url_resolver
        self.q = out_queue
        self.tickers = tickers
        self.stop_event = stop_event

    def run(self):
        total = max(len(self.tickers), 1)
        for i, t in enumerate(self.tickers, start=1):
            if self.stop_event.is_set():
                self.q.put(("status", "Atualização interrompida."))
                self.q.put(("done", None))
                return
            try:
                url = self.url_resolver(t)
                price, change, from_cache = self.price_service.get_price(t, url)
                if price > 0:
                    self.manager.set_price(t, price)
                    self.q.put(("price", (t, price, change, from_cache)))
                else:
                    self.q.put(("price", (t, 0.0, "", from_cache)))
            except Exception as e:
                self.q.put(("error", f"Falha ao atualizar {t}: {e}"))

            self.q.put(("progress", int(i / total * 100)))

        self.q.put(("done", None))

class CryptoProApp(ctk.CTk):
    def __init__(self):
        super().__init__()

        self.manager = PortfolioManager()
        self.price_service = PriceService()

        self._theme_mode = "dark"
        self.theme = DARK
        ctk.set_appearance_mode("Dark")

        self.title(APP_TITLE)
        self.geometry(APP_GEOMETRY)
        self.minsize(*MIN_SIZE)

        self.grid_columnconfigure(1, weight=1)
        self.grid_rowconfigure(0, weight=1)

        self._queue: queue.Queue = queue.Queue()
        self._worker: Optional[PriceUpdateWorker] = None
        self._stop_event = threading.Event()

        self._build_ui()
        self._refresh_all()

        # polling de eventos do worker
        self.after(120, self._poll_worker_queue)

    # ---------------- UI Layout ----------------
    def _build_ui(self):
        self.configure(fg_color=self.theme.bg)

        # Sidebar minimalista
        self.sidebar = ctk.CTkFrame(self, width=240, fg_color=self.theme.bg, corner_radius=0)
        self.sidebar.grid(row=0, column=0, sticky="nsew")
        self.sidebar.grid_propagate(False)

        brand = ctk.CTkFrame(self.sidebar, fg_color="transparent")
        brand.pack(padx=18, pady=(22, 10), fill="x")

        ctk.CTkLabel(
            brand, text="CryptoPro",
            font=ctk.CTkFont(size=22, weight="bold"),
            text_color=self.theme.text
        ).pack(anchor="w")
        ctk.CTkLabel(
            brand, text="Portfolio Dashboard",
            font=ctk.CTkFont(size=12),
            text_color=self.theme.muted
        ).pack(anchor="w", pady=(2, 0))

        # Navegação
        nav = ctk.CTkFrame(self.sidebar, fg_color="transparent")
        nav.pack(padx=12, pady=(16, 10), fill="x")

        self.nav_buttons: Dict[str, ctk.CTkButton] = {}
        for label, key in [("Dashboard", "dash"), ("Mercado", "market"), ("Histórico", "hist"), ("Relatório", "report")]:
            btn = ctk.CTkButton(
                nav, text=label, height=40, corner_radius=12,
                fg_color="transparent", hover_color=self._hover(),
                text_color=self.theme.text, anchor="w",
                command=lambda k=key: self._show_view(k)
            )
            btn.pack(fill="x", pady=4)
            self.nav_buttons[key] = btn

        # Separator
        sep = ctk.CTkFrame(self.sidebar, height=1, fg_color=self.theme.border, corner_radius=0)
        sep.pack(fill="x", padx=18, pady=(14, 14))

        # Toggle tema
        theme_row = ctk.CTkFrame(self.sidebar, fg_color="transparent")
        theme_row.pack(fill="x", padx=18, pady=(0, 6))
        ctk.CTkLabel(theme_row, text="Aparência", text_color=self.theme.muted, font=ctk.CTkFont(size=12)).pack(anchor="w")
        self.theme_switch = ctk.CTkSwitch(
            theme_row,
            text="Dark Mode",
            command=self._toggle_theme,
            onvalue=1, offvalue=0
        )
        self.theme_switch.select()
        self.theme_switch.pack(anchor="w", pady=(8, 0))

        # Quick stats (minimal)
        self.quick = ctk.CTkFrame(self.sidebar, fg_color=self.theme.card, corner_radius=16, border_width=1, border_color=self.theme.border)
        self.quick.pack(fill="x", padx=18, pady=(14, 18))

        self.lbl_q_total = ctk.CTkLabel(self.quick, text="Valor atual", text_color=self.theme.muted, font=ctk.CTkFont(size=12))
        self.lbl_q_total.pack(anchor="w", padx=14, pady=(12, 0))
        self.lbl_q_total_val = ctk.CTkLabel(self.quick, text="R$ 0,00", text_color=self.theme.text, font=ctk.CTkFont(size=18, weight="bold"))
        self.lbl_q_total_val.pack(anchor="w", padx=14, pady=(2, 0))

        self.lbl_q_ret = ctk.CTkLabel(self.quick, text="Retorno", text_color=self.theme.muted, font=ctk.CTkFont(size=12))
        self.lbl_q_ret.pack(anchor="w", padx=14, pady=(10, 0))
        self.lbl_q_ret_val = ctk.CTkLabel(self.quick, text="+0,00%", text_color=self.theme.text, font=ctk.CTkFont(size=14, weight="bold"))
        self.lbl_q_ret_val.pack(anchor="w", padx=14, pady=(2, 12))

        # Main container
        self.container = ctk.CTkFrame(self, fg_color=self.theme.bg, corner_radius=0)
        self.container.grid(row=0, column=1, sticky="nsew")
        self.container.grid_rowconfigure(0, weight=1)
        self.container.grid_columnconfigure(0, weight=1)

        # Views
        self.views: Dict[str, ctk.CTkFrame] = {}
        for key in ["dash", "market", "hist", "report"]:
            fr = ctk.CTkFrame(self.container, fg_color=self.theme.bg, corner_radius=0)
            fr.grid(row=0, column=0, sticky="nsew")
            fr.grid_rowconfigure(2, weight=1)
            fr.grid_columnconfigure(0, weight=1)
            self.views[key] = fr

        self._build_dashboard(self.views["dash"])
        self._build_market(self.views["market"])
        self._build_history(self.views["hist"])
        self._build_report(self.views["report"])

        self._show_view("dash")

    def _hover(self):
        # hover suave
        return self.theme.border

    def _card(self, parent):
        return ctk.CTkFrame(parent, fg_color=self.theme.card, corner_radius=16, border_width=1, border_color=self.theme.border)

    def _show_view(self, key: str):
        for k, b in self.nav_buttons.items():
            if k == key:
                b.configure(fg_color=self.theme.border)
            else:
                b.configure(fg_color="transparent")
        self.views[key].tkraise()
        self._refresh_all()

    def _toggle_theme(self):
        if self.theme_switch.get() == 1:
            self._theme_mode = "dark"
            self.theme = DARK
            ctk.set_appearance_mode("Dark")
        else:
            self._theme_mode = "light"
            self.theme = LIGHT
            ctk.set_appearance_mode("Light")
        # reconstruir UI para aplicar cores
        self._rebuild_ui()

    def _rebuild_ui(self):
        # destrói e recria tudo (simples e confiável)
        for w in self.winfo_children():
            w.destroy()
        self._build_ui()
        self._refresh_all()

    # ---------------- Dashboard ----------------
    def _build_dashboard(self, parent: ctk.CTkFrame):
        # Header
        header = ctk.CTkFrame(parent, fg_color="transparent")
        header.grid(row=0, column=0, sticky="ew", padx=24, pady=(20, 12))
        header.grid_columnconfigure(0, weight=1)

        ctk.CTkLabel(header, text="Dashboard", text_color=self.theme.text, font=ctk.CTkFont(size=26, weight="bold")).grid(row=0, column=0, sticky="w")

        actions = ctk.CTkFrame(header, fg_color="transparent")
        actions.grid(row=0, column=1, sticky="e")

        self.btn_add_tx = ctk.CTkButton(actions, text="Nova transação", height=38, corner_radius=12, fg_color=self.theme.accent, command=self._open_add_transaction)
        self.btn_add_tx.pack(side="left", padx=(0, 8))

        self.btn_refresh = ctk.CTkButton(actions, text="Atualizar preços", height=38, corner_radius=12, fg_color=self.theme.card, text_color=self.theme.text, border_width=1, border_color=self.theme.border, command=self._start_price_update)
        self.btn_refresh.pack(side="left")

        # Cards
        cards = ctk.CTkFrame(parent, fg_color="transparent")
        cards.grid(row=1, column=0, sticky="ew", padx=24, pady=(0, 14))
        for i in range(4):
            cards.grid_columnconfigure(i, weight=1)

        self.card_valor = self._card(cards); self.card_valor.grid(row=0, column=0, sticky="ew", padx=(0, 12))
        self.card_invest = self._card(cards); self.card_invest.grid(row=0, column=1, sticky="ew", padx=(0, 12))
        self.card_pl = self._card(cards); self.card_pl.grid(row=0, column=2, sticky="ew", padx=(0, 12))
        self.card_ret = self._card(cards); self.card_ret.grid(row=0, column=3, sticky="ew")

        self._card_metric(self.card_valor, "Valor atual", "R$ 0,00")
        self._card_metric(self.card_invest, "Investido", "R$ 0,00")
        self._card_metric(self.card_pl, "P/L", "R$ 0,00")
        self._card_metric(self.card_ret, "Retorno", "+0,00%")

        # Table container
        table_card = self._card(parent)
        table_card.grid(row=2, column=0, sticky="nsew", padx=24, pady=(0, 24))
        table_card.grid_rowconfigure(1, weight=1)
        table_card.grid_columnconfigure(0, weight=1)

        # Table header
        th = ctk.CTkFrame(table_card, fg_color="transparent")
        th.grid(row=0, column=0, sticky="ew", padx=12, pady=(12, 6))
        cols = [("Ativo", 120), ("Qtd", 90), ("PM", 110), ("Preço", 110), ("Investido", 130), ("Atual", 130), ("P/L", 110), ("% ", 80), ("", 120)]
        for i, (name, w) in enumerate(cols):
            lab = ctk.CTkLabel(th, text=name, text_color=self.theme.muted, font=ctk.CTkFont(size=12, weight="bold"), width=w)
            lab.grid(row=0, column=i, sticky="w", padx=(6 if i == 0 else 0, 0))

        self.tbl = ctk.CTkScrollableFrame(table_card, fg_color="transparent", corner_radius=0)
        self.tbl.grid(row=1, column=0, sticky="nsew", padx=6, pady=(0, 12))

    def _card_metric(self, parent, title, value):
        parent.grid_columnconfigure(0, weight=1)
        ctk.CTkLabel(parent, text=title, text_color=self.theme.muted, font=ctk.CTkFont(size=12)).pack(anchor="w", padx=14, pady=(12, 0))
        lbl = ctk.CTkLabel(parent, text=value, text_color=self.theme.text, font=ctk.CTkFont(size=18, weight="bold"))
        lbl.pack(anchor="w", padx=14, pady=(4, 12))
        parent._value_label = lbl  # type: ignore[attr-defined]

    def _set_card_value(self, card, value: str, color: Optional[str] = None):
        lbl = getattr(card, "_value_label")
        if color:
            lbl.configure(text=value, text_color=color)
        else:
            lbl.configure(text=value, text_color=self.theme.text)

    def _refresh_table(self):
        for w in self.tbl.winfo_children():
            w.destroy()

        positions = self.manager.positions()
        for p in positions:
            self._table_row(p)

    def _table_row(self, p: Position):
        row = ctk.CTkFrame(self.tbl, fg_color=self.theme.card, corner_radius=14, border_width=1, border_color=self.theme.border)
        row.pack(fill="x", padx=6, pady=6)
        row.grid_columnconfigure(0, weight=1)

        price = self.manager.precos_atuais.get(p.ticker, p.pm)
        invest = p.custo_total
        current = p.qtd * float(price)
        pl = current - invest
        pl_pct = (pl / invest * 100.0) if invest > 0 else 0.0
        pl_color = self.theme.success if pl >= 0 else self.theme.danger

        values = [
            p.ticker,
            f"{p.qtd:.6f}".rstrip("0").rstrip("."),
            format_currency_br(p.pm),
            format_currency_br(price),
            format_currency_br(invest),
            format_currency_br(current),
            format_currency_br(pl),
            format_percent(pl_pct),
        ]

        widths = [120, 90, 110, 110, 130, 130, 110, 80]
        for i, (val, w) in enumerate(zip(values, widths)):
            color = pl_color if i >= 6 else self.theme.text
            ctk.CTkLabel(row, text=val, text_color=color, font=ctk.CTkFont(size=13, weight="bold" if i >= 6 else "normal"), width=w).grid(row=0, column=i, sticky="w", padx=(12 if i == 0 else 0, 0), pady=12)

        actions = ctk.CTkFrame(row, fg_color="transparent")
        actions.grid(row=0, column=8, sticky="e", padx=10)

        ctk.CTkButton(actions, text="Editar", width=58, height=30, corner_radius=10, fg_color=self.theme.card, text_color=self.theme.text, border_width=1, border_color=self.theme.border, command=lambda t=p.ticker: self._open_add_transaction(prefill=t)).pack(side="left", padx=4)
        ctk.CTkButton(actions, text="Remover", width=70, height=30, corner_radius=10, fg_color=self.theme.card, text_color=self.theme.danger, border_width=1, border_color=self.theme.border, command=lambda t=p.ticker: self._remove_asset(t)).pack(side="left", padx=4)

    # ---------------- Market ----------------
    def _build_market(self, parent: ctk.CTkFrame):
        header = ctk.CTkFrame(parent, fg_color="transparent")
        header.grid(row=0, column=0, sticky="ew", padx=24, pady=(20, 12))
        header.grid_columnconfigure(0, weight=1)

        ctk.CTkLabel(header, text="Mercado", text_color=self.theme.text, font=ctk.CTkFont(size=26, weight="bold")).grid(row=0, column=0, sticky="w")

        right = ctk.CTkFrame(header, fg_color="transparent")
        right.grid(row=0, column=1, sticky="e")

        self.market_search = ctk.StringVar(value="")
        self.market_search.trace_add("write", lambda *_: self._refresh_market())

        self.market_entry = ctk.CTkEntry(right, width=260, corner_radius=12, textvariable=self.market_search, placeholder_text="Buscar ativo...")
        self.market_entry.pack(side="left", padx=(0, 10))

        self.market_tab = ctk.CTkSegmentedButton(right, values=["Todos", "Seus", "Cripto", "Ações B3", "Global", "Índices"], command=lambda _: self._refresh_market())
        self.market_tab.set("Todos")
        self.market_tab.pack(side="left")

        card = self._card(parent)
        card.grid(row=1, column=0, sticky="nsew", padx=24, pady=(0, 24))
        card.grid_rowconfigure(0, weight=1)
        card.grid_columnconfigure(0, weight=1)

        self.market_list = ctk.CTkScrollableFrame(card, fg_color="transparent", corner_radius=0)
        self.market_list.grid(row=0, column=0, sticky="nsew", padx=10, pady=10)

    def _market_items(self) -> List[Tuple[str, str, str, str]]:
        # (emoji, ticker, name, category)
        items = []
        for cat, lst in dados_mercado.MASTER_LIST.items():
            for emoji, ticker, name in lst:
                items.append((emoji, ticker.upper(), name, cat))
        return items

    def _refresh_market(self):
        for w in self.market_list.winfo_children():
            w.destroy()

        mode = self.market_tab.get()
        q = self.market_search.get().strip().lower()
        items = self._market_items()

        portfolio_keys = set(self.manager.dados.keys())

        # filtro por modo
        if mode == "Seus":
            items = [it for it in items if it[1] in portfolio_keys]
        elif mode != "Todos":
            items = [it for it in items if it[3] == mode]

        # filtro por busca
        if q:
            items = [it for it in items if q in it[1].lower() or q in it[2].lower() or q in it[3].lower()]

        # ordenar: carteira primeiro
        items.sort(key=lambda x: (0 if x[1] in portfolio_keys else 1, x[1]))

        for emoji, ticker, name, cat in items[:150]:
            self._market_row(emoji, ticker, name, cat, ticker in portfolio_keys)

    def _market_row(self, emoji: str, ticker: str, name: str, cat: str, in_portfolio: bool):
        row = ctk.CTkFrame(self.market_list, fg_color=self.theme.card, corner_radius=14, border_width=1, border_color=self.theme.border)
        row.pack(fill="x", padx=6, pady=6)
        row.grid_columnconfigure(1, weight=1)

        ctk.CTkLabel(row, text=emoji, text_color=self.theme.muted, font=ctk.CTkFont(size=16)).grid(row=0, column=0, padx=12, pady=12)
        ctk.CTkLabel(row, text=ticker, text_color=self.theme.text, font=ctk.CTkFont(size=14, weight="bold")).grid(row=0, column=1, sticky="w", pady=12)
        ctk.CTkLabel(row, text=name, text_color=self.theme.muted, font=ctk.CTkFont(size=12)).grid(row=1, column=1, sticky="w", padx=(0,0), pady=(0,12))
        ctk.CTkLabel(row, text=cat, text_color=self.theme.muted, font=ctk.CTkFont(size=12)).grid(row=0, column=2, rowspan=2, padx=10)

        if in_portfolio:
            btn = ctk.CTkButton(row, text="Na carteira", height=32, corner_radius=12, fg_color=self.theme.card, text_color=self.theme.muted, border_width=1, border_color=self.theme.border, state="disabled")
        else:
            btn = ctk.CTkButton(row, text="Adicionar", height=32, corner_radius=12, fg_color=self.theme.accent, command=lambda: self._add_asset(ticker, cat))
        btn.grid(row=0, column=3, rowspan=2, padx=12)

    # ---------------- History ----------------
    def _build_history(self, parent: ctk.CTkFrame):
        header = ctk.CTkFrame(parent, fg_color="transparent")
        header.grid(row=0, column=0, sticky="ew", padx=24, pady=(20, 12))
        header.grid_columnconfigure(0, weight=1)

        ctk.CTkLabel(header, text="Histórico", text_color=self.theme.text, font=ctk.CTkFont(size=26, weight="bold")).grid(row=0, column=0, sticky="w")

        right = ctk.CTkFrame(header, fg_color="transparent")
        right.grid(row=0, column=1, sticky="e")

        ctk.CTkButton(right, text="Exportar CSV", height=36, corner_radius=12, fg_color=self.theme.card, border_width=1, border_color=self.theme.border, text_color=self.theme.text, command=self._export_csv).pack(side="left")

        card = self._card(parent)
        card.grid(row=1, column=0, sticky="nsew", padx=24, pady=(0, 24))
        card.grid_rowconfigure(0, weight=1)
        card.grid_columnconfigure(0, weight=1)

        self.hist_list = ctk.CTkScrollableFrame(card, fg_color="transparent", corner_radius=0)
        self.hist_list.grid(row=0, column=0, sticky="nsew", padx=10, pady=10)

    def _refresh_history(self):
        for w in self.hist_list.winfo_children():
            w.destroy()
        txs = self.manager.all_transactions()
        for t in txs[:300]:
            self._history_row(t)

    def _history_row(self, t: Dict):
        row = ctk.CTkFrame(self.hist_list, fg_color=self.theme.card, corner_radius=14, border_width=1, border_color=self.theme.border)
        row.pack(fill="x", padx=6, pady=6)
        row.grid_columnconfigure(1, weight=1)

        tipo = t.get("tipo", "")
        color = self.theme.success if tipo == "Compra" else self.theme.danger

        left = ctk.CTkFrame(row, fg_color="transparent")
        left.grid(row=0, column=0, sticky="w", padx=12, pady=12)

        ctk.CTkLabel(left, text=t.get("data",""), text_color=self.theme.muted, font=ctk.CTkFont(size=12)).pack(anchor="w")
        ctk.CTkLabel(left, text=t.get("ativo",""), text_color=self.theme.text, font=ctk.CTkFont(size=14, weight="bold")).pack(anchor="w")

        mid = ctk.CTkFrame(row, fg_color="transparent")
        mid.grid(row=0, column=1, sticky="w", padx=10, pady=12)

        ctk.CTkLabel(mid, text=tipo, text_color=color, font=ctk.CTkFont(size=13, weight="bold")).pack(anchor="w")
        ctk.CTkLabel(mid, text=f"Qtd: {t.get('qtd',0):.6f}".rstrip("0").rstrip("."), text_color=self.theme.muted, font=ctk.CTkFont(size=12)).pack(anchor="w")

        right = ctk.CTkFrame(row, fg_color="transparent")
        right.grid(row=0, column=2, sticky="e", padx=12, pady=12)

        ctk.CTkLabel(right, text=format_currency_br(t.get("preco",0)), text_color=self.theme.text, font=ctk.CTkFont(size=13, weight="bold")).pack(anchor="e")
        ctk.CTkLabel(right, text=format_currency_br(t.get("total",0)), text_color=self.theme.muted, font=ctk.CTkFont(size=12)).pack(anchor="e")

    # ---------------- Report ----------------
    def _build_report(self, parent: ctk.CTkFrame):
        header = ctk.CTkFrame(parent, fg_color="transparent")
        header.grid(row=0, column=0, sticky="ew", padx=24, pady=(20, 12))
        header.grid_columnconfigure(0, weight=1)

        ctk.CTkLabel(header, text="Relatório", text_color=self.theme.text, font=ctk.CTkFont(size=26, weight="bold")).grid(row=0, column=0, sticky="w")

        right = ctk.CTkFrame(header, fg_color="transparent")
        right.grid(row=0, column=1, sticky="e")

        self.btn_run_report = ctk.CTkButton(right, text="Gerar", height=36, corner_radius=12, fg_color=self.theme.accent, command=self._generate_report)
        self.btn_run_report.pack(side="left", padx=(0, 8))

        self.btn_stop = ctk.CTkButton(right, text="Parar", height=36, corner_radius=12, fg_color=self.theme.card, border_width=1, border_color=self.theme.border, text_color=self.theme.danger, command=self._stop_worker)
        self.btn_stop.pack(side="left")

        # status + progress
        status = ctk.CTkFrame(parent, fg_color="transparent")
        status.grid(row=1, column=0, sticky="ew", padx=24, pady=(0, 12))
        status.grid_columnconfigure(0, weight=1)

        self.lbl_status = ctk.CTkLabel(status, text="Pronto.", text_color=self.theme.muted, font=ctk.CTkFont(size=12))
        self.lbl_status.grid(row=0, column=0, sticky="w")

        self.progress = ctk.CTkProgressBar(status, width=280)
        self.progress.grid(row=0, column=1, sticky="e")
        self.progress.set(0)

        card = self._card(parent)
        card.grid(row=2, column=0, sticky="nsew", padx=24, pady=(0, 24))
        card.grid_rowconfigure(0, weight=1)
        card.grid_columnconfigure(0, weight=1)

        self.txt_report = ctk.CTkTextbox(card, corner_radius=14, fg_color=self.theme.card, text_color=self.theme.text)
        self.txt_report.grid(row=0, column=0, sticky="nsew", padx=10, pady=10)

        tools = ctk.CTkFrame(parent, fg_color="transparent")
        tools.grid(row=3, column=0, sticky="ew", padx=24, pady=(0, 18))
        tools.grid_columnconfigure(0, weight=1)

        ctk.CTkButton(tools, text="Copiar", height=34, corner_radius=12, fg_color=self.theme.card, border_width=1, border_color=self.theme.border, text_color=self.theme.text, command=self._copy_report).pack(side="left")
        ctk.CTkButton(tools, text="Salvar .txt", height=34, corner_radius=12, fg_color=self.theme.card, border_width=1, border_color=self.theme.border, text_color=self.theme.text, command=self._save_report).pack(side="left", padx=10)

    # ---------------- Actions / Logic ----------------
    def _refresh_all(self):
        # Atualiza dashboard e listas
        self._refresh_cards()
        if "dash" in self.views and self.views["dash"].winfo_ismapped():
            self._refresh_table()
        self._refresh_market()
        self._refresh_history()

    def _refresh_cards(self):
        st = self.manager.stats()
        pl_color = self.theme.success if st.lucro_prejuizo >= 0 else self.theme.danger
        ret_color = self.theme.success if st.retorno_percentual >= 0 else self.theme.danger

        self._set_card_value(self.card_valor, format_currency_br(st.valor_atual))
        self._set_card_value(self.card_invest, format_currency_br(st.total_investido))
        self._set_card_value(self.card_pl, format_currency_br(st.lucro_prejuizo), pl_color)
        self._set_card_value(self.card_ret, format_percent(st.retorno_percentual), ret_color)

        self.lbl_q_total_val.configure(text=format_currency_br(st.valor_atual))
        self.lbl_q_ret_val.configure(text=format_percent(st.retorno_percentual), text_color=ret_color)

    def _add_asset(self, ticker: str, categoria: str):
        try:
            url = dados_mercado.gerar_url(ticker, categoria)
            ok = self.manager.add_asset(ticker, categoria, url=url)
            if ok:
                messagebox.showinfo("Sucesso", f"{ticker} adicionado à carteira.")
                self._refresh_all()
        except Exception as e:
            messagebox.showerror("Erro", str(e))

    def _remove_asset(self, ticker: str):
        if not messagebox.askyesno("Confirmar", f"Remover {ticker} e todas as transações?"):
            return
        try:
            if self.manager.remove_asset(ticker):
                self._refresh_all()
        except Exception as e:
            messagebox.showerror("Erro", str(e))

    def _open_add_transaction(self, prefill: Optional[str] = None):
        dlg = ctk.CTkToplevel(self)
        dlg.title("Nova transação")
        dlg.geometry("420x520")
        dlg.resizable(False, False)
        dlg.grab_set()
        dlg.configure(fg_color=self.theme.bg)

        card = ctk.CTkFrame(dlg, fg_color=self.theme.card, corner_radius=16, border_width=1, border_color=self.theme.border)
        card.pack(fill="both", expand=True, padx=18, pady=18)

        ctk.CTkLabel(card, text="Nova transação", text_color=self.theme.text, font=ctk.CTkFont(size=20, weight="bold")).pack(anchor="w", padx=16, pady=(16, 8))

        # Ativo
        ctk.CTkLabel(card, text="Ativo", text_color=self.theme.muted, font=ctk.CTkFont(size=12)).pack(anchor="w", padx=16, pady=(10, 0))
        asset_var = ctk.StringVar(value=prefill or (list(self.manager.dados.keys())[0] if self.manager.dados else ""))
        values = sorted(set(list(self.manager.dados.keys()) + ["NOVO..."]))
        asset_combo = ctk.CTkComboBox(card, values=values, variable=asset_var, corner_radius=12)
        asset_combo.pack(fill="x", padx=16, pady=(6, 0))

        new_frame = ctk.CTkFrame(card, fg_color="transparent")
        new_asset = ctk.CTkEntry(new_frame, corner_radius=12, placeholder_text="Ticker (ex: BTC, PETR4)")
        new_cat = ctk.CTkComboBox(new_frame, values=["Cripto", "Ações B3", "Global", "Índices"], corner_radius=12)
        new_cat.set("Cripto")

        def toggle_new(*_):
            if asset_var.get() == "NOVO...":
                new_frame.pack(fill="x", padx=16, pady=(10, 0))
            else:
                new_frame.pack_forget()

        asset_combo.configure(command=lambda _: toggle_new())
        toggle_new()

        ctk.CTkLabel(new_frame, text="Novo ativo", text_color=self.theme.muted, font=ctk.CTkFont(size=12)).pack(anchor="w", pady=(0, 4))
        new_asset.pack(fill="x")
        ctk.CTkLabel(new_frame, text="Categoria", text_color=self.theme.muted, font=ctk.CTkFont(size=12)).pack(anchor="w", pady=(10, 4))
        new_cat.pack(fill="x")

        # Data
        ctk.CTkLabel(card, text="Data (dd/mm/aa)", text_color=self.theme.muted, font=ctk.CTkFont(size=12)).pack(anchor="w", padx=16, pady=(14, 0))
        ent_date = ctk.CTkEntry(card, corner_radius=12)
        ent_date.pack(fill="x", padx=16, pady=(6, 0))
        ent_date.insert(0, datetime.now().strftime("%d/%m/%y"))

        # Tipo
        ctk.CTkLabel(card, text="Tipo", text_color=self.theme.muted, font=ctk.CTkFont(size=12)).pack(anchor="w", padx=16, pady=(14, 0))
        tipo_var = ctk.StringVar(value="Compra")
        tipo = ctk.CTkSegmentedButton(card, values=["Compra", "Venda"], variable=tipo_var)
        tipo.pack(fill="x", padx=16, pady=(6, 0))

        # Qtd / Preço
        ctk.CTkLabel(card, text="Quantidade", text_color=self.theme.muted, font=ctk.CTkFont(size=12)).pack(anchor="w", padx=16, pady=(14, 0))
        ent_qty = ctk.CTkEntry(card, corner_radius=12, placeholder_text="Ex: 0,5")
        ent_qty.pack(fill="x", padx=16, pady=(6, 0))

        ctk.CTkLabel(card, text="Preço unitário (R$)", text_color=self.theme.muted, font=ctk.CTkFont(size=12)).pack(anchor="w", padx=16, pady=(14, 0))
        ent_price = ctk.CTkEntry(card, corner_radius=12, placeholder_text="Ex: 123,45")
        ent_price.pack(fill="x", padx=16, pady=(6, 0))

        # Buttons
        bar = ctk.CTkFrame(card, fg_color="transparent")
        bar.pack(fill="x", padx=16, pady=18)

        def save():
            try:
                ticker = asset_var.get().strip().upper()
                if ticker == "NOVO...":
                    ticker = new_asset.get().strip().upper()
                    if not ticker:
                        raise ValueError("Informe o ticker do novo ativo.")
                    categoria = new_cat.get()
                    url = dados_mercado.gerar_url(ticker, categoria)
                    self.manager.add_asset(ticker, categoria, url=url)

                qty = parse_float_br(ent_qty.get())
                price = parse_float_br(ent_price.get())

                self.manager.add_transaction(
                    ticker=ticker,
                    data=ent_date.get(),
                    tipo=tipo_var.get(),
                    qtd=qty,
                    preco=price,
                )
                dlg.destroy()
                self._refresh_all()
                messagebox.showinfo("Sucesso", "Transação salva.")
            except Exception as e:
                messagebox.showerror("Erro", str(e))

        ctk.CTkButton(bar, text="Salvar", height=36, corner_radius=12, fg_color=self.theme.accent, command=save).pack(side="left")
        ctk.CTkButton(bar, text="Cancelar", height=36, corner_radius=12, fg_color=self.theme.card, border_width=1, border_color=self.theme.border, text_color=self.theme.text, command=dlg.destroy).pack(side="right")

    def _export_csv(self):
        try:
            filename = f"historico_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
            txs = self.manager.all_transactions()
            with open(filename, "w", newline="", encoding="utf-8") as f:
                w = csv.writer(f)
                w.writerow(["Data", "Ativo", "Tipo", "Quantidade", "Preço", "Total"])
                for t in txs:
                    w.writerow([t.get("data"), t.get("ativo"), t.get("tipo"), t.get("qtd"), t.get("preco"), t.get("total")])
            messagebox.showinfo("Exportado", f"CSV salvo em {filename}")
        except Exception as e:
            messagebox.showerror("Erro", str(e))

    def _start_price_update(self):
        if self._worker and self._worker.is_alive():
            messagebox.showwarning("Aviso", "Atualização já em andamento.")
            return

        positions = self.manager.positions()
        tickers = [p.ticker for p in positions]
        if not tickers:
            messagebox.showinfo("Info", "Nenhum ativo com posição para atualizar.")
            return

        self._stop_event.clear()
        self.progress.set(0)
        self.lbl_status.configure(text="Atualizando preços...")

        def resolver(ticker: str) -> str:
            url = self.manager.get_asset_url(ticker)
            if url:
                return url
            cat = self.manager.get_asset_category(ticker)
            return dados_mercado.gerar_url(ticker, cat)

        self._worker = PriceUpdateWorker(
            manager=self.manager,
            price_service=self.price_service,
            url_resolver=resolver,
            out_queue=self._queue,
            tickers=tickers,
            stop_event=self._stop_event,
        )
        self._worker.start()

    def _stop_worker(self):
        if self._worker and self._worker.is_alive():
            self._stop_event.set()
            self.lbl_status.configure(text="Parando...")

    def _poll_worker_queue(self):
        try:
            while True:
                kind, payload = self._queue.get_nowait()
                if kind == "status":
                    self.lbl_status.configure(text=str(payload))
                elif kind == "progress":
                    p = int(payload or 0)
                    self.progress.set(p / 100.0)
                elif kind == "price":
                    ticker, price, change, from_cache = payload
                    # apenas status; UI já lê do manager
                    if price > 0:
                        src = "cache" if from_cache else "web"
                        self.lbl_status.configure(text=f"{ticker}: {format_currency_br(price)} ({src})")
                elif kind == "error":
                    self.lbl_status.configure(text=str(payload))
                elif kind == "done":
                    self.lbl_status.configure(text="Preços atualizados.")
                    self.progress.set(1.0)
                    self._refresh_all()
        except queue.Empty:
            pass
        finally:
            self.after(120, self._poll_worker_queue)

    def _generate_report(self):
        # Gera relatório com stats + posições + histórico recente
        self._start_price_update()  # atualiza em background; relatório usa o que tiver
        st = self.manager.stats()
        positions = self.manager.positions()
        txs = self.manager.all_transactions()[:10]

        lines = []
        lines.append(f"RELATÓRIO — {datetime.now().strftime('%d/%m/%Y %H:%M')}")
        lines.append("")
        lines.append("RESUMO")
        lines.append(f"  • Investido: {format_currency_br(st.total_investido)}")
        lines.append(f"  • Valor atual: {format_currency_br(st.valor_atual)}")
        lines.append(f"  • P/L: {format_currency_br(st.lucro_prejuizo)}")
        lines.append(f"  • Retorno: {format_percent(st.retorno_percentual)}")
        lines.append(f"  • Ativos: {st.num_ativos}")
        lines.append("")
        lines.append("POSIÇÕES")
        lines.append("-" * 64)
        for p in positions:
            price = self.manager.precos_atuais.get(p.ticker, p.pm)
            invest = p.custo_total
            current = p.qtd * float(price)
            pl = current - invest
            pl_pct = (pl / invest * 100.0) if invest > 0 else 0.0
            lines.append(f"{p.ticker:8}  qtd={p.qtd:.6f}  pm={format_currency_br(p.pm):>12}  px={format_currency_br(price):>12}  pl={format_currency_br(pl):>12}  ({format_percent(pl_pct)})")
        lines.append("-" * 64)
        lines.append("")
        lines.append("HISTÓRICO (últimas 10)")
        for t in txs:
            lines.append(f"  • {t['data']} — {t['ativo']} — {t['tipo']} {t['qtd']} @ {format_currency_br(t['preco'])}")

        lines.append("")
        lines.append("NOTAS")
        lines.append("  • Custo médio calculado por custo médio móvel (vendas reduzem custo proporcional ao PM vigente).")
        lines.append("  • Preços podem variar conforme a fonte usada em `dados_mercado.gerar_url`.")

        text = "\n".join(lines)
        self.txt_report.delete("1.0", "end")
        self.txt_report.insert("1.0", text)

    def _copy_report(self):
        txt = self.txt_report.get("1.0", "end").strip()
        self.clipboard_clear()
        self.clipboard_append(txt)
        messagebox.showinfo("Copiado", "Relatório copiado.")

    def _save_report(self):
        try:
            txt = self.txt_report.get("1.0", "end").strip()
            filename = f"relatorio_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
            with open(filename, "w", encoding="utf-8") as f:
                f.write(txt)
            messagebox.showinfo("Salvo", f"Arquivo salvo: {filename}")
        except Exception as e:
            messagebox.showerror("Erro", str(e))
