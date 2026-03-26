"use client";

import { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createTransactionAction } from "@/features/transactions/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const schema = z.object({
  accountId: z.string().min(1, "Selecione uma conta"),
  categoryId: z.string().min(1, "Selecione uma categoria"),
  direction: z.enum(["income", "expense", "adjustment"]),
  description: z.string().min(2, "Informe uma descrição"),
  amount: z.string().min(1, "Informe o valor"),
  occurredOn: z.string().min(1, "Informe a data"),
  status: z.enum(["posted", "scheduled", "void"])
});

type FormValues = z.infer<typeof schema>;

export function TransactionForm(props: {
  accounts: Array<{ id: string; name: string }>;
  categories: Array<{ id: string; name: string }>;
}) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { direction: "expense", status: "posted", occurredOn: new Date().toISOString().slice(0, 10), amount: "" }
  });

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      await createTransactionAction({
        accountId: values.accountId,
        categoryId: values.categoryId,
        subcategoryId: null,
        description: values.description,
        amount: values.amount,
        direction: values.direction,
        status: values.status,
        occurredOn: values.occurredOn,
        dueOn: values.occurredOn,
        notes: ""
      });
      form.reset({
        accountId: values.accountId,
        categoryId: values.categoryId,
        direction: values.direction,
        status: values.status,
        description: "",
        occurredOn: new Date().toISOString().slice(0, 10),
        amount: ""
      });
    });
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Novo lançamento</CardTitle>
        <CardDescription>Entrada rápida para uso diário, com validação leve e segura.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Descrição</label>
            <Input {...form.register("description")} placeholder="Ex.: Mercado da semana" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Valor</label>
            <Input {...form.register("amount")} placeholder="Ex.: 129,90" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Conta</label>
            <select className="h-10 rounded-xl border bg-background px-3 text-sm" {...form.register("accountId")}>
              <option value="">Selecione</option>
              {props.accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Categoria</label>
            <select className="h-10 rounded-xl border bg-background px-3 text-sm" {...form.register("categoryId")}>
              <option value="">Selecione</option>
              {props.categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Direção</label>
            <select className="h-10 rounded-xl border bg-background px-3 text-sm" {...form.register("direction")}>
              <option value="expense">Despesa</option>
              <option value="income">Receita</option>
              <option value="adjustment">Ajuste</option>
            </select>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Status</label>
            <select className="h-10 rounded-xl border bg-background px-3 text-sm" {...form.register("status")}>
              <option value="posted">Lançado</option>
              <option value="scheduled">Agendado</option>
              <option value="void">Cancelado</option>
            </select>
          </div>
          <div className="grid gap-2 md:col-span-2">
            <label className="text-sm font-medium">Data</label>
            <Input type="date" {...form.register("occurredOn")} />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar lançamento"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
