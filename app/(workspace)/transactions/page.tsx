import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TransactionForm } from "@/features/transactions/transaction-form";
import { deleteTransactionAction } from "@/features/transactions/actions";
import { formatCurrencyFromCents } from "@/lib/currency";
import { listAccounts } from "@/services/accounts.service";
import { listCategories } from "@/services/categories.service";
import { listTransactions } from "@/services/transactions.service";

export default function TransactionsPage() {
  const accounts = listAccounts();
  const categories = listCategories();
  const transactions = listTransactions();

  return (
    <>
      <PageHeader
        title="Transações"
        description="Lançamentos manuais, previstos, realizados e ajustes. Transferências não entram aqui como receita ou despesa líquida."
      />
      <TransactionForm
        accounts={accounts.map((row) => ({ id: row.id, name: row.name }))}
        categories={categories.map((row) => ({ id: row.id, name: row.name }))}
      />
      <Card>
        <CardHeader>
          <CardTitle>Histórico</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Descrição</th>
                  <th>Direção</th>
                  <th>Status</th>
                  <th>Valor</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.occurredOn}</td>
                    <td>{transaction.description}</td>
                    <td>{transaction.direction}</td>
                    <td>{transaction.status}</td>
                    <td>{formatCurrencyFromCents(transaction.amountCents)}</td>
                    <td>
                      <form
                        action={async () => {
                          "use server";
                          await deleteTransactionAction(transaction.id);
                        }}
                      >
                        <Button type="submit" className="h-8 px-3 text-xs">
                          Excluir
                        </Button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState
              title="Nenhuma transação lançada"
              description="Esse vazio é legítimo quando a base ainda não recebeu lançamentos. Depois do primeiro lançamento ou da importação, o histórico aparece aqui."
            />
          )}
        </CardContent>
      </Card>
    </>
  );
}
