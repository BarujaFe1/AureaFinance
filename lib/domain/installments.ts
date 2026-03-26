export type GeneratedInstallment = {
  installmentNumber: number;
  totalInstallments: number;
  amountCents: number;
  billMonth: string;
  dueOn: string;
};

function splitEvenly(totalCents: number, count: number) {
  const base = Math.floor(totalCents / count);
  const remainder = totalCents % count;
  return Array.from({ length: count }, (_, index) => base + (index < remainder ? 1 : 0));
}

function addMonths(date: Date, amount: number) {
  const copy = new Date(date); copy.setMonth(copy.getMonth() + amount); return copy;
}
function setDay(date: Date, day: number) {
  const copy = new Date(date); copy.setDate(day); return copy;
}
function toIsoDate(date: Date) { return date.toISOString().slice(0, 10); }
function toIsoMonth(date: Date) { return date.toISOString().slice(0, 7); }

function resolveBillAnchor(purchaseDate: Date, closingDay: number) {
  const afterClosing = purchaseDate.getDate() > closingDay;
  return addMonths(new Date(purchaseDate.getFullYear(), purchaseDate.getMonth(), 1), afterClosing ? 1 : 0);
}
function resolveDueDate(monthAnchor: Date, dueDay: number) {
  return setDay(addMonths(monthAnchor, 1), dueDay);
}

export function generateCardInstallments(params: {
  purchaseDate: Date; totalCents: number; installmentCount: number; closingDay: number; dueDay: number;
}): GeneratedInstallment[] {
  const { purchaseDate, totalCents, installmentCount, closingDay, dueDay } = params;
  const amounts = splitEvenly(totalCents, installmentCount);
  const firstBill = resolveBillAnchor(purchaseDate, closingDay);
  return amounts.map((amountCents, index) => {
    const billAnchor = addMonths(firstBill, index);
    return {
      installmentNumber: index + 1,
      totalInstallments: installmentCount,
      amountCents,
      billMonth: toIsoMonth(billAnchor),
      dueOn: toIsoDate(resolveDueDate(billAnchor, dueDay))
    };
  });
}
