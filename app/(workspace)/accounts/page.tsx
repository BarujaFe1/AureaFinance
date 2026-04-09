import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { AccountForm } from "@/features/accounts/account-form";
import { archiveAccountAction, deleteAccountSnapshotAction, restoreAccountAction, saveAccountBalanceSnapshotAction, updateAccountAction } from "@/features/accounts/actions";
import { formatCurrencyFromCents } from "@/lib/currency";
import { formatAccountTypeLabel, formatShortDate } from "@/lib/formatters";
import { listAccountBalanceSnapshots, listAccountsWithBalances } from "@/services/accounts.service";

function centsToInput(value: number) {
  return (value / 100).toFixed(2).replace(".", ",");
}

export default function AccountsPage() {
  const accounts = listAccountsWithBalances();
  const archivedAccounts = listAccountsWithBalances(true).filter((account) => account.isArchived || account.isArchivedEntity);
  const totals = accounts.reduce((acc, account) => ({
    current: acc.current + account.currentBalanceCents,
    projected: acc.projected + account.projectedBalanceCents,
    reconciled: acc.reconciled + account.reconciledBalanceCents
  }), { current: 0, projected: 0, reconciled: 0 });
  const snapshots = listAccountBalanceSnapshots(undefined, 30);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <>
      <PageHeader
        title="Contas"
        description="Contas correntes, reservas e contas pagadoras com saldo calculado, saldo conferido, edição operacional e histórico de reconciliação."
        actions={<a href="/daily" className="inline-flex h-10 items-center justify-center rounded-2xl bg-[var(--primary)] px-4 text-sm font-medium text-[var(--primary-foreground)]">Ir para conferência diária</a>}
      />
      <AccountForm />

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Resumo por conta</CardTitle>
          </CardHeader>
          <CardContent>
            {accounts.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Conta</th>
                    <th>Instituição</th>
                    <th>Tipo</th>
                    <th>Saldo calculado</th>
                    <th>Saldo conferido</th>
                    <th>Diferença</th>
                    <th>Saldo projetado</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((account) => (
                    <tr key={account.id}>
                      <td>
                        <div>{account.name}</div>
                        {account.latestSnapshot ? <div className="text-xs text-[var(--muted-foreground)]">Última conferência: {formatShortDate(account.latestSnapshot.snapshotDate)}</div> : null}
                      </td>
                      <td>{account.institution || "—"}</td>
                      <td>{formatAccountTypeLabel(account.type)}</td>
                      <td>{formatCurrencyFromCents(account.currentBalanceCents)}</td>
                      <td>{formatCurrencyFromCents(account.reconciledBalanceCents)}</td>
                      <td>{formatCurrencyFromCents(account.reconciliationDiffCents)}</td>
                      <td>{formatCurrencyFromCents(account.projectedBalanceCents)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-[var(--border)] font-medium">
                    <td colSpan={3}>Totais</td>
                    <td>{formatCurrencyFromCents(totals.current)}</td>
                    <td>{formatCurrencyFromCents(totals.reconciled)}</td>
                    <td>{formatCurrencyFromCents(totals.reconciled - totals.current)}</td>
                    <td>{formatCurrencyFromCents(totals.projected)}</td>
                  </tr>
                </tfoot>
              </table>
            ) : (
              <EmptyState title="Nenhuma conta cadastrada" description="Crie a primeira conta ou importe sua base. Os saldos serão calculados a partir do saldo inicial, transações, recorrências e faturas vinculadas." />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conferir saldo real</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {accounts.map((account) => (
              <form key={account.id} action={saveAccountBalanceSnapshotAction} className="grid gap-2 rounded-2xl border border-[var(--border)] p-3 text-sm">
                <input type="hidden" name="accountId" value={account.id} />
                <input type="hidden" name="source" value="manual" />
                <div className="flex items-center justify-between gap-3">
                  <strong>{account.name}</strong>
                  <span className="text-xs text-[var(--muted-foreground)]">Calculado: {formatCurrencyFromCents(account.currentBalanceCents)}</span>
                </div>
                <div className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
                  <Input name="snapshotDate" type="date" defaultValue={today} />
                  <Input name="balance" defaultValue={centsToInput(account.latestSnapshot?.balanceCents ?? account.currentBalanceCents)} placeholder="Saldo real" />
                  <Button type="submit" className="h-10">Salvar</Button>
                </div>
                <div className="text-xs text-[var(--muted-foreground)]">Diferença atual: {formatCurrencyFromCents(account.reconciliationDiffCents)}</div>
              </form>
            ))}
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Editar contas e instituições</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {accounts.map((account) => (
            <details key={account.id} className="rounded-2xl border border-[var(--border)] p-4">
              <summary className="cursor-pointer text-sm font-medium">{account.name} · {account.institution || "Sem instituição"}</summary>
              <form action={updateAccountAction} className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <input type="hidden" name="accountId" value={account.id} />
                <label className="grid gap-2 text-sm"><span>Nome</span><Input name="name" defaultValue={account.name} /></label>
                <label className="grid gap-2 text-sm"><span>Instituição</span><Input name="institution" defaultValue={account.institution ?? ""} /></label>
                <label className="grid gap-2 text-sm"><span>Tipo</span><Select name="type" defaultValue={account.type}><option value="checking">Conta corrente</option><option value="savings">Poupança</option><option value="cash">Dinheiro</option><option value="investment">Investimento</option><option value="reserve">Reserva</option><option value="credit_card_settlement">Conta pagadora</option></Select></label>
                <label className="grid gap-2 text-sm"><span>Saldo inicial</span><Input name="openingBalance" defaultValue={centsToInput(account.openingBalanceCents)} /></label>
                <label className="grid gap-2 text-sm"><span>Cor</span><Input name="color" type="color" defaultValue={account.color ?? "#5b7cfa"} /></label>
                <label className="grid gap-2 text-sm md:col-span-2"><span>Notas</span><Input name="notes" defaultValue={account.notes ?? ""} /></label>
                <label className="flex items-center gap-2 text-sm"><input name="includeInNetWorth" type="checkbox" defaultChecked={account.includeInNetWorth} /> Incluir no patrimônio</label>
                <div className="xl:col-span-4 flex flex-wrap justify-end gap-2">
                  <Button type="submit">Salvar conta</Button>
                </div>
              </form>
              <div className="mt-3 flex flex-wrap gap-2">
                <form action={archiveAccountAction}>
                  <input type="hidden" name="accountId" value={account.id} />
                  <input type="hidden" name="reason" value="Arquivada pela UI" />
                  <Button type="submit" className="h-9 px-3 text-xs">Arquivar</Button>
                </form>
              </div>
            </details>
          ))}
          {archivedAccounts.length > 0 ? (
            <details className="rounded-2xl border border-[var(--border)] p-4">
              <summary className="cursor-pointer text-sm font-medium">Contas arquivadas ({archivedAccounts.length})</summary>
              <div className="mt-4 space-y-2">
                {archivedAccounts.map((account) => (
                  <div key={account.id} className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] p-3 text-sm">
                    <div>
                      <div className="font-medium">{account.name}</div>
                      <div className="text-xs text-[var(--muted-foreground)]">{account.institution || "Sem instituição"}</div>
                    </div>
                    <form action={restoreAccountAction}><input type="hidden" name="accountId" value={account.id} /><Button type="submit" className="h-8 px-3 text-xs">Restaurar</Button></form>
                  </div>
                ))}
              </div>
            </details>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Histórico recente de conferências</CardTitle>
        </CardHeader>
        <CardContent>
          {snapshots.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Conta</th>
                  <th>Saldo salvo</th>
                  <th>Origem</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {snapshots.map((snapshot) => {
                  const account = [...accounts, ...archivedAccounts].find((row) => row.id === snapshot.accountId);
                  return (
                    <tr key={snapshot.id}>
                      <td>{snapshot.snapshotDate}</td>
                      <td>{account?.name ?? snapshot.accountId}</td>
                      <td>{formatCurrencyFromCents(snapshot.balanceCents)}</td>
                      <td>{snapshot.source}</td>
                      <td>
                        <form action={deleteAccountSnapshotAction}><input type="hidden" name="snapshotId" value={snapshot.id} /><Button type="submit" className="h-8 px-3 text-xs">Excluir</Button></form>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <EmptyState title="Sem conferências ainda" description="Salve o saldo real de cada conta para que o dashboard destaque divergências e a operação diária fique rastreável." />
          )}
        </CardContent>
      </Card>
    </>
  );
}
