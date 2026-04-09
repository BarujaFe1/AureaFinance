"use client";

import dynamic from "next/dynamic";

const AccountBalanceChart = dynamic(
  () => import("@/components/charts/account-balance-chart").then((mod) => mod.AccountBalanceChart),
  { ssr: false, loading: () => <div className="h-80 animate-pulse rounded-2xl bg-[var(--secondary)]" /> }
);

export function AccountBalanceChartLazy({
  data,
}: {
  data: { name: string; current: number; projected: number; reconciled?: number }[];
}) {
  return <AccountBalanceChart data={data} />;
}
