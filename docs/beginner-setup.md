# Tutorial para iniciante

Este guia foi escrito para alguém que ainda programa pouco.

## 1. O que instalar

Você precisa de:

- Node.js 22 LTS
- pnpm (ou npm, mas o projeto foi configurado com pnpm)
- um editor de código, de preferência VS Code

## 2. Como instalar o Node.js

1. Entre no site oficial do Node.js.
2. Baixe a versão LTS.
3. Instale normalmente.
4. Depois abra o terminal e rode:

```bash
node -v
npm -v
```

Se aparecerem versões, deu certo.

## 3. Como instalar o pnpm

No terminal:

```bash
npm install -g pnpm
```

Teste:

```bash
pnpm -v
```

## 4. Como abrir a pasta do projeto

1. Extraia o ZIP.
2. Abra o terminal dentro da pasta do projeto.
3. Confirme que você está vendo `package.json`.

## 5. Instalar as dependências

```bash
pnpm install
```

## 6. Rodar as migrações

```bash
pnpm db:migrate
```

Isso cria a estrutura do banco SQLite.

## 7. Popular dados iniciais

```bash
pnpm db:seed
```

Isso cria:

- configuração principal;
- categorias básicas;
- tags iniciais;
- uma conta inicial de teste.

## 8. Iniciar o projeto

```bash
pnpm dev
```

Abra no navegador:

```text
http://localhost:3000
```

## 9. Onde fica o banco

O banco fica em:

```text
data/aurea-finance.sqlite
```

Esse é o arquivo mais importante dos seus dados.

## 10. Como importar a planilha

1. Vá em **Importação**.
2. Faça upload do `.xlsx` ou `.csv`.
3. Abra o lote criado.
4. Revise as abas detectadas.
5. Ajuste o tipo de destino de cada aba.
6. Ajuste o JSON de mapeamento de colunas.
7. Rode a validação.
8. Rode o dry-run.
9. Se não houver erro crítico, confirme a importação.

## 11. Como fazer backup

### Manual

Feche o app e copie o arquivo:

```text
data/aurea-finance.sqlite
```

### Pelo script

```bash
pnpm db:backup
```

## 12. Como testar se tudo deu certo

- o app abre em `localhost:3000`;
- a página de dashboard carrega;
- a conta inicial seeded aparece;
- você consegue criar uma nova conta;
- você consegue criar uma transação;
- você consegue criar um cartão;
- você consegue lançar uma compra parcelada;
- a compra gera fatura;
- o banco existe em `data/aurea-finance.sqlite`.

## 13. Ordem ideal para começar a usar

1. onboarding;
2. criar contas reais;
3. criar cartões;
4. importar planilha;
5. revisar dados importados;
6. começar a lançar apenas pelo app.
