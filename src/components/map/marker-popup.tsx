import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";

export function MarkerPopup({
  image,
  name,
  category,
  rating,
  href
}: {
  image: string;
  name: string;
  category: string;
  rating: number;
  href: string;
}) {
  return (
    <div className="flex gap-3 rounded-lg border bg-card p-3 shadow-sm">
      <Link href={href} className="relative h-20 w-24 shrink-0 overflow-hidden rounded-md">
        <Image src={image} alt={name} fill className="object-cover" sizes="96px" />
      </Link>
      <div className="min-w-0 space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{category}</Badge>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3.5 w-3.5 fill-accent text-accent" />
            {rating}
          </span>
        </div>
        <p className="truncate font-medium">{name}</p>
        <ButtonLink href={href} size="sm" variant="outline">
          查看詳情
        </ButtonLink>
      </div>
    </div>
  );
}
