import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { markBillPaidAction } from "@/features/cards/actions";
import { formatCurrencyFromCents } from "@/lib/currency";
import { listBills } from "@/services/cards.service";

export default function BillsPage() {
  const bills = listBills();

  return (
    <>
      <PageHeader
        title="Faturas"
        description="Cada fatura é uma entidade própria e consolidada. Parcelas já entram previamente na fatura correta."
      />
      {bills.length > 0 ? (
        <div className="grid gap-4">
          {bills.map((bill) => (
            <Card key={bill.id}>
              <CardHeader>
                <CardTitle>Fatura {bill.billMonth}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--muted-foreground)]">
                  <span>Fecha em {bill.closesOn}</span>
                  <span>Vence em {bill.dueOn}</span>
                  <span>Status: {bill.status}</span>
                  <strong className="text-[var(--foreground)]">
                    {formatCurrencyFromCents(bill.totalAmountCents - bill.paidAmountCents)}
                  </strong>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Entrada</th>
                      <th>Tipo</th>
                      <th>Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bill.entries.map((entry) => (
                      <tr key={entry.id}>
                        <td>{entry.description}</td>
                        <td>{entry.entryType}</td>
                        <td>{formatCurrencyFromCents(entry.amountCents)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {bill.status !== "paid" ? (
                  <form action={markBillPaidAction}>
                    <input type="hidden" name="billId" value={bill.id} />
                    <Button type="submit">Marcar como paga</Button>
                  </form>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Nenhuma fatura gerada"
          description="Esse vazio é legítimo quando ainda não existem cartões ou compras lançadas no cartão."
        />
      )}
    </>
  );
}
