import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ChartItem = {
  label: string;
  value: number;
  helper?: string;
};

export function AdminChartCard({ title, items }: { title: string; items: ChartItem[] }) {
  const max = Math.max(...items.map((item) => item.value), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div key={`${title}-${item.label}`} className="space-y-2">
            <div className="flex items-center justify-between gap-3 text-sm">
              <div className="min-w-0">
                <p className="truncate font-medium">{item.label}</p>
                {item.helper ? <p className="truncate text-xs text-muted-foreground">{item.helper}</p> : null}
              </div>
              <span className="font-mono text-xs text-muted-foreground">{item.value.toLocaleString("zh-TW")}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full bg-primary" style={{ width: `${Math.max((item.value / max) * 100, 6)}%` }} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
