import { Badge } from "@/components/ui/badge";

const positiveValues = new Set(["published", "active", "enable", "enabled", "true", "通過", "update", "create"]);
const warningValues = new Set(["draft", "scheduled", "pending", "medium", "ready"]);
const dangerValues = new Set(["archived", "suspended", "disabled", "false", "high", "delete", "ended"]);

export function AdminStatusBadge({ value }: { value: unknown }) {
  const text = formatStatus(value);
  const normalized = String(value ?? "").toLowerCase();

  if (positiveValues.has(normalized) || text === "上架" || text === "啟用") {
    return <Badge>{text}</Badge>;
  }

  if (warningValues.has(normalized) || text === "草稿" || text === "排程") {
    return <Badge variant="accent">{text}</Badge>;
  }

  if (dangerValues.has(normalized) || text === "下架" || text === "停用") {
    return <Badge variant="outline" className="border-destructive/40 text-destructive">{text}</Badge>;
  }

  return <Badge variant="secondary">{text}</Badge>;
}

function formatStatus(value: unknown) {
  if (value === true) return "啟用";
  if (value === false) return "停用";

  const text = String(value ?? "");
  const labels: Record<string, string> = {
    published: "上架",
    draft: "草稿",
    scheduled: "排程",
    archived: "下架",
    active: "啟用",
    suspended: "停權",
    pending: "待審",
    ready: "就緒",
    low: "低",
    medium: "中",
    high: "高",
    update: "更新",
    create: "新增",
    delete: "刪除"
  };

  return labels[text.toLowerCase()] ?? text;
}
