export type ValidationIssue = {
  code: string;
  severity: "error" | "warning";
  field?: string;
  message: string;
};

export function validateGenericFinanceRow(row: Record<string, unknown>) {
  const issues: ValidationIssue[] = [];
  if (!row.occurredOn && !row.date) {
    issues.push({ code: "missing_date", severity: "error", field: "occurredOn", message: "Linha sem data." });
  }
  if (row.amountCents == null && row.amount == null && row.valor == null) {
    issues.push({ code: "missing_amount", severity: "error", field: "amountCents", message: "Linha sem valor monetário." });
  }
  const maybeAmount = row.amountCents ?? row.amount ?? row.valor;
  if (maybeAmount === 0 || maybeAmount === "0") {
    issues.push({ code: "zero_amount", severity: "warning", field: "amountCents", message: "Valor igual a zero, revisar relevância." });
  }
  if (!row.description && !row.descricao && !row.nome) {
    issues.push({ code: "missing_description", severity: "warning", field: "description", message: "Linha sem descrição legível." });
  }
  return issues;
}
