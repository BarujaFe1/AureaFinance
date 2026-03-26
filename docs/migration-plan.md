# Plano de migração da planilha

## Estratégia

A planilha antiga não continuará como fonte de verdade. Ela será tratada como **legado de origem**.

## Fases

1. **Upload** do arquivo `.xlsx`
2. **Inventário** das abas
3. **Classificação provável** por aba
4. **Mapeamento manual** de colunas
5. **Staging** em `import_raw_rows`
6. **Validação** em `import_issues`
7. **Dry-run** mostrando quantidades e riscos
8. **Confirmação** pelo usuário
9. **Commit** no domínio principal
10. **Relatório final** do lote

## Princípios de segurança

- nada entra direto em `transactions` ou `accounts`
- erros e warnings ficam registrados por linha
- mappings ficam salvos para reaproveitamento
- a origem do lote e o hash do arquivo ficam persistidos

## Estratégia específica para sua planilha atual

Como a estrutura observada é heterogênea e não tabular em todas as abas, o importador foi preparado para:

- inventariar primeiro
- detectar o papel de cada aba
- exigir mapeamento revisado antes do commit

Isso é melhor do que forçar uma “importação mágica” arriscada.
