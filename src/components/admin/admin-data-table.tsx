"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { AdminBulkActions } from "@/components/admin/admin-bulk-actions";
import { AdminFilterBar } from "@/components/admin/admin-filter-bar";
import { AdminForm } from "@/components/admin/admin-form";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { AdminBulkAction, AdminColumn, AdminField, AdminFilter, AdminRecord, AdminRecordValue } from "@/types/admin";

type SortState = {
  key: string;
  direction: "asc" | "desc";
} | null;

type AdminDataTableProps = {
  title: string;
  description?: string;
  apiResource?: string;
  columns: AdminColumn[];
  rows: AdminRecord[];
  fields: AdminField[];
  filters?: AdminFilter[];
  bulkActions?: AdminBulkAction[];
  searchableKeys?: string[];
  dbFields?: string[];
  pageSize?: number;
  editPathBase?: string;
};

export function AdminDataTable({
  title,
  description,
  apiResource,
  columns,
  rows,
  fields,
  filters = [],
  bulkActions = [
    { id: "delete", label: "批次刪除", kind: "delete", confirm: "確定要刪除選取資料嗎？" }
  ],
  searchableKeys,
  dbFields,
  pageSize = 8,
  editPathBase
}: AdminDataTableProps) {
  const [items, setItems] = useState(rows);
  const [draft, setDraft] = useState<AdminRecord>(() => createEmptyDraft(fields));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [sort, setSort] = useState<SortState>(null);
  const [page, setPage] = useState(1);
  const [notice, setNotice] = useState<string | null>(null);

  const searchKeys = searchableKeys ?? columns.map((column) => column.key);

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return items
      .filter((item) => {
        const queryMatch =
          !keyword ||
          searchKeys.some((key) => formatValue(item[key]).toLowerCase().includes(keyword));
        const filterMatch = filters.every((filter) => {
          const value = filterValues[filter.key] ?? "all";
          return value === "all" || String(item[filter.key]) === value;
        });
        return queryMatch && filterMatch;
      })
      .sort((a, b) => {
        if (!sort) return 0;
        const result = compareValues(a[sort.key], b[sort.key]);
        return sort.direction === "asc" ? result : -result;
      });
  }, [filterValues, filters, items, search, searchKeys, sort]);

  const pageCount = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageRows = filteredItems.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const allPageSelected = pageRows.length > 0 && pageRows.every((row) => selected.has(row.id));

  function updateDraft(key: string, value: AdminRecordValue) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function startCreate() {
    setDraft(createEmptyDraft(fields));
    setEditingId(null);
    setNotice(null);
  }

  function startEdit(row: AdminRecord) {
    setDraft({ ...row });
    setEditingId(row.id);
    setNotice(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveDraft() {
    const id = editingId ?? crypto.randomUUID();
    const nextRow = normalizeDraft({ ...draft, id }, fields);
    const method = editingId ? "PATCH" : "POST";

    setItems((current) =>
      current.some((item) => item.id === id)
        ? current.map((item) => (item.id === id ? { ...item, ...nextRow } : item))
        : [nextRow, ...current]
    );
    setDraft(createEmptyDraft(fields));
    setEditingId(null);
    await persist(apiResource, method, id, toPayload(nextRow, dbFields));
    setNotice(method === "PATCH" ? "資料已更新。" : "資料已新增。");
  }

  async function deleteRow(id: string) {
    if (!window.confirm("確定要刪除這筆資料嗎？")) return;
    setItems((current) => current.filter((item) => item.id !== id));
    setSelected((current) => {
      const next = new Set(current);
      next.delete(id);
      return next;
    });
    await persist(apiResource, "DELETE", id);
    setNotice("資料已刪除。");
  }

  function toggleSort(column: AdminColumn) {
    if (!column.sortable) return;
    setSort((current) => {
      if (!current || current.key !== column.key) {
        return { key: column.key, direction: "asc" };
      }
      if (current.direction === "asc") {
        return { key: column.key, direction: "desc" };
      }
      return null;
    });
  }

  function toggleSelected(id: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function togglePageSelected() {
    setSelected((current) => {
      const next = new Set(current);
      if (allPageSelected) {
        pageRows.forEach((row) => next.delete(row.id));
      } else {
        pageRows.forEach((row) => next.add(row.id));
      }
      return next;
    });
  }

  function runBulkAction(action: AdminBulkAction) {
    if (selected.size === 0) return;
    if (action.confirm && !window.confirm(action.confirm)) return;

    if (action.kind === "delete") {
      setItems((current) => current.filter((item) => !selected.has(item.id)));
      setSelected(new Set());
      setNotice("已批次刪除選取資料。");
      return;
    }

    const key = action.key ?? (action.kind === "set-status" ? "status" : "is_active");
    setItems((current) =>
      current.map((item) => (selected.has(item.id) ? { ...item, [key]: action.value } : item))
    );
    setNotice(`${action.label}已套用。`);
  }

  function changeFilter(key: string, value: string) {
    setFilterValues((current) => ({ ...current, [key]: value }));
    setPage(1);
  }

  return (
    <div className="space-y-6">
      {notice ? (
        <div className="rounded-lg border border-primary/30 bg-primary/10 p-3 text-sm text-primary">{notice}</div>
      ) : null}

      <AdminForm
        title={editingId ? "編輯資料" : "新增資料"}
        description={apiResource ? `儲存後會寫入 /api/admin/${apiResource}` : "此區先提供營運資料草稿編輯。"}
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {fields.map((field) => (
            <FieldEditor key={field.key} field={field} value={draft[field.key]} onChange={(value) => updateDraft(field.key, value)} />
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button onClick={saveDraft}>
            <Save className="h-4 w-4" />
            儲存
          </Button>
          <Button variant="outline" onClick={startCreate}>
            {editingId ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {editingId ? "取消編輯" : "清空新增表單"}
          </Button>
        </div>
      </AdminForm>

      <section className="space-y-4">
        <div className="rounded-lg border bg-card p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold">{title}</h2>
              {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
            </div>
            <Button onClick={startCreate}>
              <Plus className="h-4 w-4" />
              新增
            </Button>
          </div>
          <div className="mt-4">
            <AdminFilterBar
              search={search}
              onSearchChange={(value) => {
                setSearch(value);
                setPage(1);
              }}
              filters={filters}
              values={filterValues}
              onFilterChange={changeFilter}
            />
          </div>
        </div>

        {selected.size > 0 ? (
          <AdminBulkActions selectedCount={selected.size} actions={bulkActions} onAction={runBulkAction} />
        ) : null}

        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input type="checkbox" checked={allPageSelected} onChange={togglePageSelected} aria-label="選取本頁資料" />
                </TableHead>
                {columns.map((column) => (
                  <TableHead
                    key={column.key}
                    className={cn(column.align === "right" && "text-right", column.sortable && "cursor-pointer select-none")}
                    onClick={() => toggleSort(column)}
                  >
                    <span className={cn("inline-flex items-center gap-1", column.align === "right" && "justify-end")}>
                      {column.label}
                      {sort?.key === column.key && sort.direction === "asc" ? <ArrowUp className="h-3.5 w-3.5" /> : null}
                      {sort?.key === column.key && sort.direction === "desc" ? <ArrowDown className="h-3.5 w-3.5" /> : null}
                    </span>
                  </TableHead>
                ))}
                <TableHead className="w-28 text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageRows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <input type="checkbox" checked={selected.has(row.id)} onChange={() => toggleSelected(row.id)} aria-label={`選取 ${row.id}`} />
                  </TableCell>
                  {columns.map((column) => (
                    <TableCell key={column.key} className={cn("max-w-[260px]", column.align === "right" && "text-right")}>
                      {column.status ? <AdminStatusBadge value={row[column.key]} /> : <span className="line-clamp-2">{formatValue(row[column.key])}</span>}
                    </TableCell>
                  ))}
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      {editPathBase ? (
                        <ButtonLink href={`${editPathBase}/${row.id}/edit`} size="icon" variant="outline">
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">編輯</span>
                        </ButtonLink>
                      ) : (
                        <Button size="icon" variant="outline" onClick={() => startEdit(row)} aria-label="編輯">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                      <Button size="icon" variant="destructive" onClick={() => deleteRow(row.id)} aria-label="刪除">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {pageRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 2} className="py-10 text-center text-muted-foreground">
                    沒有符合條件的資料。
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
          <div className="p-5">
            <AdminPagination page={currentPage} pageCount={pageCount} total={filteredItems.length} onPageChange={setPage} />
          </div>
        </div>
      </section>
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
          className="min-h-24"
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

  return (
    <div className={cn("space-y-2", commonClass)}>
      <Label>{field.label}</Label>
      <Input
        type={type}
        value={field.type === "tags" ? formatValue(value) : String(value ?? "")}
        onChange={(event) => onChange(field.type === "tags" ? parseTags(event.target.value) : coerceInput(event.target.value, field.type))}
        placeholder={field.placeholder}
        readOnly={field.readOnly}
      />
    </div>
  );
}

function createEmptyDraft(fields: AdminField[]): AdminRecord {
  const draft: AdminRecord = { id: "" };
  fields.forEach((field) => {
    if (field.type === "boolean") {
      draft[field.key] = false;
    } else if (field.type === "tags") {
      draft[field.key] = [];
    } else {
      draft[field.key] = field.options?.[0]?.value ?? "";
    }
  });
  return draft;
}

function normalizeDraft(draft: AdminRecord, fields: AdminField[]): AdminRecord {
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

  return value;
}

function formatValue(value: unknown) {
  if (Array.isArray(value)) return value.join(", ");
  if (value === true) return "true";
  if (value === false) return "false";
  if (value == null) return "";
  return String(value);
}

function compareValues(a: AdminRecordValue, b: AdminRecordValue) {
  if (typeof a === "number" && typeof b === "number") {
    return a - b;
  }

  return formatValue(a).localeCompare(formatValue(b), "zh-Hant");
}

function toPayload(row: AdminRecord, dbFields?: string[]) {
  if (!dbFields?.length) {
    return row;
  }

  return dbFields.reduce<Record<string, AdminRecordValue>>((payload, key) => {
    payload[key] = row[key];
    return payload;
  }, {});
}

async function persist(apiResource: string | undefined, method: "POST" | "PATCH" | "DELETE", id: string, values?: Record<string, AdminRecordValue>) {
  if (!apiResource) return;

  await fetch(`/api/admin/${apiResource}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(method === "DELETE" ? { id } : { id, values })
  }).catch(() => null);
}
