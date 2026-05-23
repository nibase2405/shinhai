import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, ListChecks } from "lucide-react";
import { AdsenseSlot } from "@/components/shared/adsense-slot";
import { AffiliateCard } from "@/components/shared/affiliate-card";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { SeoJsonLd } from "@/components/shared/seo-json-ld";
import { ArticleCard } from "@/components/cards/article-card";
import {
  articles,
  getAffiliateLinksFor,
  getArticleBySlug,
  getCategory,
  getRelatedArticles
} from "@/lib/data";
import { absoluteUrl } from "@/lib/utils";
import { articleJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

export async function generateStaticParams() {
  return articles.filter((article) => article.status === "published").map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {};
  }

  return {
    title: article.seo_title || article.title,
    description: article.seo_description || article.excerpt,
    openGraph: {
      title: article.seo_title || article.title,
      description: article.seo_description || article.excerpt,
      url: absoluteUrl(`/blog/${article.slug}`),
      type: "article",
      images: [{ url: article.og_image || article.cover_image, width: 1200, height: 630 }]
    }
  };
}

export default async function BlogDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const category = getCategory(article.category_id);
  const related = getRelatedArticles(article.tags, article.slug);
  const affiliateLinks = getAffiliateLinksFor("article", article.id);
  const toc = ["行程重點", "交通與住宿", "預算建議", "常見問題"];
  const breadcrumbItems = [
    { name: "首頁", href: "/" },
    { name: "攻略文章", href: "/blog" },
    { name: article.title, href: `/blog/${article.slug}` }
  ];

  return (
    <article className="container-page grid gap-8 py-10 lg:grid-cols-[1fr_320px]">
      <SeoJsonLd data={[breadcrumbJsonLd(breadcrumbItems), articleJsonLd(article), faqJsonLd(article.schema_faq_json)]} />
      <div className="min-w-0 space-y-8">
        <Breadcrumbs
          items={[
            { label: "首頁", href: "/" },
            { label: "攻略文章", href: "/blog" },
            { label: article.title }
          ]}
        />
        <header className="space-y-5">
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            {category ? <Link href={`/blog/category/${category.slug}`} className="font-medium text-primary">{category.name}</Link> : null}
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              {new Date(article.published_at).toLocaleDateString("zh-TW")}
            </span>
          </div>
          <h1 className="text-3xl font-bold leading-tight md:text-5xl">{article.title}</h1>
          <p className="text-lg leading-8 text-muted-foreground">{article.excerpt}</p>
          <AdsenseSlot placement="article_top_728x90" size="728x90" className="min-h-[90px]" />
          <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
            <Image src={article.cover_image} alt={article.title} fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 760px" />
          </div>
        </header>

        <section className="rounded-lg border bg-card p-5">
          <div className="mb-3 flex items-center gap-2 font-semibold">
            <ListChecks className="h-5 w-5 text-primary" />
            文章目錄
          </div>
          <ol className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
            {toc.map((item, index) => (
              <li key={item}>
                {index + 1}. {item}
              </li>
            ))}
          </ol>
        </section>

        <section className="prose prose-slate max-w-none">
          <h2>行程重點</h2>
          <p>{article.content}</p>
          <h2>交通與住宿</h2>
          <p>
            上海地鐵覆蓋度高，第一次自由行建議把住宿放在 2 號線、10 號線或人民廣場附近。外灘、南京路、豫園與陸家嘴可安排成同一區域行程。
          </p>
          <AdsenseSlot placement="article_middle_300x250" size="300x250" className="my-8 min-h-[250px]" />
          <h2>預算建議</h2>
          <p>
            一般自由行每日餐飲與交通可抓 TWD 1,000 到 2,000；住宿依區域與星級差異大，外灘與陸家嘴高端飯店價格較高，人民廣場與靜安寺選擇更彈性。
          </p>
          <h2>常見問題</h2>
          <div className="space-y-3">
            {article.schema_faq_json.map((faq) => (
              <div key={faq.question} className="rounded-lg border bg-card p-4">
                <h3 className="font-semibold">{faq.question}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <AdsenseSlot placement="article_bottom_336x280" size="336x280" className="min-h-[280px]" />

        {affiliateLinks.length ? (
          <section className="space-y-4">
            <h2 className="section-title">相關優惠連結</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {affiliateLinks.map((link) => (
                <AffiliateCard key={link.id} link={link} />
              ))}
            </div>
          </section>
        ) : null}

        <section className="space-y-4">
          <h2 className="section-title">相關文章</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {related.map((item) => (
              <ArticleCard key={item.id} article={item} />
            ))}
          </div>
        </section>
      </div>

      <aside className="space-y-5">
        <div className="sticky top-24 space-y-5">
          <AdsenseSlot placement="article_middle_300x250" size="300x250" className="min-h-[250px]" />
          <div className="rounded-lg border bg-card p-5">
            <p className="font-semibold">熱門文章</p>
            <div className="mt-3 space-y-3">
              {articles.slice(0, 4).map((item) => (
                <Link key={item.id} href={`/blog/${item.slug}`} className="block text-sm text-muted-foreground hover:text-primary">
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </article>
  );
}
