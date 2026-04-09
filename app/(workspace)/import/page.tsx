import { db } from "@/db/client";
import { importBatches, importIssues } from "@/db/schema";
import { PageHeader } from "@/components/page-header";
import { ImportWizardOverview } from "@/components/import/import-wizard-overview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { expectedCsvFiles } from "@/services/csv-import.service";
import { getMoneyBootstrapDataset } from "@/services/money-bootstrap.service";
import { bootstrapMoneyImportAction, commitBatchAction, validateBatchAction } from "@/features/import/actions";
import { fromJson } from "@/lib/utils";
import { normalizeBatchMeta, normalizeDryRunReport } from "@/lib/import-meta";
import { ImportWorkbenchLazy } from "@/components/lazy/import-workbench-lazy";

function formatCreatedAt(timestamp: number) {
  return new Date(timestamp).toLocaleDateString("pt-BR");
}

export default function ImportPage() {
  const batches = db.select().from(importBatches).all().sort((a, b) => b.createdAt - a.createdAt).slice(0, 8);
  const issues = db.select().from(importIssues).all().sort((a, b) => b.createdAt - a.createdAt).slice(0, 12);
  const money = getMoneyBootstrapDataset();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Migração e importação"
        description="Centro único para bootstrap da planilha Money, importação genérica CSV/XLSX, dry-run, validação e commit final."
      />

      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>Fluxo dedicado da Money.xlsx</CardTitle>
            <CardDescription>A planilha já gera defaults para onboarding, contas, cartões, recorrências, patrimônio e visão futura.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-2xl border border-[var(--border)] p-4 text-sm"><strong>{money.accounts.length}</strong><div className="text-[var(--muted-foreground)]">contas sugeridas</div></div>
              <div className="rounded-2xl border border-[var(--border)] p-4 text-sm"><strong>{money.cards.length}</strong><div className="text-[var(--muted-foreground)]">cartões reconhecidos</div></div>
              <div className="rounded-2xl border border-[var(--border)] p-4 text-sm"><strong>{money.recurring.length}</strong><div className="text-[var(--muted-foreground)]">compromissos recorrentes</div></div>
              <div className="rounded-2xl border border-[var(--border)] p-4 text-sm"><strong>{money.cardBills.length}</strong><div className="text-[var(--muted-foreground)]">faturas futuras</div></div>
              <div className="rounded-2xl border border-[var(--border)] p-4 text-sm"><strong>{money.reserves.length + money.stockPositions.length + money.cryptoPositions.length}</strong><div className="text-[var(--muted-foreground)]">posições patrimoniais</div></div>
              <div className="rounded-2xl border border-[var(--border)] p-4 text-sm"><strong>{money.sheetInventory.length}</strong><div className="text-[var(--muted-foreground)]">abas reconhecidas</div></div>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--secondary)] p-4 text-sm text-[var(--muted-foreground)]">
              <p><strong className="text-[var(--foreground)]">Mapeamento principal:</strong> Visão Geral → contas/saldos/patrimônio, Cartões → faturas e parcelas futuras, Richard → recorrências fixas, Registro Diário → pista para séries históricas e Acompanhamento Mensal → base do ledger de caixa.</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <form action={bootstrapMoneyImportAction}>
                <Button type="submit">Modo rápido: preencher tudo com Money</Button>
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
            <CardDescription>Heurísticas e defaults específicos para a sua Money.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {money.sheetInventory.map((sheet) => (
              <div key={sheet.name} className="rounded-2xl border border-[var(--border)] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-medium">{sheet.name}</div>
                    <div className="text-xs text-[var(--muted-foreground)]">{sheet.rows} linhas · {sheet.columns} colunas</div>
                  </div>
                  <Badge variant="secondary">reconhecida</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <ImportWizardOverview />
      <ImportWorkbenchLazy expectedFiles={expectedCsvFiles()} />

      <Card>
        <CardHeader>
          <CardTitle>Pós-importação editável</CardTitle>
          <CardDescription>O sistema não assume que a planilha veio perfeita. Depois do commit, corrija dados pelas telas operacionais.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm text-[var(--muted-foreground)] md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-[var(--border)] p-4">Contas e instituições → <a href="/accounts" className="font-medium text-[var(--foreground)]">/accounts</a></div>
          <div className="rounded-2xl border border-[var(--border)] p-4">Categorias e tags → <a href="/categories" className="font-medium text-[var(--foreground)]">/categories</a></div>
          <div className="rounded-2xl border border-[var(--border)] p-4">Ativos e snapshots → <a href="/net-worth" className="font-medium text-[var(--foreground)]">/net-worth</a></div>
          <div className="rounded-2xl border border-[var(--border)] p-4">Cartões, compras e faturas → <a href="/cards" className="font-medium text-[var(--foreground)]">/cards</a> / <a href="/bills" className="font-medium text-[var(--foreground)]">/bills</a></div>
        </CardContent>
      </Card>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Lotes de importação</CardTitle>
            <CardDescription>Workbooks enviados para staging, com inventário, dry-run e commit final.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {batches.length === 0 ? <p className="text-sm text-muted-foreground">Nenhum lote carregado ainda.</p> : null}
            {batches.map((batch) => {
              const meta = normalizeBatchMeta(fromJson<unknown>(batch.workbookSummaryJson, null));
              const report = normalizeDryRunReport(fromJson<unknown>(batch.dryRunReportJson, null));
              return (
                <div key={batch.id} className="rounded-2xl border border-[var(--border)] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="font-medium">{batch.filename}</div>
                      <div className="text-sm text-muted-foreground">Enviado em {formatCreatedAt(batch.createdAt)} · {meta.sheets.length > 0 ? `${meta.sheets.length} abas inventariadas` : "metadados indisponíveis"}</div>
                    </div>
                    <Badge variant={batch.status.includes("issues") ? "destructive" : "secondary"}>{batch.status}</Badge>
                  </div>

                  {meta.sheets.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {meta.sheets.map((sheet) => (
                        <Badge key={`${batch.id}-${sheet.name}`} variant="outline">{sheet.name}: {sheet.suggestedTarget}</Badge>
                      ))}
                    </div>
                  ) : <div className="mt-3 text-sm text-muted-foreground">Metadados do workbook não estão disponíveis para este lote.</div>}

                  {report ? (
                    <div className="mt-4 rounded-2xl bg-[var(--secondary)] p-3 text-sm">
                      <div>Contas: {report.summary.accounts} · Transações: {report.summary.transactions} · Cartões: {report.summary.creditCards} · Faturas/parcelas: {report.summary.installments}</div>
                      <div>Issues: {report.summary.issues}</div>
                      {report.warnings.length > 0 ? <div className="mt-2 text-[var(--muted-foreground)]">{report.warnings.join(" · ")}</div> : null}
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
            <CardTitle>Logs e inconsistências</CardTitle>
            <CardDescription>Mensagens legíveis para revisar o que foi reconhecido, inferido ou precisa de confirmação.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {issues.length === 0 ? <p className="text-sm text-muted-foreground">Nenhuma inconsistência registrada até agora.</p> : null}
            {issues.map((issue) => (
              <div key={issue.id} className="rounded-2xl border border-[var(--border)] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-medium">{issue.message}</div>
                    <div className="text-sm text-muted-foreground">{issue.sheetName} · {issue.issueCode}</div>
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
