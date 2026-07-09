import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ConfirmForm } from "@/components/confirm-form";
import { TransactionForm } from "@/features/transactions/transaction-form";
import { TransactionsClient } from "@/features/transactions/transactions-client";
import { restoreTransactionAction } from "@/features/transactions/actions";
import { formatCurrencyFromCents } from "@/lib/currency";
import { listAccounts } from "@/services/accounts.service";
import { listCategories } from "@/services/categories.service";
import { listArchivedTransactions, listTransactions } from "@/services/transactions.service";

export default async function TransactionsPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const params = (await searchParams) ?? {};
  const search = String(Array.isArray(params.search) ? params.search[0] : params.search ?? "").trim().toLowerCase();
  const statusFilter = String(Array.isArray(params.status) ? params.status[0] : params.status ?? "all");
  const directionFilter = String(Array.isArray(params.direction) ? params.direction[0] : params.direction ?? "all");
  const accountFilter = String(Array.isArray(params.accountId) ? params.accountId[0] : params.accountId ?? "all");
  const accounts = listAccounts();
  const categories = listCategories();
  const archived = listArchivedTransactions();
  const transactions = listTransactions().filter((transaction) => {
    if (statusFilter !== "all" && transaction.status !== statusFilter) return false;
    if (directionFilter !== "all" && transaction.direction !== directionFilter) return false;
    if (accountFilter !== "all" && transaction.accountId !== accountFilter) return false;
    if (!search) return true;
    const haystack = `${transaction.description} ${transaction.counterparty ?? ""} ${transaction.notes ?? ""}`.toLowerCase();
    return haystack.includes(search);
  });

  return (
    <>
      <PageHeader
        title="Transações"
        description="Lançamentos manuais, previstos, realizados e ajustes. Arquivar remove dos saldos com possibilidade de restaurar; exclusão permanente continua disponível."
      />
      <TransactionForm
        accounts={accounts.map((row) => ({ id: row.id, name: row.name }))}
        categories={categories.map((row) => ({ id: row.id, name: row.name }))}
      />
      <Card>
        <CardHeader>
          <CardTitle>Histórico</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <Input name="search" placeholder="Buscar descrição, observação ou contraparte" defaultValue={search} />
            <Select name="status" defaultValue={statusFilter}>
              <option value="all">Todos os status</option>
              <option value="posted">Realizado</option>
              <option value="scheduled">Projetado</option>
              <option value="void">Ignorado</option>
            </Select>
            <Select name="direction" defaultValue={directionFilter}>
              <option value="all">Todas as direções</option>
              <option value="expense">Despesa</option>
              <option value="income">Receita</option>
              <option value="adjustment">Ajuste</option>
              <option value="transfer_out">Transferência de saída</option>
              <option value="transfer_in">Transferência de entrada</option>
              <option value="bill_payment">Pagamento de fatura</option>
            </Select>
            <Select name="accountId" defaultValue={accountFilter}>
              <option value="all">Todas as contas</option>
              {accounts.map((account) => <option key={account.id} value={account.id}>{account.name}</option>)}
            </Select>
            <div className="xl:col-span-4 flex justify-end"><Button type="submit">Aplicar filtros</Button></div>
          </form>
          {transactions.length > 0 ? (
            <TransactionsClient
              transactions={transactions.map((transaction) => ({
                id: transaction.id,
                accountId: transaction.accountId,
                description: transaction.description,
                amountCents: transaction.amountCents,
                direction: transaction.direction,
                status: transaction.status,
                occurredOn: transaction.occurredOn,
                dueOn: transaction.dueOn,
                categoryId: transaction.categoryId,
                notes: transaction.notes
              }))}
              accounts={accounts.map((a) => ({ id: a.id, name: a.name }))}
              categories={categories.map((c) => ({ id: c.id, name: c.name }))}
            />
          ) : (
            <EmptyState
              title="Nenhuma transação encontrada"
              description="Ajuste os filtros ou revise o lote em Importação para confirmar se a tabela transactions recebeu registros."
            />
          )}
        </CardContent>
      </Card>

      {archived.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Arquivadas ({archived.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {archived.map((transaction) => (
              <div key={transaction.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border)] p-4">
                <div>
                  <div className="font-medium">{transaction.description}</div>
                  <div className="text-xs text-[var(--muted-foreground)]">{transaction.occurredOn} · {formatCurrencyFromCents(transaction.amountCents)}</div>
                </div>
                <ConfirmForm
                  action={restoreTransactionAction}
                  message="Restaurar esta transação? Ela volta a entrar nos saldos e listas."
                  confirmLabel="Sim, restaurar"
                  variant="default"
                >
                  <input type="hidden" name="id" value={transaction.id} />
                  <Button type="submit" variant="outline" className="h-10 px-3 text-xs">Restaurar</Button>
                </ConfirmForm>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </>
  );
}
