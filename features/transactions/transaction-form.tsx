"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTransactionAction } from "@/features/transactions/actions";
import { transactionCreateSchema, type TransactionCreateInput } from "@/lib/validation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function TransactionForm({ accounts, categories }: { accounts: { id: string; name: string }[]; categories: { id: string; name: string }[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const today = new Date().toISOString().slice(0, 10);
  const form = useForm<TransactionCreateInput>({
    resolver: zodResolver(transactionCreateSchema),
    defaultValues: { accountId: accounts[0]?.id ?? "", description: "", amount: "0,00", direction: "expense", status: "posted", occurredOn: today, dueOn: today, notes: "" }
  });
  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      await createTransactionAction(values);
      form.reset({ ...values, description: "", amount: "0,00", notes: "" });
      router.refresh();
    });
  });
  return (
    <Card>
      <CardHeader><CardTitle>Novo lançamento</CardTitle></CardHeader>
      <CardContent>
        <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" onSubmit={onSubmit}>
          <div className="space-y-2 xl:col-span-2"><Label htmlFor="description">Descrição</Label><Input id="description" {...form.register("description")} placeholder="Mercado, aluguel, salário, ajuste..." /></div>
          <div className="space-y-2"><Label htmlFor="accountId">Conta</Label><Select id="accountId" {...form.register("accountId")}>{accounts.map((account) => <option key={account.id} value={account.id}>{account.name}</option>)}</Select></div>
          <div className="space-y-2"><Label htmlFor="amount">Valor</Label><Input id="amount" {...form.register("amount")} placeholder="0,00" /></div>
          <div className="space-y-2"><Label htmlFor="direction">Tipo do lançamento</Label><Select id="direction" {...form.register("direction")}><option value="expense">Despesa</option><option value="income">Receita</option><option value="adjustment">Ajuste</option><option value="transfer_out">Transferência de saída</option><option value="transfer_in">Transferência de entrada</option></Select></div>
          <div className="space-y-2"><Label htmlFor="status">Status</Label><Select id="status" {...form.register("status")}><option value="posted">Realizado</option><option value="scheduled">Projetado</option><option value="void">Ignorado</option></Select></div>
          <div className="space-y-2"><Label htmlFor="occurredOn">Data do lançamento</Label><Input id="occurredOn" type="date" {...form.register("occurredOn")} /></div>
          <div className="space-y-2"><Label htmlFor="dueOn">Vencimento</Label><Input id="dueOn" type="date" {...form.register("dueOn")} /></div>
          <div className="space-y-2"><Label htmlFor="categoryId">Categoria</Label><Select id="categoryId" {...form.register("categoryId")}><option value="">Sem categoria</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</Select></div>
          <div className="space-y-2 xl:col-span-4"><Label htmlFor="notes">Notas</Label><Input id="notes" {...form.register("notes")} placeholder="Observação opcional para conciliação ou contexto" /></div>
          <div className="xl:col-span-4 flex justify-end"><Button type="submit" disabled={pending}>{pending ? "Salvando..." : "Criar lançamento"}</Button></div>
        </form>
      </CardContent>
    </Card>
  );
}
