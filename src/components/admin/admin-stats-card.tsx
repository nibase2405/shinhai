import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AdminStatsCard({
  label,
  value,
  helper,
  trend,
  icon
}: {
  label: string;
  value: string | number;
  helper?: string;
  trend?: string;
  icon?: ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        {icon ? <div className="text-primary">{icon}</div> : null}
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between gap-3">
          <p className="text-2xl font-bold tabular-nums">{typeof value === "number" ? value.toLocaleString("zh-TW") : value}</p>
          {trend ? <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">{trend}</span> : null}
        </div>
        {helper ? <p className="mt-2 text-xs text-muted-foreground">{helper}</p> : null}
      </CardContent>
    </Card>
  );
}
