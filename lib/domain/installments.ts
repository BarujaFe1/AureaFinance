import { addMonthsIso, isoDate } from "../dates";
import { generateInstallments } from "../finance";

export type GeneratedInstallment = {
  installmentNumber: number;
  totalInstallments: number;
  amountCents: number;
  billMonth: string;
  dueOn: string;
};

export function generateCardInstallments(params: {
  purchaseDate: Date; totalCents: number; installmentCount: number; closingDay: number; dueDay: number;
}): GeneratedInstallment[] {
  const purchaseDate = isoDate(params.purchaseDate);
  const plan = generateInstallments({
    purchaseDate,
    totalAmountCents: params.totalCents,
    installmentCount: params.installmentCount,
    closeDay: params.closingDay,
    dueDay: params.dueDay
  });

  return plan.map((item) => ({
    installmentNumber: item.installmentNumber,
    totalInstallments: params.installmentCount,
    amountCents: item.amountCents,
    billMonth: item.billMonth,
    dueOn: item.billDueOn
  }));
}
