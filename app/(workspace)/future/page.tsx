import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FutureCashflowChart } from "@/components/future/cashflow-chart";
import { FutureEventsTimeline } from "@/components/future/events-timeline";
import { FutureSummaryCards } from "@/components/future/summary-cards";
import { getProjectedCashflow } from "@/services/cashflow.service";

export default async function FuturePage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const params = (await searchParams) ?? {};
  const horizonParam = Array.isArray(params.horizon) ? params.horizon[0] : params.horizon;
  const horizon = Number.isFinite(Number(horizonParam)) ? Math.min(Math.max(Number(horizonParam), 15), 365) : 90;
  const projection = await getProjectedCashflow(horizon);
  const chartData = projection.days.map((day) => ({ date: day.date, balance: day.balance_cents / 100 }));

  return (
    <>
      <PageHeader
        title="VisÃ£o futura"
        description="Timeline projetada com recorrÃªncias, faturas, parcelas e alertas de caixa no horizonte selecionado."
      />

      <form className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-4">
        <div className="flex flex-wrap items-end gap-3">
          <label className="grid gap-2 text-sm">
            <span>Horizonte em dias</span>
            <Input name="horizon" type="number" min={15} max={365} defaultValue={String(horizon)} />
          </label>
          <button type="submit" className="inline-flex h-10 items-center justify-center rounded-2xl bg-[var(--primary)] px-4 text-sm font-medium text-[var(--primary-foreground)]">
            Atualizar projeÃ§Ã£o
          </button>
        </div>
      </form>

      <FutureSummaryCards
        initialBalanceCents={projection.initial_balance_cents}
        endingBalanceCents={projection.ending_balance_cents}
        minBalanceCents={projection.min_balance_cents}
        totalIncomeCents={projection.total_income_cents}
        totalExpensesCents={projection.total_expenses_cents}
        firstNegativeDate={projection.first_negative_date}
        minBalanceDate={projection.min_balance_date}
      />

      <Card>
        <CardHeader>
          <CardTitle>Curva de saldo projetado</CardTitle>
        </CardHeader>
        <CardContent>
          <FutureCashflowChart data={chartData} />
        </CardContent>
      </Card>

      <FutureEventsTimeline days={projection.days} />
    </>
  );
}
