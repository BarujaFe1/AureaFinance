"use client";

import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function FutureCashflowChart({ data }: { data: Array<{ date: string; balance: number }> }) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: 0, right: 0, top: 12, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" tickLine={false} axisLine={false} tickFormatter={(value: string) => value.slice(5)} />
          <YAxis tickLine={false} axisLine={false} />
          <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
          <ReferenceLine y={0} strokeDasharray="4 4" />
          <Area type="monotone" dataKey="balance" fillOpacity={0.15} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
