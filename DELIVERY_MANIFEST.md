# DELIVERY_MANIFEST.md

## Escopo desta entrega
Esta entrega **não contém overwrite de código-fonte do projeto**, porque o repositório real **não foi anexado** nesta conversa. Os únicos artefatos fornecidos foram:

- `project-scan-lite.md`
- handoff consolidado
- `Money.xlsx`

Por integridade técnica, **nenhum arquivo de `app/`, `components/`, `services/`, `db/`, `lib/`, `scripts/` ou `features/` foi sobrescrito com código especulativo**.

## Lista exata de arquivos alterados
Nenhum arquivo existente do projeto foi alterado neste pacote.

## Lista de arquivos novos
- `DELIVERY_MANIFEST.md`
- `AUDIT_REPORT.md`
- `VALIDATION.md`
- `DATABASE_NOTES.md`
- `app/.gitkeep`
- `components/.gitkeep`
- `services/.gitkeep`
- `db/.gitkeep`
- `lib/.gitkeep`
- `scripts/.gitkeep`
- `features/.gitkeep`

## Lista de arquivos removidos/renomeados
Nenhum.

## Motivo de cada alteração
- `DELIVERY_MANIFEST.md`  
  Motivo: registrar com precisão o que esta entrega contém e, principalmente, o que ela **não** contém.
- `AUDIT_REPORT.md`  
  Motivo: transformar a auditoria em backlog verificável por bug crítico, com status, evidência, impacto e validação.
- `VALIDATION.md`  
  Motivo: concentrar os comandos operacionais para typecheck, build, doctor e buscas de legados/naming/mojibake.
- `DATABASE_NOTES.md`  
  Motivo: orientar a aplicação segura no repositório real, com foco em SQLite, migrations, seed falso e bootstrap/import.
- `.gitkeep` nas pastas raiz  
  Motivo: preservar no ZIP a estrutura de raiz exigida (`app/`, `components/`, `services/`, `db/`, `lib/`, `scripts/`, `features/`) sem inventar source patches não validados.

## Quais bugs cada arquivo resolve
- `DELIVERY_MANIFEST.md`: não corrige bug de runtime; corrige a rastreabilidade da entrega.
- `AUDIT_REPORT.md`: não corrige bug de runtime; organiza o backlog técnico em forma auditável.
- `VALIDATION.md`: não corrige bug de runtime; prepara a validação executável no repo verdadeiro.
- `DATABASE_NOTES.md`: não corrige bug de runtime; reduz risco de aplicar migrations/seed/bootstrap de forma destrutiva.

## Arquivos mínimos esperados pelo solicitante
Os arquivos abaixo **não foram sobrescritos neste pacote**, porque não havia repositório real disponível para edição segura e validação:

- `services/cards.service.ts`
- `services/dashboard.service.ts`
- `services/cashflow.service.ts`
- `services/recurring.service.ts`
- `services/monthly-closing.service.ts`
- `services/net-worth.service.ts`
- `services/money-bootstrap.service.ts`
- `services/settings.service.ts`
- `app/(workspace)/future/page.tsx`
- `app/(workspace)/cards/page.tsx`
- `app/(workspace)/dashboard/page.tsx`
- `app/(workspace)/net-worth/page.tsx`
- `app/(workspace)/closings/page.tsx`
- `components/app-shell.tsx`
- `components/sidebar.tsx`
- `db/seed.ts`
- `db/migrations/*`
- `scripts/doctor.ts`

Status desses itens nesta entrega: **não alterados / não fornecidos / dependem do repositório real**.

## Observações especiais sobre migrations
- O scan aponta `settings.projectionMonths` no schema e na UI, mas sem acesso ao repositório real e ao SQLite local não é possível afirmar:
  - quais migrations SQL existem de fato;
  - quais foram aplicadas;
  - se há drift entre `db/schema.ts` e o banco real;
  - se há conflito de versões/prefixos (`0001_*`) no histórico.
- Antes de qualquer patch estrutural, deve-se rodar o fluxo de validação descrito em `VALIDATION.md` e seguir as precauções de `DATABASE_NOTES.md`.
