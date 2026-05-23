"use client";

import type { AdminBulkAction } from "@/types/admin";
import { Button } from "@/components/ui/button";

export function AdminBulkActions({
  selectedCount,
  actions,
  onAction
}: {
  selectedCount: number;
  actions: AdminBulkAction[];
  onAction: (action: AdminBulkAction) => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-secondary/40 p-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">已選取 {selectedCount.toLocaleString("zh-TW")} 筆</p>
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <Button
            key={action.id}
            variant={action.kind === "delete" ? "destructive" : "outline"}
            size="sm"
            onClick={() => onAction(action)}
            disabled={selectedCount === 0}
          >
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
