import type { Metadata } from "next";
import { ArticleManager } from "@/components/admin/article-manager";
import { articles, categories } from "@/lib/data";

export const metadata: Metadata = { title: "文章管理" };

export default function AdminArticlesPage() {
  return <ArticleManager initialArticles={articles} categories={categories} />;
}
