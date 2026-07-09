"use client";

import { useMemo, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { saveSheetMappingAction } from "@/features/import/actions";
import type { ImportSheetTarget } from "@/types/domain";

const TARGET_OPTIONS: { value: ImportSheetTarget; label: string }[] = [
  { value: "ignore", label: "Ignorar" },
  { value: "accounts", label: "Contas" },
  { value: "transactions", label: "Transações" },
  { value: "credit_cards", label: "Cartões" },
  { value: "card_bills", label: "Faturas" },
  { value: "net_worth", label: "Patrimônio" },
  { value: "investment_snapshots", label: "Snapshots de investimento" }
];

const FIELD_KEYS: Record<Exclude<ImportSheetTarget, "ignore">, string[]> = {
  accounts: ["name", "balance", "type", "institution", "includeInNetWorth"],
  transactions: ["description", "amount", "date", "account", "direction", "counterparty", "notes"],
  credit_cards: ["name", "brand", "network", "limitAmount", "closeDay", "dueDay", "settlementAccount"],
  card_bills: ["cardName", "billMonth", "dueOn", "closesOn", "totalAmount", "paidAmount"],
  net_worth: ["month", "reserves", "investments", "debts", "notes"],
  investment_snapshots: ["month", "reserves", "investments", "debts", "notes"]
};

const FIELD_LABELS: Record<string, string> = {
  name: "Nome",
  balance: "Saldo",
  type: "Tipo",
  institution: "Instituição",
  includeInNetWorth: "Incluir no patrimônio",
  description: "Descrição",
  amount: "Valor",
  date: "Data",
  account: "Conta",
  direction: "Direção",
  counterparty: "Contraparte",
  notes: "Notas",
  brand: "Bandeira",
  network: "Rede",
  limitAmount: "Limite",
  closeDay: "Dia de fechamento",
  dueDay: "Dia de vencimento",
  settlementAccount: "Conta pagadora",
  cardName: "Cartão",
  billMonth: "Mês da fatura",
  dueOn: "Vencimento",
  closesOn: "Fechamento",
  totalAmount: "Total",
  paidAmount: "Pago",
  month: "Mês",
  reserves: "Reservas",
  investments: "Investimentos",
  debts: "Dívidas"
};

export type SheetMappingEditorProps = {
  batchId: string;
  sheetName: string;
  headers: string[];
  targetEntity: ImportSheetTarget;
  columnMap: Record<string, string>;
};

export function SheetMappingEditor({ batchId, sheetName, headers, targetEntity, columnMap }: SheetMappingEditorProps) {
  const [target, setTarget] = useState<ImportSheetTarget>(targetEntity);
  const [map, setMap] = useState<Record<string, string>>(columnMap);
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const fields = useMemo(() => (target === "ignore" ? [] : FIELD_KEYS[target]), [target]);

  function onTargetChange(next: ImportSheetTarget) {
    setTarget(next);
    setSaved(false);
    if (next === "ignore") {
      setMap({});
      return;
    }
    const nextMap: Record<string, string> = {};
    for (const key of FIELD_KEYS[next]) {
      nextMap[key] = map[key] ?? "";
    }
    setMap(nextMap);
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData();
    formData.set("batchId", batchId);
    formData.set("sheetName", sheetName);
    formData.set("targetEntity", target);
    formData.set("columnMapJson", JSON.stringify(map));
    startTransition(async () => {
      await saveSheetMappingAction(formData);
      setSaved(true);
    });
  }

  return (
    <form onSubmit={onSubmit} className="mt-3 space-y-3 rounded-2xl border border-dashed border-[var(--border)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm font-medium">Mapeamento · {sheetName}</div>
          <div className="text-xs text-[var(--muted-foreground)]">{headers.length} colunas detectadas</div>
        </div>
        <Select
          value={target}
          onChange={(e) => onTargetChange(e.target.value as ImportSheetTarget)}
          className="w-52"
        >
          {TARGET_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </Select>
      </div>

      {target !== "ignore" ? (
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {fields.map((field) => (
            <label key={field} className="grid gap-1 text-xs">
              <span className="text-[var(--muted-foreground)]">{FIELD_LABELS[field] ?? field}</span>
              <Select
                value={map[field] ?? ""}
                onChange={(e) => {
                  setSaved(false);
                  setMap((prev) => ({ ...prev, [field]: e.target.value }));
                }}
              >
                <option value="">— não mapear —</option>
                {headers.filter(Boolean).map((header) => (
                  <option key={header} value={header}>{header}</option>
                ))}
              </Select>
            </label>
          ))}
        </div>
      ) : (
        <p className="text-xs text-[var(--muted-foreground)]">Esta aba será ignorada no commit.</p>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending} className="h-8 px-3 text-xs">
          {pending ? "Salvando…" : "Salvar mapeamento"}
        </Button>
        {saved ? <span className="text-xs text-[var(--muted-foreground)]">Mapeamento salvo. Rode o dry-run antes do commit.</span> : null}
      </div>
    </form>
  );
}
