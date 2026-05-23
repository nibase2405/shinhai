import type { Metadata } from "next";
import { AttractionCard } from "@/components/cards/attraction-card";
import { FilterSidebar } from "@/components/shared/filter-sidebar";
import { attractions } from "@/lib/data";

export const metadata: Metadata = {
  title: "上海景點資料庫",
  description: "上海必去、免費、親子、夜景、情侶景點列表與地區篩選。"
};

export default function AttractionsPage() {
  return (
    <div className="container-page grid gap-8 py-10 lg:grid-cols-[260px_1fr]">
      <aside>
        <FilterSidebar
          title="景點篩選"
          groups={[
            { label: "分類", options: ["必去", "免費", "親子", "夜景", "情侶"] },
            { label: "地區", options: ["黃浦區", "浦東新區", "徐匯區", "虹口區"] }
          ]}
        />
      </aside>
      <section className="space-y-6">
        <div>
          <h1 className="section-title">上海景點</h1>
          <p className="mt-2 text-sm text-muted-foreground">收藏景點、查看交通、附近美食住宿與 Klook 門票推薦。</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {attractions.map((attraction) => (
            <AttractionCard key={attraction.id} attraction={attraction} />
          ))}
        </div>
      </section>
    </div>
  );
}
