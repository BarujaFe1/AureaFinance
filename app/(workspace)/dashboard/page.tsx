import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/stat-card";
import { formatCurrencyFromCents } from "@/lib/currency";
import { formatShortDate, formatStatusLabel, formatTransactionDirectionLabel } from "@/lib/formatters";
import { getDashboardData } from "@/services/dashboard.service";
import { AccountBalanceChartLazy } from "@/components/lazy/account-balance-chart-lazy";

export default function DashboardPage() {
  const data = getDashboardData();
  const hasTransactions = data.recentTransactions.length > 0;
  const hasCommitments = data.upcomingBills.length > 0 || data.recurring.length > 0;

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Visão executiva local-first com caixa atual, patrimônio, recorrências e divergências entre projetado e conferido."
        actions={<a href="/daily" className="inline-flex h-10 items-center justify-center rounded-2xl bg-[var(--primary)] px-4 text-sm font-medium text-[var(--primary-foreground)]">Conferência diária</a>}
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard title="Caixa atual" value={formatCurrencyFromCents(data.consolidatedCurrentCents)} />
        <StatCard title="Saldo conferido" value={formatCurrencyFromCents(data.consolidatedReconciledCents)} description="Último saldo real salvo por conta." />
        <StatCard title="Caixa projetado" value={formatCurrencyFromCents(data.consolidatedProjectedCents)} description="Inclui lançamentos futuros, recorrências e faturas." />
        <StatCard title="Receitas do mês" value={formatCurrencyFromCents(data.incomeMonthCents)} />
        <StatCard title="Despesas do mês" value={formatCurrencyFromCents(data.expenseMonthCents)} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader><CardTitle>Saldo por conta</CardTitle></CardHeader>
          <CardContent><AccountBalanceChartLazy data={data.chartSeries} /></CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Reconciliação operacional</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between"><span>Contas conferidas</span><strong>{data.reconciliation.reviewedAccounts}</strong></div>
            <div className="flex items-center justify-between"><span>Contas com divergência</span><strong>{data.reconciliation.divergentAccounts}</strong></div>
            <div className="flex items-center justify-between"><span>Diferença absoluta total</span><strong>{formatCurrencyFromCents(data.reconciliation.totalAbsoluteDiffCents)}</strong></div>
            <div className="rounded-2xl border border-[var(--border)] p-3 text-xs text-[var(--muted-foreground)]">Atualizado em {formatShortDate(new Date(data.lastUpdatedAt))}.</div>
            {data.reconciliation.largestDiff ? (
              <div className="rounded-2xl border border-[var(--border)] p-3 text-xs text-[var(--muted-foreground)]">
                Maior diferença: <strong className="text-[var(--foreground)]">{data.reconciliation.largestDiff.name}</strong> · {formatCurrencyFromCents(data.reconciliation.largestDiff.reconciliationDiffCents)}
              </div>
            ) : (
              <div className="rounded-2xl border border-[var(--border)] p-3 text-xs text-[var(--muted-foreground)]">
                Nenhuma divergência relevante salva. A próxima etapa é usar a conferência diária para registrar o saldo real das contas e ativos.
              </div>
            )}
            <div className="rounded-2xl border border-[var(--border)] p-3 text-xs text-[var(--muted-foreground)]">
              Snapshot diário de patrimônio: {data.todaysNetWorth ? "registrado hoje" : "ainda não salvo hoje"}.
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_1fr_1fr]">
        <Card className="xl:col-span-1">
          <CardHeader><CardTitle>Contas com divergência</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            {data.accounts.filter((account) => account.reconciliationDiffCents !== 0).slice(0, 5).map((account) => (
              <div key={account.id} className="rounded-2xl border border-[var(--border)] p-3">
                <div className="flex items-center justify-between"><strong>{account.name}</strong><span>{formatCurrencyFromCents(account.reconciliationDiffCents)}</span></div>
                <div className="mt-1 text-xs text-[var(--muted-foreground)]">Projetado: {formatCurrencyFromCents(account.projectedBalanceCents)} · Conferido: {formatCurrencyFromCents(account.reconciledBalanceCents)}</div>
                <a href="/accounts" className="mt-2 inline-flex text-xs font-medium text-[var(--foreground)] underline-offset-2 hover:underline">Corrigir em contas</a>
              </div>
            ))}
            {data.accounts.every((account) => account.reconciliationDiffCents === 0) ? (
              <EmptyState title="Sem desvios relevantes" description="Quando você registrar saldos reais diferentes do calculado, eles aparecem aqui com prioridade operacional." />
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Patrimônio resumido</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between"><span>Liquidez atual</span><strong>{formatCurrencyFromCents(data.netWorth.realizedLiquidCents)}</strong></div>
            <div className="flex items-center justify-between"><span>Reservas consolidadas</span><strong>{formatCurrencyFromCents(data.netWorth.manualReservesCents)}</strong></div>
            <div className="flex items-center justify-between"><span>Investimentos consolidados</span><strong>{formatCurrencyFromCents(data.netWorth.manualInvestmentsCents)}</strong></div>
            <div className="flex items-center justify-between"><span>Dívidas</span><strong>{formatCurrencyFromCents(data.netWorth.manualDebtsCents)}</strong></div>
            <div className="rounded-2xl border border-[var(--border)] p-3 text-xs text-[var(--muted-foreground)]">
              {data.netWorth.month ? `Último snapshot consolidado: ${data.netWorth.month}` : "Nenhum snapshot manual salvo ainda."}
            </div>
            <div className="mt-1 rounded-2xl border border-[var(--border)] p-4 text-base font-semibold">Patrimônio total: {formatCurrencyFromCents(data.netWorth.totalNetWorthCents)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Próximos compromissos</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            {data.upcomingBills.map((bill) => (
              <div key={bill.id} className="rounded-2xl border border-[var(--border)] p-3">
                <div className="flex items-center justify-between"><strong>Fatura {bill.billMonth}</strong><Badge>{formatStatusLabel(bill.status)}</Badge></div>
                <p className="mt-1 text-[var(--muted-foreground)]">Vencimento: {bill.dueOn}</p>
                <p>{formatCurrencyFromCents(bill.totalAmountCents - bill.paidAmountCents)}</p>
              </div>
            ))}
            {data.recurring.map((occurrence) => (
              <div key={occurrence.id} className="rounded-2xl border border-[var(--border)] p-3">
                <div className="flex items-center justify-between"><strong>{occurrence.ruleTitle ?? "Recorrência"}</strong><Badge>{formatTransactionDirectionLabel(occurrence.direction)}</Badge></div>
                <p className="mt-1 text-[var(--muted-foreground)]">Prevista para {occurrence.dueOn}</p>
                <p>{formatCurrencyFromCents(occurrence.amountCents)}</p>
              </div>
            ))}
            {!hasCommitments ? (
              <EmptyState title="Nada a vencer agora" description="Não há faturas abertas nem ocorrências recorrentes agendadas. Se isso não fizer sentido para sua base, revise seed/importação." />
            ) : null}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader><CardTitle>Últimas transações</CardTitle></CardHeader>
          <CardContent>
            {hasTransactions ? (
              <table>
                <thead><tr><th>Data</th><th>Descrição</th><th>Direção</th><th>Valor</th></tr></thead>
                <tbody>
                  {data.recentTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>{transaction.occurredOn}</td>
                      <td>{transaction.description}</td>
                      <td><Badge>{formatTransactionDirectionLabel(transaction.direction)}</Badge></td>
                      <td>{formatCurrencyFromCents(transaction.amountCents)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <EmptyState title="Nenhuma transação ainda" description="Isso é um vazio legítimo: ainda não há lançamentos no banco local para compor o histórico recente." />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Próximas ações</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm text-[var(--muted-foreground)]">
            <div className="rounded-2xl border border-[var(--border)] p-3">1. Conferir o saldo real das contas.</div>
            <div className="rounded-2xl border border-[var(--border)] p-3">2. Atualizar o valor real dos ativos e gravar snapshot do dia em <a href="/net-worth" className="font-medium text-[var(--foreground)] underline-offset-2 hover:underline">Patrimônio</a>.</div>
            <div className="rounded-2xl border border-[var(--border)] p-3">3. Corrigir divergências, contas, categorias ou compras diretamente pela interface, sem depender de seed.</div>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
