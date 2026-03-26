import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { ensureSettings } from "@/services/settings.service";

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  const settings = ensureSettings();

  if (!settings.isOnboarded) {
    redirect("/onboarding");
  }

  return <>{children}</>;
}
