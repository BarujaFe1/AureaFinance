import { listBills } from "@/services/cards.service";
import { listRecurringRules } from "@/services/recurring.service";
import { getDailyNetWorthSnapshot } from "@/services/net-worth.service";

export function listDueTodayChecklist(date: string) {
  const recurring = listRecurringRules()
    .flatMap((rule) => rule.occurrences.map((occurrence) => ({
      id: occurrence.id,
      title: rule.title,
      kind: "recorrência",
      date: occurrence.dueOn,
      amountCents: occurrence.amountCents,
      status: occurrence.status
    })))
    .filter((item) => item.status === "scheduled" && item.date === date);

  const bills = listBills()
    .filter((bill) => bill.status !== "paid" && bill.dueOn === date)
    .map((bill) => ({
      id: bill.id,
      title: `Fatura ${bill.billMonth}`,
      kind: "fatura",
      date: bill.dueOn,
      amountCents: Math.max(bill.totalAmountCents - bill.paidAmountCents, 0),
      status: bill.status
    }));

  return [...recurring, ...bills].sort((a, b) => a.title.localeCompare(b.title));
}

export function listDailyNetWorthSnapshot(date: string) {
  return getDailyNetWorthSnapshot(date);
}
