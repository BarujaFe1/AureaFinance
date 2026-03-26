from __future__ import annotations

import re
import time
from dataclasses import dataclass
from datetime import datetime
from typing import Dict, Optional, Tuple, Callable

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

from .config import CACHE_DURATION_SEC

@dataclass
class CachedPrice:
    ts: datetime
    price: float
    change: str

class PriceCache:
    def __init__(self, ttl_sec: int = CACHE_DURATION_SEC):
        self.ttl_sec = ttl_sec
        self._cache: Dict[str, CachedPrice] = {}

    def get(self, ticker: str) -> Optional[CachedPrice]:
        ticker = ticker.upper()
        item = self._cache.get(ticker)
        if not item:
            return None
        age = (datetime.now() - item.ts).total_seconds()
        if age > self.ttl_sec:
            return None
        return item

    def set(self, ticker: str, price: float, change: str = "") -> None:
        self._cache[ticker.upper()] = CachedPrice(datetime.now(), float(price), change)

class SeleniumPriceFetcher:
    """Fetcher genérico via Selenium (headless). Depende da URL do ativo."""

    def __init__(self, headless: bool = True, timeout_sec: int = 12):
        self.headless = headless
        self.timeout_sec = timeout_sec

    def _setup_driver(self) -> webdriver.Chrome:
        opts = Options()
        if self.headless:
            # headless "new" é mais estável em versões recentes
            opts.add_argument("--headless=new")
        opts.add_argument("--disable-gpu")
        opts.add_argument("--no-sandbox")
        opts.add_argument("--disable-dev-shm-usage")
        opts.add_argument("--window-size=1400,900")
        opts.add_argument("--disable-notifications")
        opts.add_argument("--disable-blink-features=AutomationControlled")
        opts.add_experimental_option("excludeSwitches", ["enable-automation"])
        opts.add_experimental_option("useAutomationExtension", False)

        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=opts)
        driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
        return driver

    def fetch_from_url(self, url: str, ticker: str) -> Tuple[float, str]:
        driver = self._setup_driver()
        try:
            driver.get(url)
            wait = WebDriverWait(driver, self.timeout_sec)

            # espera DOM básico
            wait.until(lambda d: d.execute_script("return document.readyState") == "complete")
            time.sleep(0.5)

            price = self._extract_price(driver)
            change = self._extract_change(driver)
            return price, change
        finally:
            try:
                driver.quit()
            except Exception:
                pass

    def _extract_price(self, driver: webdriver.Chrome) -> float:
        # Estratégia: procurar texto com padrão numérico “grande”
        candidates = []

        # pega nós comuns
        xpath_list = [
            "//*[contains(@class,'price') or contains(@class,'last') or contains(@class,'value')]",
            "//span",
            "//div",
        ]

        for xp in xpath_list:
            try:
                els = driver.find_elements(By.XPATH, xp)
            except Exception:
                continue
            for e in els[:250]:  # limita
                try:
                    txt = (e.text or "").strip()
                except Exception:
                    continue
                if not txt:
                    continue
                # tenta achar número dentro do texto
                m = re.search(r"[-+]?\d{1,3}(?:[\.,]\d{3})*(?:[\.,]\d+)?", txt)
                if not m:
                    continue
                num = m.group(0)
                val = self._to_float(num)
                if val and val > 0:
                    candidates.append(val)

        # heurística: escolher o maior valor plausível
        if not candidates:
            return 0.0
        candidates.sort(reverse=True)
        # em alguns sites, o preço é o maior número visível próximo, então pega top-1
        return float(candidates[0])

    def _extract_change(self, driver: webdriver.Chrome) -> str:
        try:
            els = driver.find_elements(By.XPATH, "//*[contains(text(),'%')]")
            for e in els[:120]:
                txt = (e.text or "").strip()
                if "%" in txt and len(txt) <= 12:
                    return txt
        except Exception:
            pass
        return ""

    def _to_float(self, s: str) -> float:
        t = re.sub(r"[^0-9\.,-]", "", s)
        if not t:
            return 0.0
        if "," in t and "." in t:
            if t.rfind(",") > t.rfind("."):
                t = t.replace(".", "").replace(",", ".")
            else:
                t = t.replace(",", "")
        elif "," in t:
            t = t.replace(",", ".")
        try:
            return float(t)
        except ValueError:
            return 0.0

class PriceService:
    """Serviço de preços com cache + fetcher pluggável."""

    def __init__(self, cache: Optional[PriceCache] = None, fetcher: Optional[SeleniumPriceFetcher] = None):
        self.cache = cache or PriceCache()
        self.fetcher = fetcher or SeleniumPriceFetcher()

    def get_price(self, ticker: str, url: str) -> Tuple[float, str, bool]:
        """Retorna (price, change, from_cache)."""
        cached = self.cache.get(ticker)
        if cached:
            return cached.price, cached.change, True

        price, change = self.fetcher.fetch_from_url(url, ticker)
        if price > 0:
            self.cache.set(ticker, price, change)
        return price, change, False
