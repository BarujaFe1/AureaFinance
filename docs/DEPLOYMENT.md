# Deployment

## Modo suportado: local-first

Aurea Finance é um **Personal Finance OS local-first**. O caminho oficial de demo/produção pessoal é:

```bash
corepack enable
corepack prepare pnpm@10.6.1 --activate
pnpm install
pnpm approve-builds   # better-sqlite3
pnpm dbmigrate
pnpm dbseed
pnpm build
pnpm start
```

App em `http://localhost:3000`.

### Variáveis

Copie `.env.example` → `.env` se quiser customizar:

```env
DATABASE_URL=./data/aurea-finance.sqlite
NEXT_PUBLIC_APP_NAME=Aurea Finance
```

### Backup

```bash
pnpm db:backup
# ou copie data/aurea-finance.sqlite
```

Restore: `pnpm db:restore` (ver script) ou substitua o arquivo SQLite.

## Vercel / cloud — limitações honestas

| Tópico | Realidade |
|---|---|
| Build | `pnpm build` funciona |
| Runtime SQLite | filesystem efêmero no Vercel → **dados somem** entre deploys/instâncias |
| Auth | inexistente → endpoint de import e server actions ficam abertos |
| Native addon | `better-sqlite3` exige toolchain compatível |

**Recomendação de portfólio:** demonstrar localmente (ou Docker com volume). Se for publicar URL, use storage remoto (ex.: Turso/libSQL) + auth mínima — fora do escopo atual.

### Checklist se insistir em Vercel preview

1. Node 20+
2. Install: `pnpm install`
3. Build: `pnpm build`
4. Documentar que a preview é **stateless / demo UI** sem persistência confiável
5. Não apontar `DATABASE_URL` para path efêmero esperando retenção

## Docker (opcional / futuro)

Não há `Dockerfile` versionado nesta pass. Sugestão:

- image Node 20
- volume `/app/data`
- `pnpm dbmigrate && pnpm start`
- nunca montar Money.xlsx real em imagens públicas

## Security reminder

Ver `SECURITY_NOTES.md` na raiz.
