import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Clock, MapPin, Phone, WalletCards } from "lucide-react";
import { AdsenseSlot } from "@/components/shared/adsense-slot";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ImageUploaderPlaceholder } from "@/components/shared/image-uploader-placeholder";
import { SeoJsonLd } from "@/components/shared/seo-json-ld";
import { MapView } from "@/components/map/map-view";
import { AttractionCard } from "@/components/cards/attraction-card";
import { HotelCard } from "@/components/cards/hotel-card";
import { attractions, getNearbyByDistrict, getRestaurantBySlug, hotels, restaurants } from "@/lib/data";
import { absoluteUrl, formatCurrency } from "@/lib/utils";
import { breadcrumbJsonLd, localBusinessJsonLd } from "@/lib/seo";

export async function generateStaticParams() {
  return restaurants.map((restaurant) => ({ slug: restaurant.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const restaurant = getRestaurantBySlug(slug);
  if (!restaurant) return {};

  return {
    title: restaurant.seo_title || restaurant.name,
    description: restaurant.seo_description,
    openGraph: {
      title: restaurant.seo_title || restaurant.name,
      description: restaurant.seo_description,
      url: absoluteUrl(`/food/${restaurant.slug}`),
      images: [{ url: restaurant.cover_image, width: 1200, height: 630 }]
    }
  };
}

export default async function FoodDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const restaurant = getRestaurantBySlug(slug);
  if (!restaurant) notFound();

  const nearbyAttractions = getNearbyByDistrict(attractions, restaurant.district);
  const nearbyHotels = getNearbyByDistrict(hotels, restaurant.district);
  const breadcrumbItems = [
    { name: "首頁", href: "/" },
    { name: "美食", href: "/food" },
    { name: restaurant.name, href: `/food/${restaurant.slug}` }
  ];

  return (
    <div className="container-page space-y-10 py-10">
      <SeoJsonLd data={[breadcrumbJsonLd(breadcrumbItems), localBusinessJsonLd(restaurant)]} />
      <Breadcrumbs
        items={[
          { label: "首頁", href: "/" },
          { label: "美食", href: "/food" },
          { label: restaurant.name }
        ]}
      />
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative aspect-[16/11] overflow-hidden rounded-lg">
          <Image src={restaurant.cover_image} alt={restaurant.name} fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 620px" />
        </div>
        <div className="space-y-5">
          <div>
            <p className="text-sm font-medium text-primary">{restaurant.cuisine_type}</p>
            <h1 className="mt-2 text-3xl font-bold md:text-5xl">{restaurant.name}</h1>
          </div>
          <p className="text-base leading-7 text-muted-foreground">{restaurant.description}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Info icon={<MapPin className="h-4 w-4" />} label="地址" value={restaurant.address} />
            <Info icon={<Clock className="h-4 w-4" />} label="營業時間" value={restaurant.opening_hours} />
            <Info icon={<WalletCards className="h-4 w-4" />} label="人均消費" value={formatCurrency(restaurant.average_price)} />
            <Info icon={<Phone className="h-4 w-4" />} label="電話" value={restaurant.phone || "待補"} />
          </div>
        </div>
      </section>

      <AdsenseSlot placement="food_middle_300x250" size="300x250" className="min-h-[250px]" />

      <section className="grid gap-5 md:grid-cols-2">
        <ImageUploaderPlaceholder label="菜單圖片上傳預留" />
        <div className="rounded-lg border border-dashed bg-secondary/40 p-5 text-sm text-muted-foreground">
          商家廣告預留版位：可於後台 ads 表設定 direct image + target_url。
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="section-title">地圖位置</h2>
        <MapView markers={[{ ...restaurant, markerType: "美食", href: `/food/${restaurant.slug}` }]} />
      </section>

      <RelatedGrid title="附近景點">
        {nearbyAttractions.map((attraction) => (
          <AttractionCard key={attraction.id} attraction={attraction} />
        ))}
      </RelatedGrid>
      <RelatedGrid title="附近住宿">
        {nearbyHotels.map((hotel) => (
          <HotelCard key={hotel.id} hotel={hotel} />
        ))}
      </RelatedGrid>
    </div>
  );
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center gap-2 text-sm font-medium">
        {icon}
        {label}
      </div>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{value}</p>
    </div>
  );
}

function RelatedGrid({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="section-title">{title}</h2>
      <div className="grid gap-5 md:grid-cols-3">{children}</div>
    </section>
  );
}
