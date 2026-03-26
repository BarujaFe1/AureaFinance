"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAccountAction } from "@/features/accounts/actions";
import { accountCreateSchema, type AccountCreateInput } from "@/lib/validation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function AccountForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const form = useForm<AccountCreateInput>({
    resolver: zodResolver(accountCreateSchema),
    defaultValues: { name: "", type: "checking", institution: "", openingBalance: "0,00", color: "#5b7cfa", includeInNetWorth: true, notes: "" }
  });
  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      await createAccountAction(values);
      form.reset();
      router.refresh();
    });
  });
  return (
    <Card>
      <CardHeader><CardTitle>Nova conta</CardTitle></CardHeader>
      <CardContent>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
          <div className="space-y-2 md:col-span-2"><Label>Nome</Label><Input {...form.register("name")} placeholder="Banco Principal" /></div>
          <div className="space-y-2"><Label>Tipo</Label><Select {...form.register("type")}><option value="checking">Conta corrente</option><option value="savings">Poupança</option><option value="cash">Carteira</option><option value="investment">Investimento</option><option value="reserve">Reserva</option><option value="credit_card_settlement">Conta pagadora de fatura</option></Select></div>
          <div className="space-y-2"><Label>Instituição</Label><Input {...form.register("institution")} placeholder="Banco do Brasil" /></div>
          <div className="space-y-2"><Label>Saldo inicial</Label><Input {...form.register("openingBalance")} placeholder="0,00" /></div>
          <div className="space-y-2"><Label>Cor</Label><Input type="color" {...form.register("color")} /></div>
          <div className="space-y-2 md:col-span-2"><Label>Notas</Label><Input {...form.register("notes")} placeholder="Observações úteis" /></div>
          <div className="md:col-span-2 flex justify-end"><Button type="submit" disabled={pending}>{pending ? "Salvando..." : "Criar conta"}</Button></div>
        </form>
      </CardContent>
    </Card>
  );
}
