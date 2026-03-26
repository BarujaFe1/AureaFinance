import Link from "next/link";
import { BarChart3, CalendarRange, CreditCard, DollarSign, FolderTree, Home, Import, Landmark, Repeat, Settings, TrendingUp, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/accounts", label: "Contas", icon: Landmark },
  { href: "/transactions", label: "TransaÃ§Ãµes", icon: Wallet },
  { href: "/cards", label: "CartÃµes", icon: CreditCard },
  { href: "/bills", label: "Faturas", icon: CreditCard },
  { href: "/calendar", label: "CalendÃ¡rio", icon: CalendarRange },
  { href: "/recurring", label: "RecorrÃªncias", icon: Repeat },
  { href: "/closings", label: "Fechamentos", icon: DollarSign },
  { href: "/future", label: "VisÃ£o futura", icon: TrendingUp },
  { href: "/net-worth", label: "PatrimÃ´nio", icon: BarChart3 },
  { href: "/categories", label: "Categorias", icon: FolderTree },
  { href: "/import", label: "ImportaÃ§Ã£o", icon: Import },
  { href: "/settings", label: "ConfiguraÃ§Ãµes", icon: Settings }
];

export function AppSidebar() {
  return (
    <Card className="sticky top-4 hidden h-[calc(100vh-2rem)] w-[260px] overflow-hidden lg:block">
      <div className="flex h-full flex-col p-4">
        <div className="px-3 py-4">
          <div className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">Aurea</div>
          <div className="mt-2 text-xl font-semibold">Finance</div>
          <p className="mt-2 text-sm text-muted-foreground">Clareza financeira diÃ¡ria, sem ruÃ­do.</p>
        </div>
        <nav className="mt-4 flex flex-1 flex-col gap-1">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </Card>
  );
}
