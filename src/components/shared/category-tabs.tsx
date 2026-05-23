import Link from "next/link";
import { cn } from "@/lib/utils";

export function CategoryTabs({
  items,
  activeSlug,
  basePath,
  variant = "tabs"
}: {
  items: Array<{ name: string; slug: string }>;
  activeSlug?: string;
  basePath: string;
  variant?: "tabs" | "list";
}) {
  if (variant === "list") {
    return (
      <nav className="rounded-lg border bg-card p-2 shadow-sm" aria-label="文章分類">
        <Link
          href={basePath}
          className={cn(
            "flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
            !activeSlug ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
          )}
        >
          <span>全部</span>
          {!activeSlug ? <span className="h-2 w-2 rounded-full bg-current" aria-hidden="true" /> : null}
        </Link>
        {items.map((item) => (
          <Link
            key={item.slug}
            href={`${basePath}/category/${item.slug}`}
            className={cn(
              "mt-1 flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
              activeSlug === item.slug ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <span>{item.name}</span>
            {activeSlug === item.slug ? <span className="h-2 w-2 rounded-full bg-current" aria-hidden="true" /> : null}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      <Link
        href={basePath}
        className={cn(
          "whitespace-nowrap rounded-md border px-3 py-2 text-sm font-medium",
          !activeSlug ? "bg-primary text-primary-foreground" : "bg-card hover:bg-secondary"
        )}
      >
        全部
      </Link>
      {items.map((item) => (
        <Link
          key={item.slug}
          href={`${basePath}/category/${item.slug}`}
          className={cn(
            "whitespace-nowrap rounded-md border px-3 py-2 text-sm font-medium",
            activeSlug === item.slug ? "bg-primary text-primary-foreground" : "bg-card hover:bg-secondary"
          )}
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
}
