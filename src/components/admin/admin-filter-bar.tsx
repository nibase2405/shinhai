"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { AdminFilter } from "@/types/admin";

export function AdminFilterBar({
  search,
  onSearchChange,
  filters,
  values,
  onFilterChange
}: {
  search: string;
  onSearchChange: (value: string) => void;
  filters: AdminFilter[];
  values: Record<string, string>;
  onFilterChange: (key: string, value: string) => void;
}) {
  return (
    <div className="grid gap-3 lg:grid-cols-[minmax(240px,1fr)_auto]">
      <label className="flex items-center gap-2 rounded-md border bg-background px-3">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="搜尋名稱、Slug、地區或備註"
          className="border-0 px-0 focus-visible:ring-0"
        />
      </label>
      <div className="grid gap-2 sm:grid-flow-col sm:auto-cols-[minmax(150px,1fr)]">
        {filters.map((filter) => (
          <select
            key={filter.key}
            value={values[filter.key] ?? "all"}
            onChange={(event) => onFilterChange(filter.key, event.target.value)}
            className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={filter.label}
          >
            <option value="all">{filter.label}：全部</option>
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ))}
      </div>
    </div>
  );
}
