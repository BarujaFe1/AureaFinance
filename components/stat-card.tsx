import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function StatCard({ title, value, description }: { title: string; value: string; description?: string }) {
  return (
    <Card className="bg-[linear-gradient(180deg,color-mix(in_oklab,var(--card)_97%,white),var(--card))]">
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl md:text-3xl">{value}</CardTitle>
      </CardHeader>
      {description ? <CardContent className="text-sm text-[var(--muted-foreground)]">{description}</CardContent> : null}
    </Card>
  );
}
