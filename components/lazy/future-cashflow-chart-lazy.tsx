"use client";

import dynamic from "next/dynamic";

const FutureCashflowChart = dynamic(
  () => import("@/components/future/cashflow-chart").then((mod) => mod.FutureCashflowChart),
  { ssr: false, loading: () => <div className="h-80 animate-pulse rounded-2xl bg-[var(--secondary)]" /> }
);

export function FutureCashflowChartLazy({
  data,
}: {
  data: Array<{ date: string; balance: number }>;
}) {
  return <FutureCashflowChart data={data} />;
}
