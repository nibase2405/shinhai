import Image from "next/image";
import Link from "next/link";
import { ExternalLink, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { LogoutButton } from "@/components/auth/logout-button";
import { BRAND_NAME } from "@/lib/brand";
import { ADMIN_ROLE_LABELS } from "@/lib/admin/rbac";
import type { AdminRole } from "@/types/admin";

export function AdminHeader({
  role
}: {
  role: AdminRole;
}) {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex min-h-16 max-w-[1500px] items-center justify-between gap-4 px-4 md:px-6">
        <Link href="/admin/dashboard" className="flex min-w-0 items-center gap-2">
          <Image src="/logo.svg" alt={`${BRAND_NAME} logo`} width={34} height={34} className="shrink-0 rounded-md" />
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold tracking-wide text-primary">{BRAND_NAME}</span>
            <span className="block truncate text-xs text-muted-foreground">旅遊內容營運後台</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <ShieldCheck className="h-3.5 w-3.5" />
            {ADMIN_ROLE_LABELS[role]}
          </Badge>
          <ButtonLink href="/" variant="outline" size="sm" className="hidden sm:inline-flex">
            前往網站
            <ExternalLink className="h-4 w-4" />
          </ButtonLink>
          <LogoutButton redirectTo="/admin/login?reason=signed_out" label="登出" />
        </div>
      </div>
    </header>
  );
}
