import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { ArticleCard } from "@/components/cards/article-card";
import { AttractionCard } from "@/components/cards/attraction-card";
import { HotelCard } from "@/components/cards/hotel-card";
import { RestaurantCard } from "@/components/cards/restaurant-card";
import { SearchBar } from "@/components/shared/search-bar";
import { Badge } from "@/components/ui/badge";
import { articles, attractions, hotels, restaurants } from "@/lib/data";
import { isSearchType, isShanghaiDistrict, searchTypes, type SearchType } from "@/lib/search-options";

export const metadata: Metadata = {
  title: "上海旅遊搜尋｜行政區、景點、美食、住宿整合查詢",
  description: "依上海行政區與內容類型搜尋攻略文章、景點、美食與住宿。"
};

type SearchParams = {
  q?: string;
  type?: string;
  district?: string;
};

export default async function SearchPage({
  searchParams
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const selectedType: SearchType = isSearchType(params.type) ? params.type : "all";
  const districtParam = params.district?.trim();
  const selectedDistrict = isShanghaiDistrict(districtParam) ? districtParam : "all";

  const articleResults =
    selectedType === "all" || selectedType === "article"
      ? articles.filter((article) => {
          if (article.status !== "published") return false;
          const searchable = [article.title, article.excerpt, article.content, ...article.tags].join(" ");
          return matchesQuery(searchable, query) && matchesArticleDistrict(searchable, selectedDistrict);
        })
      : [];

  const attractionResults =
    selectedType === "all" || selectedType === "attraction"
      ? attractions.filter((attraction) => {
          const searchable = [
            attraction.name,
            attraction.english_name,
            attraction.description,
            attraction.address,
            attraction.district,
            attraction.category,
            ...attraction.tags
          ].join(" ");
          return matchesQuery(searchable, query) && matchesDistrict(attraction.district, selectedDistrict);
        })
      : [];

  const restaurantResults =
    selectedType === "all" || selectedType === "restaurant"
      ? restaurants.filter((restaurant) => {
          const searchable = [
            restaurant.name,
            restaurant.description,
            restaurant.address,
            restaurant.district,
            restaurant.cuisine_type
          ].join(" ");
          return matchesQuery(searchable, query) && matchesDistrict(restaurant.district, selectedDistrict);
        })
      : [];

  const hotelResults =
    selectedType === "all" || selectedType === "hotel"
      ? hotels.filter((hotel) => {
          const searchable = [hotel.name, hotel.description, hotel.address, hotel.district, hotel.price_range].join(" ");
          return matchesQuery(searchable, query) && matchesDistrict(hotel.district, selectedDistrict);
        })
      : [];

  const total =
    articleResults.length + attractionResults.length + restaurantResults.length + hotelResults.length;
  const selectedTypeLabel = searchTypes.find((type) => type.value === selectedType)?.label ?? "全部類型";
  const summaryParts = [
    query ? `關鍵字「${query}」` : "不限關鍵字",
    selectedTypeLabel,
    selectedDistrict === "all" ? "全部行政區" : selectedDistrict
  ];

  return (
    <main className="container-page space-y-8 py-10">
      <section className="space-y-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-md bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            <Search className="h-4 w-4" />
            上海旅遊搜尋
          </div>
          <h1 className="section-title">搜尋上海攻略內容</h1>
          <p className="text-sm text-muted-foreground">
            可依行政區、內容類型與關鍵字搜尋文章、景點、美食與住宿。
          </p>
        </div>
        <SearchBar initialQuery={query} initialType={selectedType} initialDistrict={selectedDistrict} />
        <div className="flex flex-wrap gap-2">
          {summaryParts.map((part) => (
            <Badge key={part} variant="outline">
              {part}
            </Badge>
          ))}
          <Badge>{total} 筆結果</Badge>
        </div>
      </section>

      {total === 0 ? (
        <section className="rounded-lg border bg-card p-8 text-center">
          <h2 className="text-lg font-semibold">沒有符合條件的結果</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            可改用較短的關鍵字，或切回全部類型、全部行政區重新搜尋。
          </p>
        </section>
      ) : (
        <div className="space-y-10">
          <ResultSection title="攻略文章" href="/blog" count={articleResults.length}>
            {articleResults.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </ResultSection>

          <ResultSection title="景點" href="/attractions" count={attractionResults.length}>
            {attractionResults.map((attraction) => (
              <AttractionCard key={attraction.id} attraction={attraction} />
            ))}
          </ResultSection>

          <ResultSection title="美食" href="/food" count={restaurantResults.length}>
            {restaurantResults.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </ResultSection>

          <ResultSection title="住宿" href="/hotels" count={hotelResults.length}>
            {hotelResults.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </ResultSection>
        </div>
      )}
    </main>
  );
}

function ResultSection({
  title,
  href,
  count,
  children
}: {
  title: string;
  href: string;
  count: number;
  children: React.ReactNode;
}) {
  if (count === 0) return null;

  return (
    <section className="space-y-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="section-title">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{count} 筆符合條件</p>
        </div>
        <Link href={href} className="shrink-0 text-sm font-medium text-primary hover:underline">
          查看全部
        </Link>
      </div>
      <div className="grid min-w-0 items-stretch gap-5 md:grid-cols-2 xl:grid-cols-3">{children}</div>
    </section>
  );
}

function matchesQuery(searchable: string, query: string) {
  if (!query) return true;
  return normalize(searchable).includes(normalize(query));
}

function matchesDistrict(itemDistrict: string, selectedDistrict: string) {
  if (selectedDistrict === "all") return true;
  return itemDistrict === selectedDistrict;
}

function matchesArticleDistrict(searchable: string, selectedDistrict: string) {
  if (selectedDistrict === "all") return true;
  return normalize(searchable).includes(normalize(selectedDistrict));
}

function normalize(value: string) {
  return value.toLowerCase().trim();
}
