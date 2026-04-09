"use client";

import dynamic from "next/dynamic";

const ImportWorkbench = dynamic(
  () => import("@/components/import/import-workbench").then((mod) => mod.ImportWorkbench),
  { ssr: false, loading: () => <div className="h-48 animate-pulse rounded-2xl bg-[var(--secondary)]" /> }
);

export function ImportWorkbenchLazy(props: React.ComponentProps<typeof ImportWorkbench>) {
  return <ImportWorkbench {...props} />;
}
