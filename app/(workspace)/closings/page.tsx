import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { runMonthlyClosingAction } from "@/features/monthly-closing/actions";
import { formatCurrencyFromCents } from "@/lib/currency";
import { listMonthlyClosings } from "@/services/monthly-closing.service";

export default function ClosingsPage() {
  const closings = listMonthlyClosings();

  return (
    <>
      <PageHeader
        title="Fechamentos mensais"
        description="ConsolidaÃ§Ã£o do mÃªs com saldo de abertura, entradas, saÃ­das, transferÃªncias, faturas abertas e caixa livre projetado."
      />
      <Card>
        <CardHeader>
          <CardTitle>Rodar fechamento</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={runMonthlyClosingAction} className="flex flex-wrap gap-2">
            <Input type="month" name="month" defaultValue={new Date().toISOString().slice(0, 7)} className="max-w-[240px]" />
            <Button type="submit">Fechar mÃªs</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>HistÃ³rico de fechamentos</CardTitle>
        </CardHeader>
        <CardContent>
          {closings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-[var(--muted-foreground)]">
                    <th className="px-2 py-2">MÃªs</th>
                    <th className="px-2 py-2">Abertura</th>
                    <th className="px-2 py-2">Receitas</th>
                    <th className="px-2 py-2">Despesas</th>
                    <th className="px-2 py-2">TransferÃªncias</th>
                    <th className="px-2 py-2">Faturas em aberto</th>
                    <th className="px-2 py-2">Saldo final</th>
                    <th className="px-2 py-2">Caixa livre</th>
                  </tr>
                </thead>
                <tbody>
                  {closings.map((closing) => (
                    <tr key={closing.id} className="border-t border-[var(--border)]">
                      <td className="px-2 py-3">{closing.month}</td>
                      <td className="px-2 py-3">{formatCurrencyFromCents(closing.openingBalanceCents)}</td>
                      <td className="px-2 py-3">{formatCurrencyFromCents(closing.incomesCents)}</td>
                      <td className="px-2 py-3">{formatCurrencyFromCents(closing.expensesCents)}</td>
                      <td className="px-2 py-3">{formatCurrencyFromCents(closing.transfersNetCents)}</td>
                      <td className="px-2 py-3">{formatCurrencyFromCents(closing.projectedBillPaymentsCents)}</td>
                      <td className="px-2 py-3 font-medium">{formatCurrencyFromCents(closing.closingBalanceCents)}</td>
                      <td className="px-2 py-3 font-medium">{formatCurrencyFromCents(closing.projectedFreeCashCents)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title="Nenhum fechamento salvo"
              description="Depois do primeiro fechamento manual, o histÃ³rico mensal aparece aqui usando a coluna month e os campos reais do schema atual."
            />
          )}
        </CardContent>
      </Card>
    </>
  );
}
