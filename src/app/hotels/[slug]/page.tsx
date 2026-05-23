import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Building2, MapPin, Star, WalletCards } from "lucide-react";
import { AdsenseSlot } from "@/components/shared/adsense-slot";
import { AffiliateButton } from "@/components/shared/affiliate-button";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { SeoJsonLd } from "@/components/shared/seo-json-ld";
import { MapView } from "@/components/map/map-view";
import { AttractionCard } from "@/components/cards/attraction-card";
import { RestaurantCard } from "@/components/cards/restaurant-card";
import { attractions, getHotelBySlug, getNearbyByDistrict, hotels, restaurants } from "@/lib/data";
import { absoluteUrl } from "@/lib/utils";
import { breadcrumbJsonLd, hotelJsonLd } from "@/lib/seo";

export async function generateStaticParams() {
  return hotels.map((hotel) => ({ slug: hotel.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const hotel = getHotelBySlug(slug);
  if (!hotel) return {};

  return {
    title: hotel.seo_title || hotel.name,
    description: hotel.seo_description,
    openGraph: {
      title: hotel.seo_title || hotel.name,
      description: hotel.seo_description,
      url: absoluteUrl(`/hotels/${hotel.slug}`),
      images: [{ url: hotel.cover_image, width: 1200, height: 630 }]
    }
  };
}

export default async function HotelDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const hotel = getHotelBySlug(slug);
  if (!hotel) notFound();

  const nearbyAttractions = getNearbyByDistrict(attractions, hotel.district);
  const nearbyRestaurants = getNearbyByDistrict(restaurants, hotel.district);
  const breadcrumbItems = [
    { name: "首頁", href: "/" },
    { name: "住宿", href: "/hotels" },
    { name: hotel.name, href: `/hotels/${hotel.slug}` }
  ];

  return (
    <div className="container-page space-y-10 py-10">
      <SeoJsonLd data={[breadcrumbJsonLd(breadcrumbItems), hotelJsonLd(hotel)]} />
      <Breadcrumbs
        items={[
          { label: "首頁", href: "/" },
          { label: "住宿", href: "/hotels" },
          { label: hotel.name }
        ]}
      />
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative aspect-[16/11] overflow-hidden rounded-lg">
          <Image src={hotel.cover_image} alt={hotel.name} fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 620px" />
        </div>
        <div className="space-y-5">
          <div>
            <p className="text-sm font-medium text-primary">{hotel.district}</p>
            <h1 className="mt-2 text-3xl font-bold md:text-5xl">{hotel.name}</h1>
          </div>
          <p className="text-base leading-7 text-muted-foreground">{hotel.description}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Info icon={<MapPin className="h-4 w-4" />} label="地址" value={hotel.address} />
            <Info icon={<Building2 className="h-4 w-4" />} label="星級" value={`${hotel.star_rating} 星`} />
            <Info icon={<WalletCards className="h-4 w-4" />} label="價格區間" value={hotel.price_range} />
            <Info icon={<Star className="h-4 w-4" />} label="評分" value={`${hotel.rating}`} />
          </div>
          <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]">
            <AffiliateButton provider="agoda" title={`${hotel.name} Agoda`} url={hotel.agoda_url} linkId={`hotel-agoda-${hotel.id}`} buttonText="Agoda 查看房價" />
            <AffiliateButton provider="booking" title={`${hotel.name} Booking`} url={hotel.booking_url} linkId={`hotel-booking-${hotel.id}`} buttonText="Booking 查看房價" />
            <AffiliateButton provider="trip" title={`${hotel.name} Trip.com`} url={hotel.trip_url} linkId={`hotel-trip-${hotel.id}`} buttonText="Trip.com 預留" />
          </div>
        </div>
      </section>

      <AdsenseSlot placement="hotel_middle_300x250" size="300x250" className="min-h-[250px]" />

      <section className="space-y-4">
        <h2 className="section-title">地圖位置</h2>
        <MapView markers={[{ ...hotel, markerType: "住宿", href: `/hotels/${hotel.slug}` }]} />
      </section>

      <RelatedGrid title="附近景點">
        {nearbyAttractions.map((attraction) => (
          <AttractionCard key={attraction.id} attraction={attraction} />
        ))}
      </RelatedGrid>
      <RelatedGrid title="附近美食">
        {nearbyRestaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
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
