"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function CashflowChart({ data }: { data: Array<{ date: string; income: number; expense: number }> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fluxo do mês</CardTitle>
        <CardDescription>Entradas e saídas observadas no período corrente.</CardDescription>
      </CardHeader>
      <CardContent className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="income" fillOpacity={0.2} strokeWidth={2} />
            <Area type="monotone" dataKey="expense" fillOpacity={0.2} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
