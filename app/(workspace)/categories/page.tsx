import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
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
import { formatCategoryKindLabel } from "@/lib/formatters";
import { listCategories, listTags } from "@/services/categories.service";

export default function CategoriesPage() {
  const categoryRows = listCategories();
  const archivedCategories = listCategories(true).filter((row) => !categoryRows.some((current) => current.id === row.id));
  const tagRows = listTags();
  const archivedTags = listTags(true).filter((row) => !tagRows.some((current) => current.id === row.id));

  return (
    <div className="space-y-6">
      <PageHeader title="Categorias e tags" description="Área operacional para criar, editar, renomear, arquivar, excluir quando seguro e mesclar classificações erradas." />

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
                <form action={mergeCategoryAction} className="mt-3 grid gap-3 md:grid-cols-[1fr_auto]">
                  <input type="hidden" name="sourceCategoryId" value={category.id} />
                  <Select name="targetCategoryId" defaultValue=""><option value="">Mesclar em...</option>{categoryRows.filter((row) => row.id !== category.id).map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}</Select>
                  <Button type="submit">Mesclar e reclassificar</Button>
                </form>
                <div className="mt-3 flex flex-wrap gap-2">
                  <form action={archiveCategoryAction}><input type="hidden" name="categoryId" value={category.id} /><Button type="submit" className="h-8 px-3 text-xs">Arquivar</Button></form>
                  <form action={deleteCategoryAction}><input type="hidden" name="categoryId" value={category.id} /><Button type="submit" className="h-8 px-3 text-xs">Excluir se seguro</Button></form>
                </div>
              </details>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Tags ativas</CardTitle></CardHeader>
          <CardContent className="space-y-4">
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
                  <form action={archiveTagAction}><input type="hidden" name="tagId" value={tag.id} /><Button type="submit" className="h-8 px-3 text-xs">Arquivar</Button></form>
                  <form action={deleteTagAction}><input type="hidden" name="tagId" value={tag.id} /><Button type="submit" className="h-8 px-3 text-xs">Excluir</Button></form>
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
