import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { createRecurringRuleAction, materializeAllRulesAction, settleOccurrenceAction } from "@/features/recurring/actions";
import { formatCurrencyFromCents } from "@/lib/currency";
import { listAccounts } from "@/services/accounts.service";
import { listCategories } from "@/services/categories.service";
import { listRecurringRules } from "@/services/recurring.service";

export default function RecurringPage() {
  const accounts = listAccounts();
  const categories = listCategories();
  const rules = listRecurringRules();

  return (
    <>
      <PageHeader
        title="Recorrências e contas fixas"
        description="Regras geram ocorrências futuras controladas. O histórico realizado não é corrompido quando a regra muda."
        actions={
          <form action={materializeAllRulesAction}>
            <Button type="submit">Gerar próximas ocorrências</Button>
          </form>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Nova regra</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createRecurringRuleAction} className="grid gap-4 md:grid-cols-3">
            <Input name="title" placeholder="Aluguel, internet, mesada..." />
            <Select name="accountId"><option value="">Selecione a conta</option>{accounts.map((account) => <option key={account.id} value={account.id}>{account.name}</option>)}</Select>
            <Input name="amount" placeholder="0,00" />
            <Select name="direction"><option value="expense">Despesa</option><option value="income">Receita</option></Select>
            <Select name="frequency"><option value="monthly">Mensal</option><option value="weekly">Semanal</option><option value="yearly">Anual</option></Select>
            <Select name="categoryId"><option value="">Sem categoria</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</Select>
            <Input name="startsOn" type="date" defaultValue={new Date().toISOString().slice(0, 10)} />
            <Input name="nextRunOn" type="date" defaultValue={new Date().toISOString().slice(0, 10)} />
            <div className="md:col-span-3"><Input name="notes" placeholder="Observações" /></div>
            <div className="md:col-span-3 flex justify-end"><Button type="submit">Criar regra</Button></div>
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
              <CardContent>
                <p className="mb-3 text-sm text-[var(--muted-foreground)]">
                  {rule.frequency} · próxima geração em {rule.nextRunOn} · {formatCurrencyFromCents(rule.amountCents)}
                </p>
                <table>
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Status</th>
                      <th>Direção</th>
                      <th>Valor</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {rule.occurrences.map((occurrence) => (
                      <tr key={occurrence.id}>
                        <td>{occurrence.dueOn}</td>
                        <td>{occurrence.status}</td>
                        <td>{occurrence.direction}</td>
                        <td>{formatCurrencyFromCents(occurrence.amountCents)}</td>
                        <td>
                          {occurrence.status !== "posted" ? (
                            <form action={settleOccurrenceAction}>
                              <input type="hidden" name="occurrenceId" value={occurrence.id} />
                              <Button type="submit">Marcar como realizado</Button>
                            </form>
                          ) : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Nenhuma regra recorrente"
          description="Esse vazio é legítimo quando nenhuma conta fixa ainda foi cadastrada. Depois de criar a regra, as ocorrências futuras aparecem aqui."
        />
      )}
    </>
  );
}
