# Aurea Finance

**Finanças pessoais local-first, com foco em operação diária, corrigibilidade e rastreabilidade.**

## Visão geral

O **Aurea Finance** é um sistema web de finanças pessoais pensado para substituir uma planilha operacional por um fluxo mais consistente, auditável e editável. Em vez de depender de uma base remota ou de automações opacas, o projeto adota uma abordagem **local-first**, com banco **SQLite local**, regras de domínio explícitas e forte ênfase em correção operacional pela interface.

Ele é voltado para quem faz gestão financeira pessoal de forma ativa e recorrente, especialmente em cenários como:

* acompanhamento diário de saldo real por conta;
* controle de cartões, faturas e parcelamentos;
* atualização manual de investimentos, cripto e outras reservas;
* comparação entre projeção e realidade;
* migração gradual de planilhas para um fluxo mais estruturado.

A proposta do produto não é “automatizar tudo a qualquer custo”, e sim oferecer um sistema confiável para o uso diário, no qual dados podem ser conferidos, corrigidos, reconciliados e evoluídos sem depender de edição manual no código.

A abordagem **local-first** importa porque ela:

* reduz dependência de serviços externos para a operação principal;
* facilita backup, restauração e portabilidade do banco;
* torna o comportamento mais previsível;
* favorece privacidade e controle direto sobre os dados;
* permite iteração rápida de produto sem transformar o sistema em uma caixa-preta remota.

## Principais capacidades

O Aurea Finance já cobre, ou busca cobrir de forma operacionalmente útil, os seguintes fluxos:

* **Dashboard financeiro** com visão consolidada, alertas, vencimentos e links de correção.
* **Contas** com saldo calculado, saldo conferido, saldo projetado e histórico de conferências.
* **Conferência diária** para registrar saldos reais, atualizar ativos e fechar o dia operacionalmente.
* **Transações** com lançamento de receitas e despesas, edição, exclusão, observações, categorias e tags.
* **Cartões e compras** com parcelamento, competência de fatura, limite disponível e vínculo com conta pagadora.
* **Faturas** com visão de composição, estado de pagamento e impacto em caixa.
* **Recorrências** com edição por ocorrência e por série, além de pausa, reativação e duplicação.
* **Calendário financeiro** para visualização temporal de eventos e movimentações.
* **Fechamentos mensais** para consolidar períodos e manter histórico.
* **Visão futura** de caixa projetado e eventos recorrentes.
* **Patrimônio** com snapshots, posições manuais e atualização de ativos.
* **Categorias e tags** editáveis, com foco em reclassificação e organização contínua.
* **Importação de planilhas/workbooks** para acelerar onboarding e migração da planilha.
* **Configurações e onboarding** para preparar o sistema para uso diário.

O sistema foi desenhado para lidar com um fato simples do mundo real: **dados financeiros frequentemente chegam incompletos, inconsistentes ou errados**. Por isso, a editabilidade operacional não é um detalhe; ela é parte central do produto.

## Princípios do produto

### 1. Local-first

O banco principal é local, persistido em **SQLite**, para que a operação diária não dependa de infraestrutura remota como requisito básico. O objetivo é manter o sistema previsível, portátil e controlável.

### 2. Corrigibilidade pela interface

Qualquer dado que possa estar errado no uso real deve poder ser corrigido pela UI, sem exigir alteração manual no código. Isso inclui nomes, vínculos, categorias, instituições, ativos, compras, recorrências e snapshots.

### 3. Evitar hardcodes e estados irreversíveis

O projeto evita transformar catálogos operacionais em listas rígidas. Bancos, categorias, ativos e outras entidades precisam ser editáveis, arquiváveis, restauráveis ou conciliáveis sempre que possível.

### 4. Separação entre cálculo, projeção e conferência

O sistema diferencia:

* o que foi **calculado** a partir das movimentações;
* o que está **projetado** para o futuro;
* o que foi **conferido manualmente** como valor real.

Essa separação é importante para não misturar previsão com realidade.

### 5. Importação como aceleração, não como prisão

Importar dados de uma planilha ou workbook serve para acelerar a adoção e a migração inicial, não para prender o sistema a um formato legado. Dados importados continuam sendo parte editável do produto.

## Stack técnica

### Frontend

* **Next.js 15**
* **React 19**
* **TypeScript**
* **Tailwind CSS 4**

### Banco e persistência

* **SQLite**
* **Drizzle ORM**

### Validação e formulários

* **Zod**
* **React Hook Form**

### Visualização de dados

* **Recharts**

### Importação de planilhas

* **xlsx**

### Testes e qualidade

* **Vitest**
* **TypeScript typecheck**
* validação de regras de domínio financeiro

### Tooling

* **pnpm**
* **tsx**
* **Drizzle Kit**
* scripts utilitários para migração, seed e manutenção local

## Arquitetura resumida

O projeto usa o **App Router** do Next.js e organiza a área principal do produto dentro de um **route group** do workspace. A ideia é manter uma separação clara entre interface, regras de domínio, persistência e utilitários.

Em alto nível, a organização segue esta lógica:

* **`app/`**
  Define as rotas, layouts, páginas e fluxos do App Router. É a camada de composição da UI e dos módulos.

* **`features/`**
  Concentra ações orientadas a caso de uso, geralmente ligadas a formulários, mutações e fluxos específicos de tela.

* **`services/`**
  Abriga regras de domínio, consultas, agregações e operações de negócio. É a camada mais importante para consistência financeira.

* **`db/`**
  Contém schema, cliente e migrações do banco SQLite.

* **`lib/`**
  Reúne utilitários compartilhados, helpers de datas, formatadores, lógica complementar de domínio e validações.

* **`components/`**
  Componentes de interface, blocos visuais, tabelas, gráficos e wrappers de interação.

A arquitetura busca ser pragmática: sem complexidade “enterprise” desnecessária, mas com separação suficiente para que regras financeiras não fiquem espalhadas pela interface.

## Módulos do sistema

### Dashboard

Ponto de entrada operacional com visão consolidada do estado financeiro. Reúne indicadores, alertas, vencimentos, divergências e atalhos para correção.

### Contas

Gerencia contas correntes, reservas, contas de pagamento e saldos. Diferencia saldo calculado, saldo real conferido e saldo projetado.

### Conferência diária

Fluxo central para o uso cotidiano. Permite registrar saldos reais, atualizar ativos, revisar divergências e fechar o dia com mais segurança operacional.

### Transações

Área de lançamento e manutenção de receitas e despesas. Deve ser tratada como base confiável para cálculo, projeção e reconciliação.

### Cartões

Controla cartões, compras, parcelamentos, vínculo com conta pagadora e impacto das despesas em faturas e caixa.

### Faturas

Mostra o fechamento por competência, composição das compras e status de pagamento. É o elo entre compras no cartão e saída real de caixa.

### Recorrências

Gerencia entradas e saídas recorrentes com granularidade operacional. O objetivo é permitir correção por ocorrência, por série e por mudança futura.

### Calendário financeiro

Distribui visualmente eventos, recorrências e movimentações em uma linha temporal. Ajuda a enxergar o comportamento financeiro ao longo do mês.

### Fechamentos mensais

Consolida períodos e preserva histórico de fechamento. É o módulo destinado a registrar o estado de um mês de forma mais estável e revisável.

### Visão futura

Projeta caixa e compromissos futuros com base nas regras existentes. Serve para planejamento, antecipação de problemas e leitura de tendência.

### Patrimônio

Centraliza ativos, reservas, posições e snapshots patrimoniais. Permite acompanhar valor total, composição e evolução ao longo do tempo.

### Categorias e tags

Mantém a organização semântica das transações e eventos. Foi pensado para ser editável, não um catálogo estático.

### Importação

Acelera a migração de planilhas e workbooks para o sistema. O foco é absorver dados legados sem torná-los imutáveis.

### Configurações

Reúne parâmetros operacionais, orientações de manutenção, comandos úteis e comportamento global do sistema.

### Onboarding

Ajuda a preparar a base inicial do usuário, reduzindo fricção na primeira configuração e na migração do fluxo manual.

## Editabilidade operacional

O Aurea Finance parte de um princípio simples: **dado financeiro errado precisa ser corrigível pela interface**.

Na prática, isso significa permitir operações como:

* renomear banco ou instituição;
* corrigir nome, tipo ou vínculo de uma conta;
* ajustar saldo real de conta por conferência;
* editar ativo patrimonial;
* corrigir ticker, nome ou classificação de um ativo;
* ajustar quantidade ou valor manual;
* corrigir compra lançada no cartão;
* alterar vínculo entre cartão e conta pagadora;
* pausar, reativar ou duplicar recorrências;
* revisar categorias e tags;
* mesclar categorias duplicadas;
* revisar dados importados depois do commit;
* arquivar ou restaurar entidades quando o dado não deve mais aparecer no dia a dia, mas ainda precisa existir historicamente.

A editabilidade operacional é uma defesa contra dois problemas comuns em software financeiro pessoal:

1. importar ou cadastrar algo errado e ficar “preso” ao erro;
2. precisar voltar ao código ou ao banco manualmente para corrigir algo que deveria ser tratável pela UI.

## Estado atual do projeto

O projeto já está além de um protótipo que apenas “abre telas”. Ele possui estrutura funcional, módulos operacionais relevantes, persistência local, rotas principais, migrações, seeds, testes de domínio e fluxo de trabalho coerente para uso diário.

Ao mesmo tempo, o Aurea Finance **ainda está em evolução**. Isso significa que:

* o sistema já é utilizável como base operacional local;
* há fluxos importantes de conferência, patrimônio, cartões, recorrências e importação;
* build, typecheck, testes e domínio financeiro precisam continuar sendo tratados com rigor;
* testes de domínio não são burocracia: eles são contrato para regras como fatura, parcelamento, recorrência e mapeamento de importação;
* performance de navegação, agregações pesadas e refinamento de UX ainda são frentes reais de melhoria;
* alguns módulos ainda podem ganhar mais profundidade, especialmente em acabamento operacional e conciliação.

Em outras palavras: o projeto já é sério o suficiente para operação local e evolução contínua, mas não deve ser apresentado como “100% finalizado”.

## Requisitos

Para rodar o projeto localmente, recomenda-se:

* **Node.js 20+**
* **pnpm**
* ambiente local com permissão de leitura e escrita para a pasta `data/`
* sistema operacional compatível com execução local de scripts Node/TypeScript

Observações importantes:

* o projeto usa **SQLite local**, então o arquivo do banco precisa estar acessível em disco;
* em alguns ambientes, o `pnpm` pode exibir aviso sobre scripts ignorados de dependências como `esbuild` e `sharp`;
* quando isso acontecer, use `pnpm approve-builds` para liberar os scripts necessários.

## Instalação

```bash
corepack enable
corepack prepare pnpm@10.6.1 --activate
pnpm install
pnpm approve-builds
```

Depois da instalação, siga para migração, seed e execução local.

## Configuração e banco

O banco principal do projeto é um **SQLite local**. Por padrão, ele fica em:

```text
data/aurea-finance.sqlite
```

### Migrar o banco

Use o alias operacional recomendado:

```bash
pnpm dbmigrate
```

### Popular a base com seed

```bash
pnpm dbseed
```

### Rodar em desenvolvimento

```bash
pnpm dev
```

### Build de produção local

```bash
pnpm build
```

### Backup do banco

O backup mais confiável e simples continua sendo a cópia do arquivo SQLite.

#### PowerShell

```powershell
New-Item -ItemType Directory -Force .\backups | Out-Null
Copy-Item .\data\aurea-finance.sqlite .\backups\aurea-finance-$(Get-Date -Format yyyyMMdd-HHmmss).sqlite
```

#### Bash

```bash
mkdir -p ./backups
cp ./data/aurea-finance.sqlite ./backups/aurea-finance-$(date +%Y%m%d-%H%M%S).sqlite
```

### Restore do banco

O restore pode ser feito substituindo o arquivo do banco por um backup válido.

#### PowerShell

```powershell
Copy-Item .\backups\aurea-finance-YYYYMMDD-HHMMSS.sqlite .\data\aurea-finance.sqlite -Force
```

#### Bash

```bash
cp ./backups/aurea-finance-YYYYMMDD-HHMMSS.sqlite ./data/aurea-finance.sqlite
```

> Antes de restaurar, feche o servidor de desenvolvimento para evitar conflito de escrita no arquivo do SQLite.

### Aliases operacionais

Este repositório adota aliases mais curtos para reduzir fricção no dia a dia:

* `pnpm dbmigrate`
* `pnpm dbseed`

## Comandos úteis

| Comando                           | Finalidade                                                |
| --------------------------------- | --------------------------------------------------------- |
| `pnpm install`                    | Instala dependências do projeto                           |
| `pnpm approve-builds`             | Aprova scripts de build de dependências quando necessário |
| `pnpm dbmigrate`                  | Aplica migrações do banco SQLite                          |
| `pnpm dbseed`                     | Popula a base com dados de seed                           |
| `pnpm typecheck`                  | Executa verificação de tipos do app e dos testes          |
| `pnpm test`                       | Executa a suíte de testes                                 |
| `pnpm build`                      | Gera o build de produção                                  |
| `pnpm dev`                        | Sobe o ambiente local de desenvolvimento                  |
| `Copy-Item ...` / `cp ...`        | Faz backup manual do arquivo SQLite                       |
| `Copy-Item ... -Force` / `cp ...` | Restaura um backup do arquivo SQLite                      |

## Fluxo recomendado de uso diário

A ordem de uso faz diferença. O fluxo mais seguro para operação diária é:

1. **Abrir a Conferência diária**
   Comece pelo ponto de conferência, não pelo dashboard. Isso ajuda a separar realidade de projeção.

2. **Salvar os saldos reais das contas**
   Registre o valor conferido de cada conta relevante naquele dia.

3. **Atualizar ativos e patrimônio**
   Ajuste manualmente posições, reservas, investimentos e cripto quando necessário.

4. **Lançar despesas e receitas do dia**
   Registre os fatos financeiros já realizados, incluindo ajustes em transações e compras de cartão.

5. **Revisar divergências**
   Compare saldo calculado com saldo conferido, revise inconsistências e corrija vínculos ou classificações quando necessário.

6. **Só então olhar projeção, dashboard e patrimônio consolidado**
   Depois que o dia estiver conferido, a leitura do dashboard, da visão futura e do patrimônio se torna mais confiável.

Esse fluxo reduz a chance de interpretar projeção como realidade e melhora a utilidade do sistema no uso diário.

## Fluxo de importação

A importação existe para acelerar a adoção do sistema, especialmente em dois cenários:

* migração de uma planilha já existente;
* onboarding inicial com histórico prévio.

O papel da importação é:

* ler dados de workbook/planilha;
* sugerir mapeamento de colunas;
* permitir análise, revisão e commit;
* transformar dados legados em dados operacionais do sistema.

Pontos importantes:

* importação **não** deve ser tratada como etapa irreversível;
* dados importados continuam passíveis de edição;
* conta, categoria, ativo, cartão, instituição e outros vínculos podem exigir revisão posterior;
* revisão pós-importação faz parte do processo normal, não de uma falha do sistema.

Em termos de produto, a importação é uma **porta de entrada**. A manutenção do dia a dia continua acontecendo na UI do próprio Aurea Finance.

## Estrutura de pastas

Abaixo está uma visão resumida da estrutura principal do repositório:

```text
app/
components/
features/
services/
db/
lib/
scripts/
tests/
```

### `app/`

Rotas, layouts, páginas e fluxos do App Router. É a camada onde os módulos do sistema são expostos.

### `components/`

Componentes visuais e blocos reutilizáveis, incluindo tabelas, formulários, cartões, shells e gráficos.

### `features/`

Ações e fluxos específicos de caso de uso, normalmente conectando formulários, mutações e comportamento de tela.

### `services/`

Camada de domínio e negócio. Reúne consultas, agregações, regras financeiras e operações de manutenção dos dados.

### `db/`

Schema, migrações e integração com SQLite/Drizzle.

### `lib/`

Helpers, utilitários, formatadores, funções de data e lógica compartilhada entre módulos.

### `scripts/`

Scripts operacionais do projeto, como migração, seed e manutenção do banco.

### `tests/`

Testes de domínio e confiabilidade, especialmente para regras sensíveis de finanças.

## Testes e qualidade

Use estes comandos como rotina mínima de qualidade:

```bash
pnpm typecheck
pnpm test
pnpm build
```

Os testes são especialmente importantes em áreas de domínio financeiro, como:

* recorrências;
* competência de fatura;
* parcelamento;
* geração de vencimentos;
* mapeamento de importação;
* consistência de regras de projeção e materialização.

No Aurea Finance, testes de domínio não são enfeite. Eles servem para proteger regras que, se estiverem erradas, afetam diretamente a confiança do usuário no produto.

## Performance e observações

Performance é uma preocupação contínua do projeto, especialmente em páginas que agregam muitos dados, calculam projeções ou renderizam gráficos e tabelas mais pesadas.

Áreas típicas de atenção incluem:

* agregações redundantes no dashboard e na visão futura;
* consultas repetidas entre módulos correlatos;
* custo de renderização de gráficos;
* peso inicial de páginas ligadas à importação;
* trabalho server-side desnecessário em navegação local.

O projeto já trata esse tema como uma frente técnica importante, e otimizações de query, carregamento e renderização fazem parte natural da evolução do sistema.

## Roadmap curto

Alguns eixos plausíveis e prioritários para evolução do projeto são:

* melhorar performance de navegação e agregações críticas;
* aprofundar o fluxo de fechamento mensal;
* fortalecer ainda mais os testes de domínio financeiro;
* melhorar a conciliação e revisão pós-importação;
* refinar UX operacional para edição, conferência e reconciliação;
* ampliar trilha de auditoria e segurança para operações sensíveis.

## Contribuição

Contribuições são bem-vindas, especialmente nas frentes de:

* corretude de domínio financeiro;
* usabilidade operacional;
* performance;
* qualidade de testes;
* documentação técnica.

Para contribuir:

1. abra uma issue clara, com contexto e resultado esperado;
2. descreva o problema de produto ou técnico de forma objetiva;
3. quando possível, inclua passos de reprodução e impacto;
4. proponha PRs pequenos, verificáveis e com baixo raio de explosão;
5. preserve o princípio central do projeto: **dados corrigíveis pela interface e operação local confiável**.

## Licença

**Licença ainda não definida neste repositório.**
