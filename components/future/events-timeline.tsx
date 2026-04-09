import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrencyFromCents } from "@/lib/currency";
import type { CashflowDay } from "@/services/cashflow.service";

function formatEventTypeLabel(value: string) {
  return ({
    fatura_cartao: "Fatura de cartão",
    parcela_cartao: "Parcela do cartão",
    recorrencia_despesa: "Recorrência de despesa",
    recorrencia_receita: "Recorrência de receita",
    manual: "Manual"
  } as Record<string, string>)[value] ?? value;
}

export function FutureEventsTimeline({ days }: { days: CashflowDay[] }) {
  const visibleDays = days.filter((day) => day.events.length > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Timeline do período</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {visibleDays.length === 0 ? <p className="text-sm text-[var(--muted-foreground)]">Nenhum evento projetado no horizonte selecionado.</p> : null}
        {visibleDays.map((day) => (
          <div key={day.date} className="rounded-2xl border border-[var(--border)] p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="font-medium">{day.date}</div>
                <div className="text-xs text-[var(--muted-foreground)]">Saldo ao final do dia: {formatCurrencyFromCents(day.balance_cents)}</div>
              </div>
              <Badge variant={day.is_negative ? "destructive" : "secondary"}>{day.is_negative ? "Saldo negativo" : "Saldo saudável"}</Badge>
            </div>
            <div className="space-y-2">
              {day.events.map((event, index) => (
                <div key={`${day.date}-${index}`} className="rounded-xl bg-[var(--secondary)] p-3 text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <strong>{event.description}</strong>
                    <span>{formatCurrencyFromCents(event.amount_cents)}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-2 text-xs text-[var(--muted-foreground)]">
                    <span>{formatEventTypeLabel(event.type)}</span>
                    <span>Conta: {event.account_name}</span>
                    {event.card_name ? <span>Cartão: {event.card_name}</span> : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
