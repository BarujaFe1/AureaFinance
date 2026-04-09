import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TransactionForm } from "@/features/transactions/transaction-form";
import { deleteTransactionAction, updateTransactionFormAction } from "@/features/transactions/actions";
import { formatCurrencyFromCents } from "@/lib/currency";
import { formatStatusLabel, formatTransactionDirectionLabel } from "@/lib/formatters";
import { listAccounts } from "@/services/accounts.service";
import { listCategories } from "@/services/categories.service";
import { listTransactions } from "@/services/transactions.service";

function centsToInput(value: number) {
  return (value / 100).toFixed(2).replace(".", ",");
}

export default async function TransactionsPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const params = (await searchParams) ?? {};
  const search = String(Array.isArray(params.search) ? params.search[0] : params.search ?? "").trim().toLowerCase();
  const statusFilter = String(Array.isArray(params.status) ? params.status[0] : params.status ?? "all");
  const directionFilter = String(Array.isArray(params.direction) ? params.direction[0] : params.direction ?? "all");
  const accountFilter = String(Array.isArray(params.accountId) ? params.accountId[0] : params.accountId ?? "all");
  const accounts = listAccounts();
  const categories = listCategories();
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
        description="Lançamentos manuais, previstos, realizados e ajustes. Agora com edição mais visível, exclusão segura, filtros básicos e busca operacional."
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
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <details key={transaction.id} className="rounded-2xl border border-[var(--border)] p-4">
                  <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="font-medium">{transaction.description}</div>
                      <div className="text-xs text-[var(--muted-foreground)]">{transaction.occurredOn} · {formatTransactionDirectionLabel(transaction.direction)} · {formatStatusLabel(transaction.status)}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrencyFromCents(transaction.amountCents)}</div>
                      <div className="text-xs text-[var(--muted-foreground)]">Clique para editar ou excluir</div>
                    </div>
                  </summary>
                  <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
                    <form action={updateTransactionFormAction} className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                      <input type="hidden" name="id" value={transaction.id} />
                      <Input name="description" defaultValue={transaction.description} />
                      <Select name="accountId" defaultValue={transaction.accountId ?? undefined}>{accounts.map((account) => <option key={account.id} value={account.id}>{account.name}</option>)}</Select>
                      <Input name="amount" defaultValue={centsToInput(transaction.amountCents)} />
                      <Select name="direction" defaultValue={transaction.direction}>
                        <option value="expense">Despesa</option>
                        <option value="income">Receita</option>
                        <option value="adjustment">Ajuste</option>
                        <option value="transfer_out">Transferência de saída</option>
                        <option value="transfer_in">Transferência de entrada</option>
                        <option value="bill_payment">Pagamento de fatura</option>
                      </Select>
                      <Select name="status" defaultValue={transaction.status}>
                        <option value="posted">Realizado</option>
                        <option value="scheduled">Projetado</option>
                        <option value="void">Ignorado</option>
                      </Select>
                      <Input name="occurredOn" type="date" defaultValue={transaction.occurredOn} />
                      <Input name="dueOn" type="date" defaultValue={transaction.dueOn ?? transaction.occurredOn} />
                      <Select name="categoryId" defaultValue={transaction.categoryId ?? undefined}>
                        <option value="">Sem categoria</option>
                        {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                      </Select>
                      <div className="xl:col-span-4"><Input name="notes" defaultValue={transaction.notes ?? ""} placeholder="Notas" /></div>
                      <div className="xl:col-span-4 flex justify-end"><Button type="submit">Salvar edição</Button></div>
                    </form>
                    <form
                      action={async () => {
                        "use server";
                        await deleteTransactionAction(transaction.id);
                      }}
                    >
                      <Button type="submit" className="h-10 px-3 text-xs">
                        Excluir com segurança
                      </Button>
                    </form>
                  </div>
                </details>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Nenhuma transação encontrada"
              description="Ajuste os filtros ou revise o lote em Importação para confirmar se a tabela transactions recebeu registros."
            />
          )}
        </CardContent>
      </Card>
    </>
  );
}
