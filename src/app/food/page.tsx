import type { Metadata } from "next";
import { RestaurantCard } from "@/components/cards/restaurant-card";
import { FilterSidebar } from "@/components/shared/filter-sidebar";
import { restaurants } from "@/lib/data";

export const metadata: Metadata = {
  title: "上海美食與餐廳推薦",
  description: "上海火鍋、小籠包、米其林、咖啡廳、酒吧、本幫菜與夜宵推薦。"
};

export default function FoodPage() {
  return (
    <div className="container-page grid gap-8 py-10 lg:grid-cols-[260px_1fr]">
      <aside>
        <FilterSidebar
          title="美食篩選"
          groups={[
            { label: "分類", options: ["火鍋", "小籠包", "米其林", "咖啡廳", "酒吧", "本幫菜", "夜宵"] },
            { label: "地區", options: ["黃浦區", "浦東新區", "徐匯區"] },
            { label: "人均消費", options: ["TWD 300 以下", "TWD 300-800", "TWD 800 以上"] }
          ]}
        />
      </aside>
      <section className="space-y-6">
        <div>
          <h1 className="section-title">上海美食</h1>
          <p className="mt-2 text-sm text-muted-foreground">餐廳地圖、菜單圖片、附近景點住宿與商家廣告預留。</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </section>
    </div>
  );
}
