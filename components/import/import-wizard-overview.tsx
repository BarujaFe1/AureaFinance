import { CheckCircle2, DatabaseZap, FileSpreadsheet, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const steps = [
  {
    icon: FileSpreadsheet,
    title: "1. Inventário do arquivo",
    description: "Lê o .xlsx, lista abas, conta linhas, detecta cabeçalhos e sugere o papel provável de cada aba."
  },
  {
    icon: DatabaseZap,
    title: "2. Staging seguro",
    description: "Cada linha vai primeiro para tabelas temporárias rastreáveis antes de tocar o domínio principal."
  },
  {
    icon: ShieldAlert,
    title: "3. Validação + dry-run",
    description: "Aponta erros, avisa riscos e mostra o que seria criado antes da confirmação final."
  },
  {
    icon: CheckCircle2,
    title: "4. Confirmação e trilha de auditoria",
    description: "Após revisão, o lote é confirmado e fica historicamente rastreável."
  }
];

export function ImportWizardOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {steps.map((step) => {
        const Icon = step.icon;
        return (
          <Card key={step.title}>
            <CardHeader>
              <Icon className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="mt-2 text-base">{step.title}</CardTitle>
              <CardDescription>{step.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0" />
          </Card>
        );
      })}
    </div>
  );
}
