import { db } from "@/db/client";
import { importIssues, importRawRows } from "@/db/schema";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function getValidationVariant(status: string) {
  if (status === "invalid") return "destructive";
  if (status === "pending") return "secondary";
  return "outline";
}

export default function ImportReviewPage() {
  const rows = db.select().from(importRawRows).all();
  const issues = db.select().from(importIssues).all();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Revisão de importação"
        description="Linhas brutas em staging, status de validação e inconsistências antes do commit definitivo."
      />
      <Card>
        <CardHeader><CardTitle>Linhas em staging</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="p-2">Aba</th>
                  <th className="p-2">Linha</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">JSON bruto</th>
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 25).map((row) => (
                  <tr key={row.id} className="border-b align-top">
                    <td className="p-2">{row.sheetName}</td>
                    <td className="p-2">{row.rowNumber}</td>
                    <td className="p-2">
                      <Badge variant={getValidationVariant(row.validationStatus)}>{row.validationStatus}</Badge>
                    </td>
                    <td className="max-w-[520px] truncate p-2 font-mono text-xs">{row.payloadJson}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Issues registradas</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {issues.slice(0, 20).map((issue) => (
            <div key={issue.id} className="rounded-xl border p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-medium">{issue.message}</div>
                  <div className="text-sm text-muted-foreground">{issue.issueCode}</div>
                </div>
                <Badge variant={issue.severity === "error" ? "destructive" : "secondary"}>{issue.severity}</Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
