import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { articles, attractions, hotels, restaurants } from "@/lib/data";
import { createSupabaseServerClient, getCurrentUser } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "我的收藏",
  description: "會員收藏的文章、景點、美食與住宿。"
};

export default async function FavoritesPage() {
  const user = await getCurrentUser();
  const supabase = await createSupabaseServerClient();
  const { data: favoritesResult } =
    user && supabase
      ? await supabase.from("favorites").select("*").eq("user_id", user.id).order("created_at", { ascending: false })
      : { data: [] };
  const favorites = (favoritesResult ?? []) as FavoriteRow[];

  const fallbackItems = [
    ...articles.slice(0, 1).map((item) => ({ type: "article", title: item.title })),
    ...attractions.slice(0, 1).map((item) => ({ type: "attraction", title: item.name })),
    ...restaurants.slice(0, 1).map((item) => ({ type: "restaurant", title: item.name })),
    ...hotels.slice(0, 1).map((item) => ({ type: "hotel", title: item.name }))
  ];

  return (
    <div className="container-page space-y-6 py-10">
      <div>
        <h1 className="section-title">我的收藏</h1>
        <p className="mt-2 text-sm text-muted-foreground">收藏文章、景點、美食與住宿。未設定 Supabase 時顯示示範資料。</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>收藏列表</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {favorites?.length
            ? favorites.map((favorite) => (
                <div key={favorite.id} className="rounded-md border p-3 text-sm">
                  {favorite.target_type} / {favorite.target_id}
                </div>
              ))
            : fallbackItems.map((item) => (
                <div key={`${item.type}-${item.title}`} className="rounded-md border p-3 text-sm">
                  {item.type} / {item.title}
                </div>
              ))}
        </CardContent>
      </Card>
    </div>
  );
}

type FavoriteRow = {
  id: string;
  target_type: string;
  target_id: string;
};
