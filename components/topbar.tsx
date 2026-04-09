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
        <div className="hidden w-[260px] md:block">
          <Input placeholder="Buscar em breve" disabled />
        </div>
        <ModeToggle />
      </div>
    </div>
  );
}
