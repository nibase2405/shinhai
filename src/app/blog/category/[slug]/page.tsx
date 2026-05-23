import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/cards/article-card";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { CategoryTabs } from "@/components/shared/category-tabs";
import { articles, categories } from "@/lib/data";

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug && item.type === "article");

  if (!category) {
    return {};
  }

  return {
    title: `${category.name}攻略文章`,
    description: `上海${category.name}相關攻略文章列表。`
  };
}

export default async function BlogCategoryPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const articleCategories = categories.filter((category) => category.type === "article");
  const category = articleCategories.find((item) => item.slug === slug);

  if (!category) {
    notFound();
  }

  const filtered = articles.filter((article) => article.status === "published" && article.category_id === category.id);

  return (
    <div className="container-page space-y-8 py-10">
      <Breadcrumbs
        items={[
          { label: "首頁", href: "/" },
          { label: "攻略文章", href: "/blog" },
          { label: category.name }
        ]}
      />
      <CategoryTabs items={articleCategories} basePath="/blog" activeSlug={slug} />
      <section className="space-y-5">
        <div>
          <h1 className="section-title">{category.name}攻略文章</h1>
          <p className="mt-2 text-sm text-muted-foreground">共 {filtered.length} 篇已發布內容。</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>
    </div>
  );
}
