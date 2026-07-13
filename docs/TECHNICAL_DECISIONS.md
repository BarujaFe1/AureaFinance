# Technical Decisions

## ADRs resumidos

### ADR-001 — Local-first com SQLite + Drizzle

**Contexto:** finanças pessoais com necessidade de privacidade, backup simples e zero custo de infra.  
**Decisão:** persistência em SQLite local via `better-sqlite3` + Drizzle ORM.  
**Trade-off:** excelente para desktop/local e demo; deploy cloud exige storage persistente (volume, Turso/libSQL, etc.).

### ADR-002 — Dinheiro apenas em centavos inteiros

**Contexto:** float quebra conciliação.  
**Decisão:** todas as quantias no domínio/DB são `integer` cents. Formatação acontece na borda (UI/import).  
**Trade-off:** parsing BR (`1.234,56`) precisa ser explícito; settings de currency afetam display, não a unidade canônica.

### ADR-003 — Tríade de saldo: calculado × projetado × conferido

**Contexto:** planilhas misturam previsão e realidade.  
**Decisão:**  
- **Calculado** = opening + movimentações postadas  
- **Projetado** = calculado + compromissos futuros materializados  
- **Conferido** = snapshot manual do dia  
**Trade-off:** UX mais densa; exige educação do usuário (onboarding + empty states).

### ADR-004 — Cartão ≠ conta corrente

**Contexto:** fatura e caixa são conceitos distintos.  
**Decisão:** cartões têm settlement account; faturas/parcelas vivem em entidades próprias.  
**Trade-off:** mais tabelas; evita “saldo de cartão” misturado com liquidez.

### ADR-005 — Importação revisável (staging → dry-run → commit)

**Contexto:** Money.xlsx é heterogênea e imperfeita.  
**Decisão:** workbench com inventário de abas, staging e commit transacional. Bootstrap sintético demonstra o shape sem vazar dados pessoais.  
**Trade-off:** bootstrap não é parser 100% live do xlsx real no repo público (planilha real fica local/gitignored).

### ADR-006 — Calendário local (dia civil BR)

**Contexto:** `Date#toISOString().slice(0,10)` usa UTC e pode mudar o “hoje” perto da meia-noite.  
**Decisão:** `todayIso()` usa componentes locais; aritmética de datas de negócio usa helpers UTC-calendar em `lib/dates` sobre strings `yyyy-MM-dd`.  
**Trade-off:** “agora” absoluto (timestamps) continua em epoch ms; “dia financeiro” é civil.

### ADR-007 — Sem auth no MVP

**Contexto:** app single-user local.  
**Decisão:** sem login. Qualquer processo com acesso à máquina/porta pode mutar o SQLite.  
**Trade-off:** simples e honesto; **não** exponha na internet sem gateway/auth.

## Non-goals (por enquanto)

- Multi-tenant SaaS
- Sync cloud obrigatório
- Open Banking
- App mobile nativo
