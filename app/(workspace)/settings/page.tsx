import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { updateSettingsAction } from "@/features/settings/actions";
import { ensureSettings } from "@/services/settings.service";

export default function SettingsPage() {
  const settings = ensureSettings();

  return (
    <>
      <PageHeader title="ConfiguraÃ§Ãµes" description="PreferÃªncias gerais, horizonte de projeÃ§Ã£o e orientaÃ§Ãµes prÃ¡ticas de backup local." />
      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>PreferÃªncias do sistema</CardTitle>
            <CardDescription>Essas definiÃ§Ãµes afetam onboarding, importaÃ§Ã£o assistida e visÃ£o futura.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={updateSettingsAction} className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm md:col-span-2">
                <span>Nome de exibiÃ§Ã£o</span>
                <Input name="userDisplayName" defaultValue={settings.userDisplayName} />
              </label>
              <label className="grid gap-2 text-sm">
                <span>Moeda base</span>
                <Select name="baseCurrency" defaultValue={settings.baseCurrency}>
                  <option value="BRL">BRL</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </Select>
              </label>
              <label className="grid gap-2 text-sm">
                <span>Locale</span>
                <Select name="locale" defaultValue={settings.locale}>
                  <option value="pt-BR">pt-BR</option>
                  <option value="en-US">en-US</option>
                </Select>
              </label>
              <label className="grid gap-2 text-sm">
                <span>Tema</span>
                <Select name="themePreference" defaultValue={settings.themePreference}>
                  <option value="system">Sistema</option>
                  <option value="light">Claro</option>
                  <option value="dark">Escuro</option>
                </Select>
              </label>
              <label className="grid gap-2 text-sm">
                <span>Horizonte futuro padrÃ£o (meses)</span>
                <Input name="projectionMonths" type="number" min={1} max={24} defaultValue={String(settings.projectionMonths)} />
              </label>
              <div className="md:col-span-2 flex justify-end">
                <Button type="submit">Salvar configuraÃ§Ãµes</Button>
              </div>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Backup local</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>O banco principal mora em <code>data/aurea-finance.sqlite</code>.</p>
            <p>Para backup manual, feche o app e copie esse arquivo para outra pasta, pendrive ou nuvem.</p>
            <p>TambÃ©m existe o script <code>pnpm db:backup</code>, que cria uma cÃ³pia versionada em <code>backups/</code>.</p>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--secondary)] p-4 text-foreground">
              <div className="text-sm"><strong>Onboarding concluÃ­do:</strong> {settings.isOnboarded ? "sim" : "nÃ£o"}</div>
              <div className="mt-1 text-sm"><strong>Modo atual:</strong> local-first com SQLite</div>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
