"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { ConfirmDialog } from "@/components/confirm-dialog";

interface BatchActionsProps {
  selectedCount: number;
  categories: { id: string; name: string }[];
  accounts: { id: string; name: string }[];
  onCategorize: (categoryId: string) => void;
  onChangeStatus: (status: string) => void;
  onChangeAccount: (accountId: string) => void;
  onDelete: () => void;
}

export function BatchActions({ selectedCount, categories, accounts, onCategorize, onChangeStatus, onChangeAccount, onDelete }: BatchActionsProps) {
  const [open, setOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ message: string; handler: () => void } | null>(null);

  const confirmThen = useCallback((message: string, handler: () => void) => {
    setPendingAction({ message, handler });
    setOpen(true);
  }, []);

  const handleConfirm = useCallback(() => {
    pendingAction?.handler();
    setPendingAction(null);
    setOpen(false);
  }, [pendingAction]);

  if (selectedCount === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--secondary)] p-3">
      <span className="text-xs font-medium">{selectedCount} selecionada(s)</span>

      <Select
        defaultValue=""
        onChange={(e) => {
          const val = e.target.value;
          if (!val) return;
          confirmThen(`Categorizar ${selectedCount} transações?`, () => { onCategorize(val); });
          e.target.value = "";
        }}
        className="w-40"
      >
        <option value="">Categorizar...</option>
        {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
      </Select>

      <Select
        defaultValue=""
        onChange={(e) => {
          const val = e.target.value;
          if (!val) return;
          const labels: Record<string, string> = { posted: "Realizado", scheduled: "Agendado", void: "Cancelado" };
          confirmThen(`Alterar status de ${selectedCount} transações para "${labels[val] ?? val}"?`, () => { onChangeStatus(val); });
          e.target.value = "";
        }}
        className="w-36"
      >
        <option value="">Status...</option>
        <option value="posted">Realizado</option>
        <option value="scheduled">Agendado</option>
        <option value="void">Cancelado</option>
      </Select>

      <Select
        defaultValue=""
        onChange={(e) => {
          const val = e.target.value;
          if (!val) return;
          confirmThen(`Mover ${selectedCount} transações para "${accounts.find((a) => a.id === val)?.name}"?`, () => { onChangeAccount(val); });
          e.target.value = "";
        }}
        className="w-40"
      >
        <option value="">Mover conta...</option>
        {accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
      </Select>

      <Button className="h-8 px-3 text-xs" onClick={() => confirmThen(`Arquivar ${selectedCount} transações? Elas saem dos saldos e podem ser restauradas.`, () => { onDelete(); })}>
        Arquivar
      </Button>

      <ConfirmDialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setPendingAction(null);
        }}
        onConfirm={handleConfirm}
        title="Confirmar ação em lote"
        message={pendingAction?.message ?? ""}
        confirmLabel="Confirmar"
      />
    </div>
  );
}
