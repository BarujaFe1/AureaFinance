"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_NAME } from "@/lib/constants";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import {
  ArrowLeftRight,
  Boxes,
  CalendarDays,
  ClipboardCheck,
  CircleDollarSign,
  CreditCard,
  FolderTree,
  Import,
  Landmark,
  LayoutDashboard,
  PieChart,
  Repeat2,
  Settings,
  TrendingUp
} from "lucide-react";

const nav = [
  ["/dashboard", "Dashboard", LayoutDashboard],
  ["/accounts", "Contas", Landmark],
  ["/daily", "Conferência diária", ClipboardCheck],
  ["/transactions", "Transações", ArrowLeftRight],
  ["/cards", "Cartões", CreditCard],
  ["/bills", "Faturas", CircleDollarSign],
  ["/recurring", "Recorrências", Repeat2],
  ["/calendar", "Calendário", CalendarDays],
  ["/closings", "Fechamentos", Boxes],
  ["/future", "Visão futura", TrendingUp],
  ["/net-worth", "Patrimônio", PieChart],
  ["/categories", "Categorias", FolderTree],
  ["/import", "Importação", Import],
  ["/settings", "Configurações", Settings]
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const plain = pathname === "/onboarding";
  if (plain) return <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">{children}</div>;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto grid min-h-screen max-w-[1600px] grid-cols-1 md:grid-cols-[272px_1fr]">
        <aside className="border-r border-[var(--border)] bg-[color-mix(in_oklab,var(--card)_96%,white)] px-5 py-6 dark:bg-[color-mix(in_oklab,var(--card)_96%,black)]">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Personal finance OS</p>
              <h2 className="text-xl font-semibold tracking-tight">{APP_NAME}</h2>
            </div>
            <ThemeToggle />
          </div>
          <nav className="space-y-1.5">
            {nav.map(([href, label, Icon]) => {
              const active = pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={href}
                  href={href}
                  prefetch
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition-colors",
                    active
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                      : "text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--foreground)]"
                  )}
                >
                  <Icon className="size-4" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--secondary)] p-4 text-sm text-[var(--muted-foreground)]">
            Banco local-first em SQLite. Backup = copiar o arquivo <code className="font-mono text-xs">data/aurea-finance.sqlite</code>.
          </div>
        </aside>
        <main className="px-5 py-6 md:px-8 md:py-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
