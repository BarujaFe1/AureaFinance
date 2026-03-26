import { Search } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { Input } from "@/components/ui/input";

export function Topbar({ title }: { title: string }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border bg-card p-4 shadow-soft lg:flex-row lg:items-center lg:justify-between">
      <div>
        <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Aurea Finance</div>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative hidden w-[260px] md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar em breve" className="pl-9" disabled />
        </div>
        <ModeToggle />
      </div>
    </div>
  );
}
