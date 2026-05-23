import Image from "next/image";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FavoriteButton } from "@/components/shared/favorite-button";
import type { Attraction } from "@/types/content";

export function AttractionCard({ attraction }: { attraction: Attraction }) {
  return (
    <Card className="flex h-full min-w-0 flex-col overflow-hidden">
      <Link href={`/attractions/${attraction.slug}`} className="block">
        <div className="relative aspect-[16/10]">
          <Image src={attraction.cover_image} alt={attraction.name} fill quality={58} className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
        </div>
      </Link>
      <CardContent className="flex min-h-0 flex-1 flex-col gap-3 p-4">
        <div className="flex min-h-10 items-center justify-between gap-2">
          <Badge className="max-w-[70%] truncate">{attraction.category}</Badge>
          <FavoriteButton targetType="attraction" targetId={attraction.id} />
        </div>
        <Link href={`/attractions/${attraction.slug}`} className="line-clamp-2 min-h-[3.25rem] text-lg font-semibold leading-snug hover:text-primary">
          {attraction.name}
        </Link>
        <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">{attraction.description}</p>
        <div className="mt-auto flex min-h-5 flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {attraction.district}
          </span>
          <span className="inline-flex items-center gap-1">
            <Star className="h-4 w-4 fill-accent text-accent" />
            {attraction.rating}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
