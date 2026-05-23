"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BadgeDollarSign,
  BarChart3,
  BookOpenText,
  ClipboardList,
  FileText,
  Hotel,
  Image,
  LayoutDashboard,
  Link2,
  Map,
  MapPin,
  Megaphone,
  SearchCheck,
  Settings,
  ShieldCheck,
  Soup,
  Store,
  Tags,
  UploadCloud,
  UsersRound
} from "lucide-react";
import { getVisibleAdminNavGroups } from "@/lib/admin/rbac";
import { cn } from "@/lib/utils";
import type { AdminRole } from "@/types/admin";

const iconMap = {
  dashboard: LayoutDashboard,
  articles: FileText,
  attractions: MapPin,
  food: Soup,
  hotels: Hotel,
  map: Map,
  affiliate: BadgeDollarSign,
  clicks: Link2,
  ads: Megaphone,
  merchants: Store,
  categories: BookOpenText,
  tags: Tags,
  seo: SearchCheck,
  media: Image,
  users: UsersRound,
  roles: ShieldCheck,
  importExport: UploadCloud,
  settings: Settings,
  audit: ClipboardList
};

export function AdminSidebar({ role }: { role: AdminRole }) {
  const nav = getVisibleAdminNavGroups(role);

  return (
    <>
      <div className="lg:hidden">
        <details className="rounded-lg border bg-card p-3">
          <summary className="cursor-pointer text-sm font-medium">後台選單</summary>
          <div className="mt-3">
            <SidebarNav nav={nav} />
          </div>
        </details>
      </div>
      <aside className="hidden lg:block">
        <div className="sticky top-24 rounded-lg border bg-card p-3">
          <div className="mb-3 flex items-center gap-2 px-3 py-2 text-sm font-semibold">
            <BarChart3 className="h-4 w-4 text-primary" />
            Admin
          </div>
          <SidebarNav nav={nav} />
        </div>
      </aside>
    </>
  );
}

function SidebarNav({ nav }: { nav: ReturnType<typeof getVisibleAdminNavGroups> }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-5">
      {nav.map((group) => (
        <div key={group.label} className="space-y-1">
          <p className="px-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">{group.label}</p>
          {group.items.map((item) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap] ?? LayoutDashboard;
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary",
                  active ? "bg-primary text-primary-foreground hover:bg-primary/90" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
