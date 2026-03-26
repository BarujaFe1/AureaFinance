import { StatCard } from "@/components/stat-card";
import { formatCurrencyFromCents } from "@/lib/currency";

export function FutureSummaryCards(props: {
  initialBalanceCents: number;
  endingBalanceCents: number;
  minBalanceCents: number;
  totalIncomeCents: number;
  totalExpensesCents: number;
  firstNegativeDate: string | null;
  minBalanceDate: string;
}) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard title="Saldo inicial" value={formatCurrencyFromCents(props.initialBalanceCents)} description="Base consolidada das contas no inÃ­cio da projeÃ§Ã£o." />
      <StatCard title="Saldo final projetado" value={formatCurrencyFromCents(props.endingBalanceCents)} description="Saldo esperado ao fim do horizonte selecionado." />
      <StatCard title="Menor saldo" value={formatCurrencyFromCents(props.minBalanceCents)} description={`Pior ponto estimado em ${props.minBalanceDate}.`} />
      <StatCard title="Alerta crÃ­tico" value={props.firstNegativeDate ? props.firstNegativeDate : "Sem saldo negativo"} description={`Entradas ${formatCurrencyFromCents(props.totalIncomeCents)} Â· saÃ­das ${formatCurrencyFromCents(props.totalExpensesCents)}.`} />
    </section>
  );
}
