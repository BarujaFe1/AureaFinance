"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ConfirmForm } from "@/components/confirm-form";
import { BatchActions } from "@/components/batch-actions";
import {
  batchArchiveTransactionsAction,
  batchCategorizeTransactionsAction,
  batchChangeStatusAction,
  batchChangeAccountAction,
  updateTransactionFormAction,
  archiveTransactionAction,
  deleteTransactionFormAction
} from "@/features/transactions/actions";
import { formatCurrencyFromCents } from "@/lib/currency";
import { formatStatusLabel, formatTransactionDirectionLabel } from "@/lib/formatters";

interface Transaction {
  id: string;
  accountId: string | null;
  description: string;
  amountCents: number;
  direction: string;
  status: string;
  occurredOn: string;
  dueOn: string | null;
  categoryId: string | null;
  notes: string | null;
}

interface Props {
  transactions: Transaction[];
  accounts: { id: string; name: string }[];
  categories: { id: string; name: string }[];
}

function centsToInput(value: number) {
  return (value / 100).toFixed(2).replace(".", ",");
}

export function TransactionsClient({ transactions, accounts, categories }: Props) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const allSelected = selectedIds.size === transactions.length && transactions.length > 0;

  const toggleOne = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(transactions.map((t) => t.id)));
  }, [allSelected, transactions]);

  const runBatch = useCallback(async (action: (formData: FormData) => Promise<void>, extra?: Record<string, string>) => {
    const formData = new FormData();
    formData.set("ids", JSON.stringify(Array.from(selectedIds)));
    if (extra) for (const [k, v] of Object.entries(extra)) formData.set(k, v);
    await action(formData);
    setSelectedIds(new Set());
  }, [selectedIds]);

  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={allSelected}
          onChange={toggleAll}
          className="size-4"
        />
        <span className="text-[var(--muted-foreground)]">{transactions.length} transações</span>
        {selectedIds.size > 0 ? (
          <span className="text-[var(--muted-foreground)]">· {selectedIds.size} selecionadas</span>
        ) : null}
      </label>

      <BatchActions
        selectedCount={selectedIds.size}
        categories={categories}
        accounts={accounts}
        onCategorize={(categoryId) => runBatch(batchCategorizeTransactionsAction, { categoryId })}
        onChangeStatus={(status) => runBatch(batchChangeStatusAction, { status })}
        onChangeAccount={(accountId) => runBatch(batchChangeAccountAction, { accountId })}
        onDelete={() => runBatch(batchArchiveTransactionsAction)}
      />

      <div className="space-y-3">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-start gap-3">
            <label className="mt-5 shrink-0">
              <input
                type="checkbox"
                checked={selectedIds.has(transaction.id)}
                onChange={() => toggleOne(transaction.id)}
                className="size-4"
              />
            </label>
            <details className="min-w-0 flex-1 rounded-2xl border border-[var(--border)] p-4">
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
                <ConfirmForm
                  action={archiveTransactionAction}
                  message="Arquivar esta transação? Ela sai dos saldos e listas, e pode ser restaurada depois."
                  confirmLabel="Sim, arquivar"
                >
                  <input type="hidden" name="id" value={transaction.id} />
                  <Button type="submit" className="h-10 px-3 text-xs">Arquivar</Button>
                </ConfirmForm>
                <ConfirmForm
                  action={deleteTransactionFormAction}
                  message="Excluir permanentemente esta transação? Esta ação não pode ser desfeita."
                >
                  <input type="hidden" name="id" value={transaction.id} />
                  <Button type="submit" className="h-10 px-3 text-xs" variant="outline">Excluir</Button>
                </ConfirmForm>
              </div>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
}
