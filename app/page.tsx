import { redirect } from "next/navigation";
import { ensureSettings } from "@/services/settings.service";

export default function HomePage() {
  const settings = ensureSettings();
  redirect(settings.isOnboarded ? "/dashboard" : "/onboarding?mode=money");
}
