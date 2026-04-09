import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { reopenMonthlyClosingAction, runMonthlyClosingAction } from "@/features/monthly-closing/actions";
import { formatCurrencyFromCents } from "@/lib/currency";
import { buildMonthlyClosing, listMonthlyClosings } from "@/services/monthly-closing.service";

export default function ClosingsPage() {
  const closings = listMonthlyClosings();
  const currentMonth = new Date().toISOString().slice(0, 7);
  const preview = buildMonthlyClosing(currentMonth);

  return (
    <>
      <PageHeader
        title="Fechamentos mensais"
        description="Fluxo real para calcular, salvar, revisar composição e reabrir um fechamento quando a base do mês precisar ser corrigida."
      />
      <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Rodar fechamento</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={runMonthlyClosingAction} className="flex flex-wrap gap-2">
              <Input type="month" name="month" defaultValue={currentMonth} className="max-w-[240px]" />
              <Button type="submit">Fechar mês</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Prévia do mês atual</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center justify-between"><span>Abertura</span><strong>{formatCurrencyFromCents(preview.openingBalanceCents)}</strong></div>
            <div className="flex items-center justify-between"><span>Receitas</span><strong>{formatCurrencyFromCents(preview.incomesCents)}</strong></div>
            <div className="flex items-center justify-between"><span>Despesas</span><strong>{formatCurrencyFromCents(preview.expensesCents)}</strong></div>
            <div className="flex items-center justify-between"><span>Transferências líquidas</span><strong>{formatCurrencyFromCents(preview.transfersNetCents)}</strong></div>
            <div className="flex items-center justify-between"><span>Faturas em aberto</span><strong>{formatCurrencyFromCents(preview.projectedBillPaymentsCents)}</strong></div>
            <div className="rounded-2xl border border-[var(--border)] p-3 text-xs text-[var(--muted-foreground)]">
              Essa prévia mostra a composição antes de salvar o fechamento histórico do mês.
            </div>
          </CardContent>
        </Card>
      </section>
      <Card>
        <CardHeader>
          <CardTitle>Histórico de fechamentos</CardTitle>
        </CardHeader>
        <CardContent>
          {closings.length > 0 ? (
            <div className="space-y-4">
              {closings.map((closing) => (
                <details key={closing.id} className="rounded-2xl border border-[var(--border)] p-4">
                  <summary className="cursor-pointer list-none">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="font-medium">{closing.month}</div>
                        <div className="text-xs text-[var(--muted-foreground)]">{closing.snapshot?.transactionCount ?? 0} transações · {closing.snapshot?.openBills ?? 0} faturas em aberto na composição</div>
                      </div>
                      <div className="text-sm font-semibold">Saldo final {formatCurrencyFromCents(closing.closingBalanceCents)}</div>
                    </div>
                  </summary>
                  <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4 text-sm">
                    <div className="rounded-2xl border border-[var(--border)] p-3"><div className="text-[var(--muted-foreground)]">Abertura</div><strong>{formatCurrencyFromCents(closing.openingBalanceCents)}</strong></div>
                    <div className="rounded-2xl border border-[var(--border)] p-3"><div className="text-[var(--muted-foreground)]">Receitas</div><strong>{formatCurrencyFromCents(closing.incomesCents)}</strong></div>
                    <div className="rounded-2xl border border-[var(--border)] p-3"><div className="text-[var(--muted-foreground)]">Despesas</div><strong>{formatCurrencyFromCents(closing.expensesCents)}</strong></div>
                    <div className="rounded-2xl border border-[var(--border)] p-3"><div className="text-[var(--muted-foreground)]">Transferências</div><strong>{formatCurrencyFromCents(closing.transfersNetCents)}</strong></div>
                    <div className="rounded-2xl border border-[var(--border)] p-3"><div className="text-[var(--muted-foreground)]">Faturas em aberto</div><strong>{formatCurrencyFromCents(closing.projectedBillPaymentsCents)}</strong></div>
                    <div className="rounded-2xl border border-[var(--border)] p-3"><div className="text-[var(--muted-foreground)]">Saldo final</div><strong>{formatCurrencyFromCents(closing.closingBalanceCents)}</strong></div>
                    <div className="rounded-2xl border border-[var(--border)] p-3"><div className="text-[var(--muted-foreground)]">Caixa livre projetado</div><strong>{formatCurrencyFromCents(closing.projectedFreeCashCents)}</strong></div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <form action={reopenMonthlyClosingAction}>
                      <input type="hidden" name="month" value={closing.month} />
                      <Button type="submit" className="h-9 px-3 text-xs">Reabrir fechamento</Button>
                    </form>
                  </div>
                </details>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Nenhum fechamento salvo"
              description="Depois do primeiro fechamento manual, o histórico mensal aparece aqui com composição resumida e reabertura controlada."
            />
          )}
        </CardContent>
      </Card>
    </>
  );
}
