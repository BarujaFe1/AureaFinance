export default function WorkspaceLoading() {
  return (
    <div className="space-y-6">
      <div className="h-16 animate-pulse rounded-3xl bg-[var(--secondary)]" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-28 animate-pulse rounded-3xl bg-[var(--secondary)]" />
        ))}
      </div>
      <div className="h-80 animate-pulse rounded-3xl bg-[var(--secondary)]" />
    </div>
  );
}
