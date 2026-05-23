import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminArticleEditor } from "@/components/admin/admin-article-editor";
import { articles, categories } from "@/lib/data";

export const metadata: Metadata = { title: "文章編輯器" };

export default async function AdminArticleEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = articles.find((item) => item.id === id);

  if (!article) {
    notFound();
  }

  return <AdminArticleEditor article={article} categories={categories} />;
}
