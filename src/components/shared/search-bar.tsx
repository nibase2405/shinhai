"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SearchBar({ placeholder = "搜尋景點、美食、住宿、文章" }: { placeholder?: string }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/blog?search=${encodeURIComponent(trimmed)}`);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid w-full max-w-3xl min-w-0 grid-cols-[auto_minmax(0,1fr)] items-center gap-2 rounded-lg border bg-card p-2 shadow-sm sm:flex"
    >
      <Search className="ms-2 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="min-w-0 flex-1 border-0 shadow-none focus-visible:ring-0"
        placeholder={placeholder}
        aria-label="搜尋"
      />
      <Button type="submit" size="lg" className="col-span-2 w-full shrink-0 px-4 sm:w-auto sm:px-5">
        搜尋
      </Button>
    </form>
  );
}
