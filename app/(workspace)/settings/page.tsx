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
      <PageHeader title="Configurações" description="Preferências gerais, horizonte de projeção e orientações práticas de backup local." />
      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>Preferências do sistema</CardTitle>
            <CardDescription>Essas definições afetam onboarding, importação assistida e visão futura.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={updateSettingsAction} className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm md:col-span-2">
                <span>Nome de exibição</span>
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
                <span>Horizonte futuro padrão (meses)</span>
                <Input name="projectionMonths" type="number" min={1} max={24} defaultValue={String(settings.projectionMonths)} />
              </label>
              <div className="md:col-span-2 flex justify-end">
                <Button type="submit">Salvar configurações</Button>
              </div>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Backup e restore local</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>O banco principal mora em <code>data/aurea-finance.sqlite</code>.</p>
            <p>Para backup manual, feche o app e copie esse arquivo para outra pasta, pendrive ou nuvem.</p>
            <p>Também existe o script <code>pnpm db:backup</code>, que cria uma cópia versionada em <code>backups/</code>.</p>
            <p>Para restore guiado por terminal, use <code>pnpm db:restore backups/SEU-ARQUIVO.sqlite</code>.</p>
            <p>Aliases operacionais: <code>pnpm dbmigrate</code> e <code>pnpm dbseed</code>.</p>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--secondary)] p-4 text-foreground">
              <div className="text-sm"><strong>Onboarding concluído:</strong> {settings.isOnboarded ? "sim" : "não"}</div>
              <div className="mt-1 text-sm"><strong>Modo atual:</strong> local-first com SQLite</div>
              <div className="mt-1 text-sm"><strong>Operação diária recomendada:</strong> abrir Conferência diária, salvar saldos reais, atualizar ativos e só então revisar projeção.</div>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
