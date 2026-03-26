import { db } from "@/db/client";
import { cryptoPositions, reserves, stockPositions } from "@/db/schema";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { saveNetWorthAction } from "@/features/net-worth/actions";
import { formatCurrencyFromCents } from "@/lib/currency";
import { getCurrentNetWorthSummary, listNetWorthSummaries } from "@/services/net-worth.service";

export default function NetWorthPage() {
  const summary = getCurrentNetWorthSummary();
  const history = listNetWorthSummaries();
  const reserveItems = db.select().from(reserves).all();
  const stockItems = db.select().from(stockPositions).all();
  const cryptoItems = db.select().from(cryptoPositions).all();

  return (
    <>
      <PageHeader
        title="PatrimÃ´nio"
        description="Resumo patrimonial com reservas, investimentos, dÃ­vidas e snapshots manuais, conciliado com os dados importados da planilha." 
      />
      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Resumo atual</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between"><span>Liquidez atual</span><strong>{formatCurrencyFromCents(summary.realizedLiquidCents)}</strong></div>
            <div className="flex items-center justify-between"><span>Reservas</span><strong>{formatCurrencyFromCents(summary.manualReservesCents)}</strong></div>
            <div className="flex items-center justify-between"><span>Investimentos</span><strong>{formatCurrencyFromCents(summary.manualInvestmentsCents)}</strong></div>
            <div className="flex items-center justify-between"><span>DÃ­vidas</span><strong>{formatCurrencyFromCents(summary.manualDebtsCents)}</strong></div>
            <div className="rounded-2xl border border-[var(--border)] p-3 text-xs text-[var(--muted-foreground)]">
              {summary.month ? `Ãšltimo snapshot consolidado: ${summary.month}` : "Nenhum snapshot manual salvo ainda."}
            </div>
            <div className="mt-1 rounded-2xl border border-[var(--border)] p-4 text-lg font-semibold">PatrimÃ´nio total: {formatCurrencyFromCents(summary.totalNetWorthCents)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Novo snapshot manual</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={saveNetWorthAction} className="grid gap-4 md:grid-cols-2">
              <Input name="month" type="month" defaultValue={new Date().toISOString().slice(0, 7)} />
              <Input name="reserves" placeholder="Reservas" defaultValue="0,00" />
              <Input name="investments" placeholder="Investimentos" defaultValue="0,00" />
              <Input name="debts" placeholder="DÃ­vidas" defaultValue="0,00" />
              <div className="md:col-span-2"><Input name="notes" placeholder="ObservaÃ§Ãµes" /></div>
              <div className="md:col-span-2 flex justify-end"><Button type="submit">Salvar snapshot</Button></div>
            </form>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Reservas importadas</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {reserveItems.length === 0 ? <p className="text-sm text-[var(--muted-foreground)]">Nenhuma reserva importada.</p> : reserveItems.map((item) => (
              <div key={item.id} className="rounded-2xl border border-[var(--border)] p-3 text-sm">
                <div className="flex items-center justify-between"><strong>{item.name}</strong><span>{formatCurrencyFromCents(item.currentValueCents)}</span></div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>AÃ§Ãµes</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {stockItems.length === 0 ? <p className="text-sm text-[var(--muted-foreground)]">Nenhuma posiÃ§Ã£o em aÃ§Ãµes importada.</p> : stockItems.map((item) => (
              <div key={item.id} className="rounded-2xl border border-[var(--border)] p-3 text-sm">
                <div className="flex items-center justify-between"><strong>{item.ticker}</strong><span>{formatCurrencyFromCents(item.currentCents)}</span></div>
                <div className="text-xs text-[var(--muted-foreground)]">{item.fullName}</div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Cripto</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {cryptoItems.length === 0 ? <p className="text-sm text-[var(--muted-foreground)]">Nenhuma posiÃ§Ã£o cripto importada.</p> : cryptoItems.map((item) => (
              <div key={item.id} className="rounded-2xl border border-[var(--border)] p-3 text-sm">
                <div className="flex items-center justify-between"><strong>{item.name}</strong><span>{formatCurrencyFromCents(item.currentCents)}</span></div>
                <div className="text-xs text-[var(--muted-foreground)]">Quantidade: {item.quantity}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>HistÃ³rico manual</CardTitle>
        </CardHeader>
        <CardContent>
          {history.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-[var(--muted-foreground)]">
                    <th className="px-2 py-2">MÃªs</th>
                    <th className="px-2 py-2">Reservas</th>
                    <th className="px-2 py-2">Investimentos</th>
                    <th className="px-2 py-2">DÃ­vidas</th>
                    <th className="px-2 py-2">Fonte</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr key={item.id} className="border-t border-[var(--border)]">
                      <td className="px-2 py-3">{item.month}</td>
                      <td className="px-2 py-3">{formatCurrencyFromCents(item.reservesCents)}</td>
                      <td className="px-2 py-3">{formatCurrencyFromCents(item.investmentsCents)}</td>
                      <td className="px-2 py-3">{formatCurrencyFromCents(item.debtsCents)}</td>
                      <td className="px-2 py-3">{item.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState title="Nenhum snapshot manual" description="O resumo acima continua funcional com base importada e liquidez atual das contas." />
          )}
        </CardContent>
      </Card>
    </>
  );
}
