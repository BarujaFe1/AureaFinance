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
  const form = useForm<TransactionCreateInput>({
    resolver: zodResolver(transactionCreateSchema),
    defaultValues: { accountId: accounts[0]?.id ?? "", description: "", amount: "0,00", direction: "expense", status: "posted", occurredOn: new Date().toISOString().slice(0, 10), dueOn: new Date().toISOString().slice(0, 10), notes: "" }
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
          <div className="space-y-2 xl:col-span-2"><Label>Descrição</Label><Input {...form.register("description")} placeholder="Mercado, aluguel, salário..." /></div>
          <div className="space-y-2"><Label>Conta</Label><Select {...form.register("accountId")}>{accounts.map((account) => <option key={account.id} value={account.id}>{account.name}</option>)}</Select></div>
          <div className="space-y-2"><Label>Valor</Label><Input {...form.register("amount")} placeholder="0,00" /></div>
          <div className="space-y-2"><Label>Direção</Label><Select {...form.register("direction")}><option value="expense">Despesa</option><option value="income">Receita</option><option value="adjustment">Ajuste</option></Select></div>
          <div className="space-y-2"><Label>Status</Label><Select {...form.register("status")}><option value="posted">Realizado</option><option value="scheduled">Projetado</option><option value="void">Ignorado</option></Select></div>
          <div className="space-y-2"><Label>Data</Label><Input type="date" {...form.register("occurredOn")} /></div>
          <div className="space-y-2"><Label>Categoria</Label><Select {...form.register("categoryId")}><option value="">Sem categoria</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</Select></div>
          <div className="space-y-2 xl:col-span-4"><Label>Notas</Label><Input {...form.register("notes")} placeholder="Observação opcional" /></div>
          <div className="xl:col-span-4 flex justify-end"><Button type="submit" disabled={pending}>{pending ? "Salvando..." : "Criar lançamento"}</Button></div>
        </form>
      </CardContent>
    </Card>
  );
}
