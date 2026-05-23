import type { Metadata } from "next";
import { ArticleCard } from "@/components/cards/article-card";
import { CategoryTabs } from "@/components/shared/category-tabs";
import { FilterSidebar } from "@/components/shared/filter-sidebar";
import { Pagination } from "@/components/shared/pagination";
import { articles, categories } from "@/lib/data";

export const metadata: Metadata = {
  title: "上海旅遊攻略文章",
  description: "上海自由行、迪士尼、住宿、美食、外灘夜景與交通攻略文章列表。"
};

export default async function BlogPage({
  searchParams
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const params = await searchParams;
  const query = params.search?.trim();
  const articleCategories = categories.filter((category) => category.type === "article");
  const filtered = articles.filter((article) => {
    if (article.status !== "published") return false;
    if (!query) return true;
    return `${article.title} ${article.excerpt} ${article.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <div className="container-page grid gap-8 py-10 lg:grid-cols-[260px_1fr]">
      <aside className="space-y-5">
        <CategoryTabs items={articleCategories} basePath="/blog" variant="list" />
        <FilterSidebar
          title="文章篩選"
          groups={[
            { label: "熱門主題", options: ["自由行", "迪士尼", "住宿", "外灘", "美食"] },
            { label: "旅遊天數", options: ["3 天", "4 天", "5 天"] }
          ]}
        />
      </aside>
      <section className="space-y-6">
        <div>
          <h1 className="section-title">上海旅遊攻略文章</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {query ? `搜尋「${query}」共 ${filtered.length} 篇結果` : "自由行規劃、景點、美食、住宿與票券攻略。"}
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
        <Pagination basePath="/blog" page={1} totalPages={1} />
      </section>
    </div>
  );
}
