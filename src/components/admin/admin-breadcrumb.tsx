"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { ADMIN_NAV_GROUPS } from "@/lib/admin/rbac";

const labels = new Map(ADMIN_NAV_GROUPS.flatMap((group) => group.items.map((item) => [item.href, item.label])));

export function AdminBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const currentHref = `/${segments.join("/")}`;
  const currentLabel = labels.get(currentHref) ?? "後台";

  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
      <Link href="/admin/dashboard" className="hover:text-foreground">
        後台
      </Link>
      <ChevronRight className="h-4 w-4" />
      <span className="font-medium text-foreground">{currentLabel}</span>
    </nav>
  );
}
