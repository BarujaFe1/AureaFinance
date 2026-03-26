import { ArrowDownRight, ArrowUpRight, Landmark, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";

const icons = {
  balance: Landmark,
  projected: ShieldCheck,
  income: ArrowUpRight,
  expense: ArrowDownRight
};

export function OverviewCards(props: {
  currentBalanceCents: number;
  projectedBalanceCents: number;
  monthIncomeCents: number;
  monthExpenseCents: number;
}) {
  const items = [
    { key: "balance", label: "Saldo atual", value: props.currentBalanceCents },
    { key: "projected", label: "Saldo projetado", value: props.projectedBalanceCents },
    { key: "income", label: "Receitas do mês", value: props.monthIncomeCents },
    { key: "expense", label: "Despesas do mês", value: props.monthExpenseCents }
  ] as const;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = icons[item.key];
        return (
          <Card key={item.key}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{item.label}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="financial-number text-2xl font-semibold tracking-tight">{formatCurrency(item.value)}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
