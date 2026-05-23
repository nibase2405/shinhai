import type { Metadata } from "next";
import { LogOut, Star, UserRound } from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BRAND_NAME } from "@/lib/brand";
import { getCurrentProfile, getCurrentUser } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "會員中心",
  description: `${BRAND_NAME} 會員個人資料與收藏管理。`
};

export default async function MemberPage() {
  const user = await getCurrentUser();
  const profile = await getCurrentProfile();

  if (!user) {
    return (
      <div className="container-page py-12">
        <Card>
          <CardHeader>
            <CardTitle>請先登入</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">登入後可管理個人資料與收藏清單。</p>
            <ButtonLink href="/login">前往登入</ButtonLink>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container-page space-y-6 py-10">
      <div>
        <h1 className="section-title">會員中心</h1>
        <p className="mt-2 text-sm text-muted-foreground">{user.email}</p>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserRound className="h-5 w-5 text-primary" />
              個人資料
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>顯示名稱：{profile?.display_name || "尚未設定"}</p>
            <p>角色：{profile?.role || "user"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              我的收藏
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ButtonLink href="/member/favorites" variant="outline">
              查看收藏
            </ButtonLink>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LogOut className="h-5 w-5 text-primary" />
              登出
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LogoutButton />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
