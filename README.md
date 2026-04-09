# Aurea Finance

![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![React](https://img.shields.io/badge/React-19-149eca)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6)
![SQLite](https://img.shields.io/badge/SQLite-local--first-003b57)

**Finanças pessoais local-first, com foco em operação diária, corrigibilidade e rastreabilidade.**

---

## Sumário

* [Visão geral](#visão-geral)
* [Principais capacidades](#principais-capacidades)
* [Princípios do produto](#princípios-do-produto)
* [Stack técnica](#stack-técnica)
* [Arquitetura resumida](#arquitetura-resumida)
* [Módulos do sistema](#módulos-do-sistema)
* [Editabilidade operacional](#editabilidade-operacional)
* [Estado atual do projeto](#estado-atual-do-projeto)
* [Requisitos](#requisitos)
* [Instalação](#instalação)
* [Configuração e banco](#configuração-e-banco)
* [Comandos úteis](#comandos-úteis)
* [Fluxo recomendado de uso diário](#fluxo-recomendado-de-uso-diário)
* [Fluxo de importação](#fluxo-de-importação)
* [Estrutura de pastas](#estrutura-de-pastas)
* [Testes e qualidade](#testes-e-qualidade)
* [Performance e observações](#performance-e-observações)
* [Roadmap curto](#roadmap-curto)
* [Contribuição](#contribuição)
* [Licença](#licença)

---

## Visão geral

O **Aurea Finance** é um sistema web de finanças pessoais criado para substituir uma planilha operacional por um fluxo mais consistente, auditável e editável. Em vez de depender de um backend remoto como requisito básico, o projeto adota uma abordagem **local-first**, com **SQLite local**, regras de domínio explícitas e forte ênfase em correção operacional pela interface.

Ele atende especialmente quem faz controle financeiro pessoal de forma ativa, recorrente e detalhada, incluindo cenários como:

* conferência diária de saldo real por conta;
* lançamento frequente de receitas e despesas;
* controle de cartões, parcelamentos e faturas;
* atualização manual de investimentos, cripto e outras reservas;
* comparação entre projeção, cálculo e valor conferido;
* migração gradual de planilhas para um sistema mais estruturado.

A proposta do produto não é “automatizar tudo a qualquer custo”, mas oferecer um sistema confiável para uso diário, em que os dados possam ser **conferidos, corrigidos, reconciliados e evoluídos** sem depender de ajustes manuais no código.

### Por que local-first?

A abordagem local-first importa porque:

* reduz dependência de serviços externos para a operação principal;
* mantém o banco sob controle direto do usuário;
* facilita backup, restauração e portabilidade;
* melhora previsibilidade de comportamento;
* favorece privacidade;
* simplifica a operação de um produto pessoal e técnico ao mesmo tempo.

---

## Principais capacidades

O Aurea Finance já cobre, ou busca cobrir de forma operacionalmente útil, os seguintes fluxos:

* **Dashboard financeiro** com visão consolidada, alertas, vencimentos e atalhos para correção.
* **Contas** com saldo calculado, saldo conferido e saldo projetado.
* **Conferência diária** para registrar realidade operacional do dia.
* **Transações** com criação, edição, exclusão, observações, categorias e tags.
* **Cartões** com compras, parcelamento, vínculo com conta pagadora e controle de limite.
* **Faturas** com competência, composição e status de pagamento.
* **Recorrências** com edição por ocorrência e por série, além de pausa, reativação e duplicação.
* **Calendário financeiro** para visualizar eventos e movimentações ao longo do tempo.
* **Fechamentos mensais** com histórico de consolidação por período.
* **Visão futura** de caixa e compromissos projetados.
* **Patrimônio** com ativos, snapshots e atualização manual de posições.
* **Categorias e tags** editáveis, com foco em revisão e organização contínua.
* **Importação de workbooks/planilhas** para acelerar onboarding e migração.
* **Configurações** com informações operacionais e manutenção local.
* **Onboarding** para preparar a base inicial de uso.

Destaques de produto:

* **Conferência diária** como fluxo central de operação;
* **patrimônio** com snapshots e atualização manual;
* **importação** como aceleração, não como dependência;
* **recorrências** com granularidade de edição;
* **cartões/faturas** com preocupação real de domínio financeiro;
* **editabilidade operacional** como princípio de arquitetura e UX.

---

## Princípios do produto

### 1. Local-first

O banco principal é um **SQLite local**. O sistema deve continuar útil e previsível sem exigir infraestrutura remota para funcionar.

### 2. Corrigibilidade pela interface

Qualquer dado que possa estar errado no uso real deve poder ser corrigido pela UI. Isso inclui nomes, vínculos, categorias, instituições, ativos, compras, recorrências e snapshots.

### 3. Evitar hardcodes e estados irreversíveis

Bancos, ativos, categorias e outros cadastros operacionais não devem ser tratados como listas rígidas ou irreversíveis. O sistema favorece edição, arquivamento, restauração, reclassificação e conciliação.

### 4. Separação entre cálculo, projeção e conferência

O sistema diferencia:

* **valor calculado** a partir das movimentações;
* **valor projetado** com base em regras e eventos futuros;
* **valor conferido** manualmente como realidade operacional.

Essa separação é central para leitura financeira confiável.

### 5. Importação como aceleração, não prisão

Importar dados de planilha ou workbook serve para acelerar adoção e migração. Os dados importados continuam editáveis depois do commit.

---

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

### Importação

* **xlsx**

### Testes e qualidade

* **Vitest**
* **TypeScript typecheck**

### Tooling

* **pnpm**
* **tsx**
* **Drizzle Kit**

---

## Arquitetura resumida

O projeto usa o **App Router** do Next.js e organiza a área principal do produto dentro de um **route group** de workspace. A arquitetura é pragmática: separa interface, regras de domínio, persistência e utilitários sem adicionar complexidade desnecessária.

### Camadas principais

* **`app/`**
  Rotas, layouts, páginas e fluxos do App Router.

* **`components/`**
  Componentes visuais, blocos reutilizáveis, tabelas, formulários, gráficos e wrappers de UI.

* **`features/`**
  Ações e fluxos específicos de caso de uso, normalmente ligados a formulários e mutações.

* **`services/`**
  Regras de domínio, agregações, consultas e operações de negócio.

* **`db/`**
  Schema, cliente e migrações do banco SQLite.

* **`lib/`**
  Helpers, formatadores, funções de datas e lógica compartilhada.

A ideia geral é manter as regras financeiras fora da camada visual sempre que possível.

---

## Módulos do sistema

### Dashboard

Visão consolidada do estado financeiro atual. Reúne indicadores, alertas, vencimentos, divergências e atalhos de correção.

### Contas

Gerencia contas correntes, reservas e contas operacionais. Diferencia saldo calculado, saldo real conferido e saldo projetado.

### Conferência diária

Fluxo central de uso diário. Permite registrar saldos reais, atualizar ativos, revisar divergências e fechar o dia com mais segurança operacional.

### Transações

Área de lançamento e manutenção de receitas e despesas. É a base do cálculo financeiro do sistema.

### Cartões

Gerencia cartões, compras, parcelamentos, vínculo com conta pagadora e impacto em caixa.

### Faturas

Exibe a composição de faturas por competência, o estado de pagamento e a relação entre compra no cartão e saída real de caixa.

### Recorrências

Controla entradas e saídas recorrentes com edição por ocorrência e por série, além de pausa, reativação e duplicação.

### Calendário financeiro

Organiza eventos e movimentações em uma visão temporal para facilitar leitura e planejamento.

### Fechamentos mensais

Permite consolidar um mês, preservar histórico e observar a composição do período.

### Visão futura

Projeta caixa e compromissos futuros com base no que já está cadastrado no sistema.

### Patrimônio

Centraliza ativos, reservas, snapshots e evolução patrimonial ao longo do tempo.

### Categorias e tags

Mantém a classificação das transações e eventos de forma editável, sem depender de catálogos rígidos.

### Importação

Acelera onboarding e migração de planilhas, com foco em revisão, staging, mapeamento e commit.

### Configurações

Reúne parâmetros operacionais, manutenção local e orientações úteis de uso do sistema.

### Onboarding

Ajuda a preparar a base inicial do usuário, reduzindo fricção de primeira configuração.

---

## Editabilidade operacional

O Aurea Finance foi pensado para permitir correção pela interface. Isso significa que o sistema precisa tolerar erro humano, importação imperfeita e evolução de cadastro sem exigir intervenção no código.

Exemplos concretos de editabilidade operacional:

* renomear banco ou instituição;
* corrigir conta e seus vínculos;
* ajustar saldo real de uma conta;
* editar ativo patrimonial;
* corrigir ticker, nome ou classificação de um ativo;
* ajustar quantidade ou valor manual;
* corrigir compra lançada no cartão;
* pausar, reativar ou duplicar recorrência;
* mesclar categorias duplicadas;
* revisar e corrigir dados importados;
* arquivar ou restaurar entidades;
* preferir soft delete quando fizer mais sentido do que exclusão dura.

Esse princípio existe para evitar um problema comum em sistemas financeiros pessoais: **ficar preso a um dado errado por limitação da UI**.

---

## Estado atual do projeto

O Aurea Finance já está além de um protótipo que apenas “abre telas”. O projeto possui:

* build e fluxo local de desenvolvimento;
* banco SQLite com migrações;
* módulos operacionais relevantes;
* testes de domínio financeiro;
* fluxo de conferência diária;
* controle de patrimônio, cartões, recorrências e importação;
* base consistente para evolução contínua.

Ao mesmo tempo, o projeto **ainda está em evolução**. Isso significa que:

* o sistema já é utilizável como base operacional local;
* testes de domínio devem ser tratados como contrato importante;
* performance de navegação e agregações pesadas continuam sendo frente de melhoria;
* refinamento de UX operacional ainda faz parte do roadmap;
* alguns módulos ainda podem ganhar profundidade adicional, especialmente em acabamento e reconciliação.

O posicionamento honesto é este: **o projeto já é sério e funcional, mas ainda não deve ser tratado como “produto final imutável”**.

---

## Requisitos

Recomendado para desenvolvimento local:

* **Node.js 20+**
* **pnpm**
* acesso local de leitura e escrita à pasta `data/`
* ambiente compatível com execução de scripts TypeScript via Node

Observações:

* o projeto usa **SQLite local**;
* em alguns ambientes, dependências como `esbuild` e `sharp` podem exigir aprovação de scripts;
* quando isso acontecer, use `pnpm approve-builds`.

---

## Instalação

```bash
corepack enable
corepack prepare pnpm@10.6.1 --activate
pnpm install
pnpm approve-builds
```

Depois da instalação, siga com migração, seed e execução local.

---

## Configuração e banco

O banco principal do projeto é um arquivo SQLite local, armazenado por padrão em:

```text
data/aurea-finance.sqlite
```

### Migrar o banco

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

### Gerar build de produção local

```bash
pnpm build
```

### Backup do banco

A forma mais simples e confiável de backup é copiar o arquivo SQLite.

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

#### PowerShell

```powershell
Copy-Item .\backups\aurea-finance-YYYYMMDD-HHMMSS.sqlite .\data\aurea-finance.sqlite -Force
```

#### Bash

```bash
cp ./backups/aurea-finance-YYYYMMDD-HHMMSS.sqlite ./data/aurea-finance.sqlite
```

> Antes de restaurar um backup, pare o servidor de desenvolvimento para evitar conflito de escrita no arquivo SQLite.

### Aliases operacionais

O projeto usa aliases mais curtos para reduzir fricção no dia a dia:

* `pnpm dbmigrate`
* `pnpm dbseed`

---

## Comandos úteis

| Comando                           | Finalidade                                                 |
| --------------------------------- | ---------------------------------------------------------- |
| `pnpm install`                    | Instalar dependências                                      |
| `pnpm approve-builds`             | Aprovar scripts de build de dependências quando necessário |
| `pnpm dbmigrate`                  | Aplicar migrações do banco                                 |
| `pnpm dbseed`                     | Popular a base com seed                                    |
| `pnpm typecheck`                  | Executar verificação de tipos do app e dos testes          |
| `pnpm test`                       | Executar a suíte de testes                                 |
| `pnpm build`                      | Gerar o build de produção                                  |
| `pnpm dev`                        | Rodar o ambiente local de desenvolvimento                  |
| `Copy-Item ...` / `cp ...`        | Fazer backup manual do SQLite                              |
| `Copy-Item ... -Force` / `cp ...` | Restaurar backup do SQLite                                 |

---

## Fluxo recomendado de uso diário

A ordem de uso faz diferença. O fluxo mais seguro e útil para o dia a dia é:

1. **Abrir a Conferência diária**
   Comece pela realidade operacional, não pela projeção.

2. **Salvar os saldos reais das contas**
   Registre o valor conferido das contas relevantes.

3. **Atualizar ativos**
   Ajuste investimentos, cripto, reservas e demais posições patrimoniais.

4. **Lançar despesas e receitas**
   Registre o que de fato aconteceu no dia.

5. **Revisar divergências**
   Compare saldo calculado com saldo conferido e corrija inconsistências.

6. **Só então olhar dashboard, visão futura e patrimônio**
   Depois da conferência, os painéis ficam muito mais confiáveis.

Esse fluxo ajuda a evitar um erro comum: interpretar projeção como realidade.

---

## Fluxo de importação

A importação existe para acelerar adoção e migração de planilhas legadas.

Seu papel é:

* ler workbook ou planilha;
* sugerir mapeamento de colunas;
* permitir revisão e ajuste antes do commit;
* transformar dados legados em dados operacionais do sistema.

Pontos importantes:

* importação não deve ser tratada como etapa irreversível;
* conta, categoria, ativo, cartão e instituição podem exigir revisão posterior;
* dados importados continuam sendo passíveis de correção pela UI;
* revisão pós-importação faz parte do fluxo normal do produto.

A importação é uma **aceleração do onboarding**, não um mecanismo que congela dados legados.

---

## Estrutura de pastas

Visão resumida da estrutura principal:

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

Rotas, layouts, páginas e fluxos do App Router.

### `components/`

Componentes de interface, gráficos, formulários, blocos reutilizáveis e wrappers visuais.

### `features/`

Fluxos específicos de tela e ações de mutação.

### `services/`

Camada principal de domínio, regras financeiras, agregações e manutenção de dados.

### `db/`

Schema, migrações e integração com SQLite/Drizzle.

### `lib/`

Helpers, funções de datas, formatadores e utilitários compartilhados.

### `scripts/`

Scripts operacionais como migração, seed e manutenção do banco.

### `tests/`

Testes de domínio e confiabilidade do sistema.

---

## Testes e qualidade

Comandos recomendados para verificação local:

```bash
pnpm typecheck
pnpm test
pnpm build
```

Os testes de domínio são especialmente importantes em áreas como:

* recorrências;
* competência de fatura;
* parcelamento;
* vencimento de parcelas;
* materialização de eventos;
* mapeamento de importação;
* coerência entre cálculo e projeção.

No Aurea Finance, testes de domínio não são decoração. Eles protegem regras financeiras que impactam diretamente a confiança do produto.

---

## Performance e observações

Performance é uma preocupação contínua do projeto, sobretudo em páginas que:

* agregam muitos dados;
* recalculam projeções;
* renderizam gráficos mais pesados;
* fazem leitura consolidada de contas, patrimônio e recorrências.

Áreas típicas de evolução incluem:

* redução de agregações redundantes;
* otimização de queries e leituras repetidas;
* lazy loading de blocos mais pesados;
* melhoria da experiência percebida em navegação;
* refinamento de renderização de gráficos e painéis.

O tema é tratado como parte normal da evolução do sistema, não como detalhe secundário.

---

## Roadmap curto

Itens plausíveis para evolução de curto e médio prazo:

* melhorar performance de navegação e agregações críticas;
* aprofundar o fluxo de fechamento mensal;
* fortalecer ainda mais os testes de domínio financeiro;
* melhorar conciliação e revisão pós-importação;
* refinar UX operacional de conferência, recorrências e patrimônio;
* ampliar trilha de auditoria para operações sensíveis.

---

## Contribuição

Contribuições são bem-vindas, especialmente nas frentes de:

* corretude de domínio financeiro;
* usabilidade operacional;
* performance;
* qualidade de testes;
* documentação técnica.

Para contribuir:

1. abra uma issue com contexto claro;
2. descreva problema, impacto e comportamento esperado;
3. inclua passos de reprodução quando possível;
4. proponha PRs pequenos, verificáveis e com baixo raio de explosão;
5. preserve os princípios centrais do projeto:

   * operação local-first;
   * dados corrigíveis pela interface;
   * confiabilidade das regras financeiras.

---

## Licença

Este projeto está licenciado sob a **MIT License**.

Consulte o arquivo `LICENSE` na raiz do repositório para o texto completo da licença.
