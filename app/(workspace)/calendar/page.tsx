import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrencyFromCents } from "@/lib/currency";
import { formatTransactionDirectionLabel } from "@/lib/formatters";
import { listBills } from "@/services/cards.service";
import { listRecurringRules } from "@/services/recurring.service";

export default function CalendarPage() {
  const timeline = [
    ...listBills()
      .filter((bill) => bill.status !== "paid")
      .map((bill) => ({
        date: bill.dueOn,
        title: `Fatura ${bill.billMonth}`,
        kind: "Fatura",
        amountCents: bill.totalAmountCents - bill.paidAmountCents
      })),
    ...listRecurringRules()
      .flatMap((rule) => rule.occurrences)
      .filter((row) => row.status === "scheduled")
      .map((occurrence) => ({
        date: occurrence.dueOn,
        title: "Recorrência",
        kind: occurrence.direction,
        amountCents: occurrence.amountCents
      }))
  ].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <>
      <PageHeader
        title="Calendário financeiro"
        description="Linha do tempo prática dos próximos vencimentos, contas fixas, faturas abertas e compromissos projetados."
      />
      <Card>
        <CardHeader>
          <CardTitle>Próximos compromissos</CardTitle>
        </CardHeader>
        <CardContent>
          {timeline.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Título</th>
                  <th>Tipo</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                {timeline.map((item, index) => (
                  <tr key={`${item.date}-${index}`}>
                    <td>{item.date}</td>
                    <td>{item.title}</td>
                    <td>{item.kind === "Fatura" ? item.kind : formatTransactionDirectionLabel(item.kind)}</td>
                    <td>{formatCurrencyFromCents(item.amountCents)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState
              title="Calendário sem eventos"
              description="Não há faturas abertas nem recorrências agendadas. Esse é um vazio legítimo quando a base ainda está no começo."
            />
          )}
        </CardContent>
      </Card>
    </>
  );
}
