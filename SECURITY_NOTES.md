# Security Notes

## Escopo

Aurea Finance é **local-first / single-user**. Este documento registra o threat model e achados sem republicar segredos.

## O que NÃO deve ir para o Git

- `.env` / tokens / API keys
- `data/*.sqlite*` com dados reais
- `Money.xlsx` pessoal
- exports CSV/XLSX com movimentações reais
- backups em `backups/`

O `.gitignore` já cobre os casos principais.

## Achados desta revisão

### 1) Bootstrap com dados sensíveis (corrigido)

`lib/money-bootstrap.ts` continha nomes de pessoa/instituição e narrativa de gastos próximos de um workbook real.  
**Ação:** dataset anonimizado + tipo limpo; seed CLI alinhado a marcas sintéticas (`Aurora`, `WalletPay`, etc.).

### 2) Sem autenticação (by design)

Server Actions e `POST /api/import/analyze` não exigem login.  
**Mitigação:** uso local; não expor porta publicamente; documentar em deploy.

### 3) Upload XLSX

Limites de tamanho/linhas em `lib/constants.ts`. Ainda assim, parsers `xlsx` têm histórico de CVEs — manter dependência atualizada e limites ativos.

### 4) Next.js advisory

`next@15.2.0` emitiu warning de vulnerabilidade conhecida no install.  
**Follow-up recomendado:** upgrade para patch seguro assim que validado com typecheck/build.

### 5) Segredos

Nenhum `.env` real commitado. `.env.example` só contém `DATABASE_URL` e nome público do app.

## Política de resposta

Se um segredo real for encontrado no histórico Git:

1. **Não** republicar o valor em issues/docs
2. Rotacionar credencial
3. Remover do histórico (`git filter-repo` / BFG) se necessário
4. Registrar aqui apenas o tipo do achado e a data
