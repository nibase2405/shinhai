import { ChevronLeft, ChevronRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

export function Pagination({ basePath, page = 1, totalPages = 1 }: { basePath: string; page?: number; totalPages?: number }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <ButtonLink href={`${basePath}?page=${Math.max(1, page - 1)}`} variant="outline" size="sm">
        <ChevronLeft className="h-4 w-4" />
        上一頁
      </ButtonLink>
      <span className="text-sm text-muted-foreground">
        第 {page} / {totalPages} 頁
      </span>
      <ButtonLink href={`${basePath}?page=${Math.min(totalPages, page + 1)}`} variant="outline" size="sm">
        下一頁
        <ChevronRight className="h-4 w-4" />
      </ButtonLink>
    </div>
  );
}
