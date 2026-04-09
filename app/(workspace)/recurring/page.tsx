import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  archiveRecurringRuleAction,
  createRecurringRuleAction,
  deleteRecurringRuleAction,
  duplicateRecurringRuleAction,
  materializeAllRulesAction,
  pauseRecurringRuleAction,
  reactivateRecurringRuleAction,
  restoreRecurringRuleAction,
  settleOccurrenceAction,
  skipRecurringOccurrenceAction,
  updateRecurringOccurrenceAction,
  updateRecurringRuleSeriesAction
} from "@/features/recurring/actions";
import { formatCurrencyFromCents } from "@/lib/currency";
import { todayIso } from "@/lib/dates";
import { formatRecurringFrequencyLabel, formatStatusLabel, formatTransactionDirectionLabel } from "@/lib/formatters";
import { listAccounts } from "@/services/accounts.service";
import { listCategories } from "@/services/categories.service";
import { listRecurringRules } from "@/services/recurring.service";

function centsToInput(value: number) {
  return (value / 100).toFixed(2).replace(".", ",");
}

export default function RecurringPage() {
  const accounts = listAccounts();
  const categories = listCategories();
  const allRules = listRecurringRules(true);
  const rules = allRules.filter((rule) => !rule.isArchivedEntity);
  const archivedRules = allRules.filter((rule) => rule.isArchivedEntity);
  const today = todayIso();

  return (
    <>
      <PageHeader
        title="Recorrências e contas fixas"
        description="Regras geram ocorrências futuras controladas. Agora com pausa, reativação, duplicação, edição por ocorrência e edição desta e futuras."
        actions={<form action={materializeAllRulesAction}><Button type="submit">Gerar próximas ocorrências</Button></form>}
      />

      <Card>
        <CardHeader><CardTitle>Nova regra</CardTitle></CardHeader>
        <CardContent>
          <form action={createRecurringRuleAction} className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <label className="grid gap-2 text-sm"><span>Título</span><Input name="title" placeholder="Aluguel, internet, mesada..." /></label>
            <label className="grid gap-2 text-sm"><span>Conta</span><Select name="accountId"><option value="">Selecione a conta</option>{accounts.map((account) => <option key={account.id} value={account.id}>{account.name}</option>)}</Select></label>
            <label className="grid gap-2 text-sm"><span>Valor</span><Input name="amount" defaultValue="0,00" /></label>
            <label className="grid gap-2 text-sm"><span>Tipo</span><Select name="direction" defaultValue="expense"><option value="expense">Despesa</option><option value="income">Receita</option></Select></label>
            <label className="grid gap-2 text-sm"><span>Frequência</span><Select name="frequency" defaultValue="monthly"><option value="monthly">Mensal</option><option value="weekly">Semanal</option><option value="yearly">Anual</option></Select></label>
            <label className="grid gap-2 text-sm"><span>Categoria</span><Select name="categoryId" defaultValue=""><option value="">Sem categoria</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</Select></label>
            <label className="grid gap-2 text-sm"><span>Início</span><Input name="startsOn" type="date" defaultValue={today} /></label>
            <label className="grid gap-2 text-sm"><span>Próxima execução</span><Input name="nextRunOn" type="date" defaultValue={today} /></label>
            <label className="grid gap-2 text-sm xl:col-span-3"><span>Observações</span><Input name="notes" placeholder="Ex.: cobrança automática, salário, conta fixa" /></label>
            <div className="xl:col-span-3 flex justify-end"><Button type="submit">Criar regra</Button></div>
          </form>
        </CardContent>
      </Card>

      {rules.length > 0 ? (
        <div className="grid gap-4">
          {rules.map((rule) => (
            <Card key={rule.id}>
              <CardHeader>
                <CardTitle>{rule.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-4 text-sm text-[var(--muted-foreground)]">
                  <span>{formatRecurringFrequencyLabel(rule.frequency)}</span>
                  <span>Próxima geração em {rule.nextRunOn}</span>
                  <span>{formatCurrencyFromCents(rule.amountCents)}</span>
                  <span>{rule.isActive ? "Ativa" : "Pausada"}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {rule.isActive ? <form action={pauseRecurringRuleAction}><input type="hidden" name="ruleId" value={rule.id} /><Button type="submit" className="h-8 px-3 text-xs">Pausar</Button></form> : <form action={reactivateRecurringRuleAction}><input type="hidden" name="ruleId" value={rule.id} /><Button type="submit" className="h-8 px-3 text-xs">Reativar</Button></form>}
                  <form action={duplicateRecurringRuleAction}><input type="hidden" name="ruleId" value={rule.id} /><Button type="submit" className="h-8 px-3 text-xs">Duplicar</Button></form>
                  <form action={archiveRecurringRuleAction}><input type="hidden" name="ruleId" value={rule.id} /><Button type="submit" className="h-8 px-3 text-xs">Arquivar</Button></form>
                </div>

                <details>
                  <summary className="cursor-pointer text-sm font-medium">Editar regra / esta e futuras</summary>
                  <form action={updateRecurringRuleSeriesAction} className="mt-4 grid gap-3 md:grid-cols-3">
                    <input type="hidden" name="ruleId" value={rule.id} />
                    <label className="grid gap-2 text-sm"><span>Título</span><Input name="title" defaultValue={rule.title} /></label>
                    <label className="grid gap-2 text-sm"><span>Conta</span><Select name="accountId" defaultValue={rule.accountId}>{accounts.map((account) => <option key={account.id} value={account.id}>{account.name}</option>)}</Select></label>
                    <label className="grid gap-2 text-sm"><span>Valor</span><Input name="amount" defaultValue={centsToInput(rule.amountCents)} /></label>
                    <label className="grid gap-2 text-sm"><span>Tipo</span><Select name="direction" defaultValue={rule.direction}><option value="expense">Despesa</option><option value="income">Receita</option></Select></label>
                    <label className="grid gap-2 text-sm"><span>Frequência</span><Select name="frequency" defaultValue={rule.frequency}><option value="monthly">Mensal</option><option value="weekly">Semanal</option><option value="yearly">Anual</option></Select></label>
                    <label className="grid gap-2 text-sm"><span>Categoria</span><Select name="categoryId" defaultValue={rule.categoryId ?? ""}><option value="">Sem categoria</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</Select></label>
                    <label className="grid gap-2 text-sm"><span>Início</span><Input name="startsOn" type="date" defaultValue={rule.startsOn} /></label>
                    <label className="grid gap-2 text-sm"><span>Próxima execução</span><Input name="nextRunOn" type="date" defaultValue={rule.nextRunOn} /></label>
                    <label className="grid gap-2 text-sm"><span>Escopo</span><Select name="scope" defaultValue="future"><option value="future">Esta e futuras</option><option value="entire">Regra inteira</option></Select></label>
                    <label className="grid gap-2 text-sm md:col-span-2"><span>Efetiva a partir de</span><Input name="effectiveFrom" type="date" defaultValue={rule.nextRunOn} /></label>
                    <label className="grid gap-2 text-sm md:col-span-3"><span>Observações</span><Input name="notes" defaultValue={rule.notes ?? ""} /></label>
                    <div className="md:col-span-3 flex justify-end gap-3"><Button type="submit">Salvar regra</Button></div>
                  </form>
                  <form action={deleteRecurringRuleAction} className="mt-3 flex justify-start"><input type="hidden" name="ruleId" value={rule.id} /><Button type="submit">Excluir regra</Button></form>
                </details>

                <table>
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Status</th>
                      <th>Direção</th>
                      <th>Valor</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rule.occurrences.map((occurrence) => (
                      <tr key={occurrence.id}>
                        <td>{occurrence.dueOn}</td>
                        <td>{formatStatusLabel(occurrence.status)}</td>
                        <td>{formatTransactionDirectionLabel(occurrence.direction)}</td>
                        <td>{formatCurrencyFromCents(occurrence.amountCents)}</td>
                        <td className="space-y-2 py-3">
                          {occurrence.status !== "posted" ? (
                            <div className="flex flex-wrap gap-2">
                              <form action={settleOccurrenceAction}><input type="hidden" name="occurrenceId" value={occurrence.id} /><Button type="submit" className="h-8 px-3 text-xs">Marcar como realizado</Button></form>
                              <form action={skipRecurringOccurrenceAction}><input type="hidden" name="occurrenceId" value={occurrence.id} /><Button type="submit" className="h-8 px-3 text-xs">Pular</Button></form>
                            </div>
                          ) : null}
                          <details>
                            <summary className="cursor-pointer text-xs text-[var(--muted-foreground)]">Editar só esta ocorrência</summary>
                            <form action={updateRecurringOccurrenceAction} className="mt-2 grid gap-2 md:grid-cols-[1fr_1fr_1fr_auto]">
                              <input type="hidden" name="occurrenceId" value={occurrence.id} />
                              <Input name="dueOn" type="date" defaultValue={occurrence.dueOn} />
                              <Input name="amount" defaultValue={centsToInput(occurrence.amountCents)} />
                              <Input name="notes" defaultValue={occurrence.notes ?? ""} placeholder="Notas" />
                              <Button type="submit" className="h-10">Salvar</Button>
                            </form>
                          </details>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : <EmptyState title="Nenhuma regra recorrente" description="Crie a primeira regra ou use o bootstrap/import para gerar compromissos futuros automaticamente." />}

      {archivedRules.length > 0 ? (
        <Card>
          <CardHeader><CardTitle>Recorrências arquivadas</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {archivedRules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] p-3 text-sm">
                <span>{rule.title}</span>
                <form action={restoreRecurringRuleAction}><input type="hidden" name="ruleId" value={rule.id} /><Button type="submit" className="h-8 px-3 text-xs">Restaurar</Button></form>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </>
  );
}
