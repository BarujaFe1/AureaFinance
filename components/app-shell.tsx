"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
  Menu,
  PieChart,
  Repeat2,
  Settings,
  TrendingUp,
  X
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const plain = pathname === "/onboarding";
  if (plain) return <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">{children}</div>;

  const NavLinks = (
    <nav className="space-y-1.5" aria-label="Navegação principal">
      {nav.map(([href, label, Icon]) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            prefetch
            aria-current={active ? "page" : undefined}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
              active
                ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                : "text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--foreground)]"
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-[var(--primary)] focus:px-3 focus:py-2 focus:text-[var(--primary-foreground)]"
      >
        Ir para o conteúdo
      </a>

      <div className="mx-auto grid min-h-screen max-w-[1600px] grid-cols-1 md:grid-cols-[272px_1fr]">
        <aside className="hidden border-r border-[var(--border)] bg-[color-mix(in_oklab,var(--card)_96%,white)] px-5 py-6 dark:bg-[color-mix(in_oklab,var(--card)_96%,black)] md:block">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Personal finance OS</p>
              <h2 className="text-xl font-semibold tracking-tight">{APP_NAME}</h2>
            </div>
            <ThemeToggle />
          </div>
          {NavLinks}
          <div className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--secondary)] p-4 text-sm text-[var(--muted-foreground)]">
            Local-first: seus dados ficam no SQLite desta máquina. Use <span className="font-medium text-[var(--foreground)]">Backup</span> em Configurações/scripts para preservar o histórico.
          </div>
        </aside>

        <div className="flex min-w-0 flex-col">
          <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--background)_92%,transparent)] px-4 py-3 backdrop-blur md:hidden">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Aurea</p>
              <p className="text-sm font-semibold">{APP_NAME}</p>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                type="button"
                className="inline-flex size-10 items-center justify-center rounded-xl border border-[var(--border)]"
                aria-expanded={mobileOpen}
                aria-controls="mobile-nav"
                onClick={() => setMobileOpen((value) => !value)}
              >
                {mobileOpen ? <X className="size-4" aria-hidden="true" /> : <Menu className="size-4" aria-hidden="true" />}
                <span className="sr-only">{mobileOpen ? "Fechar menu" : "Abrir menu"}</span>
              </button>
            </div>
          </header>

          {mobileOpen ? (
            <div id="mobile-nav" className="border-b border-[var(--border)] bg-[var(--card)] px-4 py-4 md:hidden">
              {NavLinks}
            </div>
          ) : null}

          <main id="main-content" className="px-5 py-6 md:px-8 md:py-8">
            <div className="mx-auto flex max-w-7xl flex-col gap-6">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
