import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { archiveAssetAction, deleteAssetAction, deleteAssetSnapshotAction, restoreAssetAction, saveDailyNetWorthSnapshotAction, saveNetWorthAction, upsertAssetPositionAction } from "@/features/net-worth/actions";
import { formatCurrencyFromCents } from "@/lib/currency";
import { formatAssetTypeLabel } from "@/lib/formatters";
import { todayIso } from "@/lib/dates";
import { getCurrentNetWorthSummary, getDailyNetWorthSnapshot, listAssetPositions, listAssetValueSnapshots, listNetWorthSummaries } from "@/services/net-worth.service";

function centsToInput(value: number) {
  return (value / 100).toFixed(2).replace(".", ",");
}

export default function NetWorthPage() {
  const summary = getCurrentNetWorthSummary();
  const history = listNetWorthSummaries();
  const allAssetPositions = listAssetPositions(true);
  const assetPositions = allAssetPositions.filter((asset) => !asset.isArchived);
  const archivedAssets = allAssetPositions.filter((asset) => asset.isArchived);
  const assetSnapshots = listAssetValueSnapshots(40);
  const today = todayIso();
  const todaysSnapshot = getDailyNetWorthSnapshot(today);

  return (
    <>
      <PageHeader
        title="Patrimônio"
        description="Resumo patrimonial com liquidez atual, reservas, investimentos, snapshots diários e atualização manual de ativos realmente editável."
        actions={<form action={saveDailyNetWorthSnapshotAction}><input type="hidden" name="snapshotDate" value={today} /><Button type="submit">Salvar snapshot do dia</Button></form>}
      />
      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <CardHeader><CardTitle>Resumo atual</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between"><span>Liquidez atual</span><strong>{formatCurrencyFromCents(summary.realizedLiquidCents)}</strong></div>
            <div className="flex items-center justify-between"><span>Reservas</span><strong>{formatCurrencyFromCents(summary.manualReservesCents)}</strong></div>
            <div className="flex items-center justify-between"><span>Investimentos</span><strong>{formatCurrencyFromCents(summary.manualInvestmentsCents)}</strong></div>
            <div className="flex items-center justify-between"><span>Dívidas</span><strong>{formatCurrencyFromCents(summary.manualDebtsCents)}</strong></div>
            <div className="rounded-2xl border border-[var(--border)] p-3 text-xs text-[var(--muted-foreground)]">{summary.month ? `Último snapshot consolidado: ${summary.month}` : "Nenhum snapshot consolidado salvo ainda."}</div>
            <div className="rounded-2xl border border-[var(--border)] p-3 text-xs text-[var(--muted-foreground)]">Snapshot operacional do dia: {todaysSnapshot ? "já salvo" : "ainda não registrado"}.</div>
            <div className="mt-1 rounded-2xl border border-[var(--border)] p-4 text-lg font-semibold">Patrimônio total: {formatCurrencyFromCents(summary.totalNetWorthCents)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Novo snapshot consolidado</CardTitle></CardHeader>
          <CardContent>
            <form action={saveNetWorthAction} className="grid gap-4 md:grid-cols-2">
              <Input name="month" type="month" defaultValue={new Date().toISOString().slice(0, 7)} />
              <Input name="reserves" placeholder="Reservas" defaultValue="0,00" />
              <Input name="investments" placeholder="Investimentos" defaultValue="0,00" />
              <Input name="debts" placeholder="Dívidas" defaultValue="0,00" />
              <div className="md:col-span-2"><Input name="notes" placeholder="Observações" /></div>
              <div className="md:col-span-2 flex justify-end"><Button type="submit">Salvar snapshot</Button></div>
            </form>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader><CardTitle>Ativos editáveis</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {assetPositions.length > 0 ? assetPositions.map((asset) => {
            const stockParts = asset.assetType === "stock" ? asset.label.split(" · ") : [asset.label, asset.fullName ?? asset.label];
            const label = asset.assetType === "stock" ? stockParts[0] : asset.label;
            const fullName = asset.assetType === "stock" ? (stockParts[1] ?? asset.fullName ?? label) : (asset.fullName ?? asset.label);
            return (
              <details key={`${asset.assetType}-${asset.assetId}`} className="rounded-2xl border border-[var(--border)] p-4 text-sm">
                <summary className="cursor-pointer font-medium">{asset.label} · {formatAssetTypeLabel(asset.assetType)}</summary>
                <form action={upsertAssetPositionAction} className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                  <input type="hidden" name="assetType" value={asset.assetType} />
                  <input type="hidden" name="assetId" value={asset.assetId} />
                  <label className="grid gap-2 text-sm"><span>{asset.assetType === "stock" ? "Ticker" : "Nome"}</span><Input name="label" defaultValue={label} /></label>
                  <label className="grid gap-2 text-sm"><span>Nome completo</span><Input name="fullName" defaultValue={fullName} /></label>
                  <label className="grid gap-2 text-sm"><span>Quantidade</span><Input name="quantity" defaultValue={String(asset.quantity)} placeholder="Quantidade" /></label>
                  <label className="grid gap-2 text-sm"><span>Valor investido</span><Input name="invested" defaultValue={centsToInput(asset.investedCents)} placeholder="Valor investido" /></label>
                  <label className="grid gap-2 text-sm"><span>Valor atual</span><Input name="currentValue" defaultValue={centsToInput(asset.currentValueCents)} placeholder="Valor atual" /></label>
                  <label className="grid gap-2 text-sm"><span>Data do snapshot</span><Input name="snapshotDate" type="date" defaultValue={today} /></label>
                  <label className="grid gap-2 text-sm xl:col-span-3"><span>Notas</span><Input name="notes" defaultValue="" placeholder="Contexto da correção" /></label>
                  <div className="xl:col-span-5 flex flex-wrap justify-end gap-2">
                    <Button type="submit">Salvar posição atual</Button>
                  </div>
                </form>
                <div className="mt-3 flex flex-wrap gap-2">
                  <form action={archiveAssetAction}><input type="hidden" name="assetType" value={asset.assetType} /><input type="hidden" name="assetId" value={asset.assetId} /><Button type="submit" className="h-8 px-3 text-xs">Arquivar</Button></form>
                  <form action={deleteAssetAction}><input type="hidden" name="assetType" value={asset.assetType} /><input type="hidden" name="assetId" value={asset.assetId} /><Button type="submit" className="h-8 px-3 text-xs">Excluir ativo</Button></form>
                </div>
              </details>
            );
          }) : <EmptyState title="Nenhum ativo ainda" description="Você pode importar sua base ou começar registrando manualmente reservas, ações e criptomoedas." />}
        </CardContent>
      </Card>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Nova reserva</CardTitle></CardHeader>
          <CardContent>
            <form action={upsertAssetPositionAction} className="grid gap-3 text-sm">
              <input type="hidden" name="assetType" value="reserve" />
              <Input name="label" placeholder="Ex.: Reserva de emergência" />
              <Input name="fullName" placeholder="Descrição" />
              <Input name="invested" placeholder="Valor investido" defaultValue="0,00" />
              <Input name="currentValue" placeholder="Valor atual" defaultValue="0,00" />
              <Input name="snapshotDate" type="date" defaultValue={today} />
              <Button type="submit">Criar reserva</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Nova posição em ações</CardTitle></CardHeader>
          <CardContent>
            <form action={upsertAssetPositionAction} className="grid gap-3 text-sm">
              <input type="hidden" name="assetType" value="stock" />
              <Input name="label" placeholder="Ticker (PETR4, IVVB11...)" />
              <Input name="fullName" placeholder="Nome completo" />
              <Input name="quantity" placeholder="Quantidade" defaultValue="0" />
              <Input name="invested" placeholder="Valor investido" defaultValue="0,00" />
              <Input name="currentValue" placeholder="Valor atual" defaultValue="0,00" />
              <Input name="snapshotDate" type="date" defaultValue={today} />
              <Button type="submit">Criar posição</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Nova posição em cripto</CardTitle></CardHeader>
          <CardContent>
            <form action={upsertAssetPositionAction} className="grid gap-3 text-sm">
              <input type="hidden" name="assetType" value="crypto" />
              <Input name="label" placeholder="Nome da cripto" />
              <Input name="fullName" placeholder="Símbolo ou descrição" />
              <Input name="quantity" placeholder="Quantidade" defaultValue="0" />
              <Input name="invested" placeholder="Valor investido" defaultValue="0,00" />
              <Input name="currentValue" placeholder="Valor atual" defaultValue="0,00" />
              <Input name="snapshotDate" type="date" defaultValue={today} />
              <Button type="submit">Criar posição</Button>
            </form>
          </CardContent>
        </Card>
      </section>

      {archivedAssets.length > 0 ? (
        <Card>
          <CardHeader><CardTitle>Ativos arquivados</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {archivedAssets.map((asset) => (
              <div key={`${asset.assetType}-${asset.assetId}`} className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] p-3 text-sm">
                <div>
                  <div className="font-medium">{asset.label}</div>
                  <div className="text-xs text-[var(--muted-foreground)]">{formatAssetTypeLabel(asset.assetType)}</div>
                </div>
                <form action={restoreAssetAction}><input type="hidden" name="assetType" value={asset.assetType} /><input type="hidden" name="assetId" value={asset.assetId} /><Button type="submit" className="h-8 px-3 text-xs">Restaurar</Button></form>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader><CardTitle>Histórico consolidado</CardTitle></CardHeader>
          <CardContent>
            {history.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-[var(--muted-foreground)]">
                      <th className="px-2 py-2">Mês</th>
                      <th className="px-2 py-2">Reservas</th>
                      <th className="px-2 py-2">Investimentos</th>
                      <th className="px-2 py-2">Dívidas</th>
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
            ) : <EmptyState title="Nenhum snapshot salvo" description="O resumo acima continua funcional com base importada e liquidez atual das contas." />}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Histórico recente de ativos</CardTitle></CardHeader>
          <CardContent>
            {assetSnapshots.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Ativo</th>
                    <th>Quantidade</th>
                    <th>Valor</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {assetSnapshots.map((snapshot) => (
                    <tr key={snapshot.id}>
                      <td>{snapshot.snapshotDate}</td>
                      <td>{snapshot.assetLabel}</td>
                      <td>{snapshot.quantity ?? "—"}</td>
                      <td>{formatCurrencyFromCents(snapshot.valueCents)}</td>
                      <td><form action={deleteAssetSnapshotAction}><input type="hidden" name="snapshotId" value={snapshot.id} /><Button type="submit" className="h-8 px-3 text-xs">Excluir</Button></form></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <EmptyState title="Sem snapshots de ativos" description="Ao atualizar manualmente reservas, ações ou cripto, o histórico diário passa a aparecer aqui." />}
          </CardContent>
        </Card>
      </section>
    </>
  );
}
