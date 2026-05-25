"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ListFilter, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { searchTypes, shanghaiDistricts, type SearchType } from "@/lib/search-options";

export function SearchBar({
  placeholder = "搜尋景點、美食、住宿、文章",
  initialQuery = "",
  initialType = "all",
  initialDistrict = "all"
}: {
  placeholder?: string;
  initialQuery?: string;
  initialType?: SearchType;
  initialDistrict?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState<SearchType>(initialType);
  const [district, setDistrict] = useState(initialDistrict);
  const router = useRouter();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();

    const params = new URLSearchParams();
    if (trimmed) params.set("q", trimmed);
    if (type !== "all") params.set("type", type);
    if (district !== "all") params.set("district", district);

    const queryString = params.toString();
    router.push(queryString ? `/search?${queryString}` : "/search");
  }

  function updateType(value: string) {
    if (searchTypes.some((option) => option.value === value)) {
      setType(value as SearchType);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-5xl min-w-0 rounded-lg border bg-card/95 p-2 text-slate-950 shadow-sm backdrop-blur"
    >
      <div className="grid min-w-0 gap-2 md:grid-cols-[minmax(0,1fr)_150px_180px_auto]">
        <label className="flex min-w-0 items-center gap-2 rounded-md bg-background px-3">
          <Search className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <span className="sr-only">搜尋關鍵字</span>
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="min-w-0 flex-1 border-0 px-0 text-slate-950 shadow-none placeholder:text-slate-500 focus-visible:ring-0"
            placeholder={placeholder}
          />
        </label>

        <label className="flex min-w-0 items-center gap-2 rounded-md border bg-background px-3">
          <ListFilter className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <span className="sr-only">內容類型</span>
          <select
            value={type}
            onChange={(event) => updateType(event.target.value)}
            className="h-10 min-w-0 flex-1 bg-transparent text-sm text-slate-950 outline-none"
            aria-label="內容類型"
          >
            {searchTypes.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex min-w-0 items-center gap-2 rounded-md border bg-background px-3">
          <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <span className="sr-only">上海行政區</span>
          <select
            value={district}
            onChange={(event) => setDistrict(event.target.value)}
            className="h-10 min-w-0 flex-1 bg-transparent text-sm text-slate-950 outline-none"
            aria-label="上海行政區"
          >
            <option value="all">全部行政區</option>
            {shanghaiDistricts.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <Button type="submit" size="lg" className="h-10 w-full shrink-0 px-5 md:w-auto">
          搜尋
        </Button>
      </div>
    </form>
  );
}
