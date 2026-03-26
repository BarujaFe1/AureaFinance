import { db } from "@/db/client";
import { categories, subcategories, tags } from "@/db/schema";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CategoriesPage() {
  const categoryRows = db.select().from(categories).all();
  const subcategoryRows = db.select().from(subcategories).all();
  const tagRows = db.select().from(tags).all();

  return (
    <div className="space-y-6">
      <PageHeader title="Categorias e tags" description="Taxonomia leve, flexível e preparada para busca e filtro." />
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader><CardTitle>Categorias</CardTitle></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {categoryRows.map((category) => (
              <div key={category.id} className="rounded-xl border p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-medium">{category.name}</div>
                  <Badge variant="secondary">{category.kind}</Badge>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {subcategoryRows.filter((item) => item.categoryId === category.id).map((item) => (
                    <Badge key={item.id} variant="outline">{item.name}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Tags</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {tagRows.length === 0 ? <p className="text-sm text-muted-foreground">Nenhuma tag cadastrada ainda.</p> : null}
            {tagRows.map((tag) => <Badge key={tag.id} variant="outline">{tag.name}</Badge>)}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
