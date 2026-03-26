# Troubleshooting

## 1. `pnpm` não é reconhecido

Instale com:

```bash
npm install -g pnpm
```

## 2. O banco não foi criado

Rode:

```bash
pnpm db:migrate
```

Depois confira se existe:

```text
data/aurea-finance.sqlite
```

## 3. `better-sqlite3` falhou na instalação

Isso normalmente acontece por ambiente local sem toolchain nativa completa. Soluções:

- atualizar Node para a versão LTS mais nova;
- reinstalar dependências;
- em Windows, instalar Build Tools se necessário.

## 4. A importação não entra

Cheque:

- se o arquivo é `.xlsx`, `.xls` ou `.csv`;
- se a aba tem header na primeira linha;
- se o mapeamento JSON aponta para nomes reais das colunas;
- se a validação mostrou erros críticos.

## 5. O saldo parece errado

Cheque nesta ordem:

1. saldo inicial da conta;
2. lançamentos importados com sinal correto;
3. transferências duplicadas ou mal classificadas;
4. faturas abertas ainda não pagas, que entram no saldo projetado.

## 6. A compra parcelada caiu no mês errado

Cheque o cartão:

- `close_day`
- `due_day`

A lógica usa esses dois campos para decidir em qual fatura cada parcela entra.

## 7. O app abriu, mas a sidebar não aparece

Ela fica escondida apenas no onboarding. Depois do onboarding, a navegação aparece automaticamente.
