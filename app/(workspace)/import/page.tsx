import { db } from "@/db/client";
import { importBatches, importIssues } from "@/db/schema";
import { PageHeader } from "@/components/page-header";
import { ImportWizardOverview } from "@/components/import/import-wizard-overview";
import { ImportWorkbench } from "@/components/import/import-workbench";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { expectedCsvFiles } from "@/services/csv-import.service";
import { getMoneyBootstrapDataset } from "@/services/money-bootstrap.service";
import { bootstrapMoneyImportAction, commitBatchAction, validateBatchAction } from "@/features/import/actions";
import { fromJson } from "@/lib/utils";
import type { BatchMeta, DryRunReport } from "@/types/domain";

function formatCreatedAt(timestamp: number) {
  return new Date(timestamp).toLocaleDateString("pt-BR");
}

export default function ImportPage() {
  const batches = db.select().from(importBatches).all().sort((a, b) => b.createdAt - a.createdAt);
  const issues = db.select().from(importIssues).all().sort((a, b) => b.createdAt - a.createdAt);
  const money = getMoneyBootstrapDataset();

  return (
    <div className="space-y-6">
      <PageHeader
        title="MigraÃ§Ã£o e importaÃ§Ã£o"
        description="Centro Ãºnico para bootstrap da planilha Money, importaÃ§Ã£o genÃ©rica CSV/XLSX, dry-run, validaÃ§Ã£o e commit final."
      />

      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>Fluxo dedicado da Money.xlsx</CardTitle>
            <CardDescription>A planilha foi reconhecida e jÃ¡ gerou defaults confiÃ¡veis para onboarding, contas, cartÃµes, recorrÃªncias, patrimÃ´nio e visÃ£o futura.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-2xl border border-[var(--border)] p-4 text-sm"><strong>{money.accounts.length}</strong><div className="text-[var(--muted-foreground)]">contas sugeridas</div></div>
              <div className="rounded-2xl border border-[var(--border)] p-4 text-sm"><strong>{money.cards.length}</strong><div className="text-[var(--muted-foreground)]">cartÃµes reconhecidos</div></div>
              <div className="rounded-2xl border border-[var(--border)] p-4 text-sm"><strong>{money.recurring.length}</strong><div className="text-[var(--muted-foreground)]">compromissos recorrentes</div></div>
              <div className="rounded-2xl border border-[var(--border)] p-4 text-sm"><strong>{money.cardBills.length}</strong><div className="text-[var(--muted-foreground)]">faturas futuras</div></div>
              <div className="rounded-2xl border border-[var(--border)] p-4 text-sm"><strong>{money.reserves.length + money.stockPositions.length + money.cryptoPositions.length}</strong><div className="text-[var(--muted-foreground)]">posiÃ§Ãµes patrimoniais</div></div>
              <div className="rounded-2xl border border-[var(--border)] p-4 text-sm"><strong>{money.sheetInventory.length}</strong><div className="text-[var(--muted-foreground)]">abas reconhecidas</div></div>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--secondary)] p-4 text-sm text-[var(--muted-foreground)]">
              <p><strong className="text-[var(--foreground)]">Mapeamento principal:</strong> VisÃ£o Geral â†’ contas/saldos/patrimÃ´nio, CartÃµes â†’ faturas e parcelas futuras, Richard â†’ recorrÃªncias fixas, TransaÃ§Ãµes â†’ histÃ³rico de ativos e Registro DiÃ¡rio â†’ pistas para sÃ©rie temporal.</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <form action={bootstrapMoneyImportAction}>
                <Button type="submit">Modo rÃ¡pido: preencher tudo com Money</Button>
              </form>
              <a href="/onboarding?mode=money" className="inline-flex h-10 items-center justify-center rounded-2xl border border-[var(--border)] px-4 text-sm font-medium">
                Revisar no onboarding assistido
              </a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Abas reconhecidas da planilha</CardTitle>
            <CardDescription>HeurÃ­sticas e defaults especÃ­ficos para a sua Money.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {money.sheetInventory.map((sheet) => (
              <div key={sheet.name} className="rounded-2xl border border-[var(--border)] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-medium">{sheet.name}</div>
                    <div className="text-xs text-[var(--muted-foreground)]">{sheet.rows} linhas Â· {sheet.columns} colunas</div>
                  </div>
                  <Badge variant="secondary">reconhecida</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <ImportWizardOverview />
      <ImportWorkbench expectedFiles={expectedCsvFiles()} />

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Lotes de importaÃ§Ã£o</CardTitle>
            <CardDescription>Workbooks enviados para staging, com inventÃ¡rio, dry-run e commit final.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {batches.length === 0 ? <p className="text-sm text-muted-foreground">Nenhum lote carregado ainda.</p> : null}
            {batches.map((batch) => {
              const meta = fromJson<BatchMeta>(batch.workbookSummaryJson, { sheets: [] });
              const report = fromJson<DryRunReport | null>(batch.dryRunReportJson, null);
              return (
                <div key={batch.id} className="rounded-2xl border border-[var(--border)] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="font-medium">{batch.filename}</div>
                      <div className="text-sm text-muted-foreground">Enviado em {formatCreatedAt(batch.createdAt)} Â· {meta.sheets.length} abas inventariadas</div>
                    </div>
                    <Badge variant={batch.status.includes("issues") ? "destructive" : "secondary"}>{batch.status}</Badge>
                  </div>

                  {meta.sheets.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {meta.sheets.map((sheet) => (
                        <Badge key={`${batch.id}-${sheet.name}`} variant="outline">{sheet.name}: {sheet.suggestedTarget}</Badge>
                      ))}
                    </div>
                  ) : null}

                  {report ? (
                    <div className="mt-4 rounded-2xl bg-[var(--secondary)] p-3 text-sm">
                      <div>Contas: {report.summary.accounts} Â· TransaÃ§Ãµes: {report.summary.transactions} Â· CartÃµes: {report.summary.creditCards} Â· Faturas/parcelas: {report.summary.installments}</div>
                      <div>Issues: {report.summary.issues}</div>
                      {report.warnings.length > 0 ? <div className="mt-2 text-[var(--muted-foreground)]">{report.warnings.join(" Â· ")}</div> : null}
                    </div>
                  ) : null}

                  <div className="mt-4 flex flex-wrap gap-3">
                    <form action={validateBatchAction}>
                      <input type="hidden" name="batchId" value={batch.id} />
                      <Button type="submit" variant="outline">Rodar dry-run</Button>
                    </form>
                    <form action={commitBatchAction}>
                      <input type="hidden" name="batchId" value={batch.id} />
                      <input type="hidden" name="dryRun" value="false" />
                      <Button type="submit">Commitar lote</Button>
                    </form>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Logs e inconsistÃªncias</CardTitle>
            <CardDescription>Mensagens legÃ­veis para revisar o que foi reconhecido, inferido ou precisa de confirmaÃ§Ã£o.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {issues.length === 0 ? <p className="text-sm text-muted-foreground">Nenhuma inconsistÃªncia registrada atÃ© agora.</p> : null}
            {issues.slice(0, 12).map((issue) => (
              <div key={issue.id} className="rounded-2xl border border-[var(--border)] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-medium">{issue.message}</div>
                    <div className="text-sm text-muted-foreground">{issue.sheetName} Â· {issue.issueCode}</div>
                  </div>
                  <Badge variant={issue.severity === "error" ? "destructive" : "secondary"}>{issue.severity}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
