import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { saveAccountBalanceSnapshotAction } from "@/features/accounts/actions";
import { upsertAssetPositionAction, saveDailyNetWorthSnapshotAction } from "@/features/net-worth/actions";
import { TransactionForm } from "@/features/transactions/transaction-form";
import { formatCurrencyFromCents } from "@/lib/currency";
import { todayIso } from "@/lib/dates";
import { listDailyNetWorthSnapshot, listDueTodayChecklist } from "@/services/daily.service";
import { listCategories } from "@/services/categories.service";
import { getDailyAccountChecklist } from "@/services/accounts.service";
import { listAssetPositions } from "@/services/net-worth.service";
import { listAccounts } from "@/services/accounts.service";

function centsToInput(value: number) {
  return (value / 100).toFixed(2).replace(".", ",");
}

export default function DailyPage() {
  const today = todayIso();
  const accounts = getDailyAccountChecklist(today);
  const assets = listAssetPositions();
  const categories = listCategories();
  const dueToday = listDueTodayChecklist(today);
  const netWorthSnapshot = listDailyNetWorthSnapshot(today);
  const accountDiffTotal = accounts.reduce((sum, account) => sum + Math.abs(account.suggestedAdjustmentCents), 0);

  return (
    <>
      <PageHeader
        title="Conferência diária"
        description="Central operacional para conferir saldo real das contas, atualizar ativos, lançar o dia e fechar divergências antes de olhar a projeção."
        actions={<form action={saveDailyNetWorthSnapshotAction}><input type="hidden" name="snapshotDate" value={today} /><Button type="submit">Fechar dia</Button></form>}
      />

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Diferença de contas</CardTitle></CardHeader>
          <CardContent className="text-2xl font-semibold">{formatCurrencyFromCents(accountDiffTotal)}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Compromissos do dia</CardTitle></CardHeader>
          <CardContent className="text-2xl font-semibold">{dueToday.length}</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Snapshot patrimonial</CardTitle></CardHeader>
          <CardContent className="text-sm">{netWorthSnapshot ? `Salvo hoje: ${formatCurrencyFromCents(netWorthSnapshot.totalCents)}` : "Ainda não salvo hoje."}</CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader><CardTitle>Saldos reais por conta</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {accounts.map((account) => (
              <form key={account.id} action={saveAccountBalanceSnapshotAction} className="grid gap-3 rounded-2xl border border-[var(--border)] p-4 text-sm md:grid-cols-[1.05fr_0.9fr_0.9fr_auto]">
                <input type="hidden" name="accountId" value={account.id} />
                <input type="hidden" name="source" value="daily_review" />
                <div>
                  <div className="font-medium">{account.name}</div>
                  <div className="text-xs text-[var(--muted-foreground)]">Calculado: {formatCurrencyFromCents(account.currentBalanceCents)}</div>
                </div>
                <Input name="snapshotDate" type="date" defaultValue={today} />
                <Input name="balance" defaultValue={centsToInput(account.snapshotForDate?.balanceCents ?? account.currentBalanceCents)} placeholder="Saldo real" />
                <Button type="submit" className="h-10">Salvar</Button>
                <div className="md:col-span-4 text-xs text-[var(--muted-foreground)]">Diferença atual: {formatCurrencyFromCents(account.suggestedAdjustmentCents)}</div>
              </form>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Atualização rápida de ativos</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {assets.length > 0 ? assets.map((asset) => (
              <form key={`${asset.assetType}-${asset.assetId}`} action={upsertAssetPositionAction} className="grid gap-2 rounded-2xl border border-[var(--border)] p-3 text-sm">
                <input type="hidden" name="assetType" value={asset.assetType} />
                <input type="hidden" name="assetId" value={asset.assetId} />
                <input type="hidden" name="label" value={asset.assetType === "stock" ? asset.label.split(" · ")[0] : asset.label} />
                <input type="hidden" name="fullName" value={asset.assetType === "stock" ? asset.label.split(" · ")[1] ?? asset.label : asset.label} />
                <div className="flex items-center justify-between gap-3">
                  <strong>{asset.label}</strong>
                  <span className="text-xs text-[var(--muted-foreground)]">Atual: {formatCurrencyFromCents(asset.currentValueCents)}</span>
                </div>
                <div className="grid gap-2 md:grid-cols-[0.8fr_1fr_1fr]">
                  <Input name="quantity" defaultValue={String(asset.quantity)} placeholder="Qtd." />
                  <Input name="currentValue" defaultValue={centsToInput(asset.currentValueCents)} placeholder="Valor real" />
                  <Input name="snapshotDate" type="date" defaultValue={today} />
                </div>
                <Button type="submit" className="justify-self-end">Salvar ativo</Button>
              </form>
            )) : <EmptyState title="Sem ativos cadastrados" description="Use a tela de patrimônio para criar reservas, ações e cripto antes da conferência diária." />}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <TransactionForm
          accounts={listAccounts().map((row) => ({ id: row.id, name: row.name }))}
          categories={categories.map((row) => ({ id: row.id, name: row.name }))}
        />

        <Card>
          <CardHeader><CardTitle>Agenda operacional do dia</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            {dueToday.map((item) => (
              <div key={item.id} className="rounded-2xl border border-[var(--border)] p-3">
                <div className="flex items-center justify-between"><strong>{item.title}</strong><span>{formatCurrencyFromCents(item.amountCents)}</span></div>
                <div className="mt-1 text-xs text-[var(--muted-foreground)]">{item.kind} · vence em {item.date}</div>
              </div>
            ))}
            {dueToday.length === 0 ? <EmptyState title="Dia sem vencimentos críticos" description="Sem faturas ou recorrências vencendo hoje. Foque em reconciliar saldo, ativos e lançamentos do dia." /> : null}
          </CardContent>
        </Card>
      </section>
    </>
  );
}
