"use client";

import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { AdminForm } from "@/components/admin/admin-form";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { AdminField, AdminRecord, AdminRecordValue } from "@/types/admin";

type Notice = {
  type: "success" | "warning";
  text: string;
};

type AdminRecordEditorProps = {
  title: string;
  description?: string;
  resourceLabel: string;
  apiResource?: string;
  backHref: string;
  record: AdminRecord;
  fields: AdminField[];
  dbFields?: string[];
  jsonFields?: string[];
};

export function AdminRecordEditor({
  title,
  description,
  resourceLabel,
  apiResource,
  backHref,
  record,
  fields,
  dbFields,
  jsonFields = []
}: AdminRecordEditorProps) {
  const [draft, setDraft] = useState<AdminRecord>(() => ({ ...record }));
  const [notice, setNotice] = useState<Notice | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  function updateDraft(key: string, value: AdminRecordValue) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  async function saveDraft() {
    const nextDraft = normalizeDraft(draft, fields);
    setDraft(nextDraft);

    if (!apiResource) {
      setNotice({ type: "success", text: "已更新本頁草稿資料。" });
      return;
    }

    setIsSaving(true);
    const response = await fetch(`/api/admin/${apiResource}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: nextDraft.id,
        values: toPayload(nextDraft, dbFields, jsonFields)
      })
    }).catch(() => null);
    setIsSaving(false);

    if (!response) {
      setNotice({ type: "warning", text: "已更新畫面資料，但目前無法連線到 admin API。" });
      return;
    }

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      setNotice({ type: "warning", text: `儲存未完成${payload?.error ? `：${payload.error}` : "。"}` });
      return;
    }

    setNotice({ type: "success", text: `${resourceLabel}已儲存。` });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <ButtonLink href={backHref} variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4" />
            回到清單
          </ButtonLink>
          <h1 className="section-title mt-4">{title}</h1>
          {description ? <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{description}</p> : null}
        </div>
        <Button onClick={saveDraft} disabled={isSaving}>
          <Save className="h-4 w-4" />
          {isSaving ? "儲存中" : "儲存變更"}
        </Button>
      </div>

      {notice ? (
        <div
          className={cn(
            "rounded-lg border p-3 text-sm",
            notice.type === "success" && "border-primary/30 bg-primary/10 text-primary",
            notice.type === "warning" && "border-accent/50 bg-accent/15 text-accent-foreground"
          )}
        >
          {notice.text}
        </div>
      ) : null}

      <Card>
        <CardHeader className="space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>{resourceLabel}編輯內容</CardTitle>
            {draft.status ? <AdminStatusBadge value={draft.status} /> : null}
          </div>
          <p className="text-sm text-muted-foreground">
            編輯頁會保留完整欄位與關聯設定，儲存後透過現有 admin API 寫回資料。
          </p>
        </CardHeader>
        <CardContent>
          <AdminForm title="基本資料" description="名稱、狀態、地區、地址與座標等核心資料。">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {fields.map((field) => (
                <FieldEditor
                  key={field.key}
                  field={field}
                  value={draft[field.key]}
                  onChange={(value) => updateDraft(field.key, value)}
                />
              ))}
            </div>
          </AdminForm>
          <Separator className="my-6" />
          <div className="flex flex-wrap gap-2">
            <Button onClick={saveDraft} disabled={isSaving}>
              <Save className="h-4 w-4" />
              {isSaving ? "儲存中" : "儲存變更"}
            </Button>
            <ButtonLink href={backHref} variant="outline">
              回到清單
            </ButtonLink>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function FieldEditor({
  field,
  value,
  onChange
}: {
  field: AdminField;
  value: AdminRecordValue;
  onChange: (value: AdminRecordValue) => void;
}) {
  const commonClass = field.span === "full" ? "md:col-span-2 xl:col-span-3" : "";

  if (field.type === "textarea") {
    return (
      <div className={cn("space-y-2", commonClass)}>
        <Label>{field.label}</Label>
        <Textarea
          value={formatValue(value)}
          onChange={(event) => onChange(event.target.value)}
          placeholder={field.placeholder}
          readOnly={field.readOnly}
          className="min-h-28"
        />
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <div className={cn("space-y-2", commonClass)}>
        <Label>{field.label}</Label>
        <select
          value={formatValue(value)}
          onChange={(event) => onChange(event.target.value)}
          disabled={field.readOnly}
          className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">請選擇</option>
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (field.type === "boolean") {
    return (
      <label className={cn("flex items-center gap-3 rounded-md border bg-background p-3 text-sm", commonClass)}>
        <input
          type="checkbox"
          checked={value === true || value === "true"}
          onChange={(event) => onChange(event.target.checked)}
          disabled={field.readOnly}
        />
        <span className="font-medium">{field.label}</span>
      </label>
    );
  }

  const type = field.type === "number" ? "number" : field.type === "url" ? "url" : field.type === "datetime" ? "datetime-local" : "text";
  const inputValue = field.type === "datetime" ? toDatetimeLocal(formatValue(value)) : field.type === "tags" ? formatValue(value) : String(value ?? "");

  return (
    <div className={cn("space-y-2", commonClass)}>
      <Label>{field.label}</Label>
      <Input
        type={type}
        value={inputValue}
        onChange={(event) =>
          onChange(field.type === "tags" ? parseTags(event.target.value) : coerceInput(event.target.value, field.type))
        }
        placeholder={field.placeholder}
        readOnly={field.readOnly}
      />
    </div>
  );
}

function normalizeDraft(draft: AdminRecord, fields: AdminField[]) {
  const next = { ...draft };
  fields.forEach((field) => {
    if (field.type === "number" && next[field.key] !== "" && next[field.key] != null) {
      next[field.key] = Number(next[field.key]);
    }
  });
  return next;
}

function parseTags(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function coerceInput(value: string, type?: string): AdminRecordValue {
  if (type === "number") {
    return value === "" ? "" : Number(value);
  }

  if (type === "datetime") {
    return fromDatetimeLocal(value);
  }

  return value;
}

function formatValue(value: unknown) {
  if (Array.isArray(value)) return value.join(", ");
  if (value === true) return "true";
  if (value === false) return "false";
  if (value == null) return "";
  return String(value);
}

function toDatetimeLocal(value: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(0, 16);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

function fromDatetimeLocal(value: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString();
}

function toPayload(row: AdminRecord, dbFields?: string[], jsonFields: string[] = []) {
  const keys = dbFields?.length ? dbFields : Object.keys(row);

  return keys.reduce<Record<string, unknown>>((payload, key) => {
    const value = row[key];
    if (jsonFields.includes(key) && typeof value === "string") {
      payload[key] = parseJson(value);
    } else {
      payload[key] = value;
    }
    return payload;
  }, {});
}

function parseJson(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}
