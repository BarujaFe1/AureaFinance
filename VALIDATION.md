# VALIDATION.md

## 1) Typecheck
```bash
pnpm install
pnpm typecheck
```

**Resultado esperado**
- saída sem erros de TypeScript
- código de saída `0`

---

## 2) Build
```bash
pnpm build
```

**Resultado esperado**
- build do Next concluído
- código de saída `0`

---

## 3) Doctor do banco
```bash
pnpm db:doctor
```

**Resultado esperado**
- inspeção sem falha fatal
- relatório coerente com o estado do SQLite real
- sem drift silencioso entre schema, migrations e banco

> Se `db:doctor` falhar por ausência de banco local ou por drift, consultar `DATABASE_NOTES.md` antes de qualquer patch.

---

## 4) Busca por legado de fechamento
```bash
rg -n "monthly-closing" app components services features db lib scripts
```

**Resultado esperado (estado saudável)**
- no máximo referências de compatibilidade controlada
- idealmente:
  - `app/monthly-closing/page.tsx` apenas como redirect
  - zero referências primárias em navegação, botões, revalidatePath, links ou menus

**Sinal de problema**
- sidebar/menu apontando para `/monthly-closing`
- ações ou serviços ainda assumindo a rota legada como canônica

---

## 5) Busca por naming de datas e meses críticos
```bash
rg -n "transactionDate|dueDate|referenceMonth|referenceDate|statementMonth|scheduledDate|occurredOn|dueOn|billMonth|competenceMonth" app components services features db lib scripts
```

**Resultado esperado (estado saudável)**
- nomes coerentes por domínio:
  - transações históricas: `occurredOn`
  - vencimento de fatura/conta: `dueOn`
  - competência mensal: `competenceMonth` ou `billMonth`
  - agendamento futuro: `scheduledDate` ou campo equivalente definido explicitamente
- ausência de mistura arbitrária de nomes antigos e novos no mesmo fluxo

**Sinal de problema**
- múltiplos nomes para a mesma semântica sem camada de compatibilidade
- UI lendo um nome enquanto serviço persiste outro
- migrations e schema divergindo do naming tipado

---

## 6) Busca por mojibake / encoding quebrado
```bash
rg -n "Ã|â€¦|Â·|â†’|CartÃ|VisÃ|ConfiguraÃ|TransaÃ|PatrimÃ|ConsolidaÃ" app components services features db lib scripts
```

**Resultado esperado (estado saudável)**
- zero ocorrências

**Resultado observado no scan anexado**
- há ocorrências de texto quebrado em múltiplos pontos da UI

---

## 7) Busca por seed/demo contaminando base real
```bash
rg -n "seeded|seed|Banco Principal|Cartão Principal|Snapshot inicial|ProjectionRulesIfMissing|getMoneyBootstrapDataset|bootstrapMoneyIntoDatabase" app components services features db lib scripts
```

**Resultado esperado (estado saudável)**
- seeds de demo claramente isoladas
- bootstrap Money explicitamente separado de seed genérica
- ausência de dados falsos sendo tratados como base real em produção/local real

**Sinal de problema**
- conta/cartão/snapshot de demo entrando em dashboards reais
- bootstrap e seed gerando duplicidade funcional

---

## 8) Busca por acoplamento Future x projectionMonths
```bash
rg -n "projectionMonths|getProjectedCashflow|horizon" app components services features db lib scripts
```

**Resultado esperado (estado saudável)**
- regra única e explícita para horizonte de projeção
- Future compatível com Settings

**Sinal de problema**
- Settings fala em meses e Future calcula em dias sem conversão/contrato
- defaults divergentes entre tela, serviço e onboarding

---

## 9) Busca por pontos de cartão / bills / parcelas
```bash
rg -n "creditCardBills|billEntries|installments|closeDay|dueDay|settlementAccount|limitTotalCents|totalAmountCents" app components services features db lib scripts
```

**Resultado esperado (estado saudável)**
- domínio de cartões completo e coerente
- cada bill explicável por entries/parcelas
- ano futuro legítimo derivado de parcelamento real, não de bug

---

## 10) Smoke test manual mínimo
1. Abrir `/dashboard`
2. Abrir `/accounts`
3. Abrir `/cards`
4. Abrir `/future`
5. Abrir `/net-worth`
6. Abrir `/closings`
7. Abrir `/settings`
8. Rodar bootstrap/import em ambiente de teste
9. Repetir bootstrap/import uma segunda vez

**Resultado esperado**
- sem crash
- sem `NaN`
- sem vazio enganoso
- sem duplicidade após segunda execução
- números reconciliáveis com a planilha
