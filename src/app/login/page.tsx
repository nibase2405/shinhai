import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { BRAND_NAME } from "@/lib/brand";

export const metadata: Metadata = {
  title: "會員登入",
  description: `登入 ${BRAND_NAME} 會員中心，管理收藏文章、景點、美食與住宿。`
};

export default function LoginPage() {
  return (
    <div className="container-page py-12">
      <AuthForm mode="login" />
      <p className="mt-5 text-center text-sm text-muted-foreground">
        還沒有帳號？{" "}
        <Link href="/register" className="font-medium text-primary hover:underline">
          建立會員
        </Link>
      </p>
    </div>
  );
}
