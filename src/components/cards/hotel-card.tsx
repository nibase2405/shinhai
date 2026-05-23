import Image from "next/image";
import Link from "next/link";
import { Building2, MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FavoriteButton } from "@/components/shared/favorite-button";
import type { Hotel } from "@/types/content";

export function HotelCard({ hotel }: { hotel: Hotel }) {
  return (
    <Card className="flex h-full min-w-0 flex-col overflow-hidden">
      <Link href={`/hotels/${hotel.slug}`} className="block">
        <div className="relative aspect-[16/10]">
          <Image src={hotel.cover_image} alt={hotel.name} fill quality={58} className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
        </div>
      </Link>
      <CardContent className="flex min-h-0 flex-1 flex-col gap-3 p-4">
        <div className="flex min-h-10 items-center justify-between gap-2">
          <Badge variant="accent" className="max-w-[70%] truncate">{hotel.price_range}</Badge>
          <FavoriteButton targetType="hotel" targetId={hotel.id} />
        </div>
        <Link href={`/hotels/${hotel.slug}`} className="line-clamp-2 min-h-[3.25rem] text-lg font-semibold leading-snug hover:text-primary">
          {hotel.name}
        </Link>
        <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">{hotel.description}</p>
        <div className="mt-auto flex min-h-5 flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {hotel.district}
          </span>
          <span className="inline-flex items-center gap-1">
            <Building2 className="h-4 w-4" />
            {hotel.star_rating} 星
          </span>
          <span className="inline-flex items-center gap-1">
            <Star className="h-4 w-4 fill-accent text-accent" />
            {hotel.rating}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
