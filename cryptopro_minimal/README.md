# CryptoPro — Portfolio Dashboard (CustomTkinter)

![Python](https://img.shields.io/badge/python-3.10%2B-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![UI](https://img.shields.io/badge/UI-CustomTkinter-ff69b4)

Dashboard desktop minimalista (estilo “produto Apple”) para acompanhar carteira (cripto/B3/global), registrar transações, ver P/L e gerar relatório.

> **Aviso**: projeto educacional/demonstração. Não é recomendação de investimento.

---

## ✨ Features
- **Dashboard** com cards (Valor atual, Investido, P/L, Retorno %)
- **Transações**: compra/venda com validações
- **Histórico** + exportação CSV
- **Mercado**: lista por categorias + busca (via `dados_mercado.py`)
- **Atualização de preços** em background (Selenium headless) com cache
- **Relatório** (“Morning Call”) gerado automaticamente

---

## 🧱 Requisitos
- Python **3.10+**
- Google Chrome instalado (para o modo Selenium)

---

## 🚀 Como rodar (recomendado)

### Opção A (profissional): instalar em modo *editable* (recomendado para `src/` layout)

**Windows (PowerShell)**
```powershell
git clone https://github.com/SEU_USUARIO/cryptopro.git
cd cryptopro

python -m venv .venv
.\.venv\Scripts\Activate.ps1

pip install -r requirements.txt
pip install -e .

copy portfolio_db.sample.json portfolio_db.json

python -m cryptopro
```

**Linux/macOS**
```bash
git clone https://github.com/SEU_USUARIO/cryptopro.git
cd cryptopro

python3 -m venv .venv
source .venv/bin/activate

pip install -r requirements.txt
pip install -e .

cp portfolio_db.sample.json portfolio_db.json

python -m cryptopro
```

### Opção B (rápida): rodar direto

O `main.py` já adiciona automaticamente `./src` no `sys.path`, então funciona assim:

```bash
python main.py
```

---

## 🧱 Como rodar (Windows) — versão curta

```bash
git clone https://github.com/SEU_USUARIO/cryptopro.git
cd cryptopro

python -m venv .venv
.venv\Scripts\activate

pip install -r requirements.txt

# Cria a base local (não versione dados pessoais)
copy portfolio_db.sample.json portfolio_db.json

python main.py
```

## 🚀 Como rodar (Linux/macOS)
```bash
git clone https://github.com/SEU_USUARIO/cryptopro.git
cd cryptopro

python3 -m venv .venv
source .venv/bin/activate

pip install -r requirements.txt

cp portfolio_db.sample.json portfolio_db.json

python main.py
```

---

## 📁 Estrutura do projeto
```
cryptopro/
  src/cryptopro/
    app.py          # UI (CustomTkinter)
    portfolio.py    # regras de negócio + persistência
    pricing.py      # atualização de preços (cache + Selenium)
    utils.py        # formatação/parse/IO seguro
    config.py       # tema (light/dark) estilo minimalista
  dados_mercado.py  # catálogo + gerar_url (exemplo incluído)
  main.py
  requirements.txt
  portfolio_db.sample.json
```

---

## 🔒 Privacidade (importante)
- **NÃO** commite `portfolio_db.json` (seus dados reais).
- O repositório vem com `portfolio_db.sample.json` apenas para exemplo.
- O `.gitignore` já bloqueia `portfolio_db.json` e `performance_history.json`.

---

## 🧪 Dicas para portfólio no GitHub
- Adicione **Topics**: `python`, `customtkinter`, `selenium`, `desktop-app`, `finance`, `portfolio`
- Faça 1 screenshot e coloque em `assets/screenshots/dashboard.png`
- Crie um Release (ex: `v1.0.0`) quando estiver estável

---

## 📄 Licença
MIT — veja `LICENSE`.
