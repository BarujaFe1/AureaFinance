"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { useActionState } from "react";
import { CheckCircle2, FileSpreadsheet, Loader2, TriangleAlert, UploadCloud } from "lucide-react";
import { importCsvFiles, type ImportActionState } from "@/app/import/actions";
import { uploadWorkbookAction } from "@/features/import/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type PreviewFile = {
  name: string;
  sizeKb: number;
  lineCount: number;
  sample: string[][];
  valid: boolean;
};

function parsePreview(text: string) {
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  const sample = lines.slice(0, 6).map((line) => {
    const cells: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i += 1) {
      const char = line[i];
      const next = line[i + 1];
      if (char === '"') {
        if (inQuotes && next === '"') {
          current += '"';
          i += 1;
        } else inQuotes = !inQuotes;
        continue;
      }
      if ((char === ',' || char === ';') && !inQuotes) {
        cells.push(current);
        current = "";
        continue;
      }
      current += char;
    }
    cells.push(current);
    return cells;
  });
  return { lineCount: Math.max(lines.length - 1, 0), sample };
}

export function ImportWorkbench({ expectedFiles }: { expectedFiles: string[] }) {
  const initialState: ImportActionState = useMemo(() => ({ success: true, files: [], summary: {}, expectedFiles }), [expectedFiles]);
  const [state, formAction, pending] = useActionState(importCsvFiles, initialState);
  const [previews, setPreviews] = useState<PreviewFile[]>([]);

  useEffect(() => {
    setPreviews((current) => current.map((file) => ({ ...file, valid: expectedFiles.includes(file.name) })));
  }, [expectedFiles]);

  async function handleFiles(files: FileList | null) {
    if (!files) return;
    const next: PreviewFile[] = [];
    for (const file of Array.from(files)) {
      const text = await file.text();
      const preview = parsePreview(text);
      next.push({
        name: file.name,
        sizeKb: Math.round(file.size / 1024),
        lineCount: preview.lineCount,
        sample: preview.sample,
        valid: expectedFiles.includes(file.name)
      });
    }
    setPreviews(next);
  }

  const hasValidFiles = previews.some((file) => file.valid);

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Modo assistido: workbook CSV/XLSX</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-2">
          <form action={uploadWorkbookAction} className="rounded-2xl border border-dashed border-[var(--border)] p-4">
            <div className="mb-3 flex items-center gap-2">
              <UploadCloud className="size-4 text-[var(--muted-foreground)]" />
              <strong>Workbook genérico</strong>
            </div>
            <p className="mb-4 text-sm text-[var(--muted-foreground)]">Envie um XLSX/XLS para inventário de abas, staging e dry-run com mapeamento sugerido.</p>
            <input type="file" name="file" accept=".xlsx,.xls" className="mb-4 block w-full text-sm" />
            <Button type="submit">Enviar workbook</Button>
          </form>

          <form action={formAction} className="rounded-2xl border border-dashed border-[var(--border)] p-4">
            <div className="mb-3 flex items-center gap-2">
              <FileSpreadsheet className="size-4 text-[var(--muted-foreground)]" />
              <strong>Modo legado CSV</strong>
            </div>
            <p className="mb-4 text-sm text-[var(--muted-foreground)]">Aceita múltiplos CSVs, detecta preview e executa a importação existente.</p>
            <input type="file" name="files" accept=".csv" multiple className="mb-4 block w-full text-sm" onChange={(event) => void handleFiles(event.target.files)} />
            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit" disabled={!hasValidFiles || pending}>Importar CSVs</Button>
              {pending ? <span className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)]"><Loader2 className="size-4 animate-spin" />Processando...</span> : null}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preview dos CSVs selecionados</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {previews.length === 0 ? <p className="text-sm text-[var(--muted-foreground)]">Selecione arquivos CSV para ver prévia real do conteúdo.</p> : null}
          {previews.map((file) => (
            <div key={file.name} className="rounded-2xl border border-[var(--border)] p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="size-5 text-[var(--muted-foreground)]" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{file.sizeKb} KB · {file.lineCount} linhas</p>
                  </div>
                </div>
                <div className="inline-flex items-center gap-2 text-sm">
                  {file.valid ? <><CheckCircle2 className="size-4 text-emerald-500" />Reconhecido</> : <><TriangleAlert className="size-4 text-amber-500" />Fora da lista esperada</>}
                </div>
              </div>
              <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
                <table className="min-w-full text-sm">
                  <tbody>
                    {file.sample.map((row, rowIndex) => (
                      <tr key={`${file.name}-${rowIndex}`} className="border-b border-[var(--border)] last:border-b-0">
                        {row.map((cell, cellIndex) => <td key={cellIndex} className="px-3 py-2">{cell}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resultado do modo CSV</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {state.error ? <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">{state.error}</div> : null}
          {state.summaryText ? <pre className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--secondary)] p-4 text-xs">{state.summaryText}</pre> : null}
          {state.files.length ? (
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="px-2 py-2">Arquivo</th>
                  <th className="px-2 py-2">Processadas</th>
                  <th className="px-2 py-2">Com erro</th>
                  <th className="px-2 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {state.files.flatMap((file) => {
                  const rows = [
                    <tr key={`${file.fileName}-main`}>
                      <td className="px-2 py-2">{file.fileName}</td>
                      <td className="px-2 py-2">{file.linesProcessed}</td>
                      <td className="px-2 py-2">{file.linesWithError}</td>
                      <td className="px-2 py-2">{file.status === "success" ? "✅ Sucesso" : file.status === "partial" ? "⚠️ Parcial" : file.status === "skipped" ? "↷ Ignorado" : "❌ Falhou"}</td>
                    </tr>
                  ];
                  if (file.errors.length) {
                    rows.push(
                      <tr key={`${file.fileName}-errors`}>
                        <td colSpan={4} className="px-2 py-2">
                          <details>
                            <summary className="cursor-pointer text-sm text-[var(--muted-foreground)]">Ver erros</summary>
                            <ul className="mt-2 space-y-1 text-sm text-red-300">
                              {file.errors.map((error, index) => <li key={index}>{error}</li>)}
                            </ul>
                          </details>
                        </td>
                      </tr>
                    );
                  }
                  return rows;
                })}
              </tbody>
            </table>
          ) : (
            <p className="text-sm text-[var(--muted-foreground)]">Depois da primeira importação CSV, o relatório por arquivo aparece aqui.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
