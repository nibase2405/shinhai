import Image from "next/image";
import Link from "next/link";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FavoriteButton } from "@/components/shared/favorite-button";
import { getCategory } from "@/lib/data";
import type { Article } from "@/types/content";

export function ArticleCard({ article }: { article: Article }) {
  const category = getCategory(article.category_id);

  return (
    <Card className="flex h-full min-w-0 flex-col overflow-hidden">
      <Link href={`/blog/${article.slug}`} className="block">
        <div className="relative aspect-[16/10]">
          <Image src={article.cover_image} alt={article.title} fill quality={58} className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
        </div>
      </Link>
      <CardContent className="flex min-h-0 flex-1 flex-col gap-3 p-4">
        <div className="flex min-h-10 items-center justify-between gap-2">
          {category ? <Badge variant="secondary" className="max-w-[70%] truncate">{category.name}</Badge> : <span />}
          <FavoriteButton targetType="article" targetId={article.id} />
        </div>
        <Link href={`/blog/${article.slug}`} className="line-clamp-2 min-h-[3.25rem] text-lg font-semibold leading-snug hover:text-primary">
          {article.title}
        </Link>
        <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">{article.excerpt}</p>
        <div className="mt-auto flex min-h-5 items-center gap-2 text-xs text-muted-foreground">
          <Eye className="h-4 w-4" />
          {article.view_count.toLocaleString("zh-TW")} 次閱讀
        </div>
      </CardContent>
    </Card>
  );
}
