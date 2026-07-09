import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { configureCurrencyFormat } from "@/lib/currency";
import { ensureSettings } from "@/services/settings.service";

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  const settings = ensureSettings();
  configureCurrencyFormat(settings.baseCurrency, settings.locale);

  if (!settings.isOnboarded) {
    redirect("/onboarding");
  }

  return <>{children}</>;
}
