import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmForm } from "@/components/confirm-form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  archiveCategoryAction,
  archiveTagAction,
  createCategoryAction,
  createTagAction,
  deleteCategoryAction,
  deleteTagAction,
  mergeCategoryAction,
  restoreCategoryAction,
  restoreTagAction,
  updateCategoryAction,
  updateTagAction
} from "@/features/categories/actions";
import { upsertBudgetAction, deleteBudgetAction } from "@/features/budget/actions";
import { formatCurrencyFromCents } from "@/lib/currency";
import { formatCategoryKindLabel } from "@/lib/formatters";
import { todayIso } from "@/lib/dates";
import { listCategories, listTags } from "@/services/categories.service";
import { getBudgetVsActual } from "@/services/budget.service";

export default function CategoriesPage() {
  const categoryRows = listCategories();
  const archivedCategories = listCategories(true).filter((row) => !categoryRows.some((current) => current.id === row.id));
  const tagRows = listTags();
  const archivedTags = listTags(true).filter((row) => !tagRows.some((current) => current.id === row.id));

  const today = todayIso();
  const currentMonth = today.slice(0, 7);
  const budgets = getBudgetVsActual(currentMonth);
  const totalBudgetCents = budgets.filter((b) => b.categoryKind === "expense").reduce((sum, b) => sum + b.limitCents, 0);
  const totalSpentCents = budgets.filter((b) => b.categoryKind === "expense").reduce((sum, b) => sum + b.spentCents, 0);
  const totalBudgetPct = totalBudgetCents > 0 ? Math.round((totalSpentCents / totalBudgetCents) * 100) : 0;

  return (
    <div className="space-y-6">
      <PageHeader title="Categorias e tags" description="Área operacional para criar, editar, renomear, arquivar, excluir quando seguro e mesclar classificações erradas." />

      {budgets.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Orçamento mensal — {currentMonth}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span>Total: {formatCurrencyFromCents(totalSpentCents)} de {formatCurrencyFromCents(totalBudgetCents)}</span>
              <span className={totalBudgetPct > 100 ? "text-red-500 font-semibold" : ""}>{totalBudgetPct}%</span>
            </div>
            <Progress value={Math.min(totalBudgetPct, 100)} className={totalBudgetPct > 100 ? "bg-red-200 [&>div]:bg-red-500" : ""} />
            <div className="grid gap-3 md:grid-cols-2">
              {budgets.filter((b) => b.categoryKind === "expense").map((b) => (
                <div key={b.id} className="rounded-xl border p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span style={{ color: b.categoryColor ?? undefined }} className="font-medium">{b.categoryName}</span>
                    <span className={b.percentageUsed > 100 ? "text-red-500 font-semibold" : ""}>{formatCurrencyFromCents(b.spentCents)} / {formatCurrencyFromCents(b.limitCents)}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Progress value={Math.min(b.percentageUsed, 100)} className={b.percentageUsed > 100 ? "bg-red-200 [&>div]:bg-red-500" : "flex-1"} />
                    <span className="text-xs text-[var(--muted-foreground)]">{b.percentageUsed}%</span>
                  </div>
                  <form action={deleteBudgetAction} className="mt-2">
                    <input type="hidden" name="budgetId" value={b.id} />
                    <Button type="submit" className="h-6 px-2 text-xs">Remover</Button>
                  </form>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader><CardTitle>Nova categoria</CardTitle></CardHeader>
          <CardContent>
            <form action={createCategoryAction} className="grid gap-3 md:grid-cols-[1.4fr_1fr_140px_auto]">
              <Input name="name" placeholder="Ex.: Alimentação" />
              <Select name="kind" defaultValue="expense"><option value="expense">Despesa</option><option value="income">Receita</option><option value="neutral">Neutra</option></Select>
              <Input name="color" type="color" defaultValue="#7c83ff" />
              <Button type="submit">Criar</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Nova tag</CardTitle></CardHeader>
          <CardContent>
            <form action={createTagAction} className="grid gap-3 md:grid-cols-[1fr_140px_auto]">
              <Input name="name" placeholder="Ex.: família" />
              <Input name="color" type="color" defaultValue="#71717a" />
              <Button type="submit">Criar</Button>
            </form>
          </CardContent>
        </Card>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader><CardTitle>Categorias ativas</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {categoryRows.length === 0 ? (
              <EmptyState
                title="Nenhuma categoria ainda"
                description="Crie categorias de receita e despesa para orçamento, filtros e relatórios. Você também pode importar a Money.xlsx e revisar classificações depois."
              />
            ) : null}
            {categoryRows.map((category) => (
              <details key={category.id} className="rounded-xl border p-4">
                <summary className="flex cursor-pointer items-center justify-between gap-3">
                  <div className="font-medium">{category.name}</div>
                  <Badge variant="secondary">{formatCategoryKindLabel(category.kind)}</Badge>
                </summary>
                <form action={updateCategoryAction} className="mt-4 grid gap-3 md:grid-cols-[1.3fr_1fr_140px_auto]">
                  <input type="hidden" name="categoryId" value={category.id} />
                  <Input name="name" defaultValue={category.name} />
                  <Select name="kind" defaultValue={category.kind}><option value="expense">Despesa</option><option value="income">Receita</option><option value="neutral">Neutra</option></Select>
                  <Input name="color" type="color" defaultValue={category.color ?? "#7c83ff"} />
                  <Button type="submit">Salvar</Button>
                </form>
                <form action={upsertBudgetAction} className="mt-3 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                  <input type="hidden" name="categoryId" value={category.id} />
                  <input type="hidden" name="month" value={currentMonth} />
                  <span className="flex items-center text-sm font-medium">Orçamento mensal:</span>
                  <Input name="limitCents" type="number" min="0" step="1" defaultValue={(budgets.find((b) => b.categoryId === category.id)?.limitCents ?? 0).toString()} placeholder="Limite em centavos" />
                  <Button type="submit">Definir orçamento</Button>
                </form>
                <form action={mergeCategoryAction} className="mt-3 grid gap-3 md:grid-cols-[1fr_auto]">
                  <input type="hidden" name="sourceCategoryId" value={category.id} />
                  <Select name="targetCategoryId" defaultValue=""><option value="">Mesclar em...</option>{categoryRows.filter((row) => row.id !== category.id).map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}</Select>
                  <Button type="submit">Mesclar e reclassificar</Button>
                </form>
                <div className="mt-3 flex flex-wrap gap-2">
                  <ConfirmForm action={archiveCategoryAction} message="Arquivar esta categoria? Ela ficará oculta nas listas de seleção." confirmLabel="Sim, arquivar">
                    <input type="hidden" name="categoryId" value={category.id} />
                    <Button type="submit" className="h-8 px-3 text-xs">Arquivar</Button>
                  </ConfirmForm>
                  <ConfirmForm action={deleteCategoryAction} message="Excluir permanentemente esta categoria? A operação só será concluída se nenhuma transação estiver vinculada a ela.">
                    <input type="hidden" name="categoryId" value={category.id} />
                    <Button type="submit" className="h-8 px-3 text-xs">Excluir</Button>
                  </ConfirmForm>
                </div>
              </details>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Tags ativas</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {tagRows.length === 0 ? (
              <EmptyState
                title="Nenhuma tag ainda"
                description="Tags são etiquetas leves para cruzar gastos (ex.: viagem, família) sem poluir o plano de contas."
              />
            ) : null}
            {tagRows.map((tag) => (
              <details key={tag.id} className="rounded-xl border p-4">
                <summary className="flex cursor-pointer items-center justify-between gap-3"><span className="font-medium">{tag.name}</span><Badge variant="outline">tag</Badge></summary>
                <form action={updateTagAction} className="mt-4 grid gap-3 md:grid-cols-[1fr_140px_auto]">
                  <input type="hidden" name="tagId" value={tag.id} />
                  <Input name="name" defaultValue={tag.name} />
                  <Input name="color" type="color" defaultValue={tag.color ?? "#71717a"} />
                  <Button type="submit">Salvar</Button>
                </form>
                <div className="mt-3 flex flex-wrap gap-2">
                  <ConfirmForm action={archiveTagAction} message="Arquivar esta tag? Ela ficará oculta nas listas de seleção." confirmLabel="Sim, arquivar">
                    <input type="hidden" name="tagId" value={tag.id} />
                    <Button type="submit" className="h-8 px-3 text-xs">Arquivar</Button>
                  </ConfirmForm>
                  <ConfirmForm action={deleteTagAction} message="Excluir permanentemente esta tag? A operação só será concluída se nenhum registro estiver vinculado a ela.">
                    <input type="hidden" name="tagId" value={tag.id} />
                    <Button type="submit" className="h-8 px-3 text-xs">Excluir</Button>
                  </ConfirmForm>
                </div>
              </details>
            ))}
          </CardContent>
        </Card>
      </div>

      {(archivedCategories.length > 0 || archivedTags.length > 0) ? (
        <section className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Categorias arquivadas</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {archivedCategories.map((category) => (
                <div key={category.id} className="flex items-center justify-between gap-3 rounded-xl border p-3 text-sm">
                  <span>{category.name}</span>
                  <form action={restoreCategoryAction}><input type="hidden" name="categoryId" value={category.id} /><Button type="submit" className="h-8 px-3 text-xs">Restaurar</Button></form>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Tags arquivadas</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {archivedTags.map((tag) => (
                <div key={tag.id} className="flex items-center justify-between gap-3 rounded-xl border p-3 text-sm">
                  <span>{tag.name}</span>
                  <form action={restoreTagAction}><input type="hidden" name="tagId" value={tag.id} /><Button type="submit" className="h-8 px-3 text-xs">Restaurar</Button></form>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      ) : null}
    </div>
  );
}
