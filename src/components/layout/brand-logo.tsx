import Image from "next/image";
import Link from "next/link";
import { BRAND_NAME } from "@/lib/brand";
import { cn } from "@/lib/utils";

export function BrandLogo({
  href = "/",
  size = "default",
  priority = false,
  className
}: {
  href?: string;
  size?: "default" | "compact";
  priority?: boolean;
  className?: string;
}) {
  const iconSize = size === "compact" ? 34 : 38;

  return (
    <Link href={href} className={cn("flex min-w-0 items-center gap-2 font-semibold", className)}>
      <Image src="/logo.svg" alt={`${BRAND_NAME} logo`} width={iconSize} height={iconSize} priority={priority} className="shrink-0 rounded-md" />
      <span className="truncate">{BRAND_NAME}</span>
    </Link>
  );
}
