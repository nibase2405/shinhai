import Image from "next/image";
import Link from "next/link";
import { Building2, Castle, FerrisWheel, MapPin, ShoppingBag, Soup, TrainFront } from "lucide-react";
import { AdsenseSlot } from "@/components/shared/adsense-slot";
import { AffiliateCard } from "@/components/shared/affiliate-card";
import { SearchBar } from "@/components/shared/search-bar";
import { ArticleCard } from "@/components/cards/article-card";
import { AttractionCard } from "@/components/cards/attraction-card";
import { RestaurantCard } from "@/components/cards/restaurant-card";
import { HotelCard } from "@/components/cards/hotel-card";
import { affiliateLinks, articles, attractions, hotels, restaurants } from "@/lib/data";

const categories = [
  { href: "/attractions", label: "景點", icon: MapPin },
  { href: "/food", label: "美食", icon: Soup },
  { href: "/hotels", label: "住宿", icon: Building2 },
  { href: "/blog/category/independent-travel", label: "交通", icon: TrainFront },
  { href: "/blog/category/disney", label: "迪士尼", icon: Castle },
  { href: "/attractions?category=shopping", label: "購物", icon: ShoppingBag }
];

export default function HomePage() {
  const featuredArticles = articles.slice(0, 3);
  const featuredAttractions = attractions.filter((item) => item.is_featured).slice(0, 3);
  const featuredRestaurants = restaurants.filter((item) => item.is_featured).slice(0, 3);
  const featuredHotels = hotels.filter((item) => item.is_featured).slice(0, 3);
  const klookLinks = affiliateLinks.filter((link) => link.provider === "klook");
  const hotelLinks = affiliateLinks.filter((link) => link.provider === "agoda" || link.provider === "booking");

  return (
    <div className="overflow-x-clip space-y-14">
      <section className="relative overflow-hidden bg-secondary">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1538428494232-9c0d8a3ab403?auto=format&fit=crop&w=1200&q=70"
            alt="上海外灘天際線"
            fill
            priority
            quality={65}
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/78 via-slate-950/46 to-transparent" />
        </div>
        <div className="container-page relative flex min-h-[520px] flex-col justify-center gap-8 py-16 text-white">
          <div className="max-w-2xl space-y-5">
            <div className="inline-flex items-center gap-2 rounded-md bg-white/12 px-3 py-1 text-sm backdrop-blur">
              <FerrisWheel className="h-4 w-4" />
              台灣人上海自由行攻略 MVP
            </div>
            <h1 className="max-w-[11em] break-all text-3xl font-bold leading-tight sm:max-w-2xl sm:text-4xl md:text-6xl">上海自由行攻略</h1>
            <p className="text-base leading-7 text-white/86 md:text-lg">
              搜尋景點、美食、住宿與 SEO 攻略文章，快速規劃外灘、迪士尼、南京路與上海老字號美食行程。
            </p>
          </div>
          <SearchBar />
        </div>
      </section>

      <div className="container-page">
        <AdsenseSlot placement="home_top_970x250" size="970x250" className="min-h-[160px] sm:min-h-[250px]" />
      </div>

      <section className="container-page space-y-6">
        <div className="grid min-w-0 grid-cols-2 gap-3 md:grid-cols-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link key={category.label} href={category.href} className="min-w-0 rounded-lg border bg-card p-4 text-center shadow-sm hover:border-primary">
                <Icon className="mx-auto mb-2 h-6 w-6 text-primary" />
                <span className="text-sm font-medium">{category.label}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <HomeSection title="熱門文章" href="/blog">
        {featuredArticles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </HomeSection>

      <HomeSection title="熱門景點" href="/attractions">
        {featuredAttractions.map((attraction) => (
          <AttractionCard key={attraction.id} attraction={attraction} />
        ))}
      </HomeSection>

      <div className="container-page">
        <AdsenseSlot placement="home_middle_728x90" size="728x90" className="min-h-[90px]" />
      </div>

      <HomeSection title="推薦美食" href="/food">
        {featuredRestaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </HomeSection>

      <HomeSection title="推薦住宿" href="/hotels">
        {featuredHotels.map((hotel) => (
          <HotelCard key={hotel.id} hotel={hotel} />
        ))}
      </HomeSection>

      <section className="container-page grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-4">
          <div className="flex min-w-0 flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="section-title">Klook 票券推薦</p>
              <p className="text-sm text-muted-foreground">上海迪士尼、城市一日遊與體驗行程連結管理。</p>
            </div>
          </div>
          <div className="grid min-w-0 gap-4 md:grid-cols-2">
            {klookLinks.map((link) => (
              <AffiliateCard key={link.id} link={link} />
            ))}
          </div>
        </div>
        <AdsenseSlot placement="home_side_300x250" size="300x250" className="min-h-[250px]" />
      </section>

      <section className="container-page space-y-4">
        <div>
          <p className="section-title">Agoda / Booking 住宿推薦</p>
          <p className="text-sm text-muted-foreground">飯店 affiliate link 可由後台集中管理並追蹤點擊。</p>
        </div>
        <div className="grid min-w-0 gap-4 md:grid-cols-2">
          {hotelLinks.map((link) => (
            <AffiliateCard key={link.id} link={link} />
          ))}
        </div>
      </section>
    </div>
  );
}

function HomeSection({
  title,
  href,
  children
}: {
  title: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <section className="container-page space-y-5">
      <div className="flex min-w-0 items-end justify-between gap-3">
        <h2 className="section-title min-w-0">{title}</h2>
        <Link href={href} className="shrink-0 text-sm font-medium text-primary hover:underline">
          查看全部
        </Link>
      </div>
      <div className="grid min-w-0 items-stretch gap-5 md:grid-cols-3">{children}</div>
    </section>
  );
}
