import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, WalletCards } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FavoriteButton } from "@/components/shared/favorite-button";
import { formatCurrency } from "@/lib/utils";
import type { Restaurant } from "@/types/content";

export function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  return (
    <Card className="flex h-full min-w-0 flex-col overflow-hidden">
      <Link href={`/food/${restaurant.slug}`} className="block">
        <div className="relative aspect-[16/10]">
          <Image src={restaurant.cover_image} alt={restaurant.name} fill quality={58} className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
        </div>
      </Link>
      <CardContent className="flex min-h-0 flex-1 flex-col gap-3 p-4">
        <div className="flex min-h-10 items-center justify-between gap-2">
          <Badge variant="secondary" className="max-w-[70%] truncate">{restaurant.cuisine_type}</Badge>
          <FavoriteButton targetType="restaurant" targetId={restaurant.id} />
        </div>
        <Link href={`/food/${restaurant.slug}`} className="line-clamp-2 min-h-[3.25rem] text-lg font-semibold leading-snug hover:text-primary">
          {restaurant.name}
        </Link>
        <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">{restaurant.description}</p>
        <div className="mt-auto flex min-h-5 flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {restaurant.district}
          </span>
          <span className="inline-flex items-center gap-1">
            <WalletCards className="h-4 w-4" />
            {formatCurrency(restaurant.average_price)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Star className="h-4 w-4 fill-accent text-accent" />
            {restaurant.rating}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
