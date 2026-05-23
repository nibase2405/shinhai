import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Clock, MapPin, Ticket, TrainFront } from "lucide-react";
import { AdsenseSlot } from "@/components/shared/adsense-slot";
import { AffiliateCard } from "@/components/shared/affiliate-card";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { SeoJsonLd } from "@/components/shared/seo-json-ld";
import { MapView } from "@/components/map/map-view";
import { RestaurantCard } from "@/components/cards/restaurant-card";
import { HotelCard } from "@/components/cards/hotel-card";
import { ArticleCard } from "@/components/cards/article-card";
import {
  attractions,
  getAffiliateLinksFor,
  getAttractionBySlug,
  getNearbyByDistrict,
  getRelatedArticles,
  hotels,
  restaurants
} from "@/lib/data";
import { absoluteUrl } from "@/lib/utils";
import { breadcrumbJsonLd, touristAttractionJsonLd } from "@/lib/seo";

export async function generateStaticParams() {
  return attractions.map((attraction) => ({ slug: attraction.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const attraction = getAttractionBySlug(slug);
  if (!attraction) return {};

  return {
    title: attraction.seo_title || attraction.name,
    description: attraction.seo_description,
    openGraph: {
      title: attraction.seo_title || attraction.name,
      description: attraction.seo_description,
      url: absoluteUrl(`/attractions/${attraction.slug}`),
      images: [{ url: attraction.cover_image, width: 1200, height: 630 }]
    }
  };
}

export default async function AttractionDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const attraction = getAttractionBySlug(slug);
  if (!attraction) notFound();

  const nearbyRestaurants = getNearbyByDistrict(restaurants, attraction.district);
  const nearbyHotels = getNearbyByDistrict(hotels, attraction.district);
  const relatedArticles = getRelatedArticles(attraction.tags);
  const affiliateLinks = getAffiliateLinksFor("attraction", attraction.id);
  const breadcrumbItems = [
    { name: "首頁", href: "/" },
    { name: "景點", href: "/attractions" },
    { name: attraction.name, href: `/attractions/${attraction.slug}` }
  ];

  return (
    <div className="container-page space-y-10 py-10">
      <SeoJsonLd data={[breadcrumbJsonLd(breadcrumbItems), touristAttractionJsonLd(attraction)]} />
      <Breadcrumbs
        items={[
          { label: "首頁", href: "/" },
          { label: "景點", href: "/attractions" },
          { label: attraction.name }
        ]}
      />
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative aspect-[16/11] overflow-hidden rounded-lg">
          <Image src={attraction.cover_image} alt={attraction.name} fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 620px" />
        </div>
        <div className="space-y-5">
          <div>
            <p className="text-sm font-medium text-primary">{attraction.category}</p>
            <h1 className="mt-2 text-3xl font-bold md:text-5xl">{attraction.name}</h1>
            <p className="mt-2 text-muted-foreground">{attraction.english_name}</p>
          </div>
          <p className="text-base leading-7 text-muted-foreground">{attraction.description}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Info icon={<MapPin className="h-4 w-4" />} label="地址" value={attraction.address} />
            <Info icon={<Clock className="h-4 w-4" />} label="開放時間" value={attraction.opening_hours} />
            <Info icon={<Ticket className="h-4 w-4" />} label="票價" value={attraction.ticket_price} />
            <Info icon={<TrainFront className="h-4 w-4" />} label="交通" value={attraction.transport_info} />
          </div>
        </div>
      </section>

      <AdsenseSlot placement="attraction_middle_300x250" size="300x250" className="min-h-[250px]" />

      <section className="space-y-4">
        <h2 className="section-title">地圖位置</h2>
        <MapView markers={[{ ...attraction, markerType: "景點", href: `/attractions/${attraction.slug}` }]} />
      </section>

      {affiliateLinks.length ? (
        <section className="space-y-4">
          <h2 className="section-title">Klook 門票與體驗</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {affiliateLinks.map((link) => (
              <AffiliateCard key={link.id} link={link} />
            ))}
          </div>
        </section>
      ) : null}

      <RelatedGrid title="附近美食">
        {nearbyRestaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </RelatedGrid>
      <RelatedGrid title="附近住宿">
        {nearbyHotels.map((hotel) => (
          <HotelCard key={hotel.id} hotel={hotel} />
        ))}
      </RelatedGrid>
      <RelatedGrid title="相關文章">
        {relatedArticles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </RelatedGrid>
      <AdsenseSlot placement="attraction_related_bottom_728x90" size="728x90" className="min-h-[90px]" />
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
