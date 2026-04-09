import { format } from "date-fns";
import { formatCurrency } from "@/lib/money";

export function formatShortDate(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;
  return format(date, "dd/MM/yyyy");
}

export function formatMonthRef(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;
  return format(date, "MM/yyyy");
}

const transactionDirectionLabels: Record<string, string> = {
  income: "Receita",
  expense: "Despesa",
  transfer_in: "Transferência recebida",
  transfer_out: "Transferência enviada",
  bill_payment: "Pagamento de fatura",
  adjustment: "Ajuste"
};

const statusLabels: Record<string, string> = {
  posted: "Realizado",
  scheduled: "Agendado",
  paid: "Paga",
  open: "Aberta",
  void: "Cancelado"
};

const accountTypeLabels: Record<string, string> = {
  checking: "Conta corrente",
  savings: "Poupança",
  cash: "Dinheiro",
  investment: "Investimento",
  reserve: "Reserva",
  credit_card_settlement: "Conta pagadora"
};

const billEntryTypeLabels: Record<string, string> = {
  installment: "Parcela",
  charge: "Cobrança",
  adjustment: "Ajuste"
};

const assetTypeLabels: Record<string, string> = {
  reserve: "Reserva",
  stock: "Ação / ETF",
  crypto: "Cripto"
};

const recurringFrequencyLabels: Record<string, string> = {
  weekly: "Semanal",
  monthly: "Mensal",
  yearly: "Anual"
};

const categoryKindLabels: Record<string, string> = {
  expense: "Despesa",
  income: "Receita",
  neutral: "Neutra"
};

export function formatTransactionDirectionLabel(value: string) {
  return transactionDirectionLabels[value] ?? value;
}

export function formatStatusLabel(value: string) {
  return statusLabels[value] ?? value;
}

export function formatAccountTypeLabel(value: string) {
  return accountTypeLabels[value] ?? value;
}

export function formatBillEntryTypeLabel(value: string) {
  return billEntryTypeLabels[value] ?? value;
}

export function formatAssetTypeLabel(value: string) {
  return assetTypeLabels[value] ?? value;
}

export function formatRecurringFrequencyLabel(value: string) {
  return recurringFrequencyLabels[value] ?? value;
}

export function formatCategoryKindLabel(value: string) {
  return categoryKindLabels[value] ?? value;
}

export { formatCurrency };
