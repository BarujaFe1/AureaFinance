# Modelo de dados explicado

## accounts

Representa contas reais do usuário.

Campos principais:

- `type`: checking, savings, cash, investment, reserve, credit_card_settlement
- `opening_balance_cents`: saldo inicial em centavos
- `include_in_net_worth`: entra ou não no patrimônio

## transactions

Livro razão principal do app.

Direções usadas:

- `income`
- `expense`
- `transfer_in`
- `transfer_out`
- `bill_payment`
- `adjustment`

Regras:

- o valor sempre é positivo em `amount_cents`;
- o sinal é determinado por `direction`;
- transferências não contam como receita ou despesa real do patrimônio.

## transfers

Entidade própria da transferência.

Por que existe?

Porque a transferência tem identidade própria e gera dois lançamentos espelhados em `transactions`.

## credit_cards

Guarda:

- nome do cartão;
- conta de pagamento da fatura;
- limite total;
- dia de fechamento;
- dia de vencimento.

## credit_card_bills

Cada mês relevante do cartão vira uma fatura.

Campos:

- `bill_month`
- `closes_on`
- `due_on`
- `total_amount_cents`
- `paid_amount_cents`
- `status`

## card_purchases

Compra original realizada no cartão.

## card_installments

Parcelas futuras explícitas.

Isso evita depender de cálculo frágil em tempo de execução.

## bill_entries

Entradas individuais que compõem uma fatura.

## recurring_rules

A regra abstrata.

## recurring_occurrences

As ocorrências concretas geradas a partir da regra.

## import_batches / import_raw_rows / import_mappings / import_issues

Staging da importação.

Objetivo:

- rastreabilidade;
- revisão antes de gravar;
- dry-run confiável;
- auditoria posterior.

## monthly_closings

Congela o fechamento de um mês específico.

## net_worth_summaries

Patrimônio resumido manual/importado.
