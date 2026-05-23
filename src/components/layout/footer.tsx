import Link from "next/link";
import { BrandLogo } from "@/components/layout/brand-logo";

const footerLinks = [
  { href: "/blog", label: "上海攻略" },
  { href: "/attractions", label: "景點資料庫" },
  { href: "/food", label: "美食清單" },
  { href: "/hotels", label: "住宿推薦" },
  { href: "/admin", label: "管理後台" }
];

export function Footer() {
  return (
    <footer className="mt-16 border-t bg-card">
      <div className="container-page grid gap-8 py-10 md:grid-cols-[1.2fr_1fr]">
        <div className="space-y-3">
          <BrandLogo className="w-fit" />
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            為台灣人與華語旅客建立的上海自由行攻略 MVP，整合 SEO 文章、景點、美食、住宿、地圖、會員、廣告與 affiliate tracking 架構。
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-md px-2 py-1 text-muted-foreground hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
