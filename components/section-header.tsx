export function SectionHeader({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return (
    <div className="mb-6 flex flex-col gap-2">
      {eyebrow ? <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{eyebrow}</div> : null}
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      {description ? <p className="max-w-3xl text-sm text-muted-foreground">{description}</p> : null}
    </div>
  );
}
