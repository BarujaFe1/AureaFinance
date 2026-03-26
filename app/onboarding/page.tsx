import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listCategories } from "@/services/categories.service";
import { ensureSettings } from "@/services/settings.service";
import { getMoneyOnboardingDefaults } from "@/services/money-bootstrap.service";

export default function OnboardingPage({
  searchParams
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const settings = ensureSettings();
  const categories = listCategories().map((category) => ({ id: category.id, name: category.name }));
  const moneyDefaults = getMoneyOnboardingDefaults();
  const requestedMode = typeof searchParams?.mode === "string" ? searchParams.mode : "money";
  const mode = requestedMode === "manual" ? "manual" : "money";

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-6 py-10">
      <PageHeader
        title="Primeiro acesso"
        description="O Aurea Finance pode nascer manualmente ou jÃ¡ carregando contexto Ãºtil da sua planilha Money."
        actions={
          <div className="flex flex-wrap gap-3">
            <Link href="/onboarding?mode=money" className="inline-flex h-10 items-center rounded-xl border border-[var(--border)] px-4 text-sm">
              Usar a Money
            </Link>
            <Link href="/onboarding?mode=manual" className="inline-flex h-10 items-center rounded-xl border border-[var(--border)] px-4 text-sm">
              Configurar manualmente
            </Link>
          </div>
        }
      />

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className={mode === "money" ? "border-[var(--primary)]" : ""}>
          <CardHeader>
            <CardTitle className="text-base">ComeÃ§ar com a Money</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-[var(--muted-foreground)]">
            <p>PrÃ©-preenche contas, cartÃµes, patrimÃ´nio, compromissos fixos e leva vocÃª para a central de migraÃ§Ã£o assistida.</p>
            <p>Ideal para fazer o app nascer com contexto real desde o primeiro uso.</p>
          </CardContent>
        </Card>
        <Card className={mode === "manual" ? "border-[var(--primary)]" : ""}>
          <CardHeader>
            <CardTitle className="text-base">Configurar manualmente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-[var(--muted-foreground)]">
            <p>Fluxo mais enxuto para montar a base a partir do zero, pulando o que for opcional.</p>
            <p>Depois vocÃª continua podendo importar dados histÃ³ricos pela tela /import.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Seu estado atual</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-[var(--muted-foreground)]">
            <p>UsuÃ¡rio atual: {settings.userDisplayName}</p>
            <p>Moeda base: {settings.baseCurrency}</p>
            <p>Locale: {settings.locale}</p>
            <p>Horizonte futuro: {settings.projectionMonths} meses</p>
          </CardContent>
        </Card>
      </section>

      <OnboardingWizard
        categories={categories}
        initialSettings={{
          userDisplayName: mode === "money" ? moneyDefaults.initialSettings.userDisplayName : settings.userDisplayName,
          baseCurrency: mode === "money" ? moneyDefaults.initialSettings.baseCurrency : settings.baseCurrency,
          locale: mode === "money" ? moneyDefaults.initialSettings.locale : settings.locale,
          themePreference: settings.themePreference,
          projectionMonths: mode === "money" ? moneyDefaults.initialSettings.projectionMonths : settings.projectionMonths
        }}
        mode={mode}
        dataset={moneyDefaults.dataset}
      />
    </div>
  );
}
