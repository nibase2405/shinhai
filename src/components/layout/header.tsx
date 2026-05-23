import Link from "next/link";
import { Menu, Search, User } from "lucide-react";
import { BrandLogo } from "@/components/layout/brand-logo";
import { ButtonLink } from "@/components/ui/button";

const navItems = [
  { href: "/blog", label: "攻略文章" },
  { href: "/attractions", label: "景點" },
  { href: "/food", label: "美食" },
  { href: "/hotels", label: "住宿" },
  { href: "/map", label: "地圖" }
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/92 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <BrandLogo priority />
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <ButtonLink href="/blog?search=1" variant="ghost" size="icon">
            <Search className="h-4 w-4" />
          </ButtonLink>
          <ButtonLink href="/member" variant="outline">
            <User className="h-4 w-4" />
            會員
          </ButtonLink>
        </div>
        <ButtonLink href="/member" variant="outline" size="icon" className="md:hidden">
          <Menu className="h-4 w-4" />
        </ButtonLink>
      </div>
    </header>
  );
}
