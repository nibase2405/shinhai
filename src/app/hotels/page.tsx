import type { Metadata } from "next";
import { HotelCard } from "@/components/cards/hotel-card";
import { FilterSidebar } from "@/components/shared/filter-sidebar";
import { hotels } from "@/lib/data";

export const metadata: Metadata = {
  title: "上海住宿推薦",
  description: "上海外灘、南京路、陸家嘴、迪士尼周邊飯店推薦與 Agoda Booking 分潤連結。"
};

export default function HotelsPage() {
  return (
    <div className="container-page grid gap-8 py-10 lg:grid-cols-[260px_1fr]">
      <aside>
        <FilterSidebar
          title="住宿篩選"
          groups={[
            { label: "地區", options: ["外灘", "人民廣場", "南京路", "陸家嘴", "迪士尼"] },
            { label: "星級", options: ["3 星", "4 星", "5 星"] },
            { label: "價格", options: ["平價", "中價位", "高價位"] }
          ]}
        />
      </aside>
      <section className="space-y-6">
        <div>
          <h1 className="section-title">上海住宿</h1>
          <p className="mt-2 text-sm text-muted-foreground">飯店地圖、附近景點美食與 Agoda / Booking / Trip.com 按鈕。</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {hotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      </section>
    </div>
  );
}
